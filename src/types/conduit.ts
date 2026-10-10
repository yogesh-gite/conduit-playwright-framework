// Response and request shapes from the RealWorld (Conduit) API spec.

export interface User {
  email: string;
  username: string;
  token: string;
  bio: string | null;
  image: string | null;
}

export interface UserResponse {
  user: User;
}

export interface Profile {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export interface ArticleResponse {
  article: Article;
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface TagsResponse {
  tags: string[];
}

export interface NewArticle {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export interface ErrorResponse {
  errors: Record<string, string[]>;
}
