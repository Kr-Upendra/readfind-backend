export const RedisKeys = {
  // Book Categories
  newBooks: { key: "books:newBooks", expTime: 3 * 24 * 60 * 60 },
  popularBooks: { key: "books:popularBooks", expTime: 3 * 24 * 60 * 60 },
  teensBooks: { key: "books:teensBooks", expTime: 3 * 24 * 60 * 60 },

  // Individual Book Data
  bookId: (id: string) => ({
    key: `books:bookId:${id}`,
    expTime: 3 * 24 * 60 * 60,
  }),
};
