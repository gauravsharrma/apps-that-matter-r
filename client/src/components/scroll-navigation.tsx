import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ScrollNavigationProps {
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export function ScrollNavigation({ position = 'bottom-left' }: ScrollNavigationProps) {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Show scroll to top if user has scrolled down more than 100px
      setShowScrollToTop(scrollTop > 100);
      
      // Show scroll to bottom if user is not at the bottom (with 100px threshold)
      setShowScrollToBottom(scrollTop + windowHeight < documentHeight - 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  const getPositionClasses = () => {
    const baseClasses = "fixed z-50 flex flex-col gap-2";
    switch (position) {
      case 'bottom-left':
        return `${baseClasses} bottom-4 left-4`;
      case 'bottom-right':
        return `${baseClasses} bottom-4 right-4`;
      case 'top-left':
        return `${baseClasses} top-20 left-4`;
      case 'top-right':
        return `${baseClasses} top-20 right-4`;
      default:
        return `${baseClasses} bottom-4 left-4`;
    }
  };

  if (!showScrollToTop && !showScrollToBottom) {
    return null;
  }

  return (
    <div className={getPositionClasses()}>
      {showScrollToTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="neumorphic-button h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          title="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
      {showScrollToBottom && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="neumorphic-button h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          title="Scroll to bottom"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}