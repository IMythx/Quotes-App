import classes from "./invalidInput.module.css";

const InvalidInput = (props) => {
  return <div className={classes.centered}>{props.children}</div>;
};
export default InvalidInput;
