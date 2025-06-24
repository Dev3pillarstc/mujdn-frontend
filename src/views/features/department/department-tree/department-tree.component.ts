import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { Department } from '@/models/features/lookups/department/department';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { LanguageService } from '@/services/shared/language.service';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';

@Component({
  selector: 'app-department-tree',
  imports: [Tree],
  standalone: true,
  templateUrl: './department-tree.component.html',
  styleUrl: './department-tree.component.scss',
})
export class DepartmentTreeComponent implements OnInit {
  departments: TreeNode[] = [];
  selectedNode: TreeNode | null = null;

  @Output() departmentSelected = new EventEmitter<Department>();

  departmentService = inject(DepartmentService);
  languageService = inject(LanguageService);

  constructor() {}

  ngOnInit() {
    this.getDepartmentTreeAsync();
    this.translateDepartmentName();
  }

  getDepartmentTreeAsync() {
    this.departmentService.getDepartmentTreeAsync().subscribe({
      next: (response) => {
        if (response?.data) {
          this.departments = this.mapDepartmentsToTree(response.data);
          const rootDepartment = response.data.find(
            (dept: Department) => dept.fkParentDepartmentId == null
          );
          if (rootDepartment) {
            this.departmentSelected.emit(rootDepartment);
          }
        }
      },
      error: (error) => {
        //pending golable error handler
      },
    });
  }

  mapDepartmentsToTree(departments: any[]): TreeNode[] {
    return departments.map((dept) => ({
      label:
        this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
          ? dept.nameEn
          : dept.nameAr,
      data: dept,
      children: this.mapDepartmentsToTree(dept.childDepartments || []),
    }));
  }

  updateTreeLabels() {
    this.departments = this.mapDepartmentsToTree(this.departments.map((node) => node.data));
  }

  onNodeSelect(event: any) {
    if (event.node) {
      this.departmentSelected.emit(event.node.data);
    } else {
      const rootDepartment = this.departments
        .map((node) => node.data)
        .find((dept: Department) => dept.fkParentDepartmentId == null);
      if (rootDepartment) {
        this.departmentSelected.emit(rootDepartment);
      }
    }
  }

  private translateDepartmentName() {
    this.languageService.languageChanged$.subscribe(() => {
      this.updateTreeLabels();
    });
  }
}
