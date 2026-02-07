import { Link } from '@tanstack/react-router';
import { useGetCallerApplications } from '@/hooks/useApplications';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, MessageSquare } from 'lucide-react';
import EmptyState from '@/components/common/EmptyState';
import ApplicationStatusBadge from '@/components/applications/ApplicationStatusBadge';
import RoleGate from '@/components/auth/RoleGate';
import { AccountType } from '@/backend';

export default function CandidateDashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: applications, isLoading } = useGetCallerApplications();

  if (!identity || !userProfile) {
    return <RoleGate requiredRole={AccountType.candidate} />;
  }

  if (userProfile.accountType !== 'candidate') {
    return <RoleGate requiredRole={AccountType.candidate} />;
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">Track your job applications</p>
      </div>

      {!applications || applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications yet"
          description="Start browsing jobs and apply to opportunities that interest you"
          action={
            <Link to="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4">
          {applications.map(application => (
            <Card key={application.id.toString()}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">Application #{application.id.toString()}</CardTitle>
                    <CardDescription>
                      Applied {new Date(Number(application.createdAt) / 1000000).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <ApplicationStatusBadge status={application.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Your Message</p>
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
                  <div className="flex gap-2 pt-2">
                    <Link to="/jobs/$jobId" params={{ jobId: application.jobId.toString() }}>
                      <Button variant="outline" size="sm">
                        View Job
                      </Button>
                    </Link>
                    <Link to="/messages/$applicationId" params={{ applicationId: application.id.toString() }}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Messages
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
