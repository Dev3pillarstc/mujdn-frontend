import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { NationalityPopupComponent } from '@/views/features/lookups/nationality/nationality-popup/nationality-popup.component';

@Component({
  selector: 'app-nationality-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule],
  templateUrl: './nationality-list.component.html',
  styleUrl: './nationality-list.component.scss',
})
export default class NationalityListComponent
  extends BaseListComponent<NationalityPopupComponent>
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };

  override openDialog(): void {
    this.openBaseDialog(NationalityPopupComponent as any);
  }

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  date2: Date | undefined;
  nationalities!: any[];
  first: number = 0;
  rows: number = 10;

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة الجنسيات' }];
    // Updated dummy data to match your Arabic table structure
    this.nationalities = [
      {
        nationalityAr: 'اسم الجنسية',
        nationalityEn: 'nationality name',
      },
      {
        nationalityAr: 'اسم الجنسية',
        nationalityEn: 'nationality name',
      },
    ];
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
