interface Props {
  page: number;
  totalPages: number;
  setPage: any;
}

export const Pagination = ({ page, totalPages, setPage }: Props) => (
  <div style={{ marginTop: "20px" }}>
    <button
      disabled={page === 1}
      onClick={() => setPage((prev: any) => prev - 1)}
    >
      Previous
    </button>
    <span>
      {" "}
      Page {page} of {totalPages}{" "}
    </span>
    <button
      disabled={page === totalPages}
      onClick={() => setPage((prev: any) => prev + 1)}
    >
      Next
    </button>
  </div>
);
