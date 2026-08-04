import { describe, it, expect } from 'vitest';

// Business Rules Unit Tests for Schollege MS

describe('Business Rule 1: Submission Deadline Lock', () => {
  function validateSubmissionDeadline(dueDate: Date, now: Date): { allowed: boolean; error?: string } {
    if (now > dueDate) {
      return { allowed: false, error: 'Submission deadline has passed. Late submissions are not allowed.' };
    }
    return { allowed: true };
  }

  it('should ALLOW submission before the due date', () => {
    const futureDueDate = new Date('2026-12-31T23:59:59Z');
    const submissionTime = new Date('2026-12-01T10:00:00Z');
    const result = validateSubmissionDeadline(futureDueDate, submissionTime);
    expect(result.allowed).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should REJECT submission after the due date', () => {
    const pastDueDate = new Date('2026-01-01T12:00:00Z');
    const submissionTime = new Date('2026-01-02T10:00:00Z');
    const result = validateSubmissionDeadline(pastDueDate, submissionTime);
    expect(result.allowed).toBe(false);
    expect(result.error).toContain('Submission deadline has passed');
  });
});

describe('Business Rule 2: Grading Constraints & Max Marks Validation', () => {
  function validateGradingMarks(marks: number, maxMarks: number): { valid: boolean; error?: string } {
    if (marks < 0) {
      return { valid: false, error: 'Marks cannot be negative' };
    }
    if (marks > maxMarks) {
      return { valid: false, error: `Marks (${marks}) cannot exceed maximum marks (${maxMarks})` };
    }
    return { valid: true };
  }

  it('should ACCEPT valid marks within [0, maxMarks]', () => {
    const result = validateGradingMarks(85, 100);
    expect(result.valid).toBe(true);
  });

  it('should REJECT negative marks', () => {
    const result = validateGradingMarks(-10, 100);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('cannot be negative');
  });

  it('should REJECT marks exceeding maxMarks', () => {
    const result = validateGradingMarks(105, 100);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('cannot exceed maximum marks');
  });
});

describe('Business Rule 3: Role-Based Assignment Draft Visibility', () => {
  function filterAssignmentsForRole(assignments: any[], role: string): any[] {
    if (role === 'STUDENT') {
      return assignments.filter((a) => a.status === 'PUBLISHED');
    }
    return assignments; // TEACHER and ADMIN see DRAFT and PUBLISHED
  }

  const sampleAssignments = [
    { id: '1', title: 'Published Math Homework', status: 'PUBLISHED' },
    { id: '2', title: 'Draft CS Quiz', status: 'DRAFT' },
  ];

  it('should HIDE draft assignments from STUDENT role', () => {
    const studentView = filterAssignmentsForRole(sampleAssignments, 'STUDENT');
    expect(studentView.length).toBe(1);
    expect(studentView[0].id).toBe('1');
  });

  it('should SHOW both draft and published assignments to TEACHER role', () => {
    const teacherView = filterAssignmentsForRole(sampleAssignments, 'TEACHER');
    expect(teacherView.length).toBe(2);
  });

  it('should SHOW all assignments to ADMIN role', () => {
    const adminView = filterAssignmentsForRole(sampleAssignments, 'ADMIN');
    expect(adminView.length).toBe(2);
  });
});

describe('Business Rule 4: Role Authorization Guard', () => {
  function authorizeRoleAccess(userRole: string, requiredRoles: string[]): boolean {
    return requiredRoles.includes(userRole);
  }

  it('should GRANT access if user possesses required role', () => {
    expect(authorizeRoleAccess('ADMIN', ['ADMIN'])).toBe(true);
    expect(authorizeRoleAccess('TEACHER', ['TEACHER', 'ADMIN'])).toBe(true);
  });

  it('should DENY access if user lacks required role', () => {
    expect(authorizeRoleAccess('STUDENT', ['ADMIN'])).toBe(false);
    expect(authorizeRoleAccess('STUDENT', ['TEACHER'])).toBe(false);
  });
});
