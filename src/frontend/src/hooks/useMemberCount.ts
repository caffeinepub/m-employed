import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useMemberCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<number>({
    queryKey: ['memberCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const count = await actor.getTotalMembersCount();
      return Number(count);
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
