import { Link } from '@tanstack/react-router';
import { useGetEmployerJobs } from '@/hooks/useJobs';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useCurrentUser';
import { useMemberCount } from '@/hooks/useMemberCount';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Plus, Users, Edit, UserCheck } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import RoleGate from '@/components/auth/RoleGate';
import { AccountType } from '@/backend';

export default function EmployerDashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: jobs, isLoading } = useGetEmployerJobs();
  const { data: memberCount, isLoading: memberCountLoading, isError: memberCountError } = useMemberCount();

  if (!identity || !userProfile) {
    return <RoleGate requiredRole={AccountType.employer} />;
  }

  if (userProfile.accountType !== 'employer') {
    return <RoleGate requiredRole={AccountType.employer} />;
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Jobs</h1>
          <p className="text-muted-foreground">Manage your job postings</p>
        </div>
        <Link to="/employer/jobs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Member Count Stats Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Total Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {memberCountLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : memberCountError ? (
            <p className="text-2xl font-bold">—</p>
          ) : (
            <p className="text-3xl font-bold">{memberCount?.toLocaleString() ?? '—'}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Registered users on the platform
          </p>
        </CardContent>
      </Card>

      {!jobs || jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          description="Create your first job posting to start finding candidates"
          action={
            <Link to="/employer/jobs/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Post Your First Job
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => (
            <Card key={job.id.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge variant={job.published ? 'default' : 'secondary'}>
                        {job.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {job.location} • {job.employmentType}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {job.description}
                </p>
                <div className="flex gap-2">
                  <Link to="/employer/jobs/$jobId/edit" params={{ jobId: job.id.toString() }}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Link to="/employer/jobs/$jobId/applications" params={{ jobId: job.id.toString() }}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Users className="h-4 w-4" />
                      View Applications
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
