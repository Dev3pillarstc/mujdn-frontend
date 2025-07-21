import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { Department } from '@/models/features/lookups/department/department';
import { LanguageService } from '@/services/shared/language.service';
import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Signal,
  SimpleChanges,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { Tree } from 'primeng/tree';

@Component({
  selector: 'app-department-tree',
  imports: [Tree, TranslatePipe],
  standalone: true,
  templateUrl: './department-tree.component.html',
  styleUrl: './department-tree.component.scss',
})
export class DepartmentTreeComponent implements OnInit, OnChanges {
  departments: TreeNode[] = [];
  selectedNode: TreeNode | null = null;
  @Input() departmentsTree: Department[] = [];
  @Input() selectedDepartmentSignal!: Signal<Department | null>;
  @Output() departmentSelected = new EventEmitter<Department>();

  languageService = inject(LanguageService);
  ngOnInit() {
    this.translateDepartmentName();
  }
  // React to changes in the selectedDepartmentSignal using effect
  private readonly selectedDepartmentEffect = effect(() => {
    const selectedDepartment = this.selectedDepartmentSignal();
    if (selectedDepartment && this.departments.length > 0) {
      this.selectedNode = this.findTreeNodeByDepartment(selectedDepartment, this.departments);
    }
  });

  // Add this helper to extract all departments from the tree
  private extractAllDepartmentsFromTree(tree: Department[]): Department[] {
    const all: Department[] = [];
    const traverse = (depts: Department[]) => {
      for (const dept of depts) {
        all.push(dept);
        if (dept.childDepartments) traverse(dept.childDepartments);
      }
    };
    traverse(tree);
    return all;
  }
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departmentsTree'] && this.departmentsTree.length > 0) {
      this.rebuildTree();
    }
  }

  private rebuildTree() {
    const selectedDepartment = this.selectedDepartmentSignal();
    if (selectedDepartment && this.departmentsTree.length > 0) {
      const allDepartments = this.extractAllDepartmentsFromTree(this.departmentsTree);
      const rootDepartment = this.findRootDepartment(selectedDepartment, allDepartments);
      if (rootDepartment) {
        this.departments = [this.mapDepartmentToTreeNode(rootDepartment)];
        this.expandAllNodes(this.departments); // ✅ expand here
      }
      this.selectedNode = this.findTreeNodeByDepartment(selectedDepartment, this.departments);
    } else if (this.departmentsTree.length > 0) {
      this.departments = this.mapDepartmentToTreeNodeArray(this.departmentsTree);
      this.expandAllNodes(this.departments); // ✅ expand here too
      this.selectedNode = null;
    }
  }

  private expandAllNodes(nodes: TreeNode[]): void {
    if (!nodes) return;
    for (let node of nodes) {
      node.expanded = true;
      if (node.children?.length) {
        this.expandAllNodes(node.children);
      }
    }
  }

  private mapDepartmentToTreeNodeArray(departments: Department[]): TreeNode[] {
    return departments.map((department) => this.mapDepartmentToTreeNode(department));
  }

  private mapDepartmentToTreeNode = (department: Department): TreeNode => {
    return {
      label:
        this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
          ? department.nameEn
          : department.nameAr,
      data: department,
      children: department.childDepartments?.map(this.mapDepartmentToTreeNode) || [],
    };
  };

  private findRootDepartment(
    department: Department,
    allDepartments: Department[]
  ): Department | null {
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
      label:
        this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
          ? node.data.nameEn
          : node.data.nameAr,
      children: node.children?.map((child) => ({
        ...child,
        label:
          this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
            ? child.data.nameEn
            : child.data.nameAr,
      })),
    }));
  }

  onNodeSelect(event: any) {
    if (event.node) {
      event.node.expanded = true; // Re-expand the selected node if it collapsed
      this.departmentSelected.emit(event.node.data);
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
