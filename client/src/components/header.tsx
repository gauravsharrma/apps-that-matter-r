import { Link } from "wouter";

export function Header() {
  return (
    <header className="py-6 sticky top-0 z-50" style={{ backgroundColor: 'var(--neo-bg)' }}>
      <div className="container max-w-6xl mx-auto px-4">
        <nav className="neumorphic px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-primary no-underline">
              AppsThatMatter
            </Link>
            <ul className="hidden md:flex space-x-8">
              <li>
                <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium no-underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#apps" className="text-foreground hover:text-primary transition-colors font-medium no-underline">
                  Apps
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium no-underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium no-underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
