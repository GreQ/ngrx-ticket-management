import { buildPersons } from './testing/person.factory';

import {
  LoadPersons,
  NavigateToPage,
  PersonsLoaded,
  PersonsLoadError,
  SearchByCriteria
} from './persons.actions';
import { initialState, personsReducer, DEFAULT_SEARCH_CRITERIA } from './persons.reducer';
import { PersonsState, SearchCriteria } from './persons.interfaces';

/**
 * How to test NgRx Reducers:
 *
 * To test Reducers, we mock store state (or use `initialState`), import the reducerFunction
 * and then call the reducerFunction() with mock store state and specific action instances.
 *
 * This allows us to verify state changes for a specific action!
 */
describe('Persons Reducer', () => {
  describe('valid Persons actions ', () => {
    it('should return set the list of known Persons', () => {
      const action = new PersonsLoaded(buildPersons());
      const state: PersonsState = personsReducer(initialState, action);

      expect(state.loaded).toBe(true);
      expect(state.error).toBeUndefined();
      expect(state.isSearching).toBe(false);
      expect(state.rawList.length).toBe(3);
    });
  });

  it('should update state properly on PersonsLoadError', () => {
    const errorMsg = 'unable to load persons';
    let state : PersonsState;

    state = personsReducer(initialState, new PersonsLoaded(buildPersons()));
    state = personsReducer(state, new PersonsLoadError(new Error(errorMsg)));

    expect(state.loaded).toBe(false);
    expect(state.isSearching).toBe(false);
    expect(state.rawList.length).toBe(0);

    expect(state.error).toBeDefined();
    expect(state.error).toBe(errorMsg);
  });

  describe('using SearchCriteria', () => {
    it('should NOT clear the list when the searchCriteria changes', () => {
      let state: PersonsState = personsReducer(initialState, new PersonsLoaded(buildPersons()));

      expect(state.rawList.length).toBe(3);

      state = personsReducer(state, new SearchByCriteria({ lastNameBeginsWith: 'b' }));

      expect(state.error).toBeUndefined();
      expect(state.loaded).toBe(false);
      expect(state.isSearching).toBe(true);

      expect(state.rawList.length).toBe(3);
      expect(state.paginator.totalPages).toBe(1);
      expect(state.paginator.currentPage).toBe(1);
    });

    it('should update searchCriteria with fuzzyName changes', () => {
      let state: PersonsState = personsReducer(initialState, new PersonsLoaded(buildPersons()));

      expect(state.searchCriteria).toEqual(DEFAULT_SEARCH_CRITERIA);

      const searchCriteria = {
        ...state.searchCriteria,
        fuzzyName: 'test'
      };
      state = personsReducer(state, new SearchByCriteria(searchCriteria));

      expect(state.searchCriteria).not.toEqual(DEFAULT_SEARCH_CRITERIA);
      expect(state.searchCriteria.fuzzyName).toBe('test');
    });

    it('should merge lastNameBeginsWith overrides with state searchCriteria', () => {
      let state: PersonsState = personsReducer(initialState, new PersonsLoaded(buildPersons()));

      expect(state.searchCriteria).toEqual(DEFAULT_SEARCH_CRITERIA);

      state = personsReducer(state, new SearchByCriteria({ lastNameBeginsWith: 'b' }));

      expect(state.searchCriteria.activeState).toEqual(DEFAULT_SEARCH_CRITERIA.activeState);
      expect(state.searchCriteria.personTags).toEqual(DEFAULT_SEARCH_CRITERIA.personTags);
      expect(state.searchCriteria.lastNameBeginsWith).not.toEqual(DEFAULT_SEARCH_CRITERIA.lastNameBeginsWith);
      expect(state.searchCriteria.lastNameBeginsWith).toBe('b');
    });
  });

  describe('with Paginator', function() {
    it('should initialize properly', function() {
      const action = new PersonsLoaded(buildPersons());
      const state: PersonsState = personsReducer(initialState, action);

      expect(state.paginator.totalPages).toEqual(1);
      expect(state.paginator.currentPage).toEqual(1);
      expect(state.paginator.paginatedList.length).toEqual(3);
    });

    it('should change page on NavigateToPage', function() {
      let state: PersonsState = { ...initialState };

      const loadedAction = new PersonsLoaded(buildPersons(), 2);
      state = personsReducer(state, loadedAction);

      expect(state.paginator.totalPages).toEqual(2);
      expect(state.paginator.currentPage).toEqual(1);
      expect(state.paginator.paginatedList.length).toEqual(2);

      const navAction = new NavigateToPage(2);
      state = personsReducer(state, navAction);

      expect(state.paginator.totalPages).toEqual(2);
      expect(state.paginator.currentPage).toEqual(2);
      expect(state.paginator.paginatedList.length).toEqual(1);
    });
  });

  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = {} as any; // tslint:disable-line:no-any
      const state = personsReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });
});
