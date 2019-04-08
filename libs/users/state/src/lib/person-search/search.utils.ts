import {PersonSummary} from '../models';
import {NormalizedSearch, PersonSearchRequest} from './search.interfaces';

export function normalizeStr(str: string): string {
  return str.trim().toLowerCase();
}

export function normalizeRequest(request: PersonSearchRequest): NormalizedSearch {
  return {
    searchTerm: !request.fuzzyName ? '' : normalizeStr(request.fuzzyName),
    activeState: request.activeState,
    personTags: request.personTags ? Array.from(request.personTags) : []
  };
}

export function applyFrontEndSearchFilter(persons: PersonSummary[], normalizedRequest: PersonSearchRequest) {
  const lastNamePrefix = normalizedRequest.lastNameBeginsWith;
  if (!lastNamePrefix) {
    return persons;
  }

  return persons.filter(person => {
    return this.normalizeStr(person.lastName).startsWith(lastNamePrefix);
  });
}
