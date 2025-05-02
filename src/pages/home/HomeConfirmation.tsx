
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Home, Calendar, FileText } from "lucide-react";

const HomeConfirmation = () => {
  const navigate = useNavigate();
  const [policyNumber, setPolicyNumber] = useState('');
  
  useEffect(() => {
    // Generate a random policy number
    const generatePolicyNumber = () => {
      const prefix = 'HOM';
      const randomDigits = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
      return `${prefix}-${randomDigits}`;
    };
    
    setPolicyNumber(generatePolicyNumber());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-4 mb-6">
            <CheckCircle className="h-14 w-14 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Congratulations!</h1>
          <p className="text-lg text-muted-foreground">
            Your home insurance policy has been successfully purchased.
          </p>
        </div>
        
        <Card className="max-w-3xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>Policy Details</CardTitle>
            <CardDescription>
              Keep this information for your records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Policy Number</h3>
                <p className="text-lg font-bold">{policyNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Effective Date</h3>
                <p className="text-lg font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Insured Property</h3>
              <p className="text-lg font-bold">123 Main Street, Anytown, CA 12345</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Policy Type</h3>
                <p className="text-lg font-bold">Standard Coverage</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Annual Premium</h3>
                <p className="text-lg font-bold">$1,120.00</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium mb-1">Dwelling</p>
                <p className="font-bold">$300,000</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium mb-1">Personal Property</p>
                <p className="font-bold">$150,000</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium mb-1">Liability</p>
                <p className="font-bold">$300,000</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm font-medium mb-1">Deductible</p>
                <p className="font-bold">$500</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download Policy Documents
            </Button>
          </CardFooter>
        </Card>
        
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2" /> 
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Policy Documents</h4>
                  <p className="text-sm text-muted-foreground">
                    Your policy documents will be emailed to you within 24 hours.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Welcome Kit</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a welcome kit in the mail within 5-7 business days.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Account Setup</h4>
                  <p className="text-sm text-muted-foreground">
                    Create your online account to manage your policy anytime.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center pt-6">
            <Button onClick={() => navigate('/')} size="lg">
              Return to Home Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeConfirmation;
