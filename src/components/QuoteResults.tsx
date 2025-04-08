
import React from "react";
import { useInsuranceContext } from "@/context/InsuranceContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Shield, ArrowLeft, Heart, Star, Plane } from "lucide-react";
import { toast } from "sonner";

const insurancePlans = [
  {
    id: "basic",
    name: "Basic Coverage",
    price: 49.99,
    features: [
      "Medical expenses up to $50,000",
      "Trip cancellation up to $1,000",
      "Baggage loss up to $500",
      "Travel delay coverage",
    ],
    coverage: {
      medical: 50000,
      cancellation: 1000,
      baggage: 500,
      delay: 200,
    },
  },
  {
    id: "standard",
    name: "Standard Coverage",
    price: 89.99,
    features: [
      "Medical expenses up to $100,000",
      "Trip cancellation up to $3,000",
      "Baggage loss up to $1,000",
      "Travel delay coverage",
      "Emergency evacuation",
    ],
    coverage: {
      medical: 100000,
      cancellation: 3000,
      baggage: 1000,
      delay: 500,
    },
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium Coverage",
    price: 149.99,
    features: [
      "Medical expenses up to $250,000",
      "Trip cancellation up to $10,000",
      "Baggage loss up to $2,500",
      "Travel delay coverage",
      "Emergency evacuation",
      "Adventure activities coverage",
      "24/7 Premium support",
    ],
    coverage: {
      medical: 250000,
      cancellation: 10000,
      baggage: 2500,
      delay: 1000,
    },
  },
];

const QuoteResults = () => {
  const { travelData, selectedPlan, setSelectedPlan, setCurrentStep } = useInsuranceContext();

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setCurrentStep("details");
    toast.success(`${plan.name} selected!`);
  };

  const handleBack = () => {
    setCurrentStep("form");
  };

  // Calculate price based on number of travelers and trip length
  const calculateAdjustedPrice = (basePrice) => {
    const tripLength = Math.max(
      1,
      Math.ceil(
        (new Date(travelData.returnDate).getTime() - new Date(travelData.departureDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    
    const activityMultiplier = 1 + travelData.activities.length * 0.05;
    
    // Age factor calculation
    let ageFactor = 1;
    if (travelData.travelerAges.length > 0) {
      const avgAge = travelData.travelerAges.reduce((sum, age) => sum + age, 0) / travelData.travelerAges.length;
      if (avgAge < 18) ageFactor = 0.8;
      else if (avgAge > 65) ageFactor = 1.5;
    }
    
    return (basePrice * travelData.travelers * activityMultiplier * ageFactor * Math.min(tripLength * 0.9, 30)).toFixed(2);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={handleBack} className="p-0 mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-2xl font-bold">Choose Your Coverage Plan</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insurancePlans.map((plan) => {
          const adjustedPrice = calculateAdjustedPrice(plan.price);
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${plan.recommended ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold">
                  Recommended
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center">
                  {plan.id === "basic" && <Shield className="h-5 w-5 mr-2 text-blue-500" />}
                  {plan.id === "standard" && <Star className="h-5 w-5 mr-2 text-amber-500" />}
                  {plan.id === "premium" && <Plane className="h-5 w-5 mr-2 text-purple-500" />}
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${adjustedPrice}</span>
                    <span className="text-muted-foreground"> total</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`w-full ${plan.recommended ? 'bg-primary' : ''}`}
                  onClick={() => handleSelectPlan({ ...plan, price: parseFloat(adjustedPrice) })}
                >
                  Select Plan
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 bg-muted p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-3 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-red-500" />
          Why Choose SafeJourney Insurance?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-md">
            <h4 className="font-medium mb-2">24/7 Global Assistance</h4>
            <p className="text-sm text-muted-foreground">
              Our support team is available 24/7 to assist you with any emergency during your travels.
            </p>
          </div>
          <div className="bg-background p-4 rounded-md">
            <h4 className="font-medium mb-2">Easy Claims Process</h4>
            <p className="text-sm text-muted-foreground">
              Submit claims online and get reimbursed quickly with our streamlined claims process.
            </p>
          </div>
          <div className="bg-background p-4 rounded-md">
            <h4 className="font-medium mb-2">Trusted by Millions</h4>
            <p className="text-sm text-muted-foreground">
              Join the millions of travelers who trust SafeJourney for their travel protection needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteResults;
