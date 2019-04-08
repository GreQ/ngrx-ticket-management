import { ActiveTypes, ALL_PERSON_TYPES, PersonSummary } from '../models';
import { DataPaginator, PAGE_SIZE } from './paginator';
import {
  NavigateToPage,
  PersonsAction,
  PersonsActionTypes,
  PersonsLoaded,
  SearchByCriteria
} from './persons.actions';
import { PersonsState, SearchCriteria } from './persons.interfaces';

export const DEFAULT_SEARCH_CRITERIA: SearchCriteria = {
  activeState: ActiveTypes.Active,
  personTags: ALL_PERSON_TYPES
};

export const initialState: PersonsState = {
  rawList: [],
  selectedId: '',
  paginator: {
    paginatedList: [],
    totalPages: 0,
    currentPage: -1,
    pageSize: PAGE_SIZE
  },
  isSearching: false,
  searchCriteria: DEFAULT_SEARCH_CRITERIA,
  loaded: false
};

/**
 * Internal paginator instance used to manage complexity of paginating lists
 */
const paginator = new DataPaginator<PersonSummary>();

export function personsReducer(state: PersonsState = initialState, action: PersonsAction): PersonsState {
  switch (action.type) {

    case PersonsActionTypes.SearchByCriteria:
      const searchCriteria = (action as SearchByCriteria).criteria;
      state = {
        ...state,
        searchCriteria: {
          ...DEFAULT_SEARCH_CRITERIA,
          ...state.searchCriteria,
          ...searchCriteria
        },
        isSearching: true,
        loaded: false,
        error: undefined
      };
      break;

    case PersonsActionTypes.NavigateToPage: {
      paginator.goToPage((action as NavigateToPage).page);
      const { totalPages, currentPage, paginatedList, pageSize } = paginator;

      state = {
        ...state,
        paginator: {
          paginatedList,
          currentPage,
          totalPages,
          pageSize
        }
      };
      break;
    }

    case PersonsActionTypes.LoadPersons:
      state = {
        ...state,
        isSearching: true,
        error: null
      };
      break;

    /**
     * On Error: clear list, pagination, and assign error
     */
    case PersonsActionTypes.PersonsLoadError: {
      paginator.rawList = [];
      const { totalPages, currentPage, paginatedList, pageSize } = paginator;

      state = {
        ...state,
        rawList: paginator.rawList,
        paginator: {
          paginatedList,
          currentPage,
          totalPages,
          pageSize
        },
        isSearching: false,
        loaded: false,
        error: action.error.message
      };

      console.warn(`${PersonsActionTypes.PersonsLoadError}: ${action.error.message}`);
      break;
    }

    case PersonsActionTypes.PersonsLoaded: {
      paginator.rawList = (action as PersonsLoaded).persons;
      paginator.pageSize = (action as PersonsLoaded).pageSize || paginator.pageSize;
      const { totalPages, currentPage, paginatedList, pageSize } = paginator;

      state = {
        ...state,
        rawList: paginator.rawList,
        paginator: {
          paginatedList,
          currentPage,
          totalPages,
          pageSize
        },
        loaded: true,
        isSearching: false,
        error: undefined
      };
      break;
    }

    case PersonsActionTypes.SelectPerson:
      state = {
        ...state,
        selectedId: action.id ? action.id : null
      };
      break;

  }
  return state;
}
