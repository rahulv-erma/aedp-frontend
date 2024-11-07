export type PaginatedResponse<Result> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Result[];
};
