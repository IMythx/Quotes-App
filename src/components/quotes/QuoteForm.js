import { Fragment } from "react";
import { Form } from "react-router-dom";

import Card from "../UI/Card";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./QuoteForm.module.css";

const QuoteForm = (props) => {
  return (
    <Fragment>
      <Card>
        <Form
          className={classes.form}
          method="POST"
          action="/new-quote"
          title="newQuoteForm"
        >
          {props.isLoading && (
            <div className={classes.loading}>
              <LoadingSpinner />
            </div>
          )}

          <div className={classes.control}>
            <label htmlFor="author">Author</label>
            <input type="text" name="author" id="author" />
          </div>
          <div className={classes.control}>
            <label htmlFor="text">Text</label>
            <textarea id="text" name="text" rows="5"></textarea>
          </div>
          <div className={classes.actions}>
            <button className="btn">Add Quote</button>
          </div>
        </Form>
      </Card>
    </Fragment>
  );
};

export default QuoteForm;
