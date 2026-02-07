import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Application, ApplicationId, ApplicationStatus, JobId } from '@/backend';

export function useGetCallerApplications() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Application[]>({
    queryKey: ['candidateApplications', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getApplicationsByCandidate(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useJobApplications(jobId: JobId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Application[]>({
    queryKey: ['jobApplications', jobId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApplicationsByJob(jobId);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useApplication(applicationId: ApplicationId) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Application | null>({
    queryKey: ['application', applicationId.toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      const candidateApps = await actor.getApplicationsByCandidate(identity.getPrincipal());
      return candidateApps.find(app => app.id.toString() === applicationId.toString()) || null;
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useApplyToJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      message,
      portfolioUrl,
    }: {
      jobId: JobId;
      message: string;
      portfolioUrl: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyToJob(jobId, message, portfolioUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidateApplications'] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: ApplicationId;
      status: ApplicationStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateApplicationStatus(applicationId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobApplications'] });
      queryClient.invalidateQueries({ queryKey: ['candidateApplications'] });
    },
  });
}
