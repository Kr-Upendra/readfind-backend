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
  url?: string;
}
