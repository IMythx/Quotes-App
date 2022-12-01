import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import App from "./App";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));
describe("Full app test", () => {
  beforeEach(async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => ({
        "-NG1r2uwdThSrEp2ZQ_q": {
          author: "Myth",
          text: "React is really a great js library/Framework",
        },
      }),
      ok: true,
    });
    await act(async () => render(<App />));
  });

  afterEach(() => jest.clearAllMocks());

  it("All quotes page should be rendered on the intial render", async () => {
    await waitFor(() =>
      expect(
        screen.getByText(/react is really a great js library\/framework/i)
      ).toBeInTheDocument()
    );
  });

  it("quotes get sorted if sort button is clicked", async () => {
    await act(async () =>
      userEvent.click(screen.getByRole("button", { name: /sort ascending/i }))
    );
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("new quote page is rendered if add a quote link is clicked", async () => {
    await act(async () =>
      userEvent.click(screen.getByRole("link", { name: /add a quote/i }))
    );
    expect(screen.getByTitle(/newquoteform/i)).toBeInTheDocument();
  });

  it("cannot add an empty quote", async () => {
    await act(async () =>
      userEvent.click(screen.getByRole("button", { name: /add quote/i }))
    );
    expect(
      screen.getByText(/invalid input data provided\./i)
    ).toBeInTheDocument();
    expect(location.pathname).not.toBe("/quotes"); //because i redirect to quotes page after new quotes is being added
  });

  it("new quote is added if form inputes are filled", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => ({
        testId: {
          author: "Fake Author",
          text: "test quote",
        },
      }),
      ok: true,
    });
    await userEvent.type(
      screen.getByRole("textbox", { name: /author/i }),
      "Fake Author"
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /text/i }),
      "test quote"
    );
    await userEvent.click(screen.getByRole("button", { name: /add quote/i }));

    expect(location.pathname).toBe("/quotes");
    expect(screen.getByText("test quote")).toBeInTheDocument();
  });

  it("a specific quote's view full screen button redirects to this epecific quote details page", async () => {
    await userEvent.click(
      screen.getByRole("link", { name: "View Fullscreen" })
    );
    expect(location.pathname).toBe("/quotes/testId");
  });

  it("comments are shown if load comments link is clicked", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => {},
      ok: true,
    });
    await userEvent.click(screen.getByRole("link", { name: /load comments/i }));

    expect(location.pathname).toBe("/quotes/testId/comments");
  });

  it("new comment form is shown if add a comment button is clicked", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: /add a comment/i })
    );
    expect(
      screen.getByRole("textbox", { name: /your comment/i })
    ).toBeInTheDocument();
  });

  it("cannot add an empty comment and an error message is shown", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => {},
      ok: true,
    });

    await act(async () =>
      userEvent.click(screen.getByRole("button", { name: /add a comment/i }))
    );
    await userEvent.click(screen.getByRole("button", { name: /add comment/i }));
    expect(
      screen.getByText(/please eneter a valid comment\./i)
    ).toBeInTheDocument();
  });
  it("new comments fetched after being added/posted to database", async () => {
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => ({
        testId: {
          author: "Fake Author",
          text: "test quote",
        },
      }),
      ok: true,
    }); //fetchs quote
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: async () => ({
        testId: { id: "testId", text: "test comment" },
      }),
      ok: true,
    }); //fetchs neW comment
    await act(async () =>
      userEvent.click(screen.getByRole("button", { name: /add a comment/i }))
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /your comment/i }),
      "test comment"
    );
    await userEvent.click(screen.getByRole("button", { name: /add comment/i }));

    await waitFor(() =>
      expect(screen.getByText(/test comment/i)).toBeInTheDocument()
    );
  });
});
