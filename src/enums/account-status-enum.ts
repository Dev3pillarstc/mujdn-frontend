// Account Status Enum
export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Account Status Options for Dropdown
export interface AccountStatusOption {
  id: boolean;
  nameEn: string;
  nameAr: string;
  value: AccountStatus;
}

export const ACCOUNT_STATUS_OPTIONS: AccountStatusOption[] = [
  {
    id: true,
    nameEn: 'Active',
    nameAr: 'نشط',
    value: AccountStatus.ACTIVE,
  },
  {
    id: false,
    nameEn: 'Inactive',
    nameAr: 'غير نشط',
    value: AccountStatus.INACTIVE,
  },
];
