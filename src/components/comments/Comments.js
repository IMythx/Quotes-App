import { useState } from "react";
import {
  useParams,
  useNavigation,
  useLoaderData,
  useActionData,
} from "react-router-dom";

import classes from "./Comments.module.css";
import NewCommentForm from "./NewCommentForm";
import { getAllComments, addComment } from "../../lib/api";
import LoadingSpinner from "../UI/LoadingSpinner";
import CommentsList from "./CommentsList";
import InvalidInput from "../quotes/invalidInput";

const Comments = () => {
  const loadedData = useLoaderData();
  const navigation = useNavigation();
  const [isAddingComment, setIsAddingComment] = useState(false);
  const params = useParams();
  const actionData = useActionData();

  const { quoteId } = params;

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };

  let comments;

  if (navigation.state === "submitting") {
    comments = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (loadedData && loadedData.length > 0) {
    comments = <CommentsList comments={loadedData} />;
  }

  if (!loadedData || loadedData.length === 0) {
    comments = <p className="centered">No comments were added yet!</p>;
  }

  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className="btn--flat" onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && actionData && actionData.isError && (
        <InvalidInput>{actionData.message}</InvalidInput>
      )}
      {isAddingComment && (
        <NewCommentForm
          quoteId={quoteId}
          isLoading={navigation.state === "submitting"}
        />
      )}
      {comments}
    </section>
  );
};

export default Comments;
export async function loader({ params }) {
  return getAllComments(params.quoteId);
}
export async function action({ request, params }) {
  const formData = await request.formData();
  const commentData = {
    commentData: { text: formData.get("comment"), id: params.quoteId },
    quoteId: params.quoteId,
  };
  return await addComment(commentData);
}
