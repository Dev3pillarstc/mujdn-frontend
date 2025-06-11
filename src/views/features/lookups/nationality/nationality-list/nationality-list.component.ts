import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-nationality-list',
  imports: [
    Breadcrumb,
    TableModule,
    PaginatorModule,
    InputTextModule,
  ],
  templateUrl: './nationality-list.component.html',
  styleUrl: './nationality-list.component.scss',
})
export default class NationalityListComponent implements OnInit {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  date2: Date | undefined;
  nationalities!: any[];
  first: number = 0;
  rows: number = 10;

  ngOnInit() {
    this.items = [
      { label: 'لوحة المعلومات' },
      { label: 'حركات حضور و انصراف الموظفين' },
    ];
    // Updated dummy data to match your Arabic table structure
    this.nationalities = [
      {
        nationality: 'اسم الجنسية',
      },
      {
        nationality: 'اسم الجنسية',
      },
    ];
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
