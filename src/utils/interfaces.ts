export interface CustomResponse {
  status: string;
  message: string;
  data?: any;
}

export interface Book {
  id: string;
  title: string;
  image: string;
  author: string;
  description?: string;
  publisher?: string;
  adultContent?: "No" | "Yes";
  genres?: string[];
  readingAge?: string;
  language?: string;
  isbn13?: string;
  isbns?: string;
  numberOfPages?: string;
  url?: string;
}
