import { PersonSearchRequest } from '../../person-search';
import {ActiveTypes, PersonSummary } from '../../models';

/**
 * Provide mock support for all complex filtering with FilterCriteria
 *
 *    export interface PersonSearchRequest {
 *      fuzzyName?: string | null;
 *      lastNameBeginsWith?: string | null;
 *      activeState?: ActiveTypes;
 *      personTags?: Set<PersonTypes>;
 *    }
 *
 */
export function filterWithRequest(rawList: PersonSummary[], request: PersonSearchRequest) {
  const { personTags, activeState, lastNameBeginsWith, fuzzyName } = makeFilters(request);

  return (rawList || [])
    .filter(fuzzyName)
    .filter(lastNameBeginsWith)
    .filter(activeState)
    .filter(personTags);
}

// ***************************************************************
// Private filter functions
// ***************************************************************

function makeFilters(request: PersonSearchRequest) {
  const fuzzyName = (it: PersonSummary) => {
    if (request.fuzzyName) {
      const name = request.fuzzyName.toLowerCase();
      const possibles = [it.firstName, it.lastName, it.preferredName, it.hrTitle];
      return possibles.reduce((found: boolean, text: string) => {
        return found || text.toLowerCase().indexOf(name) > -1;
      }, false);
    }
    return true; // no criteria, so no filter
  };

  const lastNameBeginsWith = (it: PersonSummary) => {
    if (request.lastNameBeginsWith) {
      const text = request.lastNameBeginsWith.toLowerCase();
      return it.lastName.toLowerCase().startsWith(text);
    }
    return true; // no criteria, so no filter
  };

  const activeState = (it: PersonSummary) => {
    if (request.activeState) {
      switch (request.activeState) {
        case ActiveTypes.Any:
          return true;
        case ActiveTypes.Active:
          return it.active;
        case ActiveTypes.Inactive:
          return !it.active;
      }
    }
    return true; // no criteria, so no filter
  };

  const personTags = (person: PersonSummary) => {
    if (request.personTags) {
      const allowedTags = Array.from(request.personTags);
      return allowedTags.reduce((found: boolean, tag) => {
        return found || person.tags.has(tag);
      }, false);
    }
    return true; // no criteria, so no filter
  };

  return { personTags, activeState, lastNameBeginsWith, fuzzyName };
}
