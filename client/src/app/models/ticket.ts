export type User = {
  id: string;
  name: string;
};

export type Ticket = {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  assigneeId?: string;
  user?: User;
};
