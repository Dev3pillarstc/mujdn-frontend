import { Observable } from 'rxjs';

export class SpreadsheetXmlHelper {
  static validateSpreadsheetXmlHeaders(
    file: File,
    requiredHeaders: string[]
  ): Observable<{ validHeaders: boolean; missing: string[]; provided: string[] }> {
    const ns = 'urn:schemas-microsoft-com:office:spreadsheet';
    const norm = (s: string) => s?.trim().toLowerCase() ?? '';

    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const xml = new DOMParser().parseFromString(reader.result as string, 'text/xml');
          const rows = Array.from(xml.getElementsByTagNameNS(ns, 'Row'));
          if (!rows.length) throw new Error('XML contains no rows');

          // locate header row (contains all requiredHeaders)
          const headerRow = rows.find((r) => {
            const vals = Array.from(r.getElementsByTagNameNS(ns, 'Data'))
              .map((d) => (d.textContent ?? '').trim());
            const set = new Set(vals.map(norm));
            return requiredHeaders.every((h) => set.has(norm(h)));
          });

          if (!headerRow) {
            observer.next({ validHeaders: false, missing: requiredHeaders, provided: [] });
            observer.complete();
            return;
          }

          const provided = Array.from(headerRow.getElementsByTagNameNS(ns, 'Data'))
            .map((d) => (d.textContent ?? '').trim())
            .filter((v) => v !== '');

          const providedSet = new Set(provided.map(norm));
          const missing = requiredHeaders.filter((h) => !providedSet.has(norm(h)));

          observer.next({ validHeaders: missing.length === 0, missing, provided });
          observer.complete();
        } catch (e) {
          observer.error(e);
        }
      };
      reader.onerror = (err) => observer.error(err);
      reader.readAsText(file);
    });
  }

  static validateSpreadsheetXmlDataValues(
    file: File,
    nonEmptyFields: string[]
  ): Observable<boolean> {
    const ns = 'urn:schemas-microsoft-com:office:spreadsheet';
    const norm = (s: string) => s?.trim().toLowerCase() ?? '';

    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const xml = new DOMParser().parseFromString(reader.result as string, 'text/xml');
          const rows = Array.from(xml.getElementsByTagNameNS(ns, 'Row'));
          if (!rows.length) throw new Error('XML contains no rows');

          // find header row
          const headerRow = rows.find((r) =>
            Array.from(r.getElementsByTagNameNS(ns, 'Data'))
              .some((d) => norm(d.textContent ?? '') === norm(nonEmptyFields[0]))
          );
          if (!headerRow) throw new Error('No header row found');

          const provided = Array.from(headerRow.getElementsByTagNameNS(ns, 'Data'))
            .map((d) => (d.textContent ?? '').trim())
            .filter((v) => v !== '');

          const headerIndexMap = new Map<string, number>();
          provided.forEach((name, i) => headerIndexMap.set(norm(name), i));

          // ensure all required fields exist
          const nonEmptyIndices = nonEmptyFields.map((f) => {
            const idx = headerIndexMap.get(norm(f));
            if (idx == null) throw new Error(`Header missing required field: ${f}`);
            return idx;
          });

          // get data rows after header
          const headerIndex = rows.indexOf(headerRow);
          const dataRows = rows.slice(headerIndex + 1);
          if (!dataRows.length) throw new Error('No data rows found');

          for (const row of dataRows) {
            const vals = Array.from(row.getElementsByTagNameNS(ns, 'Data'))
              .map((d) => (d.textContent ?? '').trim());

            // stop validation once we hit the first *completely empty* row
            const allEmpty = vals.every((v) => !v);
            if (allEmpty) break;

            // check if any required fields are empty
            const hasMissing = nonEmptyIndices.some((i) => !vals[i]);
            if (hasMissing) {
              throw new Error('Some rows missing required values before the first empty row');
            }
          }

          observer.next(true);
          observer.complete();
        } catch (e) {
          observer.error(e);
        }
      };
      reader.onerror = (err) => observer.error(err);
      reader.readAsText(file);
    });
  }
}
