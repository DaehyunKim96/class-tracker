import { useEffect, useState } from 'react';
import { listLessonsByDateRange } from '../../infrastructure/repositories/lessonRepository';
import type { Lesson } from '../../application/domain';

type UseLessonsResult = {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useLessons(
  teacherId: string,
  studentId: string | null,
  fromDate: string,
  toDate: string,
): UseLessonsResult {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!studentId) {
      setLessons([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    listLessonsByDateRange(studentId, fromDate, toDate)
      .then(setLessons)
      .catch((err) => {
        console.error('[useLessons]', err);
        setError('수업 데이터를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, [teacherId, studentId, fromDate, toDate, tick]);

  return { lessons, loading, error, reload: () => setTick((t) => t + 1) };
}
