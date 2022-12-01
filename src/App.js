import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AllQuotes from "./pages/AllQuotes";
import QuoteDetail from "./pages/QuoteDetail";
import NewQuote from "./pages/NewQuote";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import Comments from "./components/comments/Comments";
import NewComment from "./components/comments/NewComment";
import { loader as quoteLoader } from "./pages/QuoteDetail";
import { action as newQuoteAction } from "./pages/NewQuote";
import { loader as quotesLoader } from "./pages/AllQuotes";
import {
  action as commentAction,
  loader as commentsLoader,
} from "./components/comments/Comments";
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate replace to={"/quotes"} /> },
      {
        path: "/quotes",
        element: <AllQuotes />,
        loader: quotesLoader,
      },
      {
        path: "quotes/:quoteId/*",
        element: <QuoteDetail />,
        children: [
          {
            index: true,
            element: <NewComment />,
          },
          {
            path: "comments",
            element: <Comments />,
            loader: commentsLoader,
            action: commentAction,
          },
        ],
        loader: quoteLoader,
        errorElement: <p className="centered">Could not get comments.</p>,
      },
      {
        path: "/new-quote",
        element: <NewQuote />,
        action: newQuoteAction,
        errorElement: <p className="centered">Could not create quote</p>,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
