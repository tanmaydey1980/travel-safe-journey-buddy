
import React, { createContext, useContext, useState, ReactNode } from "react";

type InsuranceStep = "form" | "quote" | "details" | "payment" | "confirmation";

export interface TravelFormData {
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  travelerAges: number[];
  activities: string[];
}

export interface InsuredPerson {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  passportNumber: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
}

export interface SelectedPlan {
  id: string;
  name: string;
  price: number;
  coverage: {
    medical: number;
    cancellation: number;
    baggage: number;
    delay: number;
  };
}

interface InsuranceContextType {
  currentStep: InsuranceStep;
  setCurrentStep: (step: InsuranceStep) => void;
  travelData: TravelFormData;
  setTravelData: (data: TravelFormData) => void;
  selectedPlan: SelectedPlan | null;
  setSelectedPlan: (plan: SelectedPlan | null) => void;
  insuredDetails: InsuredPerson;
  setInsuredDetails: (details: InsuredPerson) => void;
  paymentDetails: PaymentDetails;
  setPaymentDetails: (details: PaymentDetails) => void;
  policyNumber: string;
  setPolicyNumber: (number: string) => void;
}

const defaultTravelData: TravelFormData = {
  destination: "",
  departureDate: "",
  returnDate: "",
  travelers: 1,
  travelerAges: [30],
  activities: [],
};

const defaultInsuredDetails: InsuredPerson = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  dateOfBirth: "",
  passportNumber: "",
};

const defaultPaymentDetails: PaymentDetails = {
  cardNumber: "",
  cardholderName: "",
  expiryDate: "",
  cvv: "",
};

const InsuranceContext = createContext<InsuranceContextType | undefined>(undefined);

export const useInsuranceContext = () => {
  const context = useContext(InsuranceContext);
  if (!context) {
    throw new Error("useInsuranceContext must be used within an InsuranceProvider");
  }
  return context;
};

export const InsuranceProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<InsuranceStep>("form");
  const [travelData, setTravelData] = useState<TravelFormData>(defaultTravelData);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [insuredDetails, setInsuredDetails] = useState<InsuredPerson>(defaultInsuredDetails);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(defaultPaymentDetails);
  const [policyNumber, setPolicyNumber] = useState<string>("");

  const value = {
    currentStep,
    setCurrentStep,
    travelData,
    setTravelData,
    selectedPlan,
    setSelectedPlan,
    insuredDetails,
    setInsuredDetails,
    paymentDetails,
    setPaymentDetails,
    policyNumber,
    setPolicyNumber,
  };

  return <InsuranceContext.Provider value={value}>{children}</InsuranceContext.Provider>;
};
