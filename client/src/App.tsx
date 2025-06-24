import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScrollNavigation } from "@/components/scroll-navigation";
import { useUserSettings } from "@/hooks/useUserSettings";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import UserSettings from "@/pages/user-settings";
import EMICalculator from "@/pages/emi-calculator";
import BMICalculator from "@/pages/bmi-calculator";
import PomodoroTimer from "@/pages/pomodoro-timer";
import SIPCalculator from "@/pages/sip-calculator";
import QRCodeGenerator from "@/pages/qr-code-generator";
import CurrencyConverter from "@/pages/currency-converter";
import TextFormatter from "@/pages/text-formatter";
import ColorPaletteGenerator from "@/pages/color-palette-generator";
import WaterIntakeTracker from "@/pages/water-intake-tracker";
import AIPromptGenerator from "@/pages/ai-prompt-generator";
import PostItNotes from "@/pages/post-it-notes";

function AppContent() {
  const { settings } = useUserSettings();

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/settings" component={UserSettings} />
        <Route path="/emi-calculator" component={EMICalculator} />
        <Route path="/bmi-calculator" component={BMICalculator} />
        <Route path="/pomodoro-timer" component={PomodoroTimer} />
        <Route path="/sip-calculator" component={SIPCalculator} />
        <Route path="/qr-code-generator" component={QRCodeGenerator} />
        <Route path="/currency-converter" component={CurrencyConverter} />
        <Route path="/text-formatter" component={TextFormatter} />
        <Route path="/color-palette-generator" component={ColorPaletteGenerator} />
        <Route path="/water-intake-tracker" component={WaterIntakeTracker} />
        <Route path="/ai-prompt-generator" component={AIPromptGenerator} />
        <Route path="/post-it-notes" component={PostItNotes} />
        <Route component={NotFound} />
      </Switch>
      <ScrollNavigation position={settings.scrollButtonPosition} />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
