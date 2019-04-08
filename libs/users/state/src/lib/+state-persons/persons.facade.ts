import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { SearchCriteria } from './persons.interfaces';
import { NavigateToPage, SearchByCriteria, SelectPerson } from './persons.actions';
import { personsQuery } from './persons.selectors';

import { PersonSummary, PersonTags, ActiveTypes } from '../models';

@Injectable()
export class PersonsFacade {
  // Person Features
  persons$: Observable<PersonSummary[]> = this.store.pipe(select(personsQuery.getPaginatedPersons));
  selectedPerson$: Observable<PersonSummary | null> = this.store.pipe(select(personsQuery.getSelectedPerson));

  // Paginated List Features
  currentPage$: Observable<number> = this.store.pipe(select(personsQuery.getCurrentPage));
  totalPages$: Observable<number> = this.store.pipe(select(personsQuery.getTotalPages));

  // Search Features
  searchCriteria$: Observable<SearchCriteria> = this.store.pipe(select(personsQuery.getSearchCriteria));
  isSearching$: Observable<boolean> = this.store.pipe(select(personsQuery.getIsSearching));
  error$: Observable<string | null | undefined> = this.store.pipe(select(personsQuery.getError));

  constructor(private readonly store: Store<any>) {} // tslint:disable-line:no-any

  // ********************************
  // Public API
  // ********************************

  /**
   * @Todo: consider implementing these methods as router navigations;
   * to maintain urls as 'single-source-of-truth'
   */

  navigateToPage(page: number) {
    this.store.dispatch(new NavigateToPage(page));
  }

  searchByText(text: string | null) {
    this.store.dispatch(
      new SearchByCriteria({
        fuzzyName: text,
        lastNameBeginsWith: ''
      })
    );
  }
  searchByLastNameStartsWith(letter: string | null) {
    this.store.dispatch(
      new SearchByCriteria({
        fuzzyName: '',
        lastNameBeginsWith: letter
      })
    );
  }
  searchByTags(tags: PersonTags[]) {
    this.store.dispatch(
      new SearchByCriteria({
        personTags: tags
      })
    );
  }
  searchByActiveState(tags: ActiveTypes[]) {
    const activeState = tags.length ? tags[0] : ActiveTypes.Any;
    this.store.dispatch(
      new SearchByCriteria({
        activeState
      })
    );
  }

  selectPerson(id: string) {
    this.store.dispatch(new SelectPerson(id));
  }
}
