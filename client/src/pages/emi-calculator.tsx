import { useState } from "react";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [emi, setEmi] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100; // Monthly interest rate
    const tenure = parseFloat(loanTenure) * 12; // Total months

    if (principal && rate && tenure) {
      const emiValue = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
      const totalAmountValue = emiValue * tenure;
      const totalInterestValue = totalAmountValue - principal;

      setEmi(Math.round(emiValue));
      setTotalAmount(Math.round(totalAmountValue));
      setTotalInterest(Math.round(totalInterestValue));
    }
  };

  const resetCalculator = () => {
    setLoanAmount("");
    setInterestRate("");
    setLoanTenure("");
    setEmi(null);
    setTotalAmount(null);
    setTotalInterest(null);
  };

  return (
    <>
      <SEOHead 
        title="EMI Calculator - Calculate Loan EMI | AppsThatMatter"
        description="Calculate your monthly EMI payments for home loans, car loans, and personal loans with detailed breakdowns and amortization schedules."
        keywords="EMI calculator, loan calculator, monthly installment, home loan EMI, car loan EMI"
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
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">EMI Calculator</h1>
            <p className="text-muted-foreground">Calculate your monthly EMI payments for loans with detailed breakdowns</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
                <CardDescription>Enter your loan information to calculate EMI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="e.g., 1000000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="neumorphic-inset border-none"
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 8.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="neumorphic-inset border-none"
                  />
                </div>
                <div>
                  <Label htmlFor="loanTenure">Loan Tenure (Years)</Label>
                  <Input
                    id="loanTenure"
                    type="number"
                    placeholder="e.g., 20"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                    className="neumorphic-inset border-none"
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={calculateEMI} className="neumorphic-button flex-1">
                    Calculate EMI
                  </Button>
                  <Button onClick={resetCalculator} variant="outline" className="neumorphic-button">
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>EMI Results</CardTitle>
                <CardDescription>Your loan payment breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {emi ? (
                  <div className="space-y-4">
                    <div className="neumorphic-inset p-4 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Monthly EMI</p>
                        <p className="text-2xl font-bold text-primary">₹{emi.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="neumorphic-inset p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                        <p className="text-lg font-semibold">₹{totalAmount?.toLocaleString()}</p>
                      </div>
                      <div className="neumorphic-inset p-3 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Total Interest</p>
                        <p className="text-lg font-semibold">₹{totalInterest?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="neumorphic-inset p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Loan Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Principal Amount:</span>
                          <span>₹{parseFloat(loanAmount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest Rate:</span>
                          <span>{interestRate}% per annum</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tenure:</span>
                          <span>{loanTenure} years</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Enter loan details and click "Calculate EMI" to see results</p>
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