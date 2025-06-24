import { useState } from "react";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QrCode, Download, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function QRCodeGenerator() {
  const [qrType, setQrType] = useState("text");
  const [content, setContent] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQRCode = () => {
    if (!content.trim()) return;
    
    // Using QR Server API (free service)
    const encodedContent = encodeURIComponent(content);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedContent}`;
    setQrCodeUrl(qrUrl);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTypeChange = (type: string) => {
    setQrType(type);
    setContent("");
    setQrCodeUrl("");
  };

  const getPlaceholder = () => {
    switch (qrType) {
      case "url":
        return "https://example.com";
      case "wifi":
        return "WIFI:T:WPA;S:NetworkName;P:password;;";
      case "email":
        return "mailto:someone@example.com?subject=Hello&body=Message";
      case "phone":
        return "+1234567890";
      case "sms":
        return "SMSTO:+1234567890:Hello there!";
      default:
        return "Enter your text here...";
    }
  };

  return (
    <>
      <SEOHead 
        title="QR Code Generator - Create QR Codes Online | AppsThatMatter"
        description="Generate QR codes for URLs, text, WiFi passwords, and more with customizable options. Download high-quality QR codes instantly."
        keywords="QR code generator, create QR codes, WiFi QR code, URL QR code, text QR code"
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
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">QR Code Generator</h1>
            <p className="text-muted-foreground">Generate QR codes for URLs, text, WiFi passwords, and more</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>QR Code Content</CardTitle>
                <CardDescription>Choose type and enter content for your QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">QR Code Type</Label>
                  <RadioGroup value={qrType} onValueChange={handleTypeChange} className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text" />
                      <Label htmlFor="text">Text</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="url" id="url" />
                      <Label htmlFor="url">URL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wifi" id="wifi" />
                      <Label htmlFor="wifi">WiFi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="phone" />
                      <Label htmlFor="phone">Phone</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sms" id="sms" />
                      <Label htmlFor="sms">SMS</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  {qrType === "text" || qrType === "wifi" ? (
                    <Textarea
                      id="content"
                      placeholder={getPlaceholder()}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="neumorphic-inset border-none min-h-[100px]"
                    />
                  ) : (
                    <Input
                      id="content"
                      type="text"
                      placeholder={getPlaceholder()}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="neumorphic-inset border-none"
                    />
                  )}
                </div>

                {qrType === "wifi" && (
                  <div className="neumorphic-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">WiFi Format</h4>
                    <p className="text-sm text-muted-foreground">
                      Format: WIFI:T:WPA;S:NetworkName;P:password;;
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Replace "NetworkName" and "password" with your actual WiFi credentials
                    </p>
                  </div>
                )}

                <Button onClick={generateQRCode} className="neumorphic-button w-full" disabled={!content.trim()}>
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Generated QR Code</CardTitle>
                <CardDescription>Your QR code will appear here</CardDescription>
              </CardHeader>
              <CardContent>
                {qrCodeUrl ? (
                  <div className="space-y-4">
                    <div className="neumorphic-inset p-6 rounded-lg text-center">
                      <img 
                        src={qrCodeUrl} 
                        alt="Generated QR Code" 
                        className="mx-auto mb-4"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                      <Button onClick={downloadQRCode} className="neumorphic-button">
                        <Download className="h-4 w-4 mr-2" />
                        Download PNG
                      </Button>
                    </div>
                    
                    <div className="neumorphic-inset p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">QR Code Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="capitalize">{qrType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>300x300 px</span>
                        </div>
                        <div className="break-all">
                          <span className="font-medium">Content:</span>
                          <p className="text-muted-foreground mt-1">{content}</p>
                        </div>
                      </div>
                    </div>

                    <div className="neumorphic-inset p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">How to use</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Open camera app on smartphone</li>
                        <li>• Point camera at QR code</li>
                        <li>• Tap notification to open content</li>
                        <li>• Download for printing or sharing</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Enter content and click "Generate QR Code" to create your QR code</p>
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