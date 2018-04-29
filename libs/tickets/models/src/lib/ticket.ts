export type Ticket = {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  assigneeId?: string;
  imageURL?: string;
};
