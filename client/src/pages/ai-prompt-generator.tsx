import { useState } from "react";
import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Copy, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface PromptSetting {
  id: string;
  label: string;
  options: string[];
}

const promptSettings: PromptSetting[] = [
  {
    id: "instruction",
    label: "Instruction",
    options: ["Write", "Explain", "Analyze", "Summarize", "Create", "Generate", "Review", "Compare", "Translate", "Debug"]
  },
  {
    id: "role",
    label: "Role/Persona",
    options: ["Developer", "Teacher", "Coach", "Lawyer", "Doctor", "Consultant", "Expert", "Assistant", "Researcher", "Analyst"]
  },
  {
    id: "tone",
    label: "Tone",
    options: ["Professional", "Casual", "Friendly", "Formal", "Empathetic", "Enthusiastic", "Authoritative", "Conversational", "Serious", "Humorous"]
  },
  {
    id: "style",
    label: "Style",
    options: ["Bullet Points", "Numbered List", "Conversational", "Academic", "Technical", "Narrative", "Step-by-step", "Q&A", "Structured", "Creative"]
  },
  {
    id: "format",
    label: "Output Format",
    options: ["CSV", "JSON", "Table", "YAML", "Markdown", "HTML", "Plain Text", "Code", "List", "Paragraph"]
  },
  {
    id: "length",
    label: "Length",
    options: ["Very Short", "Short", "Medium", "Long", "Very Long", "Detailed", "Concise", "Brief", "Comprehensive", "Extensive"]
  },
  {
    id: "audience",
    label: "Target Audience",
    options: ["Children", "Teenagers", "Adults", "Professionals", "Experts", "Beginners", "Students", "General Public", "Specialists", "Executives"]
  },
  {
    id: "languageLevel",
    label: "Language Level",
    options: ["Simple English", "Intermediate", "Advanced", "Technical", "Academic", "Conversational", "Basic", "Professional", "Expert", "Layman"]
  },
  {
    id: "creativity",
    label: "Creativity Level",
    options: ["Factual", "Creative", "Innovative", "Traditional", "Imaginative", "Logical", "Artistic", "Analytical", "Funny", "Serious"]
  },
  {
    id: "responseFormat",
    label: "Response Structure",
    options: ["Table", "YAML", "JSON", "XML", "Outline", "Essay", "Report", "Summary", "Guide", "Tutorial"]
  },
  {
    id: "purpose",
    label: "Response Purpose",
    options: ["Education", "Business", "Entertainment", "Research", "Training", "Documentation", "Planning", "Analysis", "Problem-solving", "Decision-making"]
  },
  {
    id: "focus",
    label: "Output Focus",
    options: ["Accuracy", "Simplicity", "Completeness", "Clarity", "Speed", "Detail", "Overview", "Practicality", "Innovation", "Efficiency"]
  },
  {
    id: "voice",
    label: "Answer Voice",
    options: ["First Person", "Second Person", "Third Person", "Neutral", "Personal", "Objective", "Subjective", "Character Voice", "Narrator", "Expert Voice"]
  },
  {
    id: "constraints",
    label: "Constraints",
    options: ["Word Limit", "Time Sensitive", "Budget Conscious", "Resource Limited", "Specific Domain", "No Jargon", "Include Examples", "Avoid Bias", "Fact-based Only", "Include Sources"]
  },
  {
    id: "structure",
    label: "Content Structure",
    options: ["Introduction-Body-Conclusion", "Problem-Solution", "Cause-Effect", "Compare-Contrast", "Chronological", "Priority Order", "Category-based", "Process Flow", "Hierarchical", "Matrix"]
  },
  {
    id: "detail",
    label: "Detail Level",
    options: ["High-level Overview", "Detailed Analysis", "Technical Deep-dive", "Surface Level", "Comprehensive", "Specific Examples", "General Concepts", "Case Studies", "Best Practices", "Step-by-step"]
  },
  {
    id: "perspective",
    label: "Perspective",
    options: ["Neutral", "Optimistic", "Critical", "Balanced", "Skeptical", "Supportive", "Objective", "Subjective", "Multiple Viewpoints", "Single Focus"]
  },
  {
    id: "context",
    label: "Context Consideration",
    options: ["Current Trends", "Historical Context", "Future Implications", "Industry Standards", "Regional Differences", "Cultural Sensitivity", "Technology Impact", "Market Conditions", "Regulatory Environment", "Social Impact"]
  },
  {
    id: "examples",
    label: "Examples & Evidence",
    options: ["Include Examples", "Real-world Cases", "Statistical Data", "Research Citations", "Expert Quotes", "Analogies", "Comparisons", "Visual Descriptions", "Practical Applications", "Hypothetical Scenarios"]
  },
  {
    id: "actionability",
    label: "Actionability",
    options: ["Actionable Steps", "Theoretical Only", "Practical Tips", "Implementation Guide", "Next Steps", "Recommendations", "Decision Framework", "Evaluation Criteria", "Success Metrics", "Timeline"]
  },
  {
    id: "urgency",
    label: "Urgency Level",
    options: ["Immediate", "Urgent", "Standard", "Flexible", "Low Priority", "Time-critical", "Deadline-driven", "Planned", "Scheduled", "As-needed"]
  },
  {
    id: "complexity",
    label: "Complexity Level",
    options: ["Simple", "Moderate", "Complex", "Advanced", "Expert-level", "Beginner-friendly", "Intermediate", "Multi-layered", "Straightforward", "Nuanced"]
  }
];

export default function AIPromptGenerator() {
  const [selectedSettings, setSelectedSettings] = useState<Record<string, string[]>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const { toast } = useToast();

  const handleSettingChange = (settingId: string, option: string, checked: boolean) => {
    setSelectedSettings(prev => {
      const current = prev[settingId] || [];
      if (checked) {
        return { ...prev, [settingId]: [...current, option] };
      } else {
        return { ...prev, [settingId]: current.filter(item => item !== option) };
      }
    });
  };

  const generatePromptSettings = () => {
    const settingsArray: string[] = [];
    
    Object.entries(selectedSettings).forEach(([settingId, options]) => {
      if (options.length > 0) {
        const setting = promptSettings.find(s => s.id === settingId);
        if (setting) {
          settingsArray.push(`${setting.label}: ${options.join(" | ")}`);
        }
      }
    });

    if (settingsArray.length === 0) {
      setGeneratedPrompt("Please select at least one setting option to generate prompt settings.");
      return;
    }

    const prompt = `[SETTINGS]\n${settingsArray.join("\n")}\n\n[YOUR PROMPT]\n(Replace this with your actual question or request)`;
    setGeneratedPrompt(prompt);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: "Copied!",
        description: "Prompt settings copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy prompt settings to clipboard",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setSelectedSettings({});
    setGeneratedPrompt("");
  };

  const selectCommonSettings = () => {
    setSelectedSettings({
      instruction: ["Write"],
      role: ["Expert"],
      tone: ["Professional"],
      style: ["Structured"],
      length: ["Medium"],
      audience: ["Professionals"],
      languageLevel: ["Professional"],
      focus: ["Clarity"],
      examples: ["Include Examples"]
    });
  };

  return (
    <>
      <SEOHead 
        title="AI Prompt Settings Generator - Create Perfect LLM Prompts | AppsThatMatter"
        description="Generate comprehensive prompt settings for ChatGPT, Gemini, and other LLMs with 20+ customizable parameters including tone, style, format, and more."
        keywords="AI prompt generator, ChatGPT prompts, LLM settings, prompt engineering, AI assistant, prompt template"
      />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--neo-bg)' }}>
        <Header />
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors no-underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Apps
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="neumorphic-inset w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-xl">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">AI Prompt Settings Generator</h1>
            <p className="text-muted-foreground">Create comprehensive prompt settings for ChatGPT, Gemini, and other LLMs</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="neumorphic mb-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common settings and controls</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <Button onClick={selectCommonSettings} className="neumorphic-button">
                    Load Common Settings
                  </Button>
                  <Button onClick={clearAll} variant="outline" className="neumorphic-button">
                    Clear All
                  </Button>
                  <Button onClick={generatePromptSettings} className="neumorphic-button">
                    Generate Prompt Settings
                  </Button>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {promptSettings.map((setting) => (
                  <Card key={setting.id} className="neumorphic">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{setting.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {setting.options.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${setting.id}-${option}`}
                              checked={selectedSettings[setting.id]?.includes(option) || false}
                              onCheckedChange={(checked) => 
                                handleSettingChange(setting.id, option, checked as boolean)
                              }
                            />
                            <Label 
                              htmlFor={`${setting.id}-${option}`}
                              className="text-sm cursor-pointer"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="neumorphic sticky top-24">
                <CardHeader>
                  <CardTitle>Generated Prompt Settings</CardTitle>
                  <CardDescription>Copy and paste into your LLM</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedPrompt ? (
                    <>
                      <div className="neumorphic-inset p-4 rounded-lg">
                        <Textarea
                          value={generatedPrompt}
                          readOnly
                          className="border-none bg-transparent resize-none min-h-[300px] text-xs"
                        />
                      </div>
                      <Button onClick={copyPrompt} className="neumorphic-button w-full">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Settings
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-muted-foreground text-sm">
                        Select settings from the options on the left and click "Generate Prompt Settings" to create your custom prompt template.
                      </p>
                    </div>
                  )}

                  <div className="neumorphic-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">How to Use</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Select relevant options for each parameter</li>
                      <li>• Click "Generate Prompt Settings"</li>
                      <li>• Copy the generated settings</li>
                      <li>• Paste before your question in ChatGPT/Gemini</li>
                      <li>• Replace [YOUR PROMPT] with your actual question</li>
                    </ul>
                  </div>

                  <div className="neumorphic-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Selection Summary</h4>
                    <div className="text-xs text-muted-foreground">
                      {Object.values(selectedSettings).reduce((total, options) => total + options.length, 0)} options selected across {Object.keys(selectedSettings).length} parameters
                    </div>
                  </div>
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