import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Users, Share, Download, Trash2, Edit, Heart, Clock, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiGet, type Trip } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import maharashtraHero from "@/assets/maharashtra-hero.jpg";
import historicalLandmarks from "@/assets/historical-landmarks.jpg";
import natureTreks from "@/assets/nature-treks.jpg";

const SavedTrips = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("saved-trips");

  // Load saved trips from backend
  const { data: tripsData, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: async () => apiGet<{ items: Trip[]; total: number }>("/api/trips"),
  });
  
  const savedTrips = useMemo(() => {
    const raw = tripsData?.items ?? [];
    return raw.map((t: any) => {
      const start = t.startDate ? new Date(t.startDate) : undefined;
      const end = t.endDate ? new Date(t.endDate) : undefined;
      const durationDays = start && end ? Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) : undefined;
      return {
        ...t,
        id: t.id || t._id,
        image: t.imageUrl || maharashtraHero,
        dates: start && end ? `${start.toLocaleDateString()} - ${end.toLocaleDateString()}` : "Custom Dates",
        duration: durationDays ? `${durationDays} Day${durationDays > 1 ? "s" : ""}` : "",
        highlights: Array.isArray(t.interests) ? t.interests : [],
        status: t.status || "upcoming",
      };
    });
  }, [tripsData]);

  // Mock favorite destinations
  const favoriteDestinations = [
    {
      id: 1,
      name: "Shivneri Fort",
      location: "Junnar",
      rating: 4.6,
      image: historicalLandmarks,
      category: "Historical"
    },
    {
      id: 2,
      name: "Lonavala Hills",
      location: "Lonavala", 
      rating: 4.8,
      image: natureTreks,
      category: "Nature"
    }
  ];

  const handleShare = (tripId: number) => {
    toast({
      title: "Link Copied!",
      description: "Trip sharing link has been copied to clipboard.",
    });
  };

  const handleDownload = (tripId: number) => {
    toast({
      title: "Download Started!",
      description: "Your trip itinerary is being downloaded as PDF.",
    });
  };

  const handleDelete = (tripId: string | number) => {
    toast({
      title: "Trip Deleted",
      description: "The trip has been removed from your saved trips.",
    });
  };

  const formatDates = (trip: Trip) => {
    if (trip.startDate && trip.endDate) {
      return `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`;
    }
    return "Custom Dates";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-secondary text-secondary-foreground";
      case "completed": return "bg-accent text-accent-foreground";
      case "draft": return "bg-muted text-muted-foreground border-2 border-dashed border-border";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming": return "Upcoming";
      case "completed": return "Completed";
      case "draft": return "Draft";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Your Travel Collection</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your saved trips, favorite destinations, and travel memories
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="saved-trips" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Saved Trips ({savedTrips.length})
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Favorites ({favoriteDestinations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved-trips" className="space-y-6">
            {savedTrips.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedTrips.map((trip) => (
                  <Card key={trip.id} className="card-shadow hover:card-shadow-hover transition-smooth overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                        {getStatusText(trip.status)}
                      </div>

                      {/* Budget */}
                      <div className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-xs font-medium text-white">{trip.budget}</span>
                      </div>

                      {/* Destination */}
                      <div className="absolute bottom-4 left-4 flex items-center text-white">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{trip.destination}</span>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl">{trip.title}</CardTitle>
                      <CardDescription className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          {trip.dates}
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          {trip.duration}
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2" />
                          {trip.travelers} travelers
                        </div>
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {trip.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleShare(trip.id)}>
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(trip.id)}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(trip.id)}
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16">
                <CardContent>
                  <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Saved Trips Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start planning your first trip to Maharashtra and save it here
                  </p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <MapPin className="h-4 w-4 mr-2" />
                    Plan Your First Trip
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            {favoriteDestinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteDestinations.map((destination) => (
                  <Card key={destination.id} className="card-shadow hover:card-shadow-hover transition-smooth cursor-pointer overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Rating */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="text-xs font-medium">{destination.rating}</span>
                      </div>

                      {/* Heart Icon */}
                      <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm rounded-full p-2">
                        <Heart className="h-4 w-4 text-white fill-current" />
                      </div>

                      {/* Location */}
                      <div className="absolute bottom-4 left-4 flex items-center text-white">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">{destination.location}</span>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg">{destination.name}</CardTitle>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {destination.category}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        View Details
                      </Button>
                        <Button variant="outline" size="sm">
                          Add to Trip
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16">
                <CardContent>
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Favorite Destinations</h3>
                  <p className="text-muted-foreground mb-6">
                    Explore destinations and add them to your favorites
                  </p>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Heart className="h-4 w-4 mr-2" />
                    Explore Destinations
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SavedTrips;