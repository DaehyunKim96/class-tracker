import { useEffect, useState } from 'react';
import { listVisibleLessons } from '../../application/services/lessonService';
import type { Lesson, User } from '../../application/domain';

type UseLessonsResult = {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useLessons(
  user: User | null,
  fromDate: string,
  toDate: string,
): UseLessonsResult {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!user) {
      setLessons([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    listVisibleLessons(user, fromDate, toDate)
      .then(setLessons)
      .catch((err) => {
        console.error('[useLessons]', err);
        setError('수업 데이터를 불러오지 못했습니다.');
      })
      .finally(() => setLoading(false));
  }, [user, fromDate, toDate, tick]);

  return { lessons, loading, error, reload: () => setTick((t) => t + 1) };
}
