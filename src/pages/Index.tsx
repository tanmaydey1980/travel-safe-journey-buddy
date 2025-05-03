
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="/">
          <span className="font-bold text-lg">Demo Platform</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/marketing">
            Marketing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/store">
            Store
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/motor">
            Insurance
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" to="/social-demo">
            Social
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Welcome to Our Demo Platform
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Explore our different applications and demos to see what we can offer.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/marketing">
                    <Button size="lg">Marketing Platform</Button>
                  </Link>
                  <Link to="/store">
                    <Button size="lg" variant="outline">E-commerce Store</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  alt="Demo Image"
                  className="aspect-video rounded-xl object-cover object-center"
                  height={310}
                  src="/placeholder.svg"
                  width={550}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Explore Our Demo Applications
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Check out our various demo applications showcasing different functionalities and features.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Marketing Platform</CardTitle>
                  <CardDescription>Customer segmentation and campaign management</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p>Manage customer data, create segments, and launch targeted marketing campaigns.</p>
                </CardContent>
                <CardFooter>
                  <Link to="/marketing" className="w-full">
                    <Button className="w-full">Explore Marketing</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>E-commerce Store</CardTitle>
                  <CardDescription>Online shopping experience</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p>Browse products, add to cart, and complete the checkout process.</p>
                </CardContent>
                <CardFooter>
                  <Link to="/store" className="w-full">
                    <Button variant="outline" className="w-full">Visit Store</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Insurance Portal</CardTitle>
                  <CardDescription>Quote and policy management</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p>Get insurance quotes, customize coverage, and manage policies.</p>
                </CardContent>
                <CardFooter>
                  <Link to="/motor" className="w-full">
                    <Button variant="outline" className="w-full">Motor Insurance</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Social App</CardTitle>
                  <CardDescription>Social media demo application</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p>Experience a simplified version of a social media platform.</p>
                </CardContent>
                <CardFooter>
                  <Link to="/social-demo" className="w-full">
                    <Button variant="outline" className="w-full">Try Social App</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2025 Demo Platform. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Index;
