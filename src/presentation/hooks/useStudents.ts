import { useEffect, useState } from 'react';
import { getStudentsByTeacher } from '../../infrastructure/repositories/studentRepository';
import type { Student } from '../../application/domain';

export function useStudents(teacherId: string | null) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!teacherId) {
      setStudents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getStudentsByTeacher(teacherId)
      .then(setStudents)
      .catch((err) => console.error('[useStudents]', err))
      .finally(() => setLoading(false));
  }, [teacherId]);

  return { students, loading };
}
