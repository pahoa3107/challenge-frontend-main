import { Fragment } from "react/jsx-runtime";
import type { Todo } from "../../types";

interface IProps {
  todos?: Todo[];
  stats: {
    completed: number;
    userCount: number;
    total: number;
  };
}

export const Stats = (props: IProps) => {
  const { stats } = props;

  return (
    <Fragment>
      <p>
        Completed: {stats.completed}/{stats.total}
      </p>
      <p>Unique Users: {stats.userCount}</p>
    </Fragment>
  );
};
