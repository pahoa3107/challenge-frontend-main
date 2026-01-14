import { TODO_SORT, TODO_STATUS } from "~/enums/todo.enum";

export const TodoStatus = [
    {
        key: TODO_STATUS.ALL,
        value: TODO_STATUS.ALL,
        label: "All"
    },
    {
        key: TODO_STATUS.COMPLETED,
        value: TODO_STATUS.COMPLETED,
        label: "Completed"
    },
    {
        key: TODO_STATUS.IN_PROGRESS,
        value: TODO_STATUS.IN_PROGRESS,
        label: "In Progress"
    },
    {
        key: TODO_STATUS.OVERDUE,
        value: TODO_STATUS.OVERDUE,
        label: "Overdue"
    }
];
export const TodoSort = [
    {
        key: TODO_SORT.DEFAULT,
        value: TODO_SORT.DEFAULT,
        label: "Default"
    },
    {
        key: TODO_SORT.ID,
        value: TODO_SORT.ID,
        label: "ID"
    },
    {
        key: TODO_SORT.TITLE,
        value: TODO_SORT.TITLE,
        label: "Title"
    }
];