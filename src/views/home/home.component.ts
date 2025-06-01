import {Component, inject, OnInit} from '@angular/core'
import {ExampleService} from '@/services/example.service'
import {delay, tap} from 'rxjs'
import {Example} from '@/models/example'
import {PaginatedList} from '@/models/paginated-list';
import {ResponseData} from '@/models/response-data';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent implements OnInit {
  service = inject(ExampleService);
  list: Example[] = [];
  declare paginatedList: PaginatedList<Example>;

  ngOnInit() {
    this.loadPaginatedData();
  }

  loadData() {
    this.service.load()
      .pipe(tap(res => console.log(res)))
      .subscribe(list => {
        console.log('ppppppppppp', list);
        this.list = list;
      });
  }

  loadPaginatedData() {
    this.service.loadPaginated()
      .pipe(tap(res => console.log(res)))
      .subscribe(paginated => {
        console.log('ppppppppppp', paginated);
        this.paginatedList = paginated
      });
  }

  delete(item: Example) {
    const yes = confirm(`ARE YOU SURE THAT YOU WANT DELETE  (${item.name} )`)

    yes &&
    item
      .delete()
      .pipe(delay(0))
      .subscribe(() => {
        this.loadData();
        alert('Item Deleted Successfully')
      })
  }
}
