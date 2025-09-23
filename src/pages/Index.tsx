import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Mountain, Waves, UtensilsCrossed, Camera, Users, Star, Clock, Castle } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      title: "Historical Landmarks",
      description: "Explore ancient forts, caves, and monuments",
      icon: Castle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      route: "/explore/historical"
    },
    {
      title: "Nature & Treks",
      description: "Discover hill stations, waterfalls, and trails",
      icon: Mountain,
      color: "text-green-600",
      bgColor: "bg-green-50",
      route: "/explore/nature"
    },
    {
      title: "Adventure Spots",
      description: "Thrilling activities and weekend getaways",
      icon: Waves,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      route: "/explore/adventure"
    },
    {
      title: "Local Cuisine",
      description: "Savor authentic Maharashtrian flavors",
      icon: UtensilsCrossed,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      route: "/explore/cuisine"
    }
  ];

  const popularDestinations = [
    { name: "Mumbai to Lonavala", duration: "2 Days", rating: 4.8, icon: Mountain, color: "text-green-600" },
    { name: "Pune to Mahabaleshwar", duration: "3 Days", rating: 4.7, icon: Mountain, color: "text-green-600" },
    { name: "Aurangabad Caves Tour", duration: "2 Days", rating: 4.9, icon: Castle, color: "text-amber-600" },
    { name: "Konkan Coast Adventure", duration: "4 Days", rating: 4.6, icon: Waves, color: "text-blue-600" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to trip planner with search query
      window.location.href = `/plan-trip?destination=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Explore Maharashtra
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the beauty, history, and culture of Maharashtra with personalized trip planning
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Where do you want to go in Maharashtra?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-28 py-4 text-base bg-card border border-border rounded-lg shadow-soft focus:shadow transition-fast"
              />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-fast"
              >
                Search
              </Button>
            </div>
          </form>
          
          <Link to="/plan-trip">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg shadow-soft hover:shadow transition-fast">
              <MapPin className="h-5 w-5 mr-2" />
              Start Planning Your Trip
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Explore by Category</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your adventure and discover what Maharashtra has to offer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.title} to={category.route}>
                <Card className="group cursor-pointer h-full transition-fast hover:card-shadow-hover hover:-translate-y-1 border border-border">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${category.bgColor} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                      <category.icon className={`h-8 w-8 ${category.color}`} />
                    </div>
                    <CardTitle className="text-lg text-center mb-2">{category.title}</CardTitle>
                    <CardDescription className="text-sm text-center">{category.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Popular Weekend Trips</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ready-made itineraries for your perfect getaway
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <Card key={destination.name} className="cursor-pointer transition-fast hover:card-shadow-hover hover:-translate-y-1 border border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                      <destination.icon className={`h-6 w-6 ${destination.color}`} />
                    </div>
                    <div className="flex items-center bg-secondary rounded-full px-3 py-1">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{destination.name}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{destination.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/explore">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-lg transition-fast">
                View All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Choose Maharashtra Explorer?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Trip Planning</h3>
              <p className="text-muted-foreground">AI-powered itineraries tailored to your interests and schedule</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Local Insights</h3>
              <p className="text-muted-foreground">Discover hidden gems and authentic experiences from locals</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Camera className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Rich Content</h3>
              <p className="text-muted-foreground">Beautiful photos, detailed guides, and curated recommendations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;