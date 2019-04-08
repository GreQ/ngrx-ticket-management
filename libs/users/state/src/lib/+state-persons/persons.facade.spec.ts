import { NxModule } from '@nrwl/nx';
import { async, TestBed } from '@angular/core/testing';
import { readFirst } from '@nrwl/nx/testing';

import { Observable, of } from 'rxjs';

import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';

import { PersonSummary, PersonTags, ActiveTypes } from '../models';
import { PersonSearchService , PersonSearchRequest } from '../person-search';

import { PersonsEffects } from './persons.effects';
import { PersonsFacade } from './persons.facade';
import { PersonsLoaded, SearchByCriteria } from './persons.actions';
import { PERSONS_FEATURE } from './persons.selectors';
import { initialState, personsReducer, DEFAULT_SEARCH_CRITERIA } from './persons.reducer';
import { PersonsState } from './persons.interfaces';

import { buildPersons, makeFuzzyText } from './testing/person.factory';
import { filterWithRequest } from './testing/filtration';

interface TestSchema {
  persons: PersonsState;
}

/**
 * Mock service used internally in persons.effects.ts
 */
export class MockPersonSearchService {
  search(request: PersonSearchRequest): Observable<PersonSummary[]> {
    return of(filterWithRequest(buildPersons(), request));
  }
}

/**
 * How to test NgRx Facades:
 *
 * To test Facades, build a test bed to setup Ngrx with effects,reducers, and selectors, and facade.
 * We mock any services used internally in the Effects. Then we test in two (2) ways:
 *
 * 1) Test Facade method calls using readFirst(<observable properties) to check emitted values
 * 2) Test Facade observable properties: by dispatching store actions
 *
 * This allows us to verify Facades observables and impacts of method calls on emitted values!
 */
describe('PersonsFacade', () => {
  let facade: PersonsFacade;
  let store: Store<TestSchema>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          NxModule.forRoot(),
          StoreModule.forRoot({}),
          EffectsModule.forRoot([]),
          StoreModule.forFeature(PERSONS_FEATURE, personsReducer, { initialState }),
          EffectsModule.forFeature([PersonsEffects])
        ],
        providers: [PersonsFacade, {
          provide: PersonSearchService,
          useClass: MockPersonSearchService
        }]
      });

      store = TestBed.get(Store);
      store.dispatch(new PersonsLoaded([]));

      facade = TestBed.get(PersonsFacade);
    })
  );

  /**
   * These tests invoke facade public methods...
   * and watch results using facade observables
   */
  describe('public methods', function() {
    it('searchByLastNameStartsWith() should emit mocked data via `person$`', async done => {
      try {
        let isSearching, list;

        list = await readFirst<PersonSummary[]>(facade.persons$);
        isSearching = await readFirst(facade.isSearching$);

        expect(isSearching).toBe(false);
        expect(list.length).toBe(0);

        facade.searchByLastNameStartsWith('b');

        isSearching = await readFirst(facade.isSearching$);
        list = await readFirst(facade.persons$);

        expect(isSearching).toBe(false);
        expect(list.length).toBe(0);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('searchByText() should emit mocked data via `person$`', async done => {
      try {
        let isSearching, list;
        list = await readFirst<PersonSummary[]>(facade.persons$);
        isSearching = await readFirst(facade.isSearching$);

        expect(isSearching).toBe(false);
        expect(list.length).toBe(0);

        const userId = '2';                 // 3 mock users generated with ids 1, 2, 3
        const text = makeFuzzyText(userId); // see mock factory

        facade.searchByText(text);

        list = await readFirst(facade.persons$);
        isSearching = await readFirst(facade.isSearching$);

        expect(isSearching).toBe(false);
        expect(list.length).toBe(1);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('searchByTags() should emit mocked data via `person$`', async done => {
      try {
        let isSearching, list;

        list = await readFirst<PersonSummary[]>(facade.persons$);
        isSearching = await readFirst(facade.isSearching$);

        expect(isSearching).toBe(false);
        expect(list.length).toBe(0);

        facade.searchByTags([PersonTags.Passenger]);

        list = await readFirst(facade.persons$);
        isSearching = await readFirst(facade.isSearching$);

        expect(isSearching).toBe(false);
        expect(list.length).toBe(3);

        facade.searchByTags([PersonTags.Crew]);
        list = await readFirst(facade.persons$);

        expect(list.length).toBe(0);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    it('searchByActiveState() should emit mocked data via `person$`', async done => {
      try {
        let isSearching, list;

        list = await readFirst<PersonSummary[]>(facade.persons$);
        isSearching = await readFirst(facade.isSearching$);

        expect(isSearching).toBe(false);
        expect(list.length).toBe(0);

        facade.searchByActiveState([ActiveTypes.Active]);

        list = await readFirst(facade.persons$);
        isSearching = await readFirst(facade.isSearching$);

        expect(isSearching).toBe(false);
        expect(list.length).toBe(3);

        facade.searchByActiveState([ActiveTypes.Inactive]);
        list = await readFirst(facade.persons$);
        isSearching = await readFirst(facade.isSearching$);

        expect(isSearching).toBe(false);
        expect(list.length).toBe(0);

        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });

  /**
   * These tests dispatch actions to the store and watch via Facade observables
   */
  describe('observable properties', function() {
    /**
     * Dispatch `PersonsLoaded` action to manually submit list for state management
     */
    it('persons$ should return the loaded list and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.persons$);
        const rawList = buildPersons(6);
        expect(list.length).toBe(0);

        store.dispatch(new PersonsLoaded(rawList));

        list = await readFirst(facade.persons$);
        expect(list.length).toBe(6);

        done();
      } catch (err) {
        done.fail(err);
      }
    });

    /**
     * Dispatch `SearchByCriteria` action to manually change searchCriteria check for emitted mock list
     */
    it('persons$ should return the loaded list and loaded flag == true', async done => {
      try {
        let list = await readFirst(facade.persons$);

        expect(list.length).toBe(0);

        store.dispatch(new SearchByCriteria(DEFAULT_SEARCH_CRITERIA));
        list = await readFirst(facade.persons$);

        expect(list.length).toBe(3);

        store.dispatch(
          new SearchByCriteria({
            fuzzyName: '=2',
            lastNameBeginsWith: 'L'
          })
        );
        list = await readFirst(facade.persons$);

        expect(list.length).toBe(1);

        done();
      } catch (err) {
        done.fail(err);
      }
    });
  });
});
