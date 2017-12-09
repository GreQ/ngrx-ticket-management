export type User = {
  id: string;
  name: string;
  imageURL: string;
};

export type Ticket = {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  assigneeId?: string;
  imageURL?: string;
};
