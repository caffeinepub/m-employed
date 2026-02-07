import { useState } from 'react';
import { useApplyToJob, useGetCallerApplications } from '@/hooks/useApplications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import { JobId } from '@/backend';

interface ApplyToJobCardProps {
  jobId: JobId;
}

export default function ApplyToJobCard({ jobId }: ApplyToJobCardProps) {
  const applyToJob = useApplyToJob();
  const { data: applications } = useGetCallerApplications();
  const [message, setMessage] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const existingApplication = applications?.find(
    app => app.jobId.toString() === jobId.toString()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please provide a message with your application');
      return;
    }

    try {
      await applyToJob.mutateAsync({
        jobId,
        message: message.trim(),
        portfolioUrl: portfolioUrl.trim() || null,
      });
      toast.success('Application submitted successfully!');
      setMessage('');
      setPortfolioUrl('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
    }
  };

  if (existingApplication) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Application</CardTitle>
          <CardDescription>You've already applied to this job</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <ApplicationStatusBadge status={existingApplication.status} />
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Your Message</p>
            <p className="text-sm text-muted-foreground">{existingApplication.message}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Applied {new Date(Number(existingApplication.createdAt) / 1000000).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply to this Job</CardTitle>
        <CardDescription>Submit your application</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Cover Message *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the employer why you're a great fit..."
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolioUrl">Portfolio / Website (optional)</Label>
            <Input
              id="portfolioUrl"
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={applyToJob.isPending}>
            {applyToJob.isPending ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
