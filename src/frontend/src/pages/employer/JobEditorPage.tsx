import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useCurrentUser';
import { useJob, useCreateJob, useUpdateJob, useDeleteJob, useToggleJobPublication } from '@/hooks/useJobs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import JobForm from '@/components/jobs/JobForm';
import RoleGate from '@/components/auth/RoleGate';
import { AccountType } from '@/backend';
import { toast } from 'sonner';

export default function JobEditorPage() {
  const params = useParams({ strict: false });
  const jobId = params.jobId ? BigInt(params.jobId) : null;
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: job, isLoading: jobLoading } = useJob(jobId);
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();
  const togglePublication = useToggleJobPublication();

  if (!identity || !userProfile) {
    return <RoleGate requiredRole={AccountType.employer} />;
  }

  if (userProfile.accountType !== 'employer') {
    return <RoleGate requiredRole={AccountType.employer} />;
  }

  if (jobId && jobLoading) {
    return (
      <div className="container py-8 max-w-3xl">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (jobId && !job) {
    return (
      <div className="container py-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Job Not Found</CardTitle>
            <CardDescription>The job you're trying to edit doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (data: {
    title: string;
    description: string;
    location: string;
    employmentType: string;
    skills: string[];
  }) => {
    try {
      if (jobId && job) {
        await updateJob.mutateAsync({
          jobId,
          ...data,
        });
        toast.success('Job updated successfully!');
      } else {
        const newJobId = await createJob.mutateAsync(data);
        toast.success('Job created successfully!');
        navigate({ to: '/employer/jobs/$jobId/edit', params: { jobId: newJobId.toString() } });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save job');
      throw error;
    }
  };

  const handleTogglePublication = async () => {
    if (!jobId || !job) return;
    
    try {
      await togglePublication.mutateAsync({
        jobId,
        published: !job.published,
      });
      toast.success(job.published ? 'Job unpublished' : 'Job published successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update publication status');
    }
  };

  const handleDelete = async () => {
    if (!jobId) return;
    
    try {
      await deleteJob.mutateAsync(jobId);
      toast.success('Job deleted successfully');
      navigate({ to: '/employer/dashboard' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete job');
    }
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {jobId ? 'Edit Job' : 'Post New Job'}
        </h1>
        <p className="text-muted-foreground">
          {jobId ? 'Update your job posting details' : 'Create a new job posting'}
        </p>
      </div>

      <JobForm
        job={job || undefined}
        onSubmit={handleSubmit}
        onTogglePublication={jobId ? handleTogglePublication : undefined}
        onDelete={jobId ? handleDelete : undefined}
        isSubmitting={createJob.isPending || updateJob.isPending}
        isDeleting={deleteJob.isPending}
        isTogglingPublication={togglePublication.isPending}
      />
    </div>
  );
}
