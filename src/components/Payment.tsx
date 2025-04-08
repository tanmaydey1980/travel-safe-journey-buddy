
import React, { useState } from "react";
import { useInsuranceContext } from "@/context/InsuranceContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, LockIcon, CreditCard, Check, Info, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Payment = () => {
  const { 
    paymentDetails, setPaymentDetails, 
    selectedPlan, insuredDetails, 
    setCurrentStep, setPolicyNumber 
  } = useInsuranceContext();
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return month < 10 ? `0${month}` : `${month}`;
  });

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < numbers.length; i += 4) {
      groups.push(numbers.slice(i, i + 4));
    }
    
    return groups.join(' ').trim();
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validate card number
    if (!paymentDetails.cardNumber.trim()) {
      errors.cardNumber = "Card number is required";
    } else {
      const strippedNumber = paymentDetails.cardNumber.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(strippedNumber)) {
        errors.cardNumber = "Please enter a valid card number";
      }
    }

    // Validate cardholder name
    if (!paymentDetails.cardholderName.trim()) {
      errors.cardholderName = "Cardholder name is required";
    }

    // Validate expiry date
    if (!paymentDetails.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    }

    // Validate CVV
    if (!paymentDetails.cvv.trim()) {
      errors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      errors.cvv = "Please enter a valid CVV";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsProcessing(true);
      
      // Simulate payment processing
      toast.loading("Processing your payment...");
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate a random policy number
        const randomPolicyNumber = `POL-${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`;
        setPolicyNumber(randomPolicyNumber);
        
        toast.dismiss();
        toast.success("Payment processed successfully!");
        
        // Navigate to confirmation
        setCurrentStep("confirmation");
      } catch (error) {
        toast.dismiss();
        toast.error("There was an error processing your payment. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  const handleBack = () => {
    setCurrentStep("details");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={handleBack} className="p-0 mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-2xl font-bold">Payment</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LockIcon className="h-5 w-5 mr-2 text-primary" />
                Secure Payment
              </CardTitle>
              <CardDescription>
                Your payment information is encrypted and secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => {
                      const formattedValue = formatCardNumber(e.target.value);
                      if (formattedValue.length <= 19) {
                        setPaymentDetails({ ...paymentDetails, cardNumber: formattedValue });
                      }
                    }}
                    placeholder="1234 5678 9012 3456"
                    className={formErrors.cardNumber ? "border-red-500" : ""}
                  />
                  {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    value={paymentDetails.cardholderName}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, cardholderName: e.target.value })
                    }
                    placeholder="John Smith"
                    className={formErrors.cardholderName ? "border-red-500" : ""}
                  />
                  {formErrors.cardholderName && <p className="text-red-500 text-xs mt-1">{formErrors.cardholderName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <div className="flex space-x-2">
                      <Select
                        value={paymentDetails.expiryDate?.split('-')[1] || ""}
                        onValueChange={(month) => {
                          const year = paymentDetails.expiryDate?.split('-')[0] || years[0].toString();
                          setPaymentDetails({ 
                            ...paymentDetails, 
                            expiryDate: `${year}-${month}` 
                          });
                        }}
                      >
                        <SelectTrigger id="expiryMonth" className={formErrors.expiryDate ? "border-red-500" : ""}>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={paymentDetails.expiryDate?.split('-')[0] || ""}
                        onValueChange={(year) => {
                          const month = paymentDetails.expiryDate?.split('-')[1] || months[0];
                          setPaymentDetails({ 
                            ...paymentDetails, 
                            expiryDate: `${year}-${month}` 
                          });
                        }}
                      >
                        <SelectTrigger id="expiryYear" className={formErrors.expiryDate ? "border-red-500" : ""}>
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {formErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      maxLength={4}
                      value={paymentDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          setPaymentDetails({ ...paymentDetails, cvv: value });
                        }
                      }}
                      placeholder="123"
                      className={formErrors.cvv ? "border-red-500" : ""}
                    />
                    {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
                  </div>
                </div>
                
                <div className="flex items-center pt-4 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mr-2" />
                  <p>We use secure encryption to protect your payment information.</p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={isProcessing}>
                Back
              </Button>
              <Button type="submit" form="payment-form" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Complete Purchase"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Plan:</h3>
                  <p>{selectedPlan?.name}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium">Primary Traveler:</h3>
                  <p>{insuredDetails.firstName} {insuredDetails.lastName}</p>
                </div>

                <div>
                  <h3 className="font-medium">Coverage:</h3>
                  <ul className="text-sm mt-2 space-y-1">
                    <li className="flex justify-between">
                      <span>Medical:</span>
                      <span>${selectedPlan?.coverage.medical.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Trip Cancellation:</span>
                      <span>${selectedPlan?.coverage.cancellation.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Baggage:</span>
                      <span>${selectedPlan?.coverage.baggage.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Delay:</span>
                      <span>${selectedPlan?.coverage.delay.toLocaleString()}</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${selectedPlan?.price.toFixed(2)}</span>
                </div>

                <div className="flex items-center text-sm bg-muted p-3 rounded-md mt-4">
                  <Info className="h-4 w-4 mr-2 text-primary" />
                  <p>Your policy will be issued immediately after successful payment.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
