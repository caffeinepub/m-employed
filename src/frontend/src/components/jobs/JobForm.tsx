import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import SkillsInput from '@/components/profile/SkillsInput';
import { Job } from '@/backend';
import { Trash2 } from 'lucide-react';

interface JobFormProps {
  job?: Job;
  onSubmit: (data: {
    title: string;
    description: string;
    location: string;
    employmentType: string;
    skills: string[];
  }) => Promise<void>;
  onTogglePublication?: () => Promise<void>;
  onDelete?: () => Promise<void>;
  isSubmitting: boolean;
  isDeleting?: boolean;
  isTogglingPublication?: boolean;
}

export default function JobForm({
  job,
  onSubmit,
  onTogglePublication,
  onDelete,
  isSubmitting,
  isDeleting,
  isTogglingPublication,
}: JobFormProps) {
  const [title, setTitle] = useState(job?.title || '');
  const [description, setDescription] = useState(job?.description || '');
  const [location, setLocation] = useState(job?.location || '');
  const [employmentType, setEmploymentType] = useState(job?.employmentType || 'Full-time');
  const [skills, setSkills] = useState<string[]>(job?.skills || []);

  useEffect(() => {
    if (job) {
      setTitle(job.title);
      setDescription(job.description);
      setLocation(job.location);
      setEmploymentType(job.employmentType);
      setSkills(job.skills);
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      employmentType,
      skills,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              {job ? 'Update your job posting' : 'Create a new job posting'}
            </CardDescription>
          </div>
          {job && (
            <Badge variant={job.published ? 'default' : 'secondary'}>
              {job.published ? 'Published' : 'Draft'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA or Remote"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentType">Employment Type *</Label>
            <Select value={employmentType} onValueChange={setEmploymentType}>
              <SelectTrigger id="employmentType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Required Skills</Label>
            <SkillsInput skills={skills} onChange={setSkills} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={8}
              required
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : job ? 'Save Changes' : 'Create Job'}
            </Button>

            {job && onTogglePublication && (
              <Button
                type="button"
                variant="outline"
                onClick={onTogglePublication}
                disabled={isTogglingPublication}
              >
                {isTogglingPublication 
                  ? 'Updating...' 
                  : job.published ? 'Unpublish' : 'Publish'}
              </Button>
            )}

            {job && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={isDeleting} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Job
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this job posting? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
