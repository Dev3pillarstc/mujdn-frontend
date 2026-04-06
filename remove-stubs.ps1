$files = @(
  'src\views\features\visit\visit-request\my-created-visit-request-list\my-created-visit-request-list.component.ts',
  'src\views\features\visit\blacklist\blacklisted-nationalities\blacklisted-nationalities-list.component.ts',
  'src\views\features\visit\blacklist\blacklisted-national-ids\blacklisted-national-ids-list.component.ts',
  'src\views\features\visit\visit-request\all-visit-request-list\all-visit-request-list.component.ts',
  'src\views\features\settings\devices-location\devices-location.component.ts',
  'src\views\features\settings\devices-configuration\devices-configuration.component.ts',
  'src\views\features\reports\attendance-report\my-attendance-report-list\my-attendance-report-list.component.ts',
  'src\views\features\reports\attendance-report\all-attendance-report-list\all-attendance-report-list.component.ts',
  'src\views\features\presence-inquiries\my-presence-inquiries-list\my-presence-inquiries-list.component.ts',
  'src\views\features\presence-inquiries\others-presence-inquiries-list\others-presence-inquiries-list.component.ts',
  'src\views\features\outside-mission\my-work-mission-list\my-work-mission-list.component.ts',
  'src\views\features\outside-mission\assign-work-mission-list\assign-work-mission-list.component.ts',
  'src\views\features\lookups\work-shifts\work-shifts-list\work-shifts-list.component.ts',
  'src\views\features\lookups\work-shifts\work-shifts-assignment\work-shifts-assignment.component.ts',
  'src\views\features\lookups\work-shifts\my-shifts\my-shifts.component.ts',
  'src\views\features\lookups\region\region-list\region-list.component.ts',
  'src\views\features\lookups\permission\permission-reason-list\permission-reason-list.component.ts',
  'src\views\features\lookups\notifiactions\notifiactions.component.ts',
  'src\views\features\lookups\nationality\nationality-list\nationality-list.component.ts',
  'src\views\features\lookups\city\city-list\city-list.component.ts',
  'src\views\features\lookups\holidays\holidays-list\holidays-list.component.ts',
  'src\views\features\employee\employee-list\employee-list.component.ts',
  'src\views\features\department\department-list\department-list.component.ts'
)

$pattern = '\r?\n  protected override mapModelToPdfRow\([^)]+\): \{ \[key: string\]: any;? \} \{\r?\n    throw new Error\(''Method not implemented\.''\);\r?\n  \}'

foreach ($rel in $files) {
  $path = Join-Path (Get-Location) $rel
  if (Test-Path $path) {
    $content = [System.IO.File]::ReadAllText($path)
    $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, '')
    if ($content -ne $newContent) {
      [System.IO.File]::WriteAllText($path, $newContent)
      Write-Host "Cleaned: $rel"
    } else {
      Write-Host "No match: $rel"
    }
  } else {
    Write-Host "Not found: $rel"
  }
}
Write-Host "Done."
