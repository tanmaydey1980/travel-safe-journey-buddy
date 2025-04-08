
import React, { useState } from "react";
import { useInsuranceContext } from "@/context/InsuranceContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const InsuredDetails = () => {
  const { insuredDetails, setInsuredDetails, selectedPlan, setCurrentStep } = useInsuranceContext();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const zipRegex = /^\d{5}(-\d{4})?$/;

    if (!insuredDetails.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!insuredDetails.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!insuredDetails.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(insuredDetails.email)) {
      errors.email = "Please enter a valid email";
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
    } else if (!zipRegex.test(insuredDetails.zipCode)) {
      errors.zipCode = "Please enter a valid ZIP code";
    }

    if (!insuredDetails.dateOfBirth.trim()) {
      errors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(insuredDetails.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (isNaN(dob.getTime())) {
        errors.dateOfBirth = "Please enter a valid date";
      } else if (age > 120 || age < 0) {
        errors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    if (!insuredDetails.passportNumber.trim()) {
      errors.passportNumber = "Passport number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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

  const formatPhone = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format phone number
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={handleBack} className="p-0 mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-2xl font-bold">Your Details</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Traveler Information</CardTitle>
          <CardDescription>
            Please provide your personal details to continue with your {selectedPlan?.name} plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="insured-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
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
                <Label htmlFor="lastName">Last Name</Label>
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
                <Label htmlFor="email">Email Address</Label>
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={insuredDetails.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    if (formatted.length <= 14) { // (XXX) XXX-XXXX is 14 chars
                      setInsuredDetails({ ...insuredDetails, phone: formatted });
                    }
                  }}
                  className={formErrors.phone ? "border-red-500" : ""}
                  placeholder="(123) 456-7890"
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
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

              <div className="space-y-2">
                <Label htmlFor="passportNumber">Passport Number</Label>
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

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
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

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={insuredDetails.zipCode}
                  onChange={(e) =>
                    setInsuredDetails({ ...insuredDetails, zipCode: e.target.value })
                  }
                  className={formErrors.zipCode ? "border-red-500" : ""}
                />
                {formErrors.zipCode && <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
          <Button type="submit" form="insured-form">
            Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InsuredDetails;
