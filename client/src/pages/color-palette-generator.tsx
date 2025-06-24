import { useState } from "react";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Palette, Shuffle, Copy, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Color {
  hex: string;
  rgb: string;
  hsl: string;
}

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#3B82F6");
  const [paletteType, setPaletteType] = useState("complementary");
  const [palette, setPalette] = useState<Color[]>([]);
  const { toast } = useToast();

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generatePalette = () => {
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors: Color[] = [];

    switch (paletteType) {
      case "complementary":
        colors.push(createColor(baseColor));
        colors.push(createColor(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)));
        break;
      
      case "triadic":
        colors.push(createColor(baseColor));
        colors.push(createColor(hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)));
        break;
      
      case "analogous":
        for (let i = -2; i <= 2; i++) {
          colors.push(createColor(hslToHex((hsl.h + i * 30) % 360, hsl.s, hsl.l)));
        }
        break;
      
      case "monochromatic":
        for (let i = 0; i < 5; i++) {
          const lightness = Math.max(10, Math.min(90, hsl.l + (i - 2) * 20));
          colors.push(createColor(hslToHex(hsl.h, hsl.s, lightness)));
        }
        break;
      
      case "tetradic":
        colors.push(createColor(baseColor));
        colors.push(createColor(hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)));
        colors.push(createColor(hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)));
        break;
    }

    setPalette(colors);
  };

  const createColor = (hex: string): Color => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      hex,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    };
  };

  const generateRandomColor = () => {
    const randomHex = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setBaseColor(randomHex);
  };

  const copyColor = async (color: string, format: string) => {
    try {
      await navigator.clipboard.writeText(color);
      toast({
        title: "Copied!",
        description: `${format} color copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy color to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEOHead 
        title="Color Palette Generator - Create Beautiful Color Schemes | AppsThatMatter"
        description="Generate beautiful color palettes for your design projects. Support for complementary, triadic, analogous, and monochromatic color schemes."
        keywords="color palette generator, color scheme, design colors, complementary colors, color picker"
      />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--neo-bg)' }}>
        <Header />
        <main className="container max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors no-underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Apps
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="neumorphic-inset w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl">
              <Palette className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Color Palette Generator</h1>
            <p className="text-muted-foreground">Generate beautiful color palettes for your design projects</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="neumorphic lg:col-span-1">
              <CardHeader>
                <CardTitle>Color Settings</CardTitle>
                <CardDescription>Configure your base color and palette type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="baseColor">Base Color</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="baseColor"
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-16 h-12 p-1 border-none rounded-lg"
                    />
                    <Input
                      type="text"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="neumorphic-inset border-none flex-1"
                    />
                    <Button onClick={generateRandomColor} variant="outline" size="icon" className="neumorphic-button">
                      <Shuffle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">Palette Type</Label>
                  <RadioGroup value={paletteType} onValueChange={setPaletteType} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="complementary" id="complementary" />
                      <Label htmlFor="complementary">Complementary (2 colors)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="triadic" id="triadic" />
                      <Label htmlFor="triadic">Triadic (3 colors)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="analogous" id="analogous" />
                      <Label htmlFor="analogous">Analogous (5 colors)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monochromatic" id="monochromatic" />
                      <Label htmlFor="monochromatic">Monochromatic (5 colors)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tetradic" id="tetradic" />
                      <Label htmlFor="tetradic">Tetradic (4 colors)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button onClick={generatePalette} className="neumorphic-button w-full">
                  Generate Palette
                </Button>

                <div className="neumorphic-inset p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Color Theory</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Complementary: Opposite colors on color wheel</li>
                    <li>• Triadic: Three evenly spaced colors</li>
                    <li>• Analogous: Adjacent colors on wheel</li>
                    <li>• Monochromatic: Same hue, different lightness</li>
                    <li>• Tetradic: Four colors forming rectangle</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic lg:col-span-2">
              <CardHeader>
                <CardTitle>Generated Palette</CardTitle>
                <CardDescription>Your color palette with multiple format options</CardDescription>
              </CardHeader>
              <CardContent>
                {palette.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {palette.map((color, index) => (
                        <div key={index} className="neumorphic p-4 rounded-lg">
                          <div 
                            className="w-full h-24 rounded-lg mb-3 border"
                            style={{ backgroundColor: color.hex }}
                          ></div>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-mono">{color.hex}</span>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyColor(color.hex, 'HEX')}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-muted-foreground">{color.rgb}</span>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyColor(color.rgb, 'RGB')}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-muted-foreground">{color.hsl}</span>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyColor(color.hsl, 'HSL')}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="neumorphic-inset p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Usage Tips</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Click copy buttons to copy color values</li>
                        <li>• Use complementary colors for high contrast</li>
                        <li>• Analogous palettes create harmony</li>
                        <li>• Test accessibility with color contrast tools</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Palette className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Choose a base color and palette type, then click "Generate Palette"</p>
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