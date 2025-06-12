import { Injectable } from '@angular/core';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Example } from '@/models/example';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Department, Person } from '@/models/person';
import { of } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => Example,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ExampleService extends BaseCrudService<Example> {
  override serviceName: string = 'ExampleService';

  override getUrlSegment(): string {
    return this.urlService.URLS.EXAMPLES;
  }

  @CastResponse(() => Person, { shape: { department: () => Department }, unwrap: 'response.data' })
  getPersons() {
    return of({
      response: {
        data: [
          {
            name: 'Ahmed',
            age: 38,
            department: {
              title: 'It',
            },
          },
          {
            name: 'Mohamed',
            age: 38,
            department: {
              title: 'It',
            },
          },
          {
            name: 'Mamoud',
            age: 38,

            department: {
              title: 'It',
            },
          },
          {
            name: 'Ashraf',
            age: 38,

            department: {
              title: 'It',
            },
          },
        ],
      },
    });
  }
}
