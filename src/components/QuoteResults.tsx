
import React, { useState, useEffect } from "react";
import { useInsuranceContext } from "@/context/InsuranceContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const QuoteResults = () => {
  const { 
    insuranceType,
    travelData, 
    motorData,
    setSelectedPlan, 
    setCurrentStep 
  } = useInsuranceContext();
  
  const [isLoading, setIsLoading] = useState(true);
  const [quotes, setQuotes] = useState<any[]>([]);

  // Generate mock quotes based on form data
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (insuranceType === "travel") {
        // Generate travel insurance quotes
        const mockTravelQuotes = [
          {
            id: "basic",
            name: "Basic Cover",
            price: 49.99 * travelData.travelers,
            recommended: false,
            coverage: {
              medical: 50000,
              cancellation: 1500,
              baggage: 1000,
              delay: 250,
            },
            features: [
              "Emergency medical coverage",
              "Trip cancellation protection",
              "Baggage protection",
              "24/7 travel assistance",
            ],
          },
          {
            id: "standard",
            name: "Standard Cover",
            price: 79.99 * travelData.travelers,
            recommended: true,
            coverage: {
              medical: 100000,
              cancellation: 3000,
              baggage: 2000,
              delay: 500,
            },
            features: [
              "Emergency medical coverage",
              "Trip cancellation protection",
              "Baggage protection",
              "24/7 travel assistance",
              "Emergency evacuation",
              "Travel delay coverage",
            ],
          },
          {
            id: "premium",
            name: "Premium Cover",
            price: 119.99 * travelData.travelers,
            recommended: false,
            coverage: {
              medical: 250000,
              cancellation: 5000,
              baggage: 3000,
              delay: 1000,
            },
            features: [
              "Emergency medical coverage",
              "Trip cancellation protection",
              "Baggage protection",
              "24/7 travel assistance",
              "Emergency evacuation",
              "Travel delay coverage",
              "Adventure activities coverage",
              "Pre-existing medical conditions",
              "Cancel for any reason",
            ],
          },
        ];
        setQuotes(mockTravelQuotes);
      } else {
        // Generate motor insurance quotes based on vehicle value and other factors
        const vehicleAgeYears = new Date().getFullYear() - motorData.vehicleYear;
        const basePrice = motorData.vehicleValue * 0.05; // 5% of vehicle value
        
        // Adjustments based on vehicle age
        const ageAdjustment = vehicleAgeYears * 50;
        
        // Adjustment for mileage (higher mileage = higher risk)
        const mileageAdjustment = (motorData.annualMileage / 5000) * 30;
        
        // Adjustment for parking location
        const parkingAdjustment = 
          motorData.parkingLocation === "garage" ? 0 :
          motorData.parkingLocation === "driveway" ? 50 :
          motorData.parkingLocation === "carport" ? 80 :
          motorData.parkingLocation === "street" ? 150 : 200;
        
        // Adjustment for modifications
        const modificationAdjustment = motorData.hasModifications ? 100 : 0;

        const mockMotorQuotes = [
          {
            id: "third-party",
            name: "Third Party Only",
            price: Math.round((basePrice * 0.6 + ageAdjustment + mileageAdjustment + parkingAdjustment + modificationAdjustment) * 100) / 100,
            recommended: false,
            coverage: {
              liability: 1000000,
              collision: 0,
              comprehensive: 0,
              personalInjury: 10000,
            },
            features: [
              "Third party liability",
              "Legal expenses",
              "Personal accident cover",
              "24/7 claims helpline",
            ],
          },
          {
            id: "third-party-fire-theft",
            name: "Third Party, Fire & Theft",
            price: Math.round((basePrice * 0.8 + ageAdjustment + mileageAdjustment + parkingAdjustment + modificationAdjustment) * 100) / 100,
            recommended: false,
            coverage: {
              liability: 1000000,
              collision: 0,
              comprehensive: motorData.vehicleValue * 0.5,
              personalInjury: 15000,
            },
            features: [
              "Third party liability",
              "Fire damage protection",
              "Theft protection",
              "Legal expenses",
              "Personal accident cover",
              "24/7 claims helpline",
            ],
          },
          {
            id: "comprehensive",
            name: "Comprehensive Cover",
            price: Math.round((basePrice + ageAdjustment + mileageAdjustment + parkingAdjustment + modificationAdjustment) * 100) / 100,
            recommended: true,
            coverage: {
              liability: 2000000,
              collision: motorData.vehicleValue,
              comprehensive: motorData.vehicleValue,
              personalInjury: 25000,
            },
            features: [
              "Accidental damage",
              "Third party liability",
              "Fire damage protection",
              "Theft protection",
              "Windscreen cover",
              "Personal belongings cover",
              "Courtesy car",
              "Legal expenses",
              "Personal accident cover",
              "24/7 claims helpline",
            ],
          },
        ];
        setQuotes(mockMotorQuotes);
      }
      setIsLoading(false);
    }, 1500);
  }, [insuranceType, travelData, motorData]);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setCurrentStep("details");
    toast.success(`Selected ${plan.name} plan`);
  };

  const handleBack = () => {
    setCurrentStep("form");
  };

  const formatCoverage = (type: string, value: number) => {
    if (!value) return null;
    
    switch(type) {
      case "medical":
      case "cancellation":
      case "baggage":
      case "delay":
      case "liability":
      case "collision":
      case "comprehensive":
      case "personalInjury":
        return `$${value.toLocaleString()}`;
      default:
        return value;
    }
  };

  const coverageLabels = insuranceType === "travel" 
    ? {
        medical: "Medical Coverage",
        cancellation: "Cancellation Coverage",
        baggage: "Baggage Coverage",
        delay: "Delay Coverage"
      }
    : {
        liability: "Third Party Liability",
        collision: "Collision Damage",
        comprehensive: "Comprehensive Coverage",
        personalInjury: "Personal Injury Protection"
      };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="p-0 mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h2 className="text-2xl font-bold">Available Plans</h2>
        </div>
        <div>
          <Badge variant="outline" className="text-sm">
            {insuranceType === "travel" ? (
              <>
                {travelData.travelers} {travelData.travelers === 1 ? "Traveler" : "Travelers"} • {travelData.destination}
              </>
            ) : (
              <>
                {motorData.vehicleMake} {motorData.vehicleModel} • {motorData.vehicleYear}
              </>
            )}
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-muted-foreground">Generating your personalized quotes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.recommended ? 'border-primary' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-medium py-1 px-3 rounded-full">
                  Recommended
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  <Shield className={`h-5 w-5 ${plan.recommended ? 'text-primary' : 'text-muted-foreground'}`} />
                </CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold">${plan.price.toFixed(2)}</span>
                  <span className="text-muted-foreground"> / year</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Coverage Details</h4>
                  <dl className="text-sm space-y-1">
                    {Object.entries(plan.coverage).map(([key, value]: [string, any]) => 
                      value ? (
                        <div key={key} className="flex justify-between">
                          <dt>{coverageLabels[key as keyof typeof coverageLabels]}</dt>
                          <dd className="font-medium">{formatCoverage(key, value)}</dd>
                        </div>
                      ) : null
                    )}
                  </dl>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="text-sm space-y-2">
                    {plan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mr-2 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plan.id === "third-party" && insuranceType === "motor" && (
                  <div className="flex items-start bg-amber-50 p-3 rounded-md text-amber-800 text-sm">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 mr-2" />
                    <p>This plan doesn't cover damage to your own vehicle.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSelectPlan(plan)} 
                  className="w-full" 
                  variant={plan.recommended ? "default" : "outline"}
                >
                  Select Plan
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuoteResults;
