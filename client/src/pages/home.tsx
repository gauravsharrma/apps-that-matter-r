import { SEOHead } from "@/lib/seo";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { SearchFilter } from "@/components/search-filter";
import { AppsGrid } from "@/components/apps-grid";
import { Footer } from "@/components/footer";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <>
      <SEOHead 
        title="AppsThatMatter - Discover Essential Utility Apps"
        description="Discover essential utility apps including EMI calculator, BMI calculator, and more. Find the perfect tools for your daily needs."
        keywords="utility apps, calculator apps, EMI calculator, BMI calculator, finance tools, productivity apps"
      />
      <div className="min-h-screen" style={{ backgroundColor: 'var(--neo-bg)' }}>
        <Header />
        <main>
          <Hero />
          <SearchFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
          <AppsGrid
            searchQuery={searchQuery}
            activeCategory={activeCategory}
          />
        </main>
        <Footer />
      </div>
    </>
  );
}
