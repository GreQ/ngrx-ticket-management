import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {PersonSummary} from '../models';
import {Observable} from 'rxjs/Rx';

import {NormalizedSearch, PersonSearchRequest} from './search.interfaces';
import {normalizeRequest} from './search.utils';

@Injectable()
export class PersonSearchService {
  constructor(protected readonly http: HttpClient) {
  }

  search(request: PersonSearchRequest): Observable<PersonSummary[]> {
    const params: HttpParams = this.buildSearchParams(normalizeRequest(request));
    return this.http.get<PersonSummary[]>('/profile/persons/search', {params});
  }

  buildSearchParams(search: NormalizedSearch) {
    const lookup = {
      activeState       : search.activeState,
      searchTerm        : (search.searchTerm.trim().length > 0) ? search.searchTerm: null,
      commaSeparatedTags: search.personTags.length ? search.personTags.join(',') : null
    };

    let params = new HttpParams();
    for (let key in lookup){
      if (!!lookup[key]) {
        params.append(key,lookup[key]);
      }
    }
    return  params;
  }

}
