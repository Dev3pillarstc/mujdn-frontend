#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Utility functions
const toPascalCase = (str) => {
    return str.replace(/(?:^|[-_\s])([a-z])/g, (_, char) => char.toUpperCase());
};

const toCamelCase = (str) => {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

const toKebabCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

const toSnakeCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
};

const toUpperCase = (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
};

// Template generators
const generateModelTemplate = (entityName, fields) => {
    const pascalName = toPascalCase(entityName);
    const camelName = toCamelCase(entityName);
    const serviceName = `${pascalName}Service`;

    const fieldDeclarations = fields.map(field => {
        if (field.type === 'boolean') {
            return `  ${field.name}: ${field.type} = ${field.defaultValue || 'true'};`;
        }
        return `  declare ${field.name}: ${field.type};`;
    }).join('\n');

    const formFields = fields.map(field => {
        const validators = field.validators || [];
        const validatorString = validators.length > 0 ? `[${validators.join(', ')}]` : '[]';
        return `      ${field.name}: [${field.name}, ${validatorString}],`;
    }).join('\n');

    return `import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { ${serviceName} } from '@/services/features/lookups/${camelName}.service';
import { InterceptModel } from 'cast-response';
import { ${pascalName}Interceptor } from '@/model-interceptors/features/lookups/${camelName}-interceptor';
import { Validators } from '@angular/forms';
import { CustomValidators } from '@/validators/custom-validators';

const { send, receive } = new ${pascalName}Interceptor();

@InterceptModel({ send, receive })
export class ${pascalName} extends BaseCrudModel<${pascalName}, ${serviceName}> {
  override $$__service_name__$$: string = '${serviceName}';
${fieldDeclarations}

  buildForm() {
    const { ${fields.map(f => f.name).join(', ')} } = this;
    return {
${formFields}
    };
  }
}
`;
};

const generateFilterTemplate = (entityName, fields) => {
    const pascalName = toPascalCase(entityName);

    const filterFields = fields.map(field => {
        return `  declare ${field.name}: ${field.type} | null;`;
    }).join('\n');

    return `export class ${pascalName}Filter {
${filterFields}
}
`;
};

const generateServiceTemplate = (entityName) => {
    const pascalName = toPascalCase(entityName);
    const camelName = toCamelCase(entityName);
    const upperName = toUpperCase(entityName);

    return `import { BaseCrudService } from '@/abstracts/base-crud-service';
import { ${pascalName} } from '@/models/features/lookups/${pascalName}';
import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { PaginatedList } from '@/models/shared/response/paginated-list';

@CastResponseContainer({
  $default: {
    model: () => ${pascalName},
  },
  $pagination: {
    model: () => PaginatedList<${pascalName}>,
    unwrap: 'data',
    shape: { 'list.*': () => ${pascalName} },
  },
})
@Injectable({
  providedIn: 'root',
})
export class ${pascalName}Service extends BaseCrudService<${pascalName}> {
  serviceName: string = '${pascalName}Service';

  override getUrlSegment(): string {
    return this.urlService.URLS.${upperName};
  }
}
`;
};

const generateInterceptorTemplate = (entityName) => {
    const pascalName = toPascalCase(entityName);

    return `import { ModelInterceptorContract } from 'cast-response';
import { ${pascalName} } from '@/models/features/lookups/${pascalName}';

export class ${pascalName}Interceptor implements ModelInterceptorContract<${pascalName}> {
  receive(model: ${pascalName}): ${pascalName} {
    return model;
  }

  send(model: Partial<${pascalName}>): Partial<${pascalName}> {
    return model;
  }
}
`;
};

const generateResolverTemplate = (entityName) => {
    const pascalName = toPascalCase(entityName);
    const camelName = toCamelCase(entityName);
    const kebabName = toKebabCase(entityName);

    return `import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ${pascalName}Service } from '@/services/features/lookups/${camelName}.service';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { ${pascalName} } from '@/models/features/lookups/${pascalName}';
import { PaginationParams } from '@/models/shared/pagination-params';

export const ${camelName}Resolver: ResolveFn<PaginatedList<${pascalName}>> = () => {
  const ${camelName}Service = inject(${pascalName}Service);
  return ${camelName}Service.loadPaginated(new PaginationParams());
};
`;
};

const generateListComponentTemplate = (entityName, fields) => {
    const pascalName = toPascalCase(entityName);
    const camelName = toCamelCase(entityName);
    const kebabName = toKebabCase(entityName);

    return `import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { ${pascalName}PopupComponent } from '@/views/features/lookups/${kebabName}/${kebabName}-popup/${kebabName}-popup.component';
import { ${pascalName}Filter } from '@/models/features/lookups/${pascalName}-filter';
import { ${pascalName} } from '@/models/features/lookups/${pascalName}';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ${pascalName}Service } from '@/services/features/lookups/${camelName}.service';

@Component({
  selector: 'app-${kebabName}-list',
  standalone: true,
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule, FormsModule, TranslatePipe],
  templateUrl: './${kebabName}-list.component.html',
  styleUrl: './${kebabName}-list.component.scss',
})
export default class ${pascalName}ListComponent
  extends BaseListComponent<
    ${pascalName},
    ${pascalName}PopupComponent,
    ${pascalName}Service,
    ${pascalName}Filter
  >
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  ${camelName}Service = inject(${pascalName}Service);
  home: MenuItem | undefined;
  filterModel: ${pascalName}Filter = new ${pascalName}Filter();

  override get service() {
    return this.${camelName}Service;
  }

  override openDialog(${camelName}: ${pascalName}): void {
    this.openBaseDialog(${pascalName}PopupComponent as any, ${camelName});
  }

  addOrEditModel(${camelName}?: ${pascalName}) {
    ${camelName} = ${camelName} || new ${pascalName}();
    this.openDialog(${camelName});
  }
}
`;
};

const generateListHtmlTemplate = (entityName, fields) => {
    const pascalName = toPascalCase(entityName);
    const camelName = toCamelCase(entityName);
    const upperName = toUpperCase(entityName);

    const filterInputs = fields.map(field => {
        const fieldLabel = field.displayName || field.name;
        return `            <div class="relative">
              <label class="label" for="${field.name}">{{
                '${upperName}_PAGE.${field.name.toUpperCase()}' | translate
              }}</label>
              <input
                [(ngModel)]="filterModel.${field.name}"
                [placeholder]="'${upperName}_PAGE.${field.name.toUpperCase()}' | translate"
                class="peer"
                fluid="true"
                id="${field.name}"
                pInputText
                type="text"
              />
              <span
                class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-black transition-all duration-500 peer-focus-within:left-0 peer-focus-within:w-full"
              ></span>
            </div>`;
    }).join('\n');

    const tableHeaders = fields.map(field => {
        const fieldLabel = field.displayName || field.name;
        return `                <th>{{ '${upperName}_PAGE.${field.name.toUpperCase()}' | translate }}</th>`;
    }).join('\n');

    const tableColumns = fields.map(field => {
        return `                <td>{{ ${camelName}.${field.name} }}</td>`;
    }).join('\n');

    return `<div class="bg-white">
  <div class="bg-[#f9fafb] p-3 sm:p-6">
    <div class="header bg-white rounded-2xl p-4 sm:p-6 mb-6">
      <p-breadcrumb [home]="home" [model]="items" class="max-w-full" />
      <h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-[#161616]">
        {{ '${upperName}_PAGE.${upperName}_LIST' | translate }}
      </h3>
    </div>
    <div class="bg-white rounded-2xl p-4 sm:p-8 border border-[#d2d6db]">
      <div class="p-6 sm:p-8 rounded-2xl bg-[#f3f4f6]">
        <div class="flex items-center justify-between">
          <h5 class="text-base sm:text-lg md:text-xl font-bold text-[#161616]">
            {{ '${upperName}_PAGE.SEARCH_FILTERS' | translate }}
          </h5>
        </div>
        <div class="pt-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
${filterInputs}
          </div>

          <div class="actions flex items-center gap-4 pt-6">
            <button (click)="search()" class="btn black-btn">
              {{ '${upperName}_PAGE.SEARCH' | translate }}
            </button>
            <button (click)="resetSearch()" class="btn gray-btn border border-[#d2d6db]">
              {{ '${upperName}_PAGE.RESET_SEARCH' | translate }}
            </button>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <div
          class="flex items-start xl:items-center justify-between justify-between flex-col xl:flex-row gap-4 bg-[#e5e7eb] rounded-lg p-4 sm:p-6 mb-4"
        >
          <h4 class="text-lg sm:text-xl md:text-2xl font-bold text-[#161616]">
            {{ '${upperName}_PAGE.${upperName}_LIST' | translate }}
          </h4>
          <div class="actions flex items-center gap-4 ms-auto">
            <button class="table-head-action-btn">
              <img alt="" src="/assets/icons/excel.svg" />
            </button>
            <button class="table-head-action-btn">
              <img alt="" src="/assets/icons/print.svg" />
            </button>
            <button (click)="addOrEditModel()" class="btn green-btn flex items-center">
              <img alt="" src="/assets/icons/plus.svg" />
              <span>{{ '${upperName}_PAGE.ADD_NEW_${upperName}' | translate }}</span>
            </button>
          </div>
        </div>
        @if (list && list.length > 0) {
          <p-table [value]="list">
            <ng-template pTemplate="header">
              <tr>
${tableHeaders}
                <th class="w-[100px]">{{ '${upperName}_PAGE.ACTIONS' | translate }}</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-${camelName}>
              <tr>
${tableColumns}
                <td>
                  <div class="actions flex gap-2">
                    <button
                      (click)="addOrEditModel(${camelName})"
                      class="table-action-gray-btn"
                    >
                      <img src="/assets/icons/edit-action.svg" alt="تعديل" />
                    </button>
                    <button class="table-action-red-btn">
                      <img src="/assets/icons/delete-action.svg" alt="حذف" />
                    </button>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        } @else {
          <div class="flex items-center justify-center h-64">
            <p class="text-gray-500">{{ '${upperName}_PAGE.NO_DATA_TO_SHOW' | translate }}</p>
          </div>
        }
        @if (paginationInfo) {
          <p-paginator
            (onPageChange)="onPageChange($event)"
            [first]="first"
            [rowsPerPageOptions]="[10, 20, 30]"
            [rows]="rows"
            [showCurrentPageReport]="false"
            [totalRecords]="paginationInfo.totalItems"
            class="mt-6"
          />
        }
      </div>
    </div>
  </div>
</div>
`;
};

const generatePopupComponentTemplate = (entityName, fields) => {
    const pascalName = toPascalCase(entityName);
    const camelName = toCamelCase(entityName);
    const kebabName = toKebabCase(entityName);

    return `import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ${pascalName} } from '@/models/features/lookups/${pascalName}';
import { RequiredMarkerDirective } from '../../../../../directives/required-marker.directive';
import { Observable } from 'rxjs';
import { AlertService } from '@/services/shared/alert.service';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { ${pascalName}Service } from '@/services/features/lookups/${camelName}.service';

@Component({
  selector: 'app-${kebabName}-popup',
  imports: [InputTextModule, ReactiveFormsModule, RequiredMarkerDirective],
  templateUrl: './${kebabName}-popup.component.html',
  styleUrl: './${kebabName}-popup.component.scss',
})
export class ${pascalName}PopupComponent extends BasePopupComponent<${pascalName}> implements OnInit {
  declare model: ${pascalName};
  declare form: FormGroup;
  alertService = inject(AlertService);
  service = inject(${pascalName}Service);
  fb = inject(FormBuilder);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    super();
  }

  override saveFail(error: Error): void {
    // logic after error if there
  }

  override prepareModel(
    model: ${pascalName},
    form: FormGroup
  ): ${pascalName} | Observable<${pascalName}> {
    this.model = Object.assign(model, { ...form.value });
    return this.model;
  }

  override initPopup() {
    this.model = this.data.model;
  }

  override buildForm() {
    this.form = this.fb.group(this.model.buildForm());
  }

  beforeSave(model: ${pascalName}, form: FormGroup) {
    // manipulation before save
    return form.valid;
  }

  afterSave() {
    const successObject = { messages: ['COMMON.SAVED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }
}
`;
};

const generatePopupHtmlTemplate = (entityName, fields) => {
    const pascalName = toPascalCase(entityName);
    const camelName = toCamelCase(entityName);
    const upperName = toUpperCase(entityName);

    const formFields = fields.map(field => {
        const isRequired = field.validators && field.validators.some(v => v.includes('required'));
        const requiredDirective = isRequired ? ' appRequiredMarker' : '';

        return `          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"${requiredDirective}>
              {{ '${upperName}_PAGE.${field.name.toUpperCase()}' | translate }}
            </label>
            <input
              formControlName="${field.name}"
              [placeholder]="'${upperName}_PAGE.${field.name.toUpperCase()}' | translate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              pInputText
              type="${field.type === 'number' ? 'number' : 'text'}"
            />
          </div>`;
    }).join('\n');

    return `<div class="p-6">
  <h2 class="text-xl font-semibold mb-4">
    {{ (model.id ? '${upperName}_PAGE.EDIT_${upperName}' : '${upperName}_PAGE.ADD_NEW_${upperName}') | translate }}
  </h2>
  
  <form [formGroup]="form" (ngSubmit)="save$.next()">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
${formFields}
    </div>
    
    <div class="flex justify-end gap-4 mt-6">
      <button
        type="button"
        (click)="close()"
        class="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
      >
        {{ 'COMMON.CANCEL' | translate }}
      </button>
      <button
        type="submit"
        [disabled]="form.invalid"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {{ 'COMMON.SAVE' | translate }}
      </button>
    </div>
  </form>
</div>
`;
};

const generateRouteTemplate = (entityName) => {
    const camelName = toCamelCase(entityName);
    const kebabName = toKebabCase(entityName);

    return `
// Add this to your app.routes.ts
{
  path: '${kebabName}',
  canActivate: [authGuard],
  data: { roles: [ROLES_ENUM.ADMIN] },
  resolve: { list: ${camelName}Resolver },
  loadComponent: () =>
    import(
      '../views/features/lookups/${kebabName}/${kebabName}-list/${kebabName}-list.component'
    ),
},`;
};

// File creation functions
const createDirectory = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✓ Created directory: ${dirPath}`);
    }
};

const createFile = (filePath, content) => {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Created file: ${filePath}`);
};

// Main generator function
const generateCrudFiles = (entityName, fields) => {
    const pascalName = toPascalCase(entityName);
    const camelName = toCamelCase(entityName);
    const kebabName = toKebabCase(entityName);
    const upperName = toUpperCase(entityName);

    console.log(`\n🚀 Generating CRUD files for ${pascalName}...\n`);

    // Create directories
    const basePath = process.cwd();
    const modelPath = path.join(basePath, 'src', 'app', 'models', 'features', 'lookups');
    const servicePath = path.join(basePath, 'src', 'app', 'services', 'features', 'lookups');
    const interceptorPath = path.join(basePath, 'src', 'app', 'model-interceptors', 'features', 'lookups');
    const resolverPath = path.join(basePath, 'src', 'app', 'resolvers', 'lookups');
    const componentPath = path.join(basePath, 'src', 'app', 'views', 'features', 'lookups', kebabName);
    const listComponentPath = path.join(componentPath, `${kebabName}-list`);
    const popupComponentPath = path.join(componentPath, `${kebabName}-popup`);

    [modelPath, servicePath, interceptorPath, resolverPath, listComponentPath, popupComponentPath].forEach(createDirectory);

    // Generate and create files
    const files = [
        {
            path: path.join(modelPath, `${pascalName}.ts`),
            content: generateModelTemplate(entityName, fields)
        },
        {
            path: path.join(modelPath, `${pascalName}-filter.ts`),
            content: generateFilterTemplate(entityName, fields)
        },
        {
            path: path.join(servicePath, `${camelName}.service.ts`),
            content: generateServiceTemplate(entityName)
        },
        {
            path: path.join(interceptorPath, `${camelName}-interceptor.ts`),
            content: generateInterceptorTemplate(entityName)
        },
        {
            path: path.join(resolverPath, `${camelName}.resolver.ts`),
            content: generateResolverTemplate(entityName)
        },
        {
            path: path.join(listComponentPath, `${kebabName}-list.component.ts`),
            content: generateListComponentTemplate(entityName, fields)
        },
        {
            path: path.join(listComponentPath, `${kebabName}-list.component.html`),
            content: generateListHtmlTemplate(entityName, fields)
        },
        {
            path: path.join(listComponentPath, `${kebabName}-list.component.scss`),
            content: '// Add your styles here\n'
        },
        {
            path: path.join(popupComponentPath, `${kebabName}-popup.component.ts`),
            content: generatePopupComponentTemplate(entityName, fields)
        },
        {
            path: path.join(popupComponentPath, `${kebabName}-popup.component.html`),
            content: generatePopupHtmlTemplate(entityName, fields)
        },
        {
            path: path.join(popupComponentPath, `${kebabName}-popup.component.scss`),
            content: '// Add your styles here\n'
        }
    ];

    files.forEach(file => createFile(file.path, file.content));

    console.log(`\n✅ Successfully generated all CRUD files for ${pascalName}!`);
    console.log(`\n📝 Don't forget to:`);
    console.log(`   1. Add the URL to your URL service: ${upperName}: '/api/${kebabName}',`);
    console.log(`   2. Add the route configuration:`);
    console.log(generateRouteTemplate(entityName));
    console.log(`   3. Import the resolver in your routes file`);
    console.log(`   4. Add translation keys for ${upperName}_PAGE`);
};

// CLI Interface
const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
};

const askFields = async () => {
    const fields = [];
    console.log('\n📝 Now let\'s define the fields for your entity.');
    console.log('   Available types: string, number, boolean, Date');
    console.log('   For each field, you can specify validators like: Validators.required, Validators.maxLength(50)');
    console.log('   Press Enter with empty field name to finish.\n');

    while (true) {
        const fieldName = await askQuestion('Field name (or press Enter to finish): ');
        if (!fieldName) break;

        const fieldType = await askQuestion(`Field type for "${fieldName}" (string/number/boolean/Date) [string]: `) || 'string';
        const displayName = await askQuestion(`Display name for "${fieldName}" (optional): `) || fieldName;
        const validators = await askQuestion(`Validators for "${fieldName}" (comma-separated, optional): `);
        const defaultValue = await askQuestion(`Default value for "${fieldName}" (optional): `);

        const field = {
            name: fieldName,
            type: fieldType,
            displayName: displayName !== fieldName ? displayName : undefined,
            validators: validators ? validators.split(',').map(v => v.trim()) : [],
            defaultValue: defaultValue || undefined
        };

        fields.push(field);
        console.log(`✓ Added field: ${fieldName} (${fieldType})\n`);
    }

    return fields;
};

const main = async () => {
    console.log('🎯 Angular CRUD Generator');
    console.log('==========================\n');

    try {
        const entityName = await askQuestion('Entity name (e.g., "category", "product"): ');
        if (!entityName) {
            console.log('❌ Entity name is required!');
            process.exit(1);
        }

        const fields = await askFields();
        if (fields.length === 0) {
            console.log('❌ At least one field is required!');
            process.exit(1);
        }

        console.log(`\n📋 Summary:`);
        console.log(`   Entity: ${toPascalCase(entityName)}`);
        console.log(`   Fields: ${fields.map(f => `${f.name} (${f.type})`).join(', ')}`);

        const confirm = await askQuestion('\nProceed with generation? (y/N): ');
        if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
            console.log('❌ Generation cancelled.');
            process.exit(0);
        }

        generateCrudFiles(entityName, fields);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
};

// Run the CLI
if (require.main === module) {
    main();
}

module.exports = {
    generateCrudFiles,
    toPascalCase,
    toCamelCase,
    toKebabCase,
    toSnakeCase,
    toUpperCase
};