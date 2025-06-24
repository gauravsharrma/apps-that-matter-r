import { useState, useEffect } from "react";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplets, Plus, Minus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function WaterIntakeTracker() {
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [currentIntake, setCurrentIntake] = useState(0);
  const [glassSize, setGlassSize] = useState(250);
  const [history, setHistory] = useState<{ time: string; amount: number }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('waterIntakeData');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) {
        setCurrentIntake(data.intake);
        setHistory(data.history || []);
        setDailyGoal(data.goal || 2000);
      }
    }
  }, []);

  useEffect(() => {
    const data = {
      date: new Date().toDateString(),
      intake: currentIntake,
      history,
      goal: dailyGoal
    };
    localStorage.setItem('waterIntakeData', JSON.stringify(data));
  }, [currentIntake, history, dailyGoal]);

  const addWater = (amount: number) => {
    const newIntake = currentIntake + amount;
    setCurrentIntake(newIntake);
    setHistory(prev => [...prev, {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount
    }]);
  };

  const removeWater = (amount: number) => {
    const newIntake = Math.max(0, currentIntake - amount);
    setCurrentIntake(newIntake);
    setHistory(prev => [...prev, {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: -amount
    }]);
  };

  const resetDaily = () => {
    setCurrentIntake(0);
    setHistory([]);
  };

  const progressPercentage = (currentIntake / dailyGoal) * 100;
  const remainingWater = Math.max(0, dailyGoal - currentIntake);
  const glassesRemaining = Math.ceil(remainingWater / glassSize);

  const getHydrationStatus = () => {
    const percentage = progressPercentage;
    if (percentage >= 100) return { status: "Excellent! Goal achieved!", color: "text-green-600" };
    if (percentage >= 75) return { status: "Great hydration!", color: "text-blue-600" };
    if (percentage >= 50) return { status: "Good progress", color: "text-yellow-600" };
    if (percentage >= 25) return { status: "Keep drinking", color: "text-orange-600" };
    return { status: "Need more water", color: "text-red-600" };
  };

  const hydrationStatus = getHydrationStatus();

  return (
    <>
      <SEOHead 
        title="Water Intake Tracker - Daily Hydration Monitor | AppsThatMatter"
        description="Track your daily water consumption with personalized goals, reminders, and hydration insights. Stay healthy and hydrated."
        keywords="water tracker, hydration tracker, daily water intake, health tracker, water reminder"
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
              <Droplets className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Water Intake Tracker</h1>
            <p className="text-muted-foreground">Track your daily water consumption and stay hydrated</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Today's Progress</CardTitle>
                <CardDescription>Your hydration journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {currentIntake}ml
                  </div>
                  <div className="text-muted-foreground">
                    of {dailyGoal}ml goal
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="w-full h-3" />
                  <div className={`text-center font-medium ${hydrationStatus.color}`}>
                    {hydrationStatus.status}
                  </div>
                </div>

                <div className="neumorphic-inset p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="text-lg font-semibold">{remainingWater}ml</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Glasses Left</p>
                      <p className="text-lg font-semibold">{glassesRemaining}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <Button onClick={() => addWater(glassSize)} className="neumorphic-button">
                    <Plus className="h-4 w-4 mr-1" />
                    {glassSize}ml
                  </Button>
                  <Button onClick={() => addWater(500)} className="neumorphic-button">
                    <Plus className="h-4 w-4 mr-1" />
                    500ml
                  </Button>
                  <Button onClick={() => removeWater(glassSize)} variant="outline" className="neumorphic-button">
                    <Minus className="h-4 w-4 mr-1" />
                    {glassSize}ml
                  </Button>
                  <Button onClick={resetDaily} variant="outline" className="neumorphic-button text-xs">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="neumorphic">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Customize your hydration goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dailyGoal">Daily Goal (ml)</Label>
                    <Input
                      id="dailyGoal"
                      type="number"
                      value={dailyGoal}
                      onChange={(e) => setDailyGoal(parseInt(e.target.value) || 2000)}
                      className="neumorphic-inset border-none"
                    />
                  </div>
                  <div>
                    <Label htmlFor="glassSize">Glass Size (ml)</Label>
                    <Input
                      id="glassSize"
                      type="number"
                      value={glassSize}
                      onChange={(e) => setGlassSize(parseInt(e.target.value) || 250)}
                      className="neumorphic-inset border-none"
                    />
                  </div>
                  <div className="neumorphic-inset p-3 rounded-lg">
                    <h4 className="font-semibold mb-2">Quick Goals</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={() => setDailyGoal(1500)} variant="outline" size="sm" className="neumorphic-button">
                        1.5L
                      </Button>
                      <Button onClick={() => setDailyGoal(2000)} variant="outline" size="sm" className="neumorphic-button">
                        2L
                      </Button>
                      <Button onClick={() => setDailyGoal(2500)} variant="outline" size="sm" className="neumorphic-button">
                        2.5L
                      </Button>
                      <Button onClick={() => setDailyGoal(3000)} variant="outline" size="sm" className="neumorphic-button">
                        3L
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neumorphic">
                <CardHeader>
                  <CardTitle>Today's Log</CardTitle>
                  <CardDescription>Your water intake history</CardDescription>
                </CardHeader>
                <CardContent>
                  {history.length > 0 ? (
                    <div className="neumorphic-inset p-4 rounded-lg max-h-48 overflow-y-auto">
                      <div className="space-y-2">
                        {history.slice(-10).reverse().map((entry, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{entry.time}</span>
                            <span className={entry.amount > 0 ? "text-blue-600" : "text-red-600"}>
                              {entry.amount > 0 ? "+" : ""}{entry.amount}ml
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No water logged today. Start drinking!
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="neumorphic">
                <CardHeader>
                  <CardTitle>Hydration Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Drink a glass of water when you wake up</li>
                    <li>• Keep a water bottle at your desk</li>
                    <li>• Drink before, during, and after exercise</li>
                    <li>• Add lemon or cucumber for flavor</li>
                    <li>• Set hourly reminders on your phone</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}