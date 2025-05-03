
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Shield, Umbrella, FileText, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

const HomeInsurance = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/home/form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Home Insurance</h1>
        
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Protect What Matters Most</CardTitle>
              <CardDescription>
                Get comprehensive coverage for your home and belongings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our home insurance plans offer protection against damage from fire, water, weather events, and more. 
                We also cover theft, liability, and additional living expenses if you're temporarily unable to live in your home.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Dwelling Coverage</h3>
                    <p className="text-sm text-muted-foreground">Protection for your home's structure</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Personal Property</h3>
                    <p className="text-sm text-muted-foreground">Coverage for your belongings</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Umbrella className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Liability Protection</h3>
                    <p className="text-sm text-muted-foreground">If someone is injured on your property</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Additional Coverage</h3>
                    <p className="text-sm text-muted-foreground">Customize your policy with add-ons</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button size="lg" onClick={handleGetStarted} className="w-full">
                Get Your Quote Now
              </Button>
              
              <Button 
                variant="outline" 
                asChild 
                className="w-full flex items-center justify-center"
              >
                <Link to="/social-demo">
                  <Share2 className="h-5 w-5 mr-2" />
                  Try Our Social Media Demo
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have a policy? <a href="#" className="text-primary hover:underline">Log in to manage your account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeInsurance;
