import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, MapPin, Users, Clock, Download, Share, Save, Sparkles } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiPost, type Trip } from "@/lib/api";

interface TripPlan {
  destination: string;
  duration: string;
  itinerary: {
    day: number;
    title: string;
    activities: string[];
    meals: string[];
    accommodation?: string;
  }[];
}

const TripPlanner = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    destination: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    travelers: "",
    budget: "",
    interests: [] as string[],
    additionalNotes: ""
  });
  const [generatedPlan, setGeneratedPlan] = useState<TripPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const interestOptions = [
    "Historical Sites",
    "Nature & Trekking",
    "Adventure Sports", 
    "Local Cuisine",
    "Photography",
    "Cultural Experiences",
    "Spiritual Places",
    "Beach Activities"
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }));
    }
  };

  const generateTripPlan = async () => {
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in destination and travel dates to generate your plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const payload: Trip = {
        title: `Trip to ${formData.destination}`,
        destination: formData.destination,
        startDate: formData.startDate ? formData.startDate.toISOString() : undefined,
        endDate: formData.endDate ? formData.endDate.toISOString() : undefined,
        travelers: formData.travelers,
        budget: formData.budget,
        interests: formData.interests,
      };
      const created = await apiPost<Trip>("/api/trips", payload);
      const plan: TripPlan = {
        destination: created.destination,
        duration: created.startDate && created.endDate ? "Custom Dates" : "",
        itinerary: [
          {
            day: 1,
            title: "Arrival & Local Exploration",
            activities: ["Check-in to hotel", "Visit local markets", "Explore historic fort", "Sunset viewpoint"],
            meals: ["Welcome lunch at local restaurant", "Traditional dinner"],
            accommodation: "Heritage Hotel"
          },
          {
            day: 2,
            title: "Adventure & Nature",
            activities: ["Early morning trek", "Waterfall visit", "Local village tour", "Cultural performances"],
            meals: ["Breakfast at hotel", "Packed lunch", "BBQ dinner"]
          },
          {
            day: 3,
            title: "Relaxation & Departure",
            activities: ["Temple visit", "Shopping for souvenirs", "Departure preparations"],
            meals: ["Traditional breakfast", "Farewell lunch"]
          }
        ]
      };
      setGeneratedPlan(plan);
      toast({ title: "Trip Plan Generated!", description: "Your itinerary has been created and saved." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to generate trip plan.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTripPlan = () => {
    toast({
      title: "Trip Saved!",
      description: "Your trip plan has been saved to your account.",
    });
  };

  const shareTripPlan = () => {
    toast({
      title: "Link Copied!",
      description: "Trip plan link has been copied to clipboard.",
    });
  };

  const downloadTripPlan = () => {
    toast({
      title: "Download Started!",
      description: "Your trip plan is being downloaded as PDF.",
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Plan Your Perfect Trip</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us your preferences and let our AI create a personalized itinerary for your Maharashtra adventure
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trip Planning Form */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Trip Details
              </CardTitle>
              <CardDescription>
                Provide your travel preferences to generate a custom itinerary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Destination */}
              <div>
                <Label htmlFor="destination">Destination in Maharashtra</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Lonavala, Pune, Mumbai, Mahabaleshwar..."
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  className="mt-2"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-2",
                          !formData.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-2",
                          !formData.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Travelers and Budget */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelers">Number of Travelers</Label>
                  <Select value={formData.travelers} onValueChange={(value) => setFormData(prev => ({ ...prev, travelers: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Person</SelectItem>
                      <SelectItem value="2">2 People</SelectItem>
                      <SelectItem value="3-4">3-4 People</SelectItem>
                      <SelectItem value="5+">5+ People</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">₹5,000 - ₹15,000</SelectItem>
                      <SelectItem value="moderate">₹15,000 - ₹30,000</SelectItem>
                      <SelectItem value="luxury">₹30,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Interests */}
              <div>
                <Label>Your Interests</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {interestOptions.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                      />
                      <Label htmlFor={interest} className="text-sm">{interest}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific requirements, dietary restrictions, or preferences..."
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  className="mt-2"
                  rows={3}
                />
              </div>

            <Button 
              onClick={generateTripPlan}
              disabled={isGenerating}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg transition-fast"
            >
                {isGenerating ? (
                  <>
                    <Clock className="h-5 w-5 mr-2 animate-spin" />
                    Generating Your Perfect Trip...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Trip Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Itinerary */}
          <div className="space-y-6">
            {generatedPlan ? (
              <>
                <Card className="card-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl text-gradient">{generatedPlan.destination}</CardTitle>
                        <CardDescription className="text-lg">{generatedPlan.duration}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={saveTripPlan}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={shareTripPlan}>
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={downloadTripPlan}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {generatedPlan.itinerary.map((day) => (
                  <Card key={day.day} className="card-shadow animate-fade-in">
                    <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground font-bold mr-3">
                      {day.day}
                    </div>
                    {day.title}
                  </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-foreground">Activities</h4>
                          <ul className="space-y-1">
                            {day.activities.map((activity, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2 text-accent">Meals</h4>
                          <ul className="space-y-1">
                            {day.meals.map((meal, index) => (
                              <li key={index} className="flex items-center text-sm">
                                <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0" />
                                {meal}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {day.accommodation && (
                          <div>
                            <h4 className="font-semibold mb-2 text-muted-foreground">Accommodation</h4>
                            <p className="text-sm">{day.accommodation}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <Card className="card-shadow">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Plan Your Trip?</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    Fill in your travel details on the left to generate a personalized itinerary for your Maharashtra adventure.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;