# Shift Buffer Frontend Update Guide

The shift API no longer uses `attendanceBuffer` or `leaveBuffer`. Replace them with four directional buffer fields in forms, TypeScript models, request payloads, and response mapping.

## Field replacement

| Remove | Add | Meaning |
|---|---|---|
| `attendanceBuffer` | `beforeAttendanceBuffer` | Minutes allowed before the scheduled attendance time |
| `attendanceBuffer` | `afterAttendanceBuffer` | Minutes allowed after the scheduled attendance time |
| `leaveBuffer` | `beforeLeaveBuffer` | Minutes allowed before the scheduled leave time |
| `leaveBuffer` | `afterLeaveBuffer` | Minutes allowed after the scheduled leave time |

Do not send the two old fields. The API rejects unmapped JSON properties.

## TypeScript model

```ts
export interface ShiftModel {
  id?: number;
  nameAr: string;
  nameEn?: string | null;
  timeFrom: string;
  timeTo: string;

  beforeAttendanceBuffer: number;
  afterAttendanceBuffer: number;
  beforeLeaveBuffer: number;
  afterLeaveBuffer: number;

  dayBoundaryTime?: string | null;
  isFullDay: boolean;
  isCrossDayShift: boolean;
  isActive?: boolean | null;
  concurrencyUpdateVersion?: string | null;
}
```

The same four buffer properties are also returned in employee current-shift, shift-history, and employee-shift-day models.

## Create/update payload

Use the four fields for both `POST /api/shifts` and `PUT /api/shifts`:

```json
{
  "id": 3,
  "nameAr": "الوردية الصباحية",
  "nameEn": "Morning Shift",
  "timeFrom": "08:00:00",
  "timeTo": "16:00:00",
  "beforeAttendanceBuffer": 20,
  "afterAttendanceBuffer": 10,
  "beforeLeaveBuffer": 5,
  "afterLeaveBuffer": 15,
  "dayBoundaryTime": "04:00:00",
  "isFullDay": false,
  "isCrossDayShift": false,
  "isActive": true
}
```

For create forms, initialize all four values to `0`. For edit forms, populate each control from its matching API property. Do not use one shared attendance or leave value unless the UI intentionally provides a “copy to both” convenience action.

## API responses

Shift responses use camel-case JSON and the standard API wrapper:

```json
{
  "data": {
    "id": 3,
    "nameAr": "الوردية الصباحية",
    "nameEn": "Morning Shift",
    "timeFrom": "08:00:00",
    "timeTo": "16:00:00",
    "beforeAttendanceBuffer": 20,
    "afterAttendanceBuffer": 10,
    "beforeLeaveBuffer": 5,
    "afterLeaveBuffer": 15
  },
  "error": null
}
```

Update response selectors, table columns, form patching, and client-side state that currently read either old property.

## Affected integrations

Review the models consumed by these endpoints:

- `GET /api/shifts`
- `GET /api/shifts/{id}`
- `POST /api/shifts/GetWithPaging`
- `POST /api/shifts`
- `PUT /api/shifts`
- `POST /api/shifts/AddShiftLog/{shiftId}`
- `GET /api/shifts/GetMyCurrentShift`
- `POST /api/shifts/GetMyShifts`
- `POST /api/employee-shift-days/GetWithPaging`
- `POST /api/employee-shift-days/GetMyShiftDaysWithPaging`

Lookup endpoints that only return shift ID, name, and time do not require buffer changes.

## Suggested form labels

- Attendance buffer — before
- Attendance buffer — after
- Leave buffer — before
- Leave buffer — after

All values represent minutes. The UI should use numeric inputs and prevent negative values.

## Frontend checklist

- [ ] Remove `attendanceBuffer` and `leaveBuffer` from interfaces and payloads.
- [ ] Add the four new camel-case fields.
- [ ] Replace the two old form controls with four controls.
- [ ] Update list/detail/current-shift and shift-day response mapping.
- [ ] Update validation, translations, and displayed labels.
- [ ] Search the frontend repository for both old property names and remove every occurrence.
- [ ] Test different before/after values to ensure they are not accidentally copied or swapped.

Existing backend shift data is migrated by copying each old attendance value into both attendance fields and each old leave value into both leave fields. The frontend does not need a separate data migration.
