
import React, { useState } from "react";
import { useInsuranceContext } from "@/context/InsuranceContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Mail, Phone, Home, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

const InsuredDetails = () => {
  const { 
    insuranceType,
    insuredDetails, setInsuredDetails, 
    selectedPlan, setCurrentStep 
  } = useInsuranceContext();
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    
    if (!insuredDetails.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    
    if (!insuredDetails.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    
    if (!insuredDetails.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(insuredDetails.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!insuredDetails.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(insuredDetails.phone.replace(/\D/g, ''))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!insuredDetails.address.trim()) {
      errors.address = "Address is required";
    }
    
    if (!insuredDetails.city.trim()) {
      errors.city = "City is required";
    }
    
    if (!insuredDetails.state.trim()) {
      errors.state = "State is required";
    }
    
    if (!insuredDetails.zipCode.trim()) {
      errors.zipCode = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(insuredDetails.zipCode.trim())) {
      errors.zipCode = "Please enter a valid ZIP code";
    }
    
    if (!insuredDetails.dateOfBirth.trim()) {
      errors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(insuredDetails.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        errors.dateOfBirth = "You must be at least 18 years old";
      }
    }

    if (insuranceType === "travel" && !insuredDetails.passportNumber.trim()) {
      errors.passportNumber = "Passport number is required";
    }

    if (insuranceType === "motor") {
      if (!insuredDetails.drivingLicenseNumber?.trim()) {
        errors.drivingLicenseNumber = "Driving license number is required";
      }
      
      if (!insuredDetails.drivingExperience) {
        errors.drivingExperience = "Driving experience is required";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setCurrentStep("payment");
      toast.success("Personal details saved successfully!");
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };
  
  const handleBack = () => {
    setCurrentStep("quote");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="p-0 mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h2 className="text-2xl font-bold">Your Details</h2>
        </div>
        {selectedPlan && (
          <Badge variant="outline" className="text-sm">
            Selected Plan: {selectedPlan.name} - ${selectedPlan.price.toFixed(2)}
          </Badge>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Please provide your details for the insurance policy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="personal-details-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <Label htmlFor="firstName">First Name</Label>
                </div>
                <Input
                  id="firstName"
                  value={insuredDetails.firstName}
                  onChange={(e) => 
                    setInsuredDetails({ ...insuredDetails, firstName: e.target.value })
                  }
                  className={formErrors.firstName ? "border-red-500" : ""}
                />
                {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <Label htmlFor="lastName">Last Name</Label>
                </div>
                <Input
                  id="lastName"
                  value={insuredDetails.lastName}
                  onChange={(e) => 
                    setInsuredDetails({ ...insuredDetails, lastName: e.target.value })
                  }
                  className={formErrors.lastName ? "border-red-500" : ""}
                />
                {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <Label htmlFor="email">Email Address</Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  value={insuredDetails.email}
                  onChange={(e) => 
                    setInsuredDetails({ ...insuredDetails, email: e.target.value })
                  }
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <Label htmlFor="phone">Phone Number</Label>
                </div>
                <Input
                  id="phone"
                  value={insuredDetails.phone}
                  onChange={(e) => {
                    const formattedPhone = formatPhone(e.target.value);
                    if (formattedPhone.length <= 12) { // 123-456-7890 (12 chars)
                      setInsuredDetails({ ...insuredDetails, phone: formattedPhone });
                    }
                  }}
                  placeholder="123-456-7890"
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 text-primary" />
                    <Label htmlFor="address">Street Address</Label>
                  </div>
                  <Input
                    id="address"
                    value={insuredDetails.address}
                    onChange={(e) => 
                      setInsuredDetails({ ...insuredDetails, address: e.target.value })
                    }
                    className={formErrors.address ? "border-red-500" : ""}
                  />
                  {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={insuredDetails.city}
                    onChange={(e) => 
                      setInsuredDetails({ ...insuredDetails, city: e.target.value })
                    }
                    className={formErrors.city ? "border-red-500" : ""}
                  />
                  {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={insuredDetails.state}
                    onValueChange={(value) => 
                      setInsuredDetails({ ...insuredDetails, state: value })
                    }
                  >
                    <SelectTrigger id="state" className={formErrors.state ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.state && <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={insuredDetails.zipCode}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,5}(-\d{0,4})?$/.test(value)) {
                        setInsuredDetails({ ...insuredDetails, zipCode: value });
                      }
                    }}
                    className={formErrors.zipCode ? "border-red-500" : ""}
                  />
                  {formErrors.zipCode && <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  </div>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    value={insuredDetails.dateOfBirth}
                    onChange={(e) => 
                      setInsuredDetails({ ...insuredDetails, dateOfBirth: e.target.value })
                    }
                    className={formErrors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {formErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{formErrors.dateOfBirth}</p>}
                </div>
              </div>
            </div>
            
            {/* Show different fields based on insurance type */}
            {insuranceType === "travel" ? (
              <div className="space-y-2">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  <Label htmlFor="passportNumber">Passport Number</Label>
                </div>
                <Input
                  id="passportNumber"
                  value={insuredDetails.passportNumber}
                  onChange={(e) => 
                    setInsuredDetails({ ...insuredDetails, passportNumber: e.target.value })
                  }
                  className={formErrors.passportNumber ? "border-red-500" : ""}
                />
                {formErrors.passportNumber && <p className="text-red-500 text-xs mt-1">{formErrors.passportNumber}</p>}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Driving Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      <Label htmlFor="drivingLicenseNumber">Driving License Number</Label>
                    </div>
                    <Input
                      id="drivingLicenseNumber"
                      value={insuredDetails.drivingLicenseNumber || ""}
                      onChange={(e) => 
                        setInsuredDetails({ ...insuredDetails, drivingLicenseNumber: e.target.value })
                      }
                      className={formErrors.drivingLicenseNumber ? "border-red-500" : ""}
                    />
                    {formErrors.drivingLicenseNumber && <p className="text-red-500 text-xs mt-1">{formErrors.drivingLicenseNumber}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="drivingExperience">Years of Driving Experience</Label>
                    <Select
                      value={insuredDetails.drivingExperience?.toString() || ""}
                      onValueChange={(value) => 
                        setInsuredDetails({ ...insuredDetails, drivingExperience: parseInt(value) })
                      }
                    >
                      <SelectTrigger id="drivingExperience" className={formErrors.drivingExperience ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 41 }, (_, i) => i).map((years) => (
                          <SelectItem key={years} value={years.toString()}>
                            {years} {years === 1 ? "year" : "years"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.drivingExperience && <p className="text-red-500 text-xs mt-1">{formErrors.drivingExperience}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="previousClaims">Number of Claims in Last 5 Years</Label>
                    <Select
                      value={insuredDetails.previousClaims?.toString() || "0"}
                      onValueChange={(value) => 
                        setInsuredDetails({ ...insuredDetails, previousClaims: parseInt(value) })
                      }
                    >
                      <SelectTrigger id="previousClaims">
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 6 }, (_, i) => i).map((claims) => (
                          <SelectItem key={claims} value={claims.toString()}>
                            {claims} {claims === 1 ? "claim" : "claims"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button type="submit" form="personal-details-form">
            Continue to Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InsuredDetails;
