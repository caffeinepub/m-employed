import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '@/hooks/useCurrentUser';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useCreateAccount } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Briefcase, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { AccountType } from '@/backend';
import AuthGate from '@/components/auth/AuthGate';

export default function SettingsPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const createAccount = useCreateAccount();
  const navigate = useNavigate();
  const [isChanging, setIsChanging] = useState(false);

  const handleChangeAccountType = async () => {
    if (!userProfile) return;

    const newType = userProfile.accountType === 'employer' ? AccountType.candidate : AccountType.employer;
    
    setIsChanging(true);
    try {
      await createAccount.mutateAsync({
        accountType: newType,
        name: userProfile.name,
      });
      
      toast.success('Account type changed successfully!');
      
      if (newType === AccountType.employer) {
        navigate({ to: '/employer/dashboard' });
      } else {
        navigate({ to: '/jobs' });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to change account type');
    } finally {
      setIsChanging(false);
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-base">{userProfile.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Type</label>
              <div className="flex items-center gap-2 mt-1">
                {userProfile.accountType === 'employer' ? (
                  <>
                    <Briefcase className="h-4 w-4" />
                    <Badge>Employer</Badge>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    <Badge>Candidate</Badge>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Principal ID</label>
              <p className="text-xs font-mono break-all text-muted-foreground">
                {identity.getPrincipal().toString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Account Type</CardTitle>
            <CardDescription>
              Switch between employer and candidate accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={isChanging}>
                  Switch to {userProfile.accountType === 'employer' ? 'Candidate' : 'Employer'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Confirm Account Type Change
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to switch to a {userProfile.accountType === 'employer' ? 'candidate' : 'employer'} account? 
                    This will change your access and available features.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleChangeAccountType}>
                    Confirm Change
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
