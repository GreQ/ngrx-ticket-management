import {PersonTags} from './person-tag';

export type WeightUnit = 'KG' | 'LB' | 'ST';
export type Gender = 'M' | 'F';

interface PersonCore {
  active: boolean;
  prefix: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  preferredName: string | null;
  tags: Set<PersonTags>;
}

export interface Person extends PersonCore {
  cityOfBirth: string | null;
  stateProvinceOfBirth: string | null;
  citizenshipCountryId: number | null;

  weight: number | null;
  weightUnit: WeightUnit | null;
  gender: Gender | null;

}

export interface PersonSummary extends PersonCore {
  readonly id: number;
  primaryEmailAddress: string | null;
  primaryPhoneNumber: string | null;
  primaryPhoneCode: string | null;
  hrTitle: string | null;
  employeeId: string | null;
}
