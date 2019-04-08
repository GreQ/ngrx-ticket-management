import { DataPaginator } from './paginator';
import { PersonSummary } from '../models';

import { PersonsState, SearchCriteria } from './persons.interfaces';
import { initialState, DEFAULT_SEARCH_CRITERIA } from './persons.reducer';
import { personsQuery, PERSONS_FEATURE } from './persons.selectors';
import { makePerson } from './testing/person.factory';

/**
 * How to test NgRx Selectors:
 *
 * To test Selectors, we mock store state (or use `initialState`), import the queries (aka selectors)
 * and call the query with the mock store state. The query output should provide the data desired.
 *
 * This allows us to verify query results for specific store state!
 */
describe('Persons Selectors', () => {
  let storeState: { [key: string]: PersonsState };

  const getPersonsId = (it: PersonSummary | null) => (it ? String(it.id) : null);

  beforeEach(() => {
    const persons = [33, 45, 67].map(id => makePerson(id));
    const paginator = new DataPaginator<PersonSummary>(persons);

    storeState = {};
    storeState[PERSONS_FEATURE] = {
      ...initialState,
      rawList: persons,
      paginator,
      selectedId: '0',
      loaded: true
    };
  });

  describe('person query', () => {
    it('getAllPersons() should return the list of Persons', () => {
      const results = personsQuery.getAllPersons(storeState);
      expect(results.length).toBe(3);
    });

    it('getSelectedPerson() should return the selected Person', () => {
      const state: PersonsState = storeState[PERSONS_FEATURE];

      let expectedId = getPersonsId(state.rawList[1]);
      storeState = updatePersonsState(storeState, 'selectedId', expectedId);
      let actualId = getPersonsId(personsQuery.getSelectedPerson(storeState));

      expect(expectedId === actualId).toBe(true);

      expectedId = getPersonsId(state.rawList[2]);
      storeState = updatePersonsState(storeState, 'selectedId', expectedId);
      actualId = getPersonsId(personsQuery.getSelectedPerson(storeState));

      expect(expectedId).toBe(actualId);
    });
  });

  describe('error reporting', function() {
    const ERROR_MSG = "weird unknown error occurred";

    beforeEach(() => {
      storeState[PERSONS_FEATURE] = {
        ...initialState,
        rawList: [],
        paginator: new DataPaginator([]),
        loaded: false,
        isSearching: false,
        error: ERROR_MSG
      };
    });

     it('errors should be queried properly', function() {
       expect(personsQuery.getError(storeState)).toBe(ERROR_MSG);
       expect(personsQuery.getIsSearching(storeState)).toEqual(false);
       expect(personsQuery.getIsLoaded(storeState)).toEqual(false);
     });

   });

  describe('Paginated Users', function() {
    beforeEach(() => {
      const paginator = new DataPaginator(storeState[PERSONS_FEATURE].rawList);
      storeState = updatePersonsState(storeState, 'paginator', paginator);
    });

    it('getPaginatedPersons() should properly lookup the paginated users', function() {
      const paginatedList = personsQuery.getPaginatedPersons(storeState);
      const rawList = personsQuery.getAllPersons(storeState);

      expect(paginatedList).toBeTruthy();
      expect(paginatedList.length).toEqual(3);
      expect(paginatedList).not.toBe(rawList);
    });

    it('Paginator accessors should calculate page info correctly', function() {
      expect(personsQuery.getTotalPages(storeState)).toBe(1);
      expect(personsQuery.getCurrentPage(storeState)).toBe(1);
    });
  });

  describe('searching', function() {
    it('getSearchCriteria() should access search criteria', function() {
      const criteria: SearchCriteria = personsQuery.getSearchCriteria(storeState);
      const defaults: SearchCriteria = DEFAULT_SEARCH_CRITERIA;

      expect(criteria).toBeDefined();
      expect(criteria.personTags === defaults.personTags).toBe(true);
      expect(criteria.activeState === defaults.activeState).toBe(true);
    });

    it('getIsSearching() should current state', function() {
      const isSearching = personsQuery.getIsSearching(storeState);
      expect(personsQuery.getIsSearching(storeState)).toBe(false);

      storeState = updatePersonsState(storeState, 'isSearching', true);
      expect(personsQuery.getIsSearching(storeState)).toBe(true);
    });

    it('getError() should current error', function() {
      const error = 'Some random error message';
      expect(personsQuery.getError(storeState)).toBeUndefined();
      storeState = updatePersonsState(storeState, 'error', error);
      expect(personsQuery.getError(storeState) === error).toBe(true);
    });
  });
});

/**
 * Properly mutate PersonsState fields so memoized selectors fire properly...
 */
function updatePersonsState(appState, key, value) {
  const storeState = { ...appState };
  storeState[PERSONS_FEATURE] = { ...appState[PERSONS_FEATURE] };
  storeState[PERSONS_FEATURE][key] = value;

  return storeState;
}
