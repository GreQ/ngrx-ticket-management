import { PersonSummary, PersonTags } from '../../models';


/**
 * Factory to build 'n' PersonSummary instance
 */
export function buildPersons(count = 3): PersonSummary[] {
  return new Array(count).fill(null).map((_, index) => makePerson(index + 1));
}

/**
 * For specified person id, make partial text
 * search useful in fuzzy searches
 */
export function makeFuzzyText(id: string) {
  return `e=${id}`;
}

export function makePerson(id: number) {
  return {
    id,
    active: true,
    prefix: '',
    firstName: `first=${id}`,
    middleName: '',
    lastName: `lastName=${id}`,
    suffix: '',
    preferredName: '',
    tags: new Set([PersonTags.Passenger]),
    primaryEmailAddress: '',
    primaryPhoneNumber: '',
    primaryPhoneCode: '',
    hrTitle: `title=${id}`,
    employeeId: ''
  };
}
