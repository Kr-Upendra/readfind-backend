export const RedisKeys = {
  // Book Categories
  newBooks: "books:newBooks",
  popularBooks: "books:popularBooks",

  // Timestamps
  newBooksTimestamp: "books:newBooks:timestamp",
  popularBooksTimestamp: "books:popularBooks:timestamp",

  // Individual Book Data
  bookId: (id: string) => `books:bookId:${id}`,
};
