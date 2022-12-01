import { useNavigation, redirect, useActionData } from "react-router-dom";
import { Fragment } from "react";
import QuoteForm from "../components/quotes/QuoteForm";
import InvalidInput from "../components/quotes/invalidInput.js";
import { addQuote } from "../lib/api";
const NewQuote = () => {
  const actionData = useActionData();
  const navigation = useNavigation;
  return (
    <Fragment>
      {actionData && actionData.isError && (
        <InvalidInput>{actionData.message}</InvalidInput>
      )}
      <QuoteForm isLoading={navigation.state === "submitting"} />
    </Fragment>
  );
};

export default NewQuote;
export async function action({ request }) {
  const formData = await request.formData();
  const newQuoteData = {
    text: formData.get("text"),
    author: formData.get("author"),
  };
  const validationError = await addQuote(newQuoteData);
  if (validationError) {
    return validationError;
  }
  return redirect("/quotes");
}
