import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, X, Compass, Map, Bookmark, PlaneTakeoff } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: MapPin },
    { path: "/plan-trip", label: "Plan Trip", icon: PlaneTakeoff },
    { path: "/explore", label: "Explore", icon: Compass },
    { path: "/saved-trips", label: "Saved Trips", icon: Bookmark },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2 rounded-lg transition-fast group-hover:scale-105">
              <Map className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Maharashtra Explorer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={isActive(path) ? "default" : "ghost"}
                  className={`transition-fast ${
                    isActive(path) 
                      ? "bg-primary text-primary-foreground shadow-soft" 
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link 
                  key={path} 
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant={isActive(path) ? "default" : "ghost"}
                    className={`w-full justify-start transition-fast ${
                      isActive(path) 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;