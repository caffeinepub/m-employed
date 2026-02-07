import { useState } from 'react';
import { useUpdateProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserProfile } from '@/backend';
import SkillsInput from './SkillsInput';

interface CandidateProfileFormProps {
  profile: UserProfile;
}

export default function CandidateProfileForm({ profile }: CandidateProfileFormProps) {
  const updateProfile = useUpdateProfile();
  const [location, setLocation] = useState(profile.location || '');
  const [description, setDescription] = useState(profile.description || '');
  const [skills, setSkills] = useState<string[]>(profile.skills || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile.mutateAsync({
        skills: skills.length > 0 ? skills : null,
        location: location.trim(),
        description: description.trim(),
        companyName: '',
      });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Profile</CardTitle>
        <CardDescription>Update your professional information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State or Remote"
            />
          </div>

          <div className="space-y-2">
            <Label>Skills</Label>
            <SkillsInput skills={skills} onChange={setSkills} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Bio / Professional Summary</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell employers about your experience and what you're looking for..."
              rows={5}
            />
          </div>

          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
