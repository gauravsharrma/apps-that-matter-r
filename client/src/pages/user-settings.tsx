import { useEffect } from "react";
import { useLocation } from "wouter";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Settings, ArrowLeft, LogOut } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function UserSettings() {
  const { user, logout, isAuthenticated } = useAuth();
  const { settings, updateSettings, resetSettings } = useUserSettings();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
    }
  }, [isAuthenticated, setLocation]);

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <SEOHead 
        title="User Settings - AppsThatMatter"
        description="Customize your AppsThatMatter experience with personalized settings and preferences."
        keywords="settings, preferences, customization, AppsThatMatter"
      />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--neo-bg)' }}>
        <Header />
        <main className="container max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors no-underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Apps
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="neumorphic-inset w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl">
              <Settings className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">User Settings</h1>
            <p className="text-muted-foreground">Customize your AppsThatMatter experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  {user?.profileImageUrl && (
                    <img 
                      src={user.profileImageUrl} 
                      alt={`${user.firstName} ${user.lastName}`} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="neumorphic-button w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Scroll Navigation</CardTitle>
                <CardDescription>Customize scroll button placement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Button Position</Label>
                  <RadioGroup 
                    value={settings.scrollButtonPosition} 
                    onValueChange={(value) => 
                      updateSettings({ scrollButtonPosition: value as any })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bottom-left" id="bottom-left" />
                      <Label htmlFor="bottom-left">Bottom Left</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bottom-right" id="bottom-right" />
                      <Label htmlFor="bottom-right">Bottom Right</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="top-left" id="top-left" />
                      <Label htmlFor="top-left">Top Left</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="top-right" id="top-right" />
                      <Label htmlFor="top-right">Top Right</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>General app preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Theme</Label>
                  <RadioGroup 
                    value={settings.theme} 
                    onValueChange={(value) => 
                      updateSettings({ theme: value as any })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auto" id="auto" />
                      <Label htmlFor="auto">Auto</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button 
                  onClick={resetSettings}
                  variant="outline" 
                  className="neumorphic-button w-full"
                >
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="neumorphic mt-6">
            <CardHeader>
              <CardTitle>About Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold mb-2">Scroll Navigation</h4>
                  <p>Choose where you want the scroll-to-top and scroll-to-bottom buttons to appear on all pages. These buttons help you quickly navigate long pages.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Storage</h4>
                  <p>Your preferences are saved locally in your browser and synced when you're logged in. No personal data is shared with third parties.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    </>
  );
}