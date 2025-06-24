import { useState, useEffect, useRef } from "react";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break' | 'longBreak'>('work');
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const modes = {
    work: { duration: 25 * 60, label: 'Focus Time', color: 'text-red-500' },
    break: { duration: 5 * 60, label: 'Short Break', color: 'text-green-500' },
    longBreak: { duration: 15 * 60, label: 'Long Break', color: 'text-blue-500' }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    if (mode === 'work') {
      setSessions(prev => prev + 1);
      // After 4 work sessions, take a long break
      if ((sessions + 1) % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(modes.longBreak.duration);
      } else {
        setMode('break');
        setTimeLeft(modes.break.duration);
      }
    } else {
      setMode('work');
      setTimeLeft(modes.work.duration);
    }
    
    // Play notification sound (if supported)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'work' ? 'Time for a break!' : 'Time to focus!',
        icon: '/favicon.ico'
      });
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(modes[mode].duration);
  };

  const switchMode = (newMode: 'work' | 'break' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(modes[newMode].duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].duration - timeLeft) / modes[mode].duration) * 100;

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <>
      <SEOHead 
        title="Pomodoro Timer - Productivity Timer | AppsThatMatter"
        description="Boost your productivity with the Pomodoro Technique. Customizable focus sessions with break reminders and session tracking."
        keywords="pomodoro timer, productivity timer, focus timer, time management, study timer"
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
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Pomodoro Timer</h1>
            <p className="text-muted-foreground">Boost productivity with focused work sessions and strategic breaks</p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="neumorphic">
              <CardHeader className="text-center">
                <CardTitle className={modes[mode].color}>{modes[mode].label}</CardTitle>
                <CardDescription>Session {sessions + 1}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-mono font-bold text-foreground mb-4">
                    {formatTime(timeLeft)}
                  </div>
                  <Progress value={progress} className="w-full h-2 mb-6" />
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={toggleTimer}
                    className="neumorphic-button flex items-center gap-2"
                    size="lg"
                  >
                    {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isActive ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    className="neumorphic-button"
                    size="lg"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => switchMode('work')}
                    variant={mode === 'work' ? 'default' : 'outline'}
                    className="neumorphic-button text-xs"
                    size="sm"
                  >
                    Focus
                  </Button>
                  <Button
                    onClick={() => switchMode('break')}
                    variant={mode === 'break' ? 'default' : 'outline'}
                    className="neumorphic-button text-xs"
                    size="sm"
                  >
                    Break
                  </Button>
                  <Button
                    onClick={() => switchMode('longBreak')}
                    variant={mode === 'longBreak' ? 'default' : 'outline'}
                    className="neumorphic-button text-xs"
                    size="sm"
                  >
                    Long Break
                  </Button>
                </div>

                <div className="neumorphic-inset p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Session Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-primary">{sessions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Focus Time</p>
                      <p className="text-2xl font-bold text-primary">{Math.floor(sessions * 25 / 60)}h {(sessions * 25) % 60}m</p>
                    </div>
                  </div>
                </div>

                <div className="neumorphic-inset p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">How it works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Focus for 25 minutes</li>
                    <li>• Take a 5-minute break</li>
                    <li>• After 4 sessions, take a 15-minute break</li>
                    <li>• Repeat to boost productivity</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}