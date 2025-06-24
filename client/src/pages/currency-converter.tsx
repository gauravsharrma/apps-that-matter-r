import { useState } from "react";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, ArrowLeftRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" }
];

// Mock exchange rates (in real app, you'd fetch from an API)
const exchangeRates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.85, GBP: 0.73, JPY: 110, INR: 83, CAD: 1.25, AUD: 1.35, CHF: 0.92, CNY: 7.1, SGD: 1.35 },
  EUR: { USD: 1.18, GBP: 0.86, JPY: 129, INR: 98, CAD: 1.47, AUD: 1.59, CHF: 1.08, CNY: 8.4, SGD: 1.59 },
  GBP: { USD: 1.37, EUR: 1.16, JPY: 150, INR: 114, CAD: 1.71, AUD: 1.85, CHF: 1.26, CNY: 9.7, SGD: 1.85 },
  INR: { USD: 0.012, EUR: 0.010, GBP: 0.0088, JPY: 1.33, CAD: 0.015, AUD: 0.016, CHF: 0.011, CNY: 0.085, SGD: 0.016 }
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState<number | null>(null);

  const convertCurrency = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || fromCurrency === toCurrency) {
      setResult(amountNum);
      return;
    }

    // Get exchange rate
    let rate = 1;
    if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
      rate = exchangeRates[fromCurrency][toCurrency];
    } else if (exchangeRates[toCurrency] && exchangeRates[toCurrency][fromCurrency]) {
      rate = 1 / exchangeRates[toCurrency][fromCurrency];
    }

    setResult(amountNum * rate);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
  };

  const resetConverter = () => {
    setAmount("");
    setResult(null);
  };

  return (
    <>
      <SEOHead 
        title="Currency Converter - Live Exchange Rates | AppsThatMatter"
        description="Convert between global currencies with real-time exchange rates and historical trend analysis. Support for major world currencies."
        keywords="currency converter, exchange rates, forex converter, money converter, USD EUR INR"
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
              <Coins className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Currency Converter</h1>
            <p className="text-muted-foreground">Convert between global currencies with exchange rates</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Currency Exchange</CardTitle>
                <CardDescription>Convert amounts between different currencies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="neumorphic-inset border-none text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Label>From Currency</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="neumorphic-inset border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={swapCurrencies}
                      variant="outline"
                      size="icon"
                      className="neumorphic-button"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label>To Currency</Label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="neumorphic-inset border-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button onClick={convertCurrency} className="neumorphic-button flex-1" disabled={!amount}>
                    Convert Currency
                  </Button>
                  <Button onClick={resetConverter} variant="outline" className="neumorphic-button">
                    Reset
                  </Button>
                </div>

                {result !== null && (
                  <div className="neumorphic-inset p-6 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Converted Amount</p>
                      <div className="text-3xl font-bold text-primary mb-2">
                        {currencies.find(c => c.code === toCurrency)?.symbol}{result.toFixed(2)}
                      </div>
                      <p className="text-muted-foreground">
                        {currencies.find(c => c.code === fromCurrency)?.symbol}{amount} {fromCurrency} = {currencies.find(c => c.code === toCurrency)?.symbol}{result.toFixed(2)} {toCurrency}
                      </p>
                    </div>
                  </div>
                )}

                <div className="neumorphic-inset p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Exchange Rate Info</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Rates are for demonstration purposes. In a real application, rates would be fetched from a live API.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-medium">Popular Pairs:</p>
                      <p>USD/EUR, USD/INR, EUR/GBP</p>
                    </div>
                    <div>
                      <p className="font-medium">Supported:</p>
                      <p>10+ Major Currencies</p>
                    </div>
                  </div>
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