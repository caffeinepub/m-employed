import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Job, JobId, UserProfile } from '@/backend';
import { Principal } from '@icp-sdk/core/principal';

export function usePublishedJobs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Job[]>({
    queryKey: ['publishedJobs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedJobs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSearchJobs(searchTerm: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Job[]>({
    queryKey: ['searchJobs', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchJobs(searchTerm);
    },
    enabled: !!actor && !actorFetching && searchTerm.length > 0,
  });
}

export function useJob(jobId: JobId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Job | null>({
    queryKey: ['job', jobId?.toString()],
    queryFn: async () => {
      if (!actor || !jobId) return null;
      const jobs = await actor.getPublishedJobs();
      return jobs.find(j => j.id.toString() === jobId.toString()) || null;
    },
    enabled: !!actor && !actorFetching && !!jobId,
  });
}

export function useGetEmployerJobs() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Job[]>({
    queryKey: ['employerJobs', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getJobsByEmployer(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useJobEmployerProfile(employer: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['employerProfile', employer?.toString()],
    queryFn: async () => {
      if (!actor || !employer) return null;
      return actor.getUserProfile(employer);
    },
    enabled: !!actor && !actorFetching && !!employer,
  });
}

export function useCreateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      location: string;
      employmentType: string;
      skills: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJob(
        data.title,
        data.description,
        data.location,
        data.employmentType,
        data.skills
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
    },
  });
}

export function useUpdateJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      jobId: JobId;
      title: string;
      description: string;
      location: string;
      employmentType: string;
      skills: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateJob(
        data.jobId,
        data.title,
        data.description,
        data.location,
        data.employmentType,
        data.skills
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      queryClient.invalidateQueries({ queryKey: ['job'] });
    },
  });
}

export function useToggleJobPublication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, published }: { jobId: JobId; published: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.toggleJobPublication(jobId, published);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      queryClient.invalidateQueries({ queryKey: ['job'] });
      queryClient.invalidateQueries({ queryKey: ['publishedJobs'] });
    },
  });
}

export function useDeleteJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: JobId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteJob(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      queryClient.invalidateQueries({ queryKey: ['publishedJobs'] });
    },
  });
}
