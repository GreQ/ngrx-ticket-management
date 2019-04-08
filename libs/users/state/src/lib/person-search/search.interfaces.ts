import { PersonTags, ActiveTypes } from '../models';

export interface NormalizedSearch {
  searchTerm: string;
  activeState: ActiveTypes;
  personTags: PersonTags[];
}

export interface PersonSearchRequest {
  activeState?: ActiveTypes;
  personTags?: Set<PersonTags>;
  fuzzyName?: string | null;
  lastNameBeginsWith?: string | null;
}
