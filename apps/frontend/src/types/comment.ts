export interface Comment {
  id: string;
  card_id: string;
  content: string;
  author_id: string | null;
  author_name: string | null;
  author_email: string | null;
  created_at: string;
}

export interface CreateCommentData {
  content: string;
  card_id: string;
}

export interface UpdateCommentData {
  content: string;
}
