import { useGetCallerUserProfile } from '@/hooks/useCurrentUser';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import EmployerProfileForm from '@/components/profile/EmployerProfileForm';
import CandidateProfileForm from '@/components/profile/CandidateProfileForm';
import AuthGate from '@/components/auth/AuthGate';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (!identity) {
    return <AuthGate />;
  }

  if (isLoading) {
    return (
      <div className="container py-8 max-w-3xl">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="container py-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Please complete onboarding first</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your profile information</p>
      </div>

      {userProfile.accountType === 'employer' ? (
        <EmployerProfileForm profile={userProfile} />
      ) : (
        <CandidateProfileForm profile={userProfile} />
      )}
    </div>
  );
}
