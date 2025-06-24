import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="py-6 sticky top-0 z-50" style={{ backgroundColor: 'var(--neo-bg)' }}>
      <div className="container max-w-6xl mx-auto px-4">
        <nav className="neumorphic px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl md:text-2xl font-bold text-primary no-underline">
              AppsThatMatter
            </Link>
            
            <div className="flex items-center space-x-4 md:space-x-8">
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
              </ul>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user?.picture} alt={user?.name} />
                        <AvatarFallback>
                          {user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.name}</p>
                        <p className="w-[200px] truncate text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="neumorphic-button">
                  <Link href="/login">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
