import { useState } from "react";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Copy, Download, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function TextFormatter() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const { toast } = useToast();

  const formatText = (type: string) => {
    if (!inputText.trim()) return;

    let result = "";
    switch (type) {
      case "uppercase":
        result = inputText.toUpperCase();
        break;
      case "lowercase":
        result = inputText.toLowerCase();
        break;
      case "titlecase":
        result = inputText.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case "sentencecase":
        result = inputText.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => 
          c.toUpperCase()
        );
        break;
      case "removeextraspaces":
        result = inputText.replace(/\s+/g, ' ').trim();
        break;
      case "removelinebreaks":
        result = inputText.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
        break;
      case "addlinebreaks":
        result = inputText.replace(/\.\s+/g, '.\n');
        break;
      case "removepunctuation":
        result = inputText.replace(/[^\w\s]/gi, '');
        break;
      case "extractemails":
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const emails = inputText.match(emailRegex);
        result = emails ? emails.join('\n') : 'No email addresses found';
        break;
      case "extracturls":
        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const urls = inputText.match(urlRegex);
        result = urls ? urls.join('\n') : 'No URLs found';
        break;
      case "wordcount":
        const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
        const characters = inputText.length;
        const charactersNoSpaces = inputText.replace(/\s/g, '').length;
        const lines = inputText.split('\n').length;
        result = `Words: ${words.length}\nCharacters: ${characters}\nCharacters (no spaces): ${charactersNoSpaces}\nLines: ${lines}`;
        break;
      case "reverse":
        result = inputText.split('').reverse().join('');
        break;
      default:
        result = inputText;
    }
    setOutputText(result);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadText = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "formatted-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearText = () => {
    setInputText("");
    setOutputText("");
  };

  return (
    <>
      <SEOHead 
        title="Text Formatter - Format and Transform Text | AppsThatMatter"
        description="Format, clean, and transform text with multiple options including case conversion, space removal, and text analysis."
        keywords="text formatter, text converter, case converter, text cleaner, word counter"
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Text Formatter</h1>
            <p className="text-muted-foreground">Format, clean, and transform text with multiple formatting options</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="neumorphic lg:col-span-2">
              <CardHeader>
                <CardTitle>Input Text</CardTitle>
                <CardDescription>Enter or paste your text here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="neumorphic-inset border-none min-h-[200px]"
                />
                <div className="flex gap-2">
                  <Button onClick={clearText} variant="outline" className="neumorphic-button">
                    Clear
                  </Button>
                  <div className="text-sm text-muted-foreground flex items-center ml-auto">
                    {inputText.length} characters
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Formatting Options</CardTitle>
                <CardDescription>Choose a formatting operation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button onClick={() => formatText("uppercase")} className="neumorphic-button justify-start" variant="outline">
                    UPPERCASE
                  </Button>
                  <Button onClick={() => formatText("lowercase")} className="neumorphic-button justify-start" variant="outline">
                    lowercase
                  </Button>
                  <Button onClick={() => formatText("titlecase")} className="neumorphic-button justify-start" variant="outline">
                    Title Case
                  </Button>
                  <Button onClick={() => formatText("sentencecase")} className="neumorphic-button justify-start" variant="outline">
                    Sentence case
                  </Button>
                  <Button onClick={() => formatText("removeextraspaces")} className="neumorphic-button justify-start" variant="outline">
                    Remove Extra Spaces
                  </Button>
                  <Button onClick={() => formatText("removelinebreaks")} className="neumorphic-button justify-start" variant="outline">
                    Remove Line Breaks
                  </Button>
                  <Button onClick={() => formatText("addlinebreaks")} className="neumorphic-button justify-start" variant="outline">
                    Add Line Breaks
                  </Button>
                  <Button onClick={() => formatText("removepunctuation")} className="neumorphic-button justify-start" variant="outline">
                    Remove Punctuation
                  </Button>
                  <Button onClick={() => formatText("extractemails")} className="neumorphic-button justify-start" variant="outline">
                    Extract Emails
                  </Button>
                  <Button onClick={() => formatText("extracturls")} className="neumorphic-button justify-start" variant="outline">
                    Extract URLs
                  </Button>
                  <Button onClick={() => formatText("wordcount")} className="neumorphic-button justify-start" variant="outline">
                    Word Count
                  </Button>
                  <Button onClick={() => formatText("reverse")} className="neumorphic-button justify-start" variant="outline">
                    Reverse Text
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic lg:col-span-2">
              <CardHeader>
                <CardTitle>Output Text</CardTitle>
                <CardDescription>Formatted text will appear here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Formatted text will appear here..."
                  value={outputText}
                  readOnly
                  className="neumorphic-inset border-none min-h-[200px] bg-muted/50"
                />
                {outputText && (
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} className="neumorphic-button">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={downloadText} variant="outline" className="neumorphic-button">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <div className="text-sm text-muted-foreground flex items-center ml-auto">
                      {outputText.length} characters
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="neumorphic">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Use "Remove Extra Spaces" to clean up messy text</li>
                  <li>• "Extract Emails" finds all email addresses</li>
                  <li>• "Word Count" gives detailed text statistics</li>
                  <li>• "Title Case" capitalizes each word</li>
                  <li>• Copy or download results for later use</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}