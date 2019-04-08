import { createFeatureSelector, createSelector } from '@ngrx/store';

import { PersonSummary } from '../models';
import { PersonsState } from './persons.interfaces';

export const PERSONS_FEATURE = 'persons';

const getPersonsState = createFeatureSelector<PersonsState>(PERSONS_FEATURE);

const getAllPersons = createSelector(getPersonsState, (state: PersonsState) => state.rawList);
const getPaginatedPersons = createSelector(getPersonsState, (state: PersonsState) => {
  return state.paginator.paginatedList;
});

const getSelectedId = createSelector(getPersonsState, (state: PersonsState) => state.selectedId);
const getSelectedPerson = createSelector(getAllPersons, getSelectedId, (persons: PersonSummary[], id: string) => {
  const person = id ? persons.find((it: PersonSummary) => String(it['id']) == id) : null; // tslint:disable-line
  return person ? ({ ...person } as PersonSummary) : null;
});

const getSearchCriteria = createSelector(getPersonsState, (state: PersonsState) => state.searchCriteria);
const getIsLoaded = createSelector(getPersonsState, (state: PersonsState) => state.loaded);
const getIsSearching = createSelector(getPersonsState, (state: PersonsState) => state.isSearching);
const getError = createSelector(getPersonsState, (state: PersonsState) => state.error);

const getCurrentPage = createSelector(getPersonsState, (state: PersonsState) => state.paginator.currentPage);
const getTotalPages = createSelector(getPersonsState, (state: PersonsState) => state.paginator.totalPages);

export const personsQuery = {
  getAllPersons,
  getPaginatedPersons,
  getSelectedPerson,
  getSearchCriteria,
  getIsLoaded,
  getIsSearching,
  getError,
  getCurrentPage,
  getTotalPages
};
