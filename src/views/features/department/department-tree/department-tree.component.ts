import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { Department } from '@/models/features/lookups/Department/department';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { LanguageService } from '@/services/shared/language.service';
import { Component, effect, EventEmitter, inject, Input, OnInit, Output, Signal } from '@angular/core';
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

  @Input() selectedDepartmentSignal!: Signal<Department | null>;
  @Output() departmentSelected = new EventEmitter<Department>();

  languageService = inject(LanguageService);

  // React to changes in the selectedDepartmentSignal using effect
  private readonly selectedDepartmentEffect = effect(() => {
    const selectedDepartment = this.selectedDepartmentSignal();
    if (selectedDepartment) {
      const allDepartments = this.extractAllDepartments(selectedDepartment); // Extract all departments from the hierarchy
      const rootDepartment = this.findRootDepartment(selectedDepartment, allDepartments);
      if (rootDepartment) {
        this.departments = [this.mapDepartmentToTreeNode(rootDepartment)];
      }
      this.selectedNode = this.findTreeNodeByDepartment(selectedDepartment, this.departments);
    }
  });
  private extractAllDepartments(department: Department): Department[] {
    const allDepartments: Department[] = [];
    const traverse = (dept: Department) => {
      allDepartments.push(dept);
      if (dept.childDepartments) {
        dept.childDepartments.forEach(traverse);
      }
    };
    traverse(department);
    return allDepartments;
  }
  constructor() { }

  ngOnInit() {
    this.translateDepartmentName();
  }

  private mapDepartmentToTreeNodeArray(departments: Department[]): TreeNode[] {
    return departments.map((department) => this.mapDepartmentToTreeNode(department));
  }

  private mapDepartmentToTreeNode = (department: Department): TreeNode => {
    return {
      label: this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
        ? department.nameEn
        : department.nameAr,
      data: department,
      children: department.childDepartments?.map(this.mapDepartmentToTreeNode) || [],
    };
  }

  private findRootDepartment(department: Department, allDepartments: Department[]): Department | null {
    // Traverse up the hierarchy to find the root department
    let current = department;
    while (current.fkParentDepartmentId) {
      const parent = allDepartments.find((dept) => dept.id === current.fkParentDepartmentId);
      if (!parent) {
        return null; // Return null if the parent department is not found
      }
      current = parent;
    }
    return current; // Return the root department (the one with fkParentDepartmentId === null)
  }

  private findTreeNodeByDepartment(department: Department, nodes: TreeNode[]): TreeNode | null {
    for (const node of nodes) {
      if (node.data.id === department.id) {
        return node;
      }
      if (node.children) {
        const childNode = this.findTreeNodeByDepartment(department, node.children);
        if (childNode) {
          return childNode;
        }
      }
    }
    return null;
  }

  updateTreeLabels() {
    this.departments = this.departments.map((node) => ({
      ...node,
      label: this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
        ? node.data.nameEn
        : node.data.nameAr,
      children: node.children?.map((child) => ({
        ...child,
        label: this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
          ? child.data.nameEn
          : child.data.nameAr,
      })),
    }));
  }

  onNodeSelect(event: any) {
    if (event.node) {
      this.departmentSelected.emit(event.node.data); // Emit the selected node to the parent
    }
  }

  private translateDepartmentName() {
    this.languageService.languageChanged$.subscribe(() => {
      if (this.departments.length > 0) {
        this.updateTreeLabels();
      }
    });
  }
}