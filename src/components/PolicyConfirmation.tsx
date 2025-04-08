
import React from "react";
import { useInsuranceContext } from "@/context/InsuranceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Mail, Printer, Calendar, MapPin, Users } from "lucide-react";

const PolicyConfirmation = () => {
  const { policyNumber, selectedPlan, insuredDetails, travelData, setCurrentStep } = useInsuranceContext();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStartOver = () => {
    setCurrentStep("form");
  };

  // Get destination name
  const getDestinationName = (code: string): string => {
    const destinations: Record<string, string> = {
      usa: "United States",
      europe: "Europe",
      asia: "Asia",
      australia: "Australia",
      africa: "Africa",
      southamerica: "South America"
    };
    
    return destinations[code] || code;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold">Thank You!</h2>
        <p className="text-lg text-muted-foreground mt-2">
          Your travel insurance policy has been successfully issued
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="bg-primary/10 border-b">
          <CardTitle>Policy Information</CardTitle>
          <CardDescription>
            Your policy details are shown below. You'll also receive a copy via email.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Policy Number</h3>
              <p className="text-lg font-semibold">{policyNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Plan</h3>
              <p className="text-lg font-semibold">{selectedPlan?.name}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-3">Traveler Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                <p>{insuredDetails.firstName} {insuredDetails.lastName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</h4>
                <p>{formatDate(insuredDetails.dateOfBirth)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                <p>{insuredDetails.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                <p>{insuredDetails.phone}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
                <p>{insuredDetails.address}, {insuredDetails.city}, {insuredDetails.state} {insuredDetails.zipCode}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-3">Trip Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Destination</h4>
                  <p>{getDestinationName(travelData.destination)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Travel Dates</h4>
                  <p>{formatDate(travelData.departureDate)} - {formatDate(travelData.returnDate)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Travelers</h4>
                  <p>{travelData.travelers}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-3">Coverage Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Medical Expenses</h4>
                <p className="font-semibold">${selectedPlan?.coverage.medical.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Trip Cancellation</h4>
                <p className="font-semibold">${selectedPlan?.coverage.cancellation.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Baggage Loss</h4>
                <p className="font-semibold">${selectedPlan?.coverage.baggage.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Travel Delay</h4>
                <p className="font-semibold">${selectedPlan?.coverage.delay.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <Button variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download Policy
            </Button>
            <Button variant="outline" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email Policy
            </Button>
            <Button variant="outline" className="flex items-center">
              <Printer className="mr-2 h-4 w-4" />
              Print Policy
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <h3 className="text-lg font-medium mb-2">Need to buy another policy?</h3>
        <Button onClick={handleStartOver}>Start a New Quote</Button>
      </div>
    </div>
  );
};

export default PolicyConfirmation;
