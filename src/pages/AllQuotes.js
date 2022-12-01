import { Suspense } from "react";
import QuoteList from "../components/quotes/QuoteList";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import NoQuotesFound from "../components/quotes/NoQuotesFound";
import { getAllQuotes } from "../lib/api";
import { defer, useLoaderData, Await } from "react-router-dom";

const AllQuotes = () => {
  const loadedQuotes = useLoaderData();

  return (
    <Suspense
      fallback={
        <div className="centered">
          <LoadingSpinner />
        </div>
      }
    >
      <Await resolve={loadedQuotes.quotes} errorElement={<NoQuotesFound />}>
        {(loadedData) => <QuoteList quotes={loadedData} />}
      </Await>
    </Suspense>
  );
};

export default AllQuotes;

export async function loader() {
  return defer({ quotes: getAllQuotes() });
}
