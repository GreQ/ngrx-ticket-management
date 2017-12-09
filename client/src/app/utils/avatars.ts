import { Ticket, User } from '../models/ticket';

export function updateWithAvatar(ticket: Ticket, users: User[]): Ticket {
  updateWithAvatars([ticket], users);
  return ticket;
}

/**
 * Update tickets with Avatar image URLs
 */
export function updateWithAvatars(tickets: Ticket[], users: User[]): Ticket[] {
  const lookupUser = findUserBy(users);
  tickets.forEach(t => {
    const user = lookupUser(t.assigneeId);
    t.imageURL = user ? user.imageURL : '';
    return t;
  });

  return tickets;
}

function findUserBy(users = []) {
  return id => {
    return users.reduce((found, user) => {
      return found || (user.id == id ? user : null);
    }, null);
  };
}
