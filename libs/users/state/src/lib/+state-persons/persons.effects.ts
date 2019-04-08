import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';

import { of } from 'rxjs';
import {
  catchError,
  map,
  pluck,
  retryWhen,
  switchMap,
  delay,
  take,
  withLatestFrom
} from 'rxjs/operators';

import { PersonSummary } from '../models';
import {PersonSearchRequest} from '../person-search';
import { PersonsFacade } from './persons.facade';
import { PersonsState, SearchCriteria } from './persons.interfaces';
import { PersonSearchService } from '../person-search/search.service';

import {
  LoadPersons,
  PersonsActionTypes,
  PersonsLoaded,
  PersonsLoadError
} from './persons.actions';

const INIT_PERSONS_EFFECTS = '[PersonsEffects]: Init';

@Injectable()
export class PersonsEffects {
  @Effect()
  /**
   *  When search criteria changes, dispatch action to Load all matching persons
   */
  searchPersons$ = this.facade.searchCriteria$.pipe(map((criteria: SearchCriteria) => new LoadPersons(criteria)));

  @Effect()
  /**
   * Load all persons using specified search criteria
   */
  loadPersons$ = this.actions$.pipe(
    ofType(PersonsActionTypes.LoadPersons),
    pluck('searchRequest'),
    switchMap((searchCriteria: SearchCriteria) => {
      const request = toSearchRequest(searchCriteria);
      return this.searchService.search(request).pipe(
        map(list => new PersonsLoaded(sortByName(list))),
        retryWhen(errors => errors.pipe(delay(300), take(3))),
        catchError(error => {
          return of(new PersonsLoadError(error));
        }),
      );
    })
  );


  @Effect()
  loadAllContacts$ = this.actions$.pipe(
    ofType(INIT_PERSONS_EFFECTS),
    withLatestFrom(this.searchPersons$),
    map(([_, action]) => action)
  );

  constructor(
    private readonly store: Store<PersonsState>,
    private readonly actions$: Actions,
    private readonly facade: PersonsFacade,
    private readonly searchService: PersonSearchService
  ) {
  }

  ngrxOnInitEffects(): Action {
    return { type: INIT_PERSONS_EFFECTS };
  }
}

/**
 * Build a sorted set...
 */
function sortByName(list: PersonSummary[]) {
  const sortedPersons = list ? [...list] : [];
  //sort by last, then first name, case-insensitive.  use id to break ties stably
  return sortedPersons.sort((a, b) => {
    const aName = `${a.lastName} ${a.firstName}${a.id || 0}`.toLowerCase();
    const bName = `${b.lastName} ${b.firstName}${b.id || 0}`.toLowerCase();
    return aName > bName ? 1 : bName > aName ? -1 : 0;
  });
}

/**
 * Convert serializable NgRx search criteria to format expect by
 * searchService.service() API.
 */
function toSearchRequest(criteria: SearchCriteria): PersonSearchRequest {
  criteria = criteria || {};
  const personTags = new Set(criteria.personTags || []);
  return { ...criteria, personTags } as PersonSearchRequest;
}
