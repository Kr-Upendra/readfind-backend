export const RedisKeys = {
  // Book Categories
  newBooks: "books:newBooks",
  popularBooks: "books:popularBooks",
  teensBooks: "books:teensBooks",

  // Individual Book Data
  bookId: (id: string) => `books:bookId:${id}`,
};
