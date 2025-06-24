import { useState } from "react";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {
    let heightInM = parseFloat(height);
    let weightInKg = parseFloat(weight);

    if (unit === "imperial") {
      // Convert feet/inches to meters and pounds to kg
      heightInM = heightInM * 0.3048; // feet to meters
      weightInKg = weightInKg * 0.453592; // pounds to kg
    } else {
      heightInM = heightInM / 100; // cm to meters
    }

    if (heightInM && weightInKg) {
      const bmiValue = weightInKg / (heightInM * heightInM);
      setBmi(Math.round(bmiValue * 10) / 10);

      // Determine BMI category
      if (bmiValue < 18.5) {
        setCategory("Underweight");
      } else if (bmiValue < 25) {
        setCategory("Normal weight");
      } else if (bmiValue < 30) {
        setCategory("Overweight");
      } else {
        setCategory("Obese");
      }
    }
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return "text-blue-600";
    if (bmi < 25) return "text-green-600";
    if (bmi < 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthAdvice = (category: string) => {
    switch (category) {
      case "Underweight":
        return "Consider consulting a healthcare provider about healthy weight gain strategies.";
      case "Normal weight":
        return "Great! Maintain your healthy lifestyle with balanced diet and regular exercise.";
      case "Overweight":
        return "Consider adopting a balanced diet and increasing physical activity.";
      case "Obese":
        return "Consult with a healthcare provider for a comprehensive weight management plan.";
      default:
        return "";
    }
  };

  return (
    <>
      <SEOHead 
        title="BMI Calculator - Body Mass Index Calculator | AppsThatMatter"
        description="Calculate your Body Mass Index (BMI) and get health recommendations based on WHO guidelines. Support for both metric and imperial units."
        keywords="BMI calculator, body mass index, health calculator, weight status, fitness calculator"
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
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">BMI Calculator</h1>
            <p className="text-muted-foreground">Calculate your Body Mass Index and get health recommendations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Body Measurements</CardTitle>
                <CardDescription>Enter your height and weight to calculate BMI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">Unit System</Label>
                  <RadioGroup value={unit} onValueChange={setUnit} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="metric" id="metric" />
                      <Label htmlFor="metric">Metric (cm, kg)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="imperial" id="imperial" />
                      <Label htmlFor="imperial">Imperial (ft, lbs)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="height">
                    Height ({unit === "metric" ? "cm" : "feet"})
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    step={unit === "metric" ? "1" : "0.1"}
                    placeholder={unit === "metric" ? "e.g., 170" : "e.g., 5.8"}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="neumorphic-inset border-none"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">
                    Weight ({unit === "metric" ? "kg" : "lbs"})
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder={unit === "metric" ? "e.g., 70" : "e.g., 154"}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="neumorphic-inset border-none"
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={calculateBMI} className="neumorphic-button flex-1">
                    Calculate BMI
                  </Button>
                  <Button onClick={resetCalculator} variant="outline" className="neumorphic-button">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>BMI Results</CardTitle>
                <CardDescription>Your body mass index and health status</CardDescription>
              </CardHeader>
              <CardContent>
                {bmi ? (
                  <div className="space-y-4">
                    <div className="neumorphic-inset p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Your BMI</p>
                        <p className={`text-3xl font-bold ${getBMIColor(bmi)}`}>{bmi}</p>
                        <p className="text-lg font-semibold text-foreground">{category}</p>
                      </div>
                    </div>
                    
                    <div className="neumorphic-inset p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">BMI Categories (WHO)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Underweight:</span>
                          <span className="text-blue-600">Below 18.5</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Normal weight:</span>
                          <span className="text-green-600">18.5 - 24.9</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overweight:</span>
                          <span className="text-yellow-600">25.0 - 29.9</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Obese:</span>
                          <span className="text-red-600">30.0 and above</span>
                        </div>
                      </div>
                    </div>

                    <div className="neumorphic-inset p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Health Recommendation</h4>
                      <p className="text-sm text-muted-foreground">
                        {getHealthAdvice(category)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Enter your measurements and click "Calculate BMI" to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}