import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ApplicationId, Message } from '@/backend';

export function useMessages(applicationId: ApplicationId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', applicationId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessagesByApplication(applicationId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      content,
    }: {
      applicationId: ApplicationId;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(applicationId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.applicationId.toString()] });
    },
  });
}
