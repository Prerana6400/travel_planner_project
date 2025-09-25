import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Clock, Camera, Mountain, Waves, UtensilsCrossed, Filter } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import historicalLandmarks from "@/assets/historical-landmarks.jpg";
import natureTreks from "@/assets/nature-treks.jpg";
import adventureSpots from "@/assets/adventure-spots.jpg";
import localCuisine from "@/assets/local-cuisine.jpg";
import { useQuery } from "@tanstack/react-query";
import { apiGet, type Destination } from "@/lib/api";

const Explore = () => {
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [sortBy, setSortBy] = useState("popular");

  const categories = [
    { id: "all", name: "All Categories", icon: MapPin },
    { id: "historical", name: "Historical Landmarks", icon: Camera },
    { id: "nature", name: "Nature & Treks", icon: Mountain },
    { id: "adventure", name: "Adventure Spots", icon: Waves },
    { id: "cuisine", name: "Local Cuisine", icon: UtensilsCrossed }
  ];

  const categoryParam = selectedCategory;
  const queryKey = useMemo(() => ["destinations", { categoryParam, searchQuery, sortBy }], [categoryParam, searchQuery, sortBy]);
  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryParam && categoryParam !== "all") params.set("category", categoryParam);
      if (searchQuery) params.set("q", searchQuery);
      // sortBy not implemented on API yet; could be client-side
      const res = await apiGet<{ items: Destination[]; total: number; page: number; limit: number }>(`/api/destinations?${params.toString()}`);
      return res;
    }
  });
  const destinations = data?.items || [];

  const [selected, setSelected] = useState<Destination | null>(null);
  const imageFor = (d: Destination) =>
    d.category === "historical"
      ? historicalLandmarks
      : d.category === "nature"
      ? natureTreks
      : d.category === "adventure"
      ? adventureSpots
      : localCuisine;

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const currentCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || "All Categories";

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Explore {currentCategoryName}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing destinations, activities, and experiences across Maharashtra
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 card-shadow">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Search */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search Destinations</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="min-w-48">
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center">
                        <cat.icon className="h-4 w-4 mr-2" />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="min-w-40">
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(cat => (
              <Button
                onClick={() => setSelectedCategory(cat.id)}
                className={`transition-fast ${
                  selectedCategory === cat.id 
                    ? "bg-primary text-primary-foreground shadow-soft" 
                    : "hover:bg-muted"
                }`}
              >
              <cat.icon className="h-4 w-4 mr-2" />
              {cat.name}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {isLoading ? "Loading destinations..." : `Showing ${destinations.length} destinations${selectedCategory !== "all" ? ` in ${currentCategoryName}` : ""}`}
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Card key={(destination as any).id || destination._id} className="group cursor-pointer transition-smooth hover:card-shadow-hover hover:-translate-y-1 overflow-hidden">
              <div className="relative h-48">
                <img
                  src={destination.category === "historical" ? historicalLandmarks : destination.category === "nature" ? natureTreks : destination.category === "adventure" ? adventureSpots : localCuisine}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  <span className="text-xs font-medium">{destination.rating}</span>
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-medium text-white">{destination.price}</span>
                </div>

                {/* Location */}
                <div className="absolute bottom-4 left-4 flex items-center text-white">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{destination.location}</span>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1">{destination.name}</CardTitle>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{destination.duration}</span>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {destination.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.highlights?.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => setSelected(destination)} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-fast">
                    View Details
                  </Button>
                  <Link to="/plan-trip">
                    <Button variant="outline" size="sm">
                      Add to Trip
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {!isLoading && destinations.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => {setSearchQuery(""); setSelectedCategory("all");}}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {destinations.length > 0 && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-lg transition-fast">
              Load More Destinations
            </Button>
          </div>
        )}

        {/* Details Modal */}
        <AlertDialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">
                {selected?.name}
              </AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div>
                  {selected && (
                    <div className="space-y-4">
                      <div className="relative h-56 w-full rounded-md overflow-hidden">
                        <img src={selected ? imageFor(selected) : undefined} alt={selected?.name || ""} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-primary/90 text-white text-xs rounded-full px-3 py-1">{selected?.price}</div>
                        <div className="absolute top-3 right-3 bg-white/90 text-xs rounded-full px-2 py-1 flex items-center"><Star className="h-3 w-3 text-yellow-500 mr-1" />{selected?.rating}</div>
                      </div>

                      <div className="flex items-center text-muted-foreground gap-4">
                        <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {selected?.location}</div>
                        <div className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {selected?.duration}</div>
                      </div>

                      {selected?.description && (
                        <p className="text-sm text-foreground/80">{selected.description}</p>
                      )}

                      {selected?.highlights && selected.highlights.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selected.highlights.map((h, idx) => (
                            <span key={idx} className="text-xs bg-secondary rounded-full px-3 py-1">{h}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelected(null)}>Close</AlertDialogCancel>
              <AlertDialogAction asChild>
                <a href="/plan-trip" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground">
                  Add to Trip
                </a>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Explore;