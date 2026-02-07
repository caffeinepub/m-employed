import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function AuthGate() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container py-20">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please log in with Internet Identity to access this page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleLogin} 
            disabled={loginStatus === 'logging-in'}
            className="w-full gap-2"
          >
            <LogIn className="h-4 w-4" />
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Login with Internet Identity'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
