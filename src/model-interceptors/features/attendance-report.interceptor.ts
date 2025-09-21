import AttendanceReport from '@/models/features/attendance/attendance-report/attendance-report';
import { convertUtcToSystemTimeZone } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class AttendanceReportInterceptor implements ModelInterceptorContract<AttendanceReport> {
  receive(model: AttendanceReport): AttendanceReport {
    // Convert all date fields coming from backend
    model.processingDate = model.processingDate
      ? convertUtcToSystemTimeZone(model.processingDate as string)
      : null;

    model.earliestAllowedArrivalDateTime = model.earliestAllowedArrivalDateTime
      ? convertUtcToSystemTimeZone(model.earliestAllowedArrivalDateTime as string)
      : null;

    model.latestAllowedArrivalDateTime = model.latestAllowedArrivalDateTime
      ? convertUtcToSystemTimeZone(model.latestAllowedArrivalDateTime as string)
      : null;

    model.earliestAllowedDepartureDateTime = model.earliestAllowedDepartureDateTime
      ? convertUtcToSystemTimeZone(model.earliestAllowedDepartureDateTime as string)
      : null;

    model.latestAllowedDepartureDateTime = model.latestAllowedDepartureDateTime
      ? convertUtcToSystemTimeZone(model.latestAllowedDepartureDateTime as string)
      : null;

    model.firstAttendanceFingerPrint = model.firstAttendanceFingerPrint
      ? convertUtcToSystemTimeZone(model.firstAttendanceFingerPrint as string)
      : null;

    model.lastLeaveFingerPrint = model.lastLeaveFingerPrint
      ? convertUtcToSystemTimeZone(model.lastLeaveFingerPrint as string)
      : null;

    model.creationDate = model.creationDate
      ? convertUtcToSystemTimeZone(model.creationDate as string)
      : null;

    model.modificationDate = model.modificationDate
      ? convertUtcToSystemTimeZone(model.modificationDate as string)
      : null;

    return model;
  }

  send(model: Partial<AttendanceReport>): Partial<AttendanceReport> {
    // remove frontend-only props if any
    delete (model as any).languageService;
    delete model.user;

    return model;
  }
}
