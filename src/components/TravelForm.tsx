
import React, { useState, useEffect } from "react";
import { useInsuranceContext } from "@/context/InsuranceContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, Calendar, Users, Mountain } from "lucide-react";
import { toast } from "sonner";

const TravelForm = () => {
  const { travelData, setTravelData, setCurrentStep } = useInsuranceContext();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Create a state to manage traveler ages
  const [ages, setAges] = useState<string[]>(
    Array(travelData.travelers)
      .fill("")
      .map((_, i) => String(travelData.travelerAges[i] || ""))
  );

  // Update ages when travelers count changes
  useEffect(() => {
    if (travelData.travelers !== ages.length) {
      const newAges = Array(travelData.travelers).fill("");
      for (let i = 0; i < Math.min(ages.length, travelData.travelers); i++) {
        newAges[i] = ages[i];
      }
      setAges(newAges);
    }
  }, [travelData.travelers]);

  const activities = [
    { id: "hiking", label: "Hiking" },
    { id: "skiing", label: "Skiing" },
    { id: "diving", label: "Scuba Diving" },
    { id: "climbing", label: "Rock Climbing" },
    { id: "surfing", label: "Surfing" },
  ];

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!travelData.destination) {
      errors.destination = "Please enter your destination";
    }

    if (!travelData.departureDate) {
      errors.departureDate = "Please select a departure date";
    }

    if (!travelData.returnDate) {
      errors.returnDate = "Please select a return date";
    } else if (
      new Date(travelData.returnDate) <= new Date(travelData.departureDate)
    ) {
      errors.returnDate = "Return date must be after departure date";
    }

    // Validate all traveler ages are entered
    for (let i = 0; i < ages.length; i++) {
      if (!ages[i]) {
        errors[`age-${i}`] = "Please enter age";
      } else if (isNaN(Number(ages[i])) || Number(ages[i]) <= 0 || Number(ages[i]) > 120) {
        errors[`age-${i}`] = "Please enter a valid age";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert ages from strings to numbers
    const travelerAges = ages.map(age => Number(age)).filter(age => !isNaN(age));
    
    // Update travel data with the ages
    setTravelData({
      ...travelData,
      travelerAges,
    });

    if (validateForm()) {
      setCurrentStep("quote");
      toast.success("Quote generated successfully!");
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  const handleActivityChange = (activityId: string, checked: boolean) => {
    if (checked) {
      setTravelData({
        ...travelData,
        activities: [...travelData.activities, activityId],
      });
    } else {
      setTravelData({
        ...travelData,
        activities: travelData.activities.filter((id) => id !== activityId),
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Tell us about your trip</CardTitle>
        <CardDescription>
          Provide the details below to get personalized travel insurance quotes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="destination">Destination</Label>
              </div>
              <Select
                value={travelData.destination}
                onValueChange={(value) =>
                  setTravelData({ ...travelData, destination: value })
                }
              >
                <SelectTrigger id="destination" className={formErrors.destination ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select your destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="africa">Africa</SelectItem>
                  <SelectItem value="southamerica">South America</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.destination && <p className="text-red-500 text-xs mt-1">{formErrors.destination}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="travelers">Number of Travelers</Label>
              </div>
              <Select
                value={String(travelData.travelers)}
                onValueChange={(value) =>
                  setTravelData({ ...travelData, travelers: parseInt(value) })
                }
              >
                <SelectTrigger id="travelers">
                  <SelectValue placeholder="Select number of travelers" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num} {num === 1 ? "traveler" : "travelers"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="departureDate">Departure Date</Label>
              </div>
              <Input
                type="date"
                id="departureDate"
                min={new Date().toISOString().split("T")[0]}
                value={travelData.departureDate}
                onChange={(e) =>
                  setTravelData({ ...travelData, departureDate: e.target.value })
                }
                className={formErrors.departureDate ? "border-red-500" : ""}
              />
              {formErrors.departureDate && <p className="text-red-500 text-xs mt-1">{formErrors.departureDate}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="returnDate">Return Date</Label>
              </div>
              <Input
                type="date"
                id="returnDate"
                min={travelData.departureDate || new Date().toISOString().split("T")[0]}
                value={travelData.returnDate}
                onChange={(e) =>
                  setTravelData({ ...travelData, returnDate: e.target.value })
                }
                className={formErrors.returnDate ? "border-red-500" : ""}
              />
              {formErrors.returnDate && <p className="text-red-500 text-xs mt-1">{formErrors.returnDate}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <Users className="mr-2 h-4 w-4 text-primary" />
                <h3 className="text-base font-medium">Traveler Ages</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Array.from({ length: travelData.travelers }).map((_, index) => (
                  <div key={index} className="space-y-1">
                    <Label htmlFor={`age-${index}`}>Traveler {index + 1}</Label>
                    <Input
                      type="number"
                      id={`age-${index}`}
                      placeholder="Age"
                      min="1"
                      max="120"
                      value={ages[index]}
                      onChange={(e) => {
                        const newAges = [...ages];
                        newAges[index] = e.target.value;
                        setAges(newAges);
                      }}
                      className={formErrors[`age-${index}`] ? "border-red-500" : ""}
                    />
                    {formErrors[`age-${index}`] && (
                      <p className="text-red-500 text-xs">{formErrors[`age-${index}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <Mountain className="mr-2 h-4 w-4 text-primary" />
                <h3 className="text-base font-medium">Activities (Optional)</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={activity.id}
                      checked={travelData.activities.includes(activity.id)}
                      onCheckedChange={(checked) =>
                        handleActivityChange(activity.id, checked === true)
                      }
                    />
                    <label
                      htmlFor={activity.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {activity.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          type="button" 
          className="w-full"
          onClick={handleSubmit}
        >
          Get My Quotes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TravelForm;
