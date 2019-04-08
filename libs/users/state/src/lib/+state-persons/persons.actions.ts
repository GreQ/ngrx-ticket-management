import { Action } from '@ngrx/store';
import { PersonSummary } from '../models';

import { SearchCriteria } from './persons.interfaces';

export enum PersonsActionTypes {
  LoadPersons = '[Persons] Load Persons',
  PersonsLoaded = '[Persons] Persons Loaded',
  PersonsLoadError = '[Persons] Persons Load Error',
  SelectPerson = '[Persons] Selected Person by ID',
  SearchByCriteria = '[Persons] Search for By Criteria',
  NavigateToPage = '[Persons] Update Paginator CurrentPage'
}

export class LoadPersons implements Action {
  readonly type = PersonsActionTypes.LoadPersons;
  constructor(readonly searchRequest?: SearchCriteria) {}
}

export class PersonsLoadError implements Action {
  readonly type = PersonsActionTypes.PersonsLoadError;
  constructor(
    readonly error: any // tslint:disable-line:no-any
  ) {}
}

export class PersonsLoaded implements Action {
  readonly type = PersonsActionTypes.PersonsLoaded;
  constructor(readonly persons: PersonSummary[], readonly pageSize?: number) {}
}

export class SelectPerson implements Action {
  readonly type = PersonsActionTypes.SelectPerson;
  constructor(readonly id: string) {}
}

export class SearchByCriteria implements Action {
  readonly type = PersonsActionTypes.SearchByCriteria;
  constructor(readonly criteria: SearchCriteria) {}
}

export class NavigateToPage implements Action {
  readonly type = PersonsActionTypes.NavigateToPage;
  constructor(readonly page: number) {}
}

export type PersonsAction = LoadPersons | PersonsLoaded | PersonsLoadError | SelectPerson | SearchByCriteria | NavigateToPage;

export const fromPersonsActions = {
  LoadPersons,
  PersonsLoaded,
  PersonsLoadError,
  SelectPerson,
  SearchByCriteria,
  NavigateToPage
};
