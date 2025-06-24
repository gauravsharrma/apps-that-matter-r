import { useEffect } from "react";
import { useLocation } from "wouter";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = () => {
    login();
    setLocation('/');
  };

  return (
    <>
      <SEOHead 
        title="Login - AppsThatMatter"
        description="Sign in to access personalized settings and features on AppsThatMatter."
        keywords="login, sign in, account, AppsThatMatter"
      />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--neo-bg)' }}>
        <Header />
        <main className="container max-w-md mx-auto px-4 py-16">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors no-underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Apps
            </Link>
          </div>

          <Card className="neumorphic">
            <CardHeader className="text-center">
              <div className="neumorphic-inset w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your personalized settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button 
                onClick={handleLogin}
                className="neumorphic-button w-full py-3"
                size="lg"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign in with Google
              </Button>

              <div className="neumorphic-inset p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Why sign in?</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Customize scroll button position</li>
                  <li>• Save your app preferences</li>
                  <li>• Sync settings across devices</li>
                  <li>• Access advanced features</li>
                </ul>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}