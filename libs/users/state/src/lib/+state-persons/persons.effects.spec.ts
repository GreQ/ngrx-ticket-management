import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { EffectsMetadata, EffectsModule, getEffectsMetadata } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { DataPersistence, NxModule } from '@nrwl/nx';
import { of, throwError } from 'rxjs';
import {PersonSearchRequest} from '../person-search';

import { buildPersons } from './testing/person.factory';

import { PersonsFacade } from './persons.facade';
import { PERSONS_FEATURE } from './persons.selectors';
import { initialState, personsReducer } from './persons.reducer';
import { SearchCriteria, PersonsState } from './persons.interfaces';

import { PersonSearchService } from '../person-search/search.service';
import { PersonSummary } from '../models';

import {
  LoadPersons,
  PersonsActionTypes, PersonsLoaded,
  PersonsLoadError,
  SearchByCriteria
} from './persons.actions';
import { PersonsEffects } from './persons.effects';

interface TestSchema {
  persons: PersonsState;
}

/**
 * How to test NgRx Effects:
 *
 * To test Effects, build a test bed to setup Ngrx with effects, reducers, and selectors, and facade.
 * We mock any services used internally in the Effects.
 *
 * Then we test in by dispatching store actions that only the @Effect() will handle and subscribe to
 * the effect observable to see if the desired output is emitted.
 *
 * This allows us to verify Effect observables and impacts of actions stream in the pipeline.
 */
describe('PersonsEffects', () => {
  let effects: PersonsEffects;
  let metadata: EffectsMetadata<PersonsEffects>;
  let store: Store<TestSchema>;
  let rawList;

  const MAKE_ERROR = 'throw error on loadPersons$';
  const ERROR_MESSAGE = 'error during loadPersons$';
  /**
   * The mock ProfilePerson checks request.fuzzyName to alternative
   * throw an error. This
   */
  const ERROR_ACTION = new SearchByCriteria({
    fuzzyName: MAKE_ERROR
  });
  /**
   * Mock service used internally in persons.effects.ts
   */
  const mockSearchService = {
    search: (request: PersonSearchRequest): Observable<PersonSummary[]> => {
      return (request.fuzzyName == MAKE_ERROR) ? throwError(ERROR_MESSAGE) : of(rawList);
    }
  };

  beforeEach(() => {
    rawList = buildPersons();

    TestBed.configureTestingModule({
      imports: [
        NxModule.forRoot(),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(PERSONS_FEATURE, personsReducer, { initialState }),
        EffectsModule.forFeature([PersonsEffects])
      ],
      providers: [
        {
          provide: PersonSearchService,
          useValue: mockSearchService
        },
        DataPersistence,
        PersonsFacade
      ]
    });

    effects = TestBed.get(PersonsEffects);
    metadata = getEffectsMetadata(effects);
    store = TestBed.get(Store);
  });

  describe('effects responses', function() {
    it('should register loadPersons$ that dispatches an action', () => {
      expect(metadata.loadPersons$).toEqual({ dispatch: true });
    });

    it('should register loadPersons$ that dispatches an action', () => {
      expect(metadata.searchPersons$).toEqual({ dispatch: true });
    });
  });

  /**
   * Testing the @Effect properties
   */
  describe('listen for action', ()  => {
    it('loadPersons$ should return list using "PersonsLoaded" action', () => {
      store.dispatch(new LoadPersons());

      effects.loadPersons$.subscribe(action => {
        expect(action.type).toBe(PersonsActionTypes.PersonsLoaded);
        expect((action as PersonsLoaded).persons.length === rawList.length).toBe(true);
      });
    });

    it('searchPersons$ should switch to new action "LoadPersons"', () => {
      store.dispatch(
        new SearchByCriteria({
          lastNameBeginsWith: 'b'
        })
      );

      effects.searchPersons$.subscribe(action => {
        expect(action.type).toBe(PersonsActionTypes.LoadPersons);
        expect((action.searchRequest as SearchCriteria).lastNameBeginsWith).toEqual('b');
      });
    });

    it('loadPersons$ should catch error and dispatch PersonsLoadError', () => {
      store.dispatch(ERROR_ACTION);

      effects.loadPersons$.subscribe(action => {
        expect(action.type).toBe(PersonsActionTypes.PersonsLoadError);
        expect((action as PersonsLoadError).error).toBe(ERROR_MESSAGE);
      });
    });

  });
});
