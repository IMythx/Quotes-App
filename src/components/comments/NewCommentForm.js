import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./NewCommentForm.module.css";
import { Form, useParams } from "react-router-dom";

const NewCommentForm = (props) => {
  const { quoteId } = useParams();

  return (
    <Form
      className={classes.form}
      method="POST"
      action={`/quotes/${quoteId}/comments`}
    >
      {props.isLoading && (
        <div className="centered">
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.control}>
        <label htmlFor="comment">Your Comment</label>
        <textarea id="comment" name="comment" rows="5"></textarea>
      </div>
      <div className={classes.actions}>
        <button className="btn--flat">Add Comment</button>
      </div>
    </Form>
  );
};

export default NewCommentForm;
