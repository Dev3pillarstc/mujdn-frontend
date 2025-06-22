export enum BooleanOption {
  YES = 'YES',
  NO = 'NO',
}

// Boolean Options for Dropdown/Checkbox
export interface BooleanOptionModel {
  id: boolean;
  nameEn: string;
  nameAr: string;
  value: BooleanOption;
}

export const BOOLEAN_OPTIONS: BooleanOptionModel[] = [
  {
    id: true,
    nameEn: 'Yes',
    nameAr: 'نعم',
    value: BooleanOption.YES,
  },
  {
    id: false,
    nameEn: 'No',
    nameAr: 'لا',
    value: BooleanOption.NO,
  },
];

// Fingerprint Exemption specific options
export const FINGERPRINT_EXEMPTION_OPTIONS: BooleanOptionModel[] = [
  {
    id: true,
    nameEn: 'Exempt from Fingerprint',
    nameAr: 'معفى من البصمة',
    value: BooleanOption.YES,
  },
  {
    id: false,
    nameEn: 'Not Exempt from Fingerprint',
    nameAr: 'غير معفى من البصمة',
    value: BooleanOption.NO,
  },
];
