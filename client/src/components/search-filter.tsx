import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const categories = [
  { key: "all", label: "All Apps" },
  { key: "Finance", label: "Finance" },
  { key: "Health", label: "Health" },
  { key: "Utilities", label: "Utilities" },
  { key: "AI Tools", label: "AI Tools" },
  { key: "Productivity", label: "Productivity" },
];

export function SearchFilter({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}: SearchFilterProps) {
  return (
    <section className="py-8 mb-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="neumorphic-inset p-4 mb-8 relative">
          <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            placeholder="Search apps by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-14 pr-4 py-3 text-base border-none bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`neumorphic-button px-6 py-3 text-sm font-medium text-foreground ${
                activeCategory === category.key ? "active" : ""
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
