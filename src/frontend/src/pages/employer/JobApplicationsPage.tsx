import { useParams, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useCurrentUser';
import { useJob } from '@/hooks/useJobs';
import { useJobApplications, useUpdateApplicationStatus } from '@/hooks/useApplications';
import { useCandidateProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageSquare, User } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import ApplicationStatusSelect from '@/components/applications/ApplicationStatusSelect';
import RoleGate from '@/components/auth/RoleGate';
import { AccountType } from '@/backend';

function ApplicationCard({ application }: { application: any }) {
  const { data: candidateProfile } = useCandidateProfile(application.candidate);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              {candidateProfile?.name || 'Candidate'}
            </CardTitle>
            <CardDescription>
              Applied {new Date(Number(application.createdAt) / 1000000).toLocaleDateString()}
            </CardDescription>
          </div>
          <ApplicationStatusSelect
            applicationId={application.id}
            currentStatus={application.status}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {candidateProfile && (
          <div className="space-y-2">
            {candidateProfile.location && (
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{candidateProfile.location}</p>
              </div>
            )}
            {candidateProfile.skills && candidateProfile.skills.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {candidateProfile.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div>
          <p className="text-sm font-medium mb-1">Application Message</p>
          <p className="text-sm text-muted-foreground">{application.message}</p>
        </div>
        {application.portfolioUrl && (
          <div>
            <p className="text-sm font-medium mb-1">Portfolio</p>
            <a 
              href={application.portfolioUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {application.portfolioUrl}
            </a>
          </div>
        )}
        <Link to="/messages/$applicationId" params={{ applicationId: application.id.toString() }}>
          <Button variant="outline" size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Message Candidate
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function JobApplicationsPage() {
  const { jobId } = useParams({ from: '/employer/jobs/$jobId/applications' });
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: job, isLoading: jobLoading } = useJob(BigInt(jobId));
  const { data: applications, isLoading: applicationsLoading } = useJobApplications(BigInt(jobId));

  if (!identity || !userProfile) {
    return <RoleGate requiredRole={AccountType.employer} />;
  }

  if (userProfile.accountType !== 'employer') {
    return <RoleGate requiredRole={AccountType.employer} />;
  }

  if (jobLoading || applicationsLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid gap-4">
          {[1, 2].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Job Not Found</CardTitle>
            <CardDescription>The job you're looking for doesn't exist.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link to="/employer/dashboard">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Applications for {job.title}</h1>
        <p className="text-muted-foreground">
          {applications?.length || 0} {applications?.length === 1 ? 'application' : 'applications'}
        </p>
      </div>

      {!applications || applications.length === 0 ? (
        <EmptyState
          icon={User}
          title="No applications yet"
          description="When candidates apply to this job, they will appear here"
        />
      ) : (
        <div className="grid gap-4">
          {applications.map(application => (
            <ApplicationCard key={application.id.toString()} application={application} />
          ))}
        </div>
      )}
    </div>
  );
}
