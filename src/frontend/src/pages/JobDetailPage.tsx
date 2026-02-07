import { useParams, useNavigate } from '@tanstack/react-router';
import { useJob, useJobEmployerProfile } from '@/hooks/useJobs';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Briefcase, Building2, Globe, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ApplyToJobCard from '@/components/applications/ApplyToJobCard';

export default function JobDetailPage() {
  const { jobId } = useParams({ from: '/jobs/$jobId' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: job, isLoading: jobLoading } = useJob(BigInt(jobId));
  const { data: employerProfile, isLoading: employerLoading } = useJobEmployerProfile(job?.employer);

  const isAuthenticated = !!identity;
  const isCandidate = userProfile?.accountType === 'candidate';

  if (jobLoading || employerLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
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
            <CardDescription>The job you're looking for doesn't exist or has been removed.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/jobs' })}>
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate({ to: '/jobs' })}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{job.title}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-4 text-base">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {job.employmentType}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Job Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {employerProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {employerProfile.companyName && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{employerProfile.companyName}</span>
                  </div>
                )}
                {employerProfile.description && (
                  <p className="text-sm text-muted-foreground">{employerProfile.description}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          {isAuthenticated && isCandidate ? (
            <ApplyToJobCard jobId={job.id} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Apply to this Job</CardTitle>
              </CardHeader>
              <CardContent>
                {!isAuthenticated ? (
                  <p className="text-sm text-muted-foreground mb-4">
                    Please log in to apply to this job
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    Only candidates can apply to jobs. Please switch to a candidate account in settings.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
