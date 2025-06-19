import { Component, OnInit } from '@angular/core';
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
  files: any[] = [];
  OnInit() {}
  private mockData = [
    {
      label: 'الإدارة العامة لتقنية المعلومات',
      data: 'الإدارة العامة لتقنية المعلومات',
      children: [
        {
          label: 'إدارة المشاريع التقنية',
          data: 'إدارة المشاريع التقنية',
        },
        {
          label: 'إدارة البنية التحتية',
          data: 'إدارة البنية التحتية',
        },
        {
          label: 'إدارة الدعم الفني',
          data: 'إدارة الدعم الفني',
        },
        {
          label: 'إدارة أمن المعلومات',
          data: 'إدارة أمن المعلومات',
        },
        {
          label: 'إدارة النظم والتطبيقات',
          data: 'إدارة النظم والتطبيقات',
        },
        {
          label: 'إدارة تطوير البرمجيات',
          data: 'إدارة تطوير البرمجيات',
        },
        {
          label: 'إدارة الحوكمة والامتثال',
          data: 'إدارة الحوكمة والامتثال',
        },
      ],
    },
    {
      label: 'الإدارة العامة لتقنية المعلومات',
      data: 'الإدارة العامة لتقنية المعلومات',
      children: [
        {
          label: 'إدارة المشاريع التقنية',
          data: 'إدارة المشاريع التقنية',
        },
        {
          label: 'إدارة البنية التحتية',
          data: 'إدارة البنية التحتية',
        },
        {
          label: 'إدارة الدعم الفني',
          data: 'إدارة الدعم الفني',
        },
        {
          label: 'إدارة أمن المعلومات',
          data: 'إدارة أمن المعلومات',
        },
        {
          label: 'إدارة النظم والتطبيقات',
          data: 'إدارة النظم والتطبيقات',
        },
        {
          label: 'إدارة تطوير البرمجيات',
          data: 'إدارة تطوير البرمجيات',
        },
        {
          label: 'إدارة الحوكمة والامتثال',
          data: 'إدارة الحوكمة والامتثال',
        },
      ],
    },
    {
      label: 'الإدارة العامة لتقنية المعلومات',
      data: 'الإدارة العامة لتقنية المعلومات',
      children: [
        {
          label: 'إدارة المشاريع التقنية',
          data: 'إدارة المشاريع التقنية',
        },
        {
          label: 'إدارة البنية التحتية',
          data: 'إدارة البنية التحتية',
        },
        {
          label: 'إدارة الدعم الفني',
          data: 'إدارة الدعم الفني',
        },
        {
          label: 'إدارة أمن المعلومات',
          data: 'إدارة أمن المعلومات',
        },
        {
          label: 'إدارة النظم والتطبيقات',
          data: 'إدارة النظم والتطبيقات',
        },
        {
          label: 'إدارة تطوير البرمجيات',
          data: 'إدارة تطوير البرمجيات',
        },
        {
          label: 'إدارة الحوكمة والامتثال',
          data: 'إدارة الحوكمة والامتثال',
        },
      ],
    },
    {
      label: 'الإدارة العامة لتقنية المعلومات',
      data: 'الإدارة العامة لتقنية المعلومات',
      children: [
        {
          label: 'إدارة المشاريع التقنية',
          data: 'إدارة المشاريع التقنية',
        },
        {
          label: 'إدارة البنية التحتية',
          data: 'إدارة البنية التحتية',
        },
        {
          label: 'إدارة الدعم الفني',
          data: 'إدارة الدعم الفني',
        },
        {
          label: 'إدارة أمن المعلومات',
          data: 'إدارة أمن المعلومات',
        },
        {
          label: 'إدارة النظم والتطبيقات',
          data: 'إدارة النظم والتطبيقات',
        },
        {
          label: 'إدارة تطوير البرمجيات',
          data: 'إدارة تطوير البرمجيات',
        },
        {
          label: 'إدارة الحوكمة والامتثال',
          data: 'إدارة الحوكمة والامتثال',
        },
      ],
    },
  ];

  constructor() {
    this.loadFiles();
  }

  ngOnInit() {
    // Set aria-expanded="false" on all .p-tree-node elements after view is initialized
    setTimeout(() => {
      const nodes = document.querySelectorAll('.p-tree-node');
      nodes.forEach((node) => {
        (node as HTMLElement).setAttribute('aria-expanded', 'false');
      });
    }, 0);
  }

  loadFiles() {
    // محاكاة جلب البيانات كما لو كانت من خدمة
    Promise.resolve(this.mockData).then((data) => {
      this.files = data;
    });
  }
}
