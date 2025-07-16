import { BooleanOption } from '@/enums/boolean-option-enum';
import { BooleanOptionModel } from './boolean-option';

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
