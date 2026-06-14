import { useEffect, useState } from 'react';
import {
  getProposalsByTeacher,
  getProposalsByProposer,
} from '../../infrastructure/repositories/proposalRepository';
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
    const fetch =
      user.role === 'teacher'
        ? getProposalsByTeacher(user.id)
        : getProposalsByProposer(user.id);
    fetch
      .then((all) => setProposals(all.filter((p) => p.status === 'pending')))
      .catch(console.error);
  }, [user, tick]);

  return { proposals, reload: () => setTick((t) => t + 1) };
}
