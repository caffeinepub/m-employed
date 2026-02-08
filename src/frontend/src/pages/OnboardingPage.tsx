import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useCreateAccount } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, User } from 'lucide-react';
import { toast } from 'sonner';
import { AccountType } from '@/backend';

export default function OnboardingPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const createAccount = useCreateAccount();
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !name.trim()) {
      toast.error('Please select an account type and enter your name');
      return;
    }

    try {
      await createAccount.mutateAsync({ accountType: selectedType, name: name.trim() });
      toast.success('Account created successfully!');
      
      if (selectedType === AccountType.employer) {
        navigate({ to: '/employer/dashboard' });
      } else {
        navigate({ to: '/jobs' });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    }
  };

  if (!identity) {
    return (
      <div className="container py-20">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to continue</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to M Employed</h1>
          <p className="text-muted-foreground">Let's set up your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>I am a...</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all ${selectedType === AccountType.employer ? 'ring-2 ring-primary' : 'hover:border-primary'}`}
                onClick={() => setSelectedType(AccountType.employer)}
              >
                <CardContent className="pt-6 text-center">
                  <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Employer</h3>
                  <p className="text-sm text-muted-foreground">
                    Post jobs and find talented candidates
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all ${selectedType === AccountType.candidate ? 'ring-2 ring-primary' : 'hover:border-primary'}`}
                onClick={() => setSelectedType(AccountType.candidate)}
              >
                <CardContent className="pt-6 text-center">
                  <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Candidate</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse jobs and apply to opportunities
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={!selectedType || !name.trim() || createAccount.isPending}
          >
            {createAccount.isPending ? 'Creating Account...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}
