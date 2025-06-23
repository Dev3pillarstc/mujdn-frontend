import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { NationalityPopupComponent } from '@/views/features/lookups/nationality/nationality-popup/nationality-popup.component';
import { NationalityFilter } from '@/models/features/lookups/Nationality-filter';
import { Nationality } from '@/models/features/lookups/Nationality';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { NationalityService } from '@/services/features/lookups/nationality.service';

@Component({
  selector: 'app-nationality-list',
  standalone: true,
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule, FormsModule, TranslatePipe],
  templateUrl: './nationality-list.component.html',
  styleUrl: './nationality-list.component.scss',
})
export default class NationalityListComponent
  extends BaseListComponent<
    Nationality,
    NationalityPopupComponent,
    NationalityService,
    NationalityFilter
  >
  implements OnInit
{
  protected override mapModelToExcelRow(model: Nationality): { [key: string]: any } {
    throw new Error('Method not implemented.');
  }
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  nationalityService = inject(NationalityService);
  home: MenuItem | undefined;
  filterModel: NationalityFilter = new NationalityFilter();

  override get service() {
    return this.nationalityService;
  }

  override openDialog(nationality: Nationality): void {
    this.openBaseDialog(NationalityPopupComponent as any, nationality);
  }

  addOrEditModel(nationality?: Nationality) {
    const nationalityCopy = nationality
      ? new Nationality().clone(nationality) // assuming a `clone` method exists
      : new Nationality();

    this.openDialog(nationalityCopy);
  }
}
