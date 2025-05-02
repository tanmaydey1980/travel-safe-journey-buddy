
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle, Home, Shield, CircleDollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QuoteOption {
  id: string;
  name: string;
  price: number;
  coverage: {
    dwelling: number;
    personalProperty: number;
    liability: number;
    deductible: number;
  };
  features: string[];
}

const HomeQuote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<QuoteOption[]>([]);

  useEffect(() => {
    // Simulate loading quotes from an API
    const timer = setTimeout(() => {
      setQuotes([
        {
          id: "basic",
          name: "Basic Coverage",
          price: 780,
          coverage: {
            dwelling: 200000,
            personalProperty: 100000,
            liability: 100000,
            deductible: 1000
          },
          features: [
            "Standard dwelling coverage",
            "Basic personal property protection",
            "Liability coverage",
            "Guest medical protection"
          ]
        },
        {
          id: "standard",
          name: "Standard Coverage",
          price: 1120,
          coverage: {
            dwelling: 300000,
            personalProperty: 150000,
            liability: 300000,
            deductible: 500
          },
          features: [
            "Enhanced dwelling coverage",
            "Extended personal property protection",
            "Higher liability limits",
            "Lower deductible",
            "Water damage coverage"
          ]
        },
        {
          id: "premium",
          name: "Premium Coverage",
          price: 1560,
          coverage: {
            dwelling: 500000,
            personalProperty: 250000,
            liability: 500000,
            deductible: 250
          },
          features: [
            "Maximum dwelling protection",
            "Full replacement cost on personal property",
            "Highest liability coverage",
            "Lowest deductible",
            "Extended water damage coverage",
            "Additional living expenses coverage",
            "Identity theft protection"
          ]
        }
      ]);
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSelectQuote = (id: string) => {
    setSelectedQuote(id);
  };
  
  const handleContinue = () => {
    if (!selectedQuote) {
      toast({
        title: "Please select a plan",
        description: "You must select a plan to continue",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would save the selected quote to your context
    navigate('/home/checkout');
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/home/form')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Form
        </Button>
        
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Your Personalized Home Insurance Quotes</h1>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Calculating your best options...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {quotes.map((quote) => (
                <Card 
                  key={quote.id}
                  className={`relative ${selectedQuote === quote.id ? 'ring-2 ring-primary' : ''}`}
                >
                  {selectedQuote === quote.id && (
                    <div className="absolute -top-3 -right-3 bg-primary text-white rounded-full p-1">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{quote.name}</CardTitle>
                    <CardDescription>
                      <div className="text-2xl font-bold text-primary mt-2">
                        {formatCurrency(quote.price)}/year
                      </div>
                      <div className="text-sm">or {formatCurrency(quote.price / 12)}/month</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Coverage Includes:</p>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-sm">Dwelling</span>
                          <span className="text-sm font-medium">{formatCurrency(quote.coverage.dwelling)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-sm">Personal Property</span>
                          <span className="text-sm font-medium">{formatCurrency(quote.coverage.personalProperty)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-sm">Liability</span>
                          <span className="text-sm font-medium">{formatCurrency(quote.coverage.liability)}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-sm">Deductible</span>
                          <span className="text-sm font-medium">{formatCurrency(quote.coverage.deductible)}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Features:</p>
                      <ul className="space-y-2">
                        {quote.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant={selectedQuote === quote.id ? "default" : "outline"} 
                      className="w-full"
                      onClick={() => handleSelectQuote(quote.id)}
                    >
                      {selectedQuote === quote.id ? "Selected" : "Select This Plan"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button size="lg" onClick={handleContinue}>
                Continue to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeQuote;
