import { PersonSummary, PersonTags, ActiveTypes } from '../models';
import { Paginator } from './paginator';

export interface SearchCriteria {
  fuzzyName?: string | null;
  lastNameBeginsWith?: string | null;
  activeState?: ActiveTypes;
  personTags?: PersonTags[];
}

export interface PersonsState {
  rawList: PersonSummary[];
  selectedId: string | null;
  paginator: Paginator<PersonSummary>;
  isSearching: boolean;
  searchCriteria: SearchCriteria;
  loaded: boolean;
  error?: string | null;
}
