import { useQuery } from "@tanstack/react-query";
import { type App } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { getIconComponent } from "@/lib/utils";
import { Link } from "wouter";
import { useMemo } from "react";

interface AppsGridProps {
  searchQuery: string;
  activeCategory: string;
}

const getAppUrl = (appName: string): string => {
  const urlMap: Record<string, string> = {
    "EMI Calculator": "/emi-calculator",
    "BMI Calculator": "/bmi-calculator",
    "Pomodoro Timer": "/pomodoro-timer",
    "SIP Calculator": "/sip-calculator",
    "Text Formatter": "/text-formatter",
    "AI Text Extractor": "/ai-text-extractor",
    "Color Palette Generator": "/color-palette-generator",
    "Currency Converter": "/currency-converter",
    "QR Code Generator": "/qr-code-generator",
    "Water Intake Tracker": "/water-intake-tracker",
    "AI Language Detector": "/ai-language-detector",
    "Task Prioritizer": "/task-prioritizer",
    "AI Prompt Generator": "/ai-prompt-generator"
  };
  return urlMap[appName] || "#";
};

export function AppsGrid({ searchQuery, activeCategory }: AppsGridProps) {
  const { data: apps, isLoading } = useQuery<App[]>({
    queryKey: ["/api/apps"],
  });

  const filteredApps = useMemo(() => {
    if (!apps) return [];
    
    let filtered = apps;
    
    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(app => app.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [apps, activeCategory, searchQuery]);

  if (isLoading) {
    return (
      <section className="pb-16" id="apps">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="neumorphic p-8">
                <Skeleton className="w-16 h-16 mx-auto mb-6 rounded-xl" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mx-auto mb-4" />
                <Skeleton className="h-6 w-20 mx-auto rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!filteredApps || filteredApps.length === 0) {
    return (
      <section className="pb-16" id="apps">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="neumorphic p-12 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2 text-foreground">No apps found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 
                  `No apps match your search for "${searchQuery}"` : 
                  `No apps found in the ${activeCategory} category`
                }
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-16" id="apps">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredApps.map((app) => {
            const IconComponent = getIconComponent(app.icon);
            return (
              <Link
                key={app.id}
                href={getAppUrl(app.name)}
                className="block no-underline"
              >
                <div className="neumorphic app-card-hover p-8 cursor-pointer">
                <div className="neumorphic-inset w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-xl">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center text-foreground">
                  {app.name}
                </h3>
                <p className="text-muted-foreground mb-4 text-center text-sm leading-relaxed">
                  {app.description}
                </p>
                <div className="flex justify-center">
                  <span className="neumorphic-inset px-3 py-1 text-xs font-medium text-primary rounded-full">
                    {app.category}
                  </span>
                </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
