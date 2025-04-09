
import React, { useEffect } from "react";
import { useInsuranceContext } from "@/context/InsuranceContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotorForm from "@/components/MotorForm";
import QuoteResults from "@/components/QuoteResults";
import InsuredDetails from "@/components/InsuredDetails";
import Payment from "@/components/Payment";
import PolicyConfirmation from "@/components/PolicyConfirmation";
import { CheckCircle } from "lucide-react";

const MotorInsurance = () => {
  const { currentStep, setInsuranceType } = useInsuranceContext();

  // Set insurance type on component load
  useEffect(() => {
    setInsuranceType("motor");
  }, [setInsuranceType]);

  const steps = [
    { id: "form", label: "Vehicle Details" },
    { id: "quote", label: "Select Plan" },
    { id: "details", label: "Your Details" },
    { id: "payment", label: "Payment" },
    { id: "confirmation", label: "Confirmation" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section - only shown on the first step */}
        {currentStep === "form" && (
          <div className="bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2874&auto=format&fit=crop')] bg-center bg-cover py-20 px-4 md:px-8 text-white relative">
            <div className="absolute inset-0 bg-black/50" />
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Protect Your Vehicle</h1>
                <p className="text-xl mb-6">
                  Get comprehensive motor insurance coverage for your car. Protection against accidents, theft, damage, and more.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-2" />
                    <span>24/7 Roadside Assistance</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-2" />
                    <span>Comprehensive Coverage</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
                    <CheckCircle className="h-6 w-6 text-primary mr-2" />
                    <span>Fast Claims Process</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
          {/* Step indicator */}
          {currentStep !== "form" && (
            <div className="step-indicator mb-8">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = 
                  steps.findIndex(s => s.id === currentStep) > 
                  steps.findIndex(s => s.id === step.id);
                
                return (
                  <div 
                    key={step.id} 
                    className={`step ${isActive ? 'step-active' : ''} ${isCompleted ? 'step-completed' : ''}`}
                  >
                    <div className="step-circle">
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className="text-sm">{step.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Current step content */}
          {currentStep === "form" && <MotorForm />}
          {currentStep === "quote" && <QuoteResults />}
          {currentStep === "details" && <InsuredDetails />}
          {currentStep === "payment" && <Payment />}
          {currentStep === "confirmation" && <PolicyConfirmation />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MotorInsurance;
