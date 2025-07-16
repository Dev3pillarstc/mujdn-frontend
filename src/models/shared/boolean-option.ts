import { BooleanOption } from '@/enums/boolean-option-enum';

// Boolean Options for Dropdown/Checkbox
export interface BooleanOptionModel {
  id: boolean;
  nameEn: string;
  nameAr: string;
  value: BooleanOption;
}
