import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {Ticket} from '../models/ticket';
import {Backend} from './backend.service';

export class TicketsService {
  tickets$   : Subject<Ticket[]> = new Subject<Ticket[]>();
  allTickets : Ticket[] = [];   // all known tickets
  filter     : string   = "";   // filter criteria

  constructor(private backend: Backend) {
    backend.tickets().subscribe((list:Ticket[]) => {
      this.allTickets = list;
      this.announceChanges();
    });
  }

  loadAll():Observable<Ticket[]> {
    return this.backend.tickets().pipe(
      tap( list => {
        this.allTickets = list;
        this.announceChanges();
      })
    );
  }


  applyFilter(criteria:string) {
    this.filter = criteria;
    this.announceChanges();
  }

  addTicket(title:string) {
    this.backend
      .newTicket( {title} )
      .subscribe((ticket:Ticket) => {
        this.allTickets = addTicket(ticket, this.allTickets);
        this.announceChanges();
      });
  }

  doComplete(ticket:Ticket) {
    this.backend
      .complete(ticket.id, true)
      .subscribe((ticket:Ticket) => {
        this.allTickets = addTicket(ticket, this.allTickets);
        this.announceChanges();
      })
  }


  private announceChanges() {
    this.tickets$.next(
        applyFilters(this.filter, this.allTickets)
    );
  }
}



/**
 * Notice this is analogous to a Redux `reducer` function...
 * @param list
 * @param filter
 */
function applyFilters(criteria:string, list:Ticket[]):Ticket[] {
  const inComplete = (t:Ticket):boolean => (t.completed !== true);
  return list
    .filter(it => matchesCriteria(criteria,it))
    .filter( inComplete );
}

/**
 * Add ticket to existing list. If already existing,
 * overwrite with new values. Maintain ticket order.
 */
function addTicket(ticket:Ticket, buffer:Ticket[]):Ticket[] {
  const found = findExisting(ticket, buffer);
  const result = !!found ? buffer.map(it => {
      return (it.id == ticket.id) ? {...it, ...ticket} : it;
  }) : buffer.concat(ticket);

  return result;
}



// ***************************************************************
// Simple data model methods
// ***************************************************************

/**
 * Determine if criteria matches ticket description
 */
function matchesCriteria(criteria:string, ticket:Ticket):boolean {
  const description = ticket.description.toLowerCase();
  const title       = ticket.title.toLowerCase();

    criteria = criteria.toLowerCase();

  return title.includes(criteria) || description.includes(criteria);
}

/**
 * Find existing ticket (if present)
 */
function findExisting(ticket:Ticket, buffer:Ticket[]):Ticket {
  return buffer.reduce((prev, curr):Ticket=> {
    return prev ? prev : ((curr.id == ticket.id) ? curr : null);
  }, null);
}
