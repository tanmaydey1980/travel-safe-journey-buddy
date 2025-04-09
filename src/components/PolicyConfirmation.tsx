
import React from "react";
import { useInsuranceContext } from "@/context/InsuranceContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Calendar, Download, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const PolicyConfirmation = () => {
  const { 
    insuranceType,
    policyNumber, 
    insuredDetails, 
    selectedPlan, 
    travelData,
    motorData,
    setCurrentStep, 
    setSelectedPlan 
  } = useInsuranceContext();

  // Current date for policy start date
  const startDate = new Date();
  
  // Policy end date (1 year from now for motor, or return date for travel)
  const endDate = insuranceType === "travel"
    ? new Date(travelData.returnDate)
    : new Date(startDate.setFullYear(startDate.getFullYear() + 1));

  const handleNewQuote = () => {
    setSelectedPlan(null);
    setCurrentStep("form");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">Your Policy has been issued!</h1>
        <p className="text-muted-foreground mt-2">
          Thank you for purchasing {insuranceType === "travel" ? "travel" : "motor"} insurance with us
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Policy Information
          </CardTitle>
          <CardDescription>
            Your policy details and documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Policy Number</p>
              <p className="font-medium">{policyNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="font-medium">{selectedPlan?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Policy Holder</p>
              <p className="font-medium">
                {insuredDetails.firstName} {insuredDetails.lastName}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Premium</p>
              <p className="font-medium">${selectedPlan?.price.toFixed(2)}</p>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Coverage Period</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Start Date</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">
                    {format(new Date(), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">End Date</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">
                    {format(new Date(endDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {insuranceType === "travel" ? (
            <div className="space-y-4">
              <h3 className="font-medium">Trip Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Destination</p>
                  <p className="font-medium capitalize">{travelData.destination}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Travelers</p>
                  <p className="font-medium">{travelData.travelers}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Departure Date</p>
                  <p className="font-medium">
                    {format(new Date(travelData.departureDate), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Return Date</p>
                  <p className="font-medium">
                    {format(new Date(travelData.returnDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Make & Model</p>
                  <p className="font-medium capitalize">{motorData.vehicleMake} {motorData.vehicleModel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-medium">{motorData.vehicleYear}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Registration</p>
                  <p className="font-medium">{motorData.vehicleRegistration}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Vehicle Value</p>
                  <p className="font-medium">${motorData.vehicleValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-medium">Policy Documents</h3>
            <div className="flex flex-col space-y-2">
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" /> Download Policy Document
              </Button>
              <Button variant="outline" className="justify-start">
                <Printer className="h-4 w-4 mr-2" /> Print Insurance Certificate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted p-6 rounded-lg mb-8">
        <h3 className="font-medium mb-2">What happens next?</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2" />
            <span>An email with your policy documents has been sent to {insuredDetails.email}</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2" />
            <span>You can access your policy details anytime through your online account</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-primary shrink-0 mr-2" />
            <span>For claims or assistance, call our 24/7 helpline: <span className="font-medium">1-800-SAFE-NOW</span></span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="outline" onClick={handleNewQuote}>
          Get Another Quote
        </Button>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default PolicyConfirmation;
