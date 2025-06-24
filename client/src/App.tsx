import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
