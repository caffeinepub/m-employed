import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { AccountType, UserProfile } from '@/backend';
import { Principal } from '@icp-sdk/core/principal';

export function useCreateAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountType, name }: { accountType: AccountType; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createAccount(accountType, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      skills,
      location,
      description,
      companyName,
    }: {
      skills: string[] | null;
      location: string;
      description: string;
      companyName: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProfile(skills, location, description, companyName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCandidateProfile(principal: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', principal.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !actorFetching,
  });
}
