export type ActionType = 'review' | "watch" | "rating" | "list";

export type UserAction = {
  type: ActionType;

  createdAt: Date;

  authorId: number;
  authorName: string;
  authorAvatarPath: string;

  movieId?: string;
  title?: string;

  rating?: number;
  reviewTitle?: string;
  review?: string;

  listId?: number;
  listName?: string;
}