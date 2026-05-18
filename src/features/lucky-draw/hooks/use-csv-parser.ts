import { useCallback } from 'react';
import type { Participant, CSVParseResult, CSVColumn } from '../types';

export function useCSVParser() {
  const parseCSV = useCallback((csvContent: string): CSVParseResult => {
    const lines = csvContent.trim().split('\n');
    const errors: string[] = [];
    const participants: Participant[] = [];

    if (lines.length < 2) {
      errors.push('CSV file must have header row and at least one data row');
      return { participants: [], errors, mappedColumns: { name: null, employeeId: null, department: null } };
    }

    // Parse header row
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    
    // Map columns
    const mappedColumns: Record<CSVColumn, number | null> = {
      name: null,
      employeeId: null,
      department: null,
    };

    const namePatterns = ['name', 'employee name', 'full name'];
    const idPatterns = ['employee id', 'id', 'emp id', 'employee number'];
    const deptPatterns = ['department', 'dept', 'team'];

    // Find column indices
    headers.forEach((header, index) => {
      if (namePatterns.some((p) => header.includes(p))) {
        mappedColumns.name = index;
      }
      if (idPatterns.some((p) => header.includes(p))) {
        mappedColumns.employeeId = index;
      }
      if (deptPatterns.some((p) => header.includes(p))) {
        mappedColumns.department = index;
      }
    });

    // Validate name column exists
    if (mappedColumns.name === null) {
      errors.push('Could not find "Name" column in CSV');
      return { participants: [], errors, mappedColumns };
    }

    // Parse data rows
    const seen = new Set<string>();
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(',').map((c) => c.trim());

      const name = columns[mappedColumns.name];
      if (!name) {
        errors.push(`Row ${i + 1}: Missing name`);
        continue;
      }

      // Check for duplicates
      if (seen.has(name)) {
        errors.push(`Row ${i + 1}: Duplicate name "${name}" - skipped`);
        continue;
      }
      seen.add(name);

      const participant: Participant = {
        id: `${Date.now()}-${Math.random()}`,
        name,
        employeeId: mappedColumns.employeeId !== null ? columns[mappedColumns.employeeId] : undefined,
        department: mappedColumns.department !== null ? columns[mappedColumns.department] : undefined,
      };

      participants.push(participant);
    }

    return {
      participants,
      errors,
      mappedColumns,
    };
  }, []);

  return { parseCSV };
}
