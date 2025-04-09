
import React, { useState } from "react";
import { useInsuranceContext } from "@/context/InsuranceContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Car, Calendar, Gauge, Landmark, Tools } from "lucide-react";
import { toast } from "sonner";

const MotorForm = () => {
  const { motorData, setMotorData, setCurrentStep } = useInsuranceContext();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const parkingLocations = [
    { value: "garage", label: "Private Garage" },
    { value: "driveway", label: "Private Driveway" },
    { value: "street", label: "Street" },
    { value: "carport", label: "Carport" },
    { value: "public", label: "Public Parking" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const carBrands = [
    "Toyota", "Honda", "Ford", "Chevrolet", "Nissan", 
    "BMW", "Mercedes-Benz", "Audi", "Volkswagen", "Hyundai",
    "Kia", "Subaru", "Tesla", "Mazda", "Lexus"
  ];

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!motorData.vehicleMake) {
      errors.vehicleMake = "Please select vehicle make";
    }

    if (!motorData.vehicleModel) {
      errors.vehicleModel = "Please enter vehicle model";
    }

    if (!motorData.vehicleRegistration) {
      errors.vehicleRegistration = "Please enter vehicle registration";
    }

    if (!motorData.vehicleValue || motorData.vehicleValue <= 0) {
      errors.vehicleValue = "Please enter a valid vehicle value";
    }

    if (!motorData.annualMileage || motorData.annualMileage <= 0) {
      errors.annualMileage = "Please enter valid annual mileage";
    }

    if (!motorData.parkingLocation) {
      errors.parkingLocation = "Please select where you park your vehicle";
    }

    if (motorData.hasModifications && !motorData.modifications) {
      errors.modifications = "Please describe the modifications";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setCurrentStep("quote");
      toast.success("Quote generated successfully!");
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Tell us about your vehicle</CardTitle>
        <CardDescription>
          Provide the details below to get personalized motor insurance quotes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <Car className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="vehicleMake">Vehicle Make</Label>
              </div>
              <Select
                value={motorData.vehicleMake}
                onValueChange={(value) =>
                  setMotorData({ ...motorData, vehicleMake: value })
                }
              >
                <SelectTrigger id="vehicleMake" className={formErrors.vehicleMake ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select vehicle make" />
                </SelectTrigger>
                <SelectContent>
                  {carBrands.map((brand) => (
                    <SelectItem key={brand.toLowerCase()} value={brand.toLowerCase()}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.vehicleMake && <p className="text-red-500 text-xs mt-1">{formErrors.vehicleMake}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Car className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
              </div>
              <Input
                id="vehicleModel"
                value={motorData.vehicleModel}
                onChange={(e) =>
                  setMotorData({ ...motorData, vehicleModel: e.target.value })
                }
                placeholder="e.g. Corolla, Civic"
                className={formErrors.vehicleModel ? "border-red-500" : ""}
              />
              {formErrors.vehicleModel && <p className="text-red-500 text-xs mt-1">{formErrors.vehicleModel}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="vehicleYear">Year of Manufacture</Label>
              </div>
              <Select
                value={String(motorData.vehicleYear)}
                onValueChange={(value) =>
                  setMotorData({ ...motorData, vehicleYear: parseInt(value) })
                }
              >
                <SelectTrigger id="vehicleYear">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Car className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="vehicleRegistration">Registration Number</Label>
              </div>
              <Input
                id="vehicleRegistration"
                value={motorData.vehicleRegistration}
                onChange={(e) =>
                  setMotorData({ ...motorData, vehicleRegistration: e.target.value.toUpperCase() })
                }
                placeholder="e.g. ABC123"
                className={formErrors.vehicleRegistration ? "border-red-500" : ""}
              />
              {formErrors.vehicleRegistration && <p className="text-red-500 text-xs mt-1">{formErrors.vehicleRegistration}</p>}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Landmark className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="vehicleValue">Vehicle Value ($)</Label>
              </div>
              <Input
                type="number"
                id="vehicleValue"
                value={motorData.vehicleValue}
                onChange={(e) =>
                  setMotorData({ ...motorData, vehicleValue: parseInt(e.target.value) || 0 })
                }
                placeholder="e.g. 15000"
                className={formErrors.vehicleValue ? "border-red-500" : ""}
              />
              {formErrors.vehicleValue && <p className="text-red-500 text-xs mt-1">{formErrors.vehicleValue}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Gauge className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="annualMileage">Annual Mileage</Label>
              </div>
              <Input
                type="number"
                id="annualMileage"
                value={motorData.annualMileage}
                onChange={(e) =>
                  setMotorData({ ...motorData, annualMileage: parseInt(e.target.value) || 0 })
                }
                placeholder="e.g. 10000"
                className={formErrors.annualMileage ? "border-red-500" : ""}
              />
              {formErrors.annualMileage && <p className="text-red-500 text-xs mt-1">{formErrors.annualMileage}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Landmark className="mr-2 h-4 w-4 text-primary" />
                <Label htmlFor="parkingLocation">Where is the vehicle usually parked?</Label>
              </div>
              <Select
                value={motorData.parkingLocation}
                onValueChange={(value) =>
                  setMotorData({ ...motorData, parkingLocation: value })
                }
              >
                <SelectTrigger id="parkingLocation" className={formErrors.parkingLocation ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select parking location" />
                </SelectTrigger>
                <SelectContent>
                  {parkingLocations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.parkingLocation && <p className="text-red-500 text-xs mt-1">{formErrors.parkingLocation}</p>}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Tools className="h-4 w-4 text-primary" />
                <h3 className="text-base font-medium">Vehicle Modifications</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasModifications"
                  checked={motorData.hasModifications}
                  onCheckedChange={(checked) =>
                    setMotorData({ ...motorData, hasModifications: checked === true, modifications: checked ? motorData.modifications : "" })
                  }
                />
                <label
                  htmlFor="hasModifications"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Does your vehicle have any modifications?
                </label>
              </div>

              {motorData.hasModifications && (
                <div className="space-y-2 mt-3">
                  <Label htmlFor="modifications">Please describe the modifications</Label>
                  <Input
                    id="modifications"
                    value={motorData.modifications}
                    onChange={(e) =>
                      setMotorData({ ...motorData, modifications: e.target.value })
                    }
                    placeholder="e.g. Custom exhaust, turbocharger, etc."
                    className={formErrors.modifications ? "border-red-500" : ""}
                  />
                  {formErrors.modifications && <p className="text-red-500 text-xs mt-1">{formErrors.modifications}</p>}
                </div>
              )}
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

export default MotorForm;
