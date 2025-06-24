import { useState } from "react";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [totalInvestment, setTotalInvestment] = useState<number | null>(null);
  const [totalGains, setTotalGains] = useState<number | null>(null);

  const calculateSIP = () => {
    const P = parseFloat(monthlyAmount);
    const r = parseFloat(annualReturn) / 12 / 100; // Monthly rate
    const n = parseFloat(timePeriod) * 12; // Total months

    if (P && r && n) {
      // SIP Future Value Formula: P * [((1 + r)^n - 1) / r] * (1 + r)
      const fv = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      const totalInv = P * n;
      const gains = fv - totalInv;

      setFutureValue(Math.round(fv));
      setTotalInvestment(Math.round(totalInv));
      setTotalGains(Math.round(gains));
    }
  };

  const resetCalculator = () => {
    setMonthlyAmount("");
    setAnnualReturn("");
    setTimePeriod("");
    setFutureValue(null);
    setTotalInvestment(null);
    setTotalGains(null);
  };

  return (
    <>
      <SEOHead 
        title="SIP Calculator - Systematic Investment Plan Calculator | AppsThatMatter"
        description="Calculate your SIP returns and plan your systematic investment portfolio with compound interest calculations and goal-based planning."
        keywords="SIP calculator, systematic investment plan, mutual fund calculator, investment calculator, compound interest"
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
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">SIP Calculator</h1>
            <p className="text-muted-foreground">Plan your systematic investment portfolio with compound interest calculations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
                <CardDescription>Enter your SIP investment parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="monthlyAmount">Monthly Investment (₹)</Label>
                  <Input
                    id="monthlyAmount"
                    type="number"
                    placeholder="e.g., 5000"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    className="neumorphic-inset border-none"
                  />
                </div>
                <div>
                  <Label htmlFor="annualReturn">Expected Annual Return (%)</Label>
                  <Input
                    id="annualReturn"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 12"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(e.target.value)}
                    className="neumorphic-inset border-none"
                  />
                </div>
                <div>
                  <Label htmlFor="timePeriod">Investment Period (Years)</Label>
                  <Input
                    id="timePeriod"
                    type="number"
                    placeholder="e.g., 10"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="neumorphic-inset border-none"
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={calculateSIP} className="neumorphic-button flex-1">
                    Calculate Returns
                  </Button>
                  <Button onClick={resetCalculator} variant="outline" className="neumorphic-button">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>SIP Results</CardTitle>
                <CardDescription>Your investment growth projection</CardDescription>
              </CardHeader>
              <CardContent>
                {futureValue ? (
                  <div className="space-y-4">
                    <div className="neumorphic-inset p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Future Value</p>
                        <p className="text-2xl font-bold text-primary">₹{futureValue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="neumorphic-inset p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Total Investment</p>
                        <p className="text-lg font-semibold">₹{totalInvestment?.toLocaleString()}</p>
                      </div>
                      <div className="neumorphic-inset p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Total Gains</p>
                        <p className="text-lg font-semibold text-green-600">₹{totalGains?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="neumorphic-inset p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Investment Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Monthly SIP:</span>
                          <span>₹{parseFloat(monthlyAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Return:</span>
                          <span>{annualReturn}% per annum</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Investment Period:</span>
                          <span>{timePeriod} years</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span>Growth Multiple:</span>
                          <span>{totalInvestment && futureValue ? (futureValue / totalInvestment).toFixed(2) + "x" : "-"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Enter investment details and click "Calculate Returns" to see projections</p>
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