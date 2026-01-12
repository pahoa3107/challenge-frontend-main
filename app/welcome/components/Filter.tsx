import type { FilterProps, User } from "../../types";

interface Props {
  filterByText: FilterProps;
  filterByUser: {
    value: number | null;
    onChange: (value: number | null) => void;
  };
  sortBy: FilterProps;
  users: User[];
}

export const Filter = ({ filterByText, filterByUser, sortBy, users }: Props) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Filter todos..."
        value={filterByText.value}
        onChange={(e) => filterByText.onChange(e.target.value)}
      />
      <select value={sortBy.value} onChange={(e) => sortBy.onChange(e.target.value as any)}>
        <option value="id">Sort by ID</option>
        <option value="title">Sort by Title</option>
      </select>
      <select
        value={filterByUser.value || ""}
        onChange={(e) =>
          filterByUser.onChange(e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">All Users</option>
        {Object.values(users).map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
      // onClick={() =>
      //   setTheme((prev) => (prev === "light" ? "dark" : "light"))
      // }
      >
        Toggle Theme
      </button>
    </div>
  );
};
