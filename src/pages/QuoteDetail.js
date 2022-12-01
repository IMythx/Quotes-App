import { Fragment } from "react";
import { Suspense } from "react";
import { defer, Await, Outlet, useLoaderData } from "react-router-dom";

import HighlightedQuote from "../components/quotes/HighlightedQuote";
import { getSingleQuote } from "../lib/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const QuoteDetail = () => {
  const loaderData = useLoaderData();

  return (
    <Suspense
      fallback={
        <div className="centered">
          <LoadingSpinner />
        </div>
      }
    >
      <Await
        resolve={loaderData.quoteData}
        errorElement={
          <div className="centered">
            <p>No quote found!</p>
          </div>
        }
      >
        {(loadedData) => {
          return (
            <Fragment>
              <HighlightedQuote
                text={loadedData.text}
                author={loadedData.author}
              />
              <Outlet />
            </Fragment>
          );
        }}
      </Await>
    </Suspense>
  );
};

export default QuoteDetail;

export async function loader({ params }) {
  return defer({ quoteData: getSingleQuote(params.quoteId) });
}
