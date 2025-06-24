import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="py-12 mt-16">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="neumorphic p-8 text-center">
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors font-medium no-underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors font-medium no-underline">
              Terms of Service
            </Link>
            <Link href="/support" className="text-muted-foreground hover:text-primary transition-colors font-medium no-underline">
              Support
            </Link>
            <Link href="/api" className="text-muted-foreground hover:text-primary transition-colors font-medium no-underline">
              API
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors font-medium no-underline">
              Blog
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; 2024 AppsThatMatter. All rights reserved. Making digital tools that truly matter.
          </p>
        </div>
      </div>
    </footer>
  );
}
