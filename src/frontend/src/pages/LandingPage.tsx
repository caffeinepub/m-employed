import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, MessageSquare, Shield, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

export default function LandingPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated && isFetched && !profileLoading) {
      if (!userProfile) {
        navigate({ to: '/onboarding' });
      }
    }
  }, [isAuthenticated, userProfile, profileLoading, isFetched, navigate]);

  const handleGetStarted = async () => {
    if (!isAuthenticated) {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
      }
    } else if (userProfile) {
      if (userProfile.accountType === 'employer') {
        navigate({ to: '/employer/dashboard' });
      } else {
        navigate({ to: '/jobs' });
      }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Connect Talent with Opportunity
                </h1>
                <p className="text-lg font-medium text-primary">
                  M Employed; Am Employed
                </p>
                <p className="text-xl text-muted-foreground max-w-xl">
                  The modern job marketplace where employers find exceptional candidates and professionals discover their next career move.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  disabled={loginStatus === 'logging-in'}
                  className="gap-2"
                >
                  {loginStatus === 'logging-in' ? 'Loading...' : 'Get Started'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link to="/jobs">
                  <Button size="lg" variant="outline">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/generated/hero-connection.dim_1400x700.png" 
                alt="Connecting employers and employees" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete platform designed for both employers and job seekers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Post & Manage Jobs</h3>
                <p className="text-sm text-muted-foreground">
                  Create detailed job listings and manage applications in one place
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Find Top Talent</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with qualified candidates who match your requirements
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Direct Messaging</h3>
                <p className="text-sm text-muted-foreground">
                  Communicate directly with candidates or employers
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Built on Internet Computer with Internet Identity authentication
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join Caffeine Jobs today and take the next step in your career journey
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              disabled={loginStatus === 'logging-in'}
              className="gap-2"
            >
              {loginStatus === 'logging-in' ? 'Loading...' : 'Sign Up Now'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
