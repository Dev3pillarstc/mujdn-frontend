import { BooleanOption } from '@/enums/boolean-option-enum';
import { BooleanOptionModel } from './boolean-option';

// Fingerprint Exemption specific options
export const PROCESSING_STATUS_OPTIONS: BooleanOptionModel[] = [
  {
    id: true,
    nameEn: 'Processed',
    nameAr: 'تم المعالجة',
    value: BooleanOption.YES,
  },
  {
    id: false,
    nameEn: 'Processing',
    nameAr: 'قيد المعالجة',
    value: BooleanOption.YES,
  },
];
