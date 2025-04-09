
import React, { createContext, useContext, useState, ReactNode } from "react";

type InsuranceStep = "form" | "quote" | "details" | "payment" | "confirmation";
type InsuranceType = "travel" | "motor";

export interface TravelFormData {
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  travelerAges: number[];
  activities: string[];
}

export interface MotorFormData {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleRegistration: string;
  vehicleValue: number;
  annualMileage: number;
  parkingLocation: string;
  hasModifications: boolean;
  modifications: string;
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
  drivingLicenseNumber?: string;
  drivingExperience?: number;
  previousClaims?: number;
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
    medical?: number;
    cancellation?: number;
    baggage?: number;
    delay?: number;
    liability?: number;
    collision?: number;
    comprehensive?: number;
    personalInjury?: number;
  };
}

interface InsuranceContextType {
  insuranceType: InsuranceType;
  setInsuranceType: (type: InsuranceType) => void;
  currentStep: InsuranceStep;
  setCurrentStep: (step: InsuranceStep) => void;
  travelData: TravelFormData;
  setTravelData: (data: TravelFormData) => void;
  motorData: MotorFormData;
  setMotorData: (data: MotorFormData) => void;
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

const defaultMotorData: MotorFormData = {
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: new Date().getFullYear(),
  vehicleRegistration: "",
  vehicleValue: 15000,
  annualMileage: 10000,
  parkingLocation: "garage",
  hasModifications: false,
  modifications: "",
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
  drivingLicenseNumber: "",
  drivingExperience: 5,
  previousClaims: 0,
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
  const [insuranceType, setInsuranceType] = useState<InsuranceType>("travel");
  const [currentStep, setCurrentStep] = useState<InsuranceStep>("form");
  const [travelData, setTravelData] = useState<TravelFormData>(defaultTravelData);
  const [motorData, setMotorData] = useState<MotorFormData>(defaultMotorData);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [insuredDetails, setInsuredDetails] = useState<InsuredPerson>(defaultInsuredDetails);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(defaultPaymentDetails);
  const [policyNumber, setPolicyNumber] = useState<string>("");

  const value = {
    insuranceType,
    setInsuranceType,
    currentStep,
    setCurrentStep,
    travelData,
    setTravelData,
    motorData,
    setMotorData,
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
