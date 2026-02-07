import { Link } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '@/hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { AccountType } from '@/backend';

interface RoleGateProps {
  requiredRole: AccountType;
}

export default function RoleGate({ requiredRole }: RoleGateProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  const roleName = requiredRole === AccountType.employer ? 'Employer' : 'Candidate';

  return (
    <div className="container py-20">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Access Restricted
          </CardTitle>
          <CardDescription>
            This page is only accessible to {roleName} accounts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {userProfile 
              ? `Your current account type is ${userProfile.accountType === 'employer' ? 'Employer' : 'Candidate'}. You can change your account type in settings.`
              : 'Please complete your profile setup first.'}
          </p>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline">Go Home</Button>
            </Link>
            {userProfile && (
              <Link to="/settings">
                <Button>Change Account Type</Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
