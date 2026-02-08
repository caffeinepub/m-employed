import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Briefcase, User, Settings, LogOut, LogIn, Menu, Download } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isEmployer = userProfile?.accountType === 'employer';
  const isCandidate = userProfile?.accountType === 'candidate';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const NavLinks = () => (
    <>
      <Link to="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
        Browse Jobs
      </Link>
      <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
        About
      </Link>
      <Link to="/founder" className="text-sm font-medium hover:text-primary transition-colors">
        Founder
      </Link>
      {isAuthenticated && isCandidate && (
        <Link to="/candidate/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
          My Applications
        </Link>
      )}
      {isAuthenticated && isEmployer && (
        <>
          <Link to="/employer/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            My Jobs
          </Link>
          <Link to="/employer/jobs/new" className="text-sm font-medium hover:text-primary transition-colors">
            Post Job
          </Link>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/assets/generated/logo-m-employed.dim_512x256.png" 
                alt="M EMPLOYED" 
                className="h-8 w-auto"
              />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {userProfile.name}
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
            
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="hidden md:flex gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button 
                onClick={handleLogin} 
                disabled={loginStatus === 'logging-in'}
                size="sm"
                className="hidden md:flex gap-2"
              >
                <LogIn className="h-4 w-4" />
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
              </Button>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                  {isAuthenticated && userProfile && (
                    <>
                      <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                        Profile
                      </Link>
                      <Link to="/settings" className="text-sm font-medium hover:text-primary transition-colors">
                        Settings
                      </Link>
                    </>
                  )}
                  <div className="pt-4 border-t">
                    {isAuthenticated ? (
                      <Button onClick={handleLogout} variant="outline" className="w-full gap-2">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    ) : (
                      <Button onClick={handleLogin} disabled={loginStatus === 'logging-in'} className="w-full gap-2">
                        <LogIn className="h-4 w-4" />
                        {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/30 py-8 mt-auto">
        <div className="container">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © 2026. Built with ❤️ using{' '}
                <a 
                  href="https://caffeine.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium hover:text-primary transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link to="/jobs" className="hover:text-primary transition-colors">
                  Browse Jobs
                </Link>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
                <Link to="/founder" className="hover:text-primary transition-colors">
                  Founder
                </Link>
                {isAuthenticated && (
                  <Link to="/profile" className="hover:text-primary transition-colors">
                    Profile
                  </Link>
                )}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Logo:
                </span>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="/assets/generated/m-employed-logo-download-transparent.dim_2048x512.png"
                    download="m-employed-logo-transparent.png"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Transparent PNG
                  </a>
                  <span className="text-muted-foreground">•</span>
                  <a 
                    href="/assets/generated/m-employed-logo-download-white.dim_2048x512.png"
                    download="m-employed-logo-white.png"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    White Background PNG
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
