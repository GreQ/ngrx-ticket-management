export enum PersonTags {
  Crew = 'Crew',
  NonCrew = 'Non-Crew',
  Passenger = 'Pax'
}

export enum ActiveTypes {
  Any = 'any',
  Inactive = 'inactive',
  Active = 'active'
}

export const ALL_PERSON_TYPES = [PersonTags.Crew, PersonTags.NonCrew, PersonTags.Passenger];

export const sortPersonTags = (tags: PersonTags[]): PersonTags[] => {
  const sortingValues: Record<PersonTags, number> = {
    Pax: 1,
    Crew: 2,
    'Non-Crew': 3
  };
  return tags.slice(0).sort((tagA, tagB) => {
    if (sortingValues[tagA] > sortingValues[tagB]) {
      return 1;
    }
    if (sortingValues[tagA] < sortingValues[tagB]) {
      return -1;
    }
    return 0;
  });
};
