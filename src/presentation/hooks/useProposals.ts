import { useEffect, useState } from 'react';
import {
  getProposalsByTeacher,
  getProposalsByStudent,
  getProposalsByProposer,
} from '../../infrastructure/repositories/proposalRepository';
import { getStudentByUid } from '../../infrastructure/repositories/studentRepository';
import type { LessonProposal, User } from '../../application/domain';

type UseProposalsResult = {
  proposals: LessonProposal[];
  reload: () => void;
};

export function useProposals(user: User | null): UseProposalsResult {
  const [proposals, setProposals] = useState<LessonProposal[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!user) {
      setProposals([]);
      return;
    }

    async function load() {
      let all: LessonProposal[] = [];

      if (user!.role === 'teacher') {
        all = await getProposalsByTeacher(user!.id);
      } else if (user!.role === 'student') {
        const student = await getStudentByUid(user!.id);
        if (student) all = await getProposalsByStudent(student.id);
      } else {
        // 학부모: 자신이 제안한 것만 (본인의 proposerUid 기준)
        all = await getProposalsByProposer(user!.id);
      }

      setProposals(all.filter((p) => p.status === 'pending'));
    }

    load().catch(console.error);
  }, [user, tick]);

  return { proposals, reload: () => setTick((t) => t + 1) };
}
