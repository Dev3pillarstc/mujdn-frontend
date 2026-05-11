import { ShiftDetails } from '@/models/features/lookups/work-shifts/shift-details';

export class RotationGroup {
  declare id: number;
  declare groupName: string;
  declare shiftDetails?: ShiftDetails;
  declare periodOrder: number;
  declare label: string;
  declare fkShiftId: number;
  memberIds: number[] = [];
}
