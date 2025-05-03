
import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketing } from '@/context/MarketingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Filter, 
  Send, 
  LineChart,
  BarChart3,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

const MarketingLanding = () => {
  const { customers, segments, campaigns } = useMarketing();

  const features = [
    {
      title: "Customer Management",
      description: "View and filter customer data based on demographics, behavior, and purchase history.",
      icon: <Users className="h-10 w-10 text-primary" />,
      link: "/marketing/customers",
      count: customers.length,
      label: "Total Customers"
    },
    {
      title: "Audience Segmentation",
      description: "Create targeted customer segments with flexible and powerful filtering options.",
      icon: <Filter className="h-10 w-10 text-primary" />,
      link: "/marketing/segments",
      count: segments.length,
      label: "Active Segments"
    },
    {
      title: "Campaign Creation",
      description: "Design and send personalized marketing campaigns across multiple channels.",
      icon: <Send className="h-10 w-10 text-primary" />,
      link: "/marketing/campaigns",
      count: campaigns.length,
      label: "Campaigns"
    },
    {
      title: "Performance Analytics",
      description: "Track campaign performance and customer engagement with detailed analytics.",
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
      link: "/marketing/analytics",
      count: "-",
      label: "Insights Dashboard"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Marketing Platform</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              A powerful solution for customer segmentation, campaign management, and marketing analytics
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link to="/marketing/customers">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/marketing/analytics">
                  View Analytics
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">{feature.count}</p>
                    <p className="text-sm text-muted-foreground">{feature.label}</p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={feature.link}>
                      View <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{customers.length}</p>
                  <p className="text-muted-foreground">Total Customers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{segments.length}</p>
                  <p className="text-muted-foreground">Customer Segments</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{campaigns.length}</p>
                  <p className="text-muted-foreground">Marketing Campaigns</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">24/7</p>
                  <p className="text-muted-foreground">Customer Support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to start your marketing campaign?</h2>
              <p className="text-primary-foreground/80">
                Launch targeted campaigns to your segmented audience in minutes.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link to="/marketing/campaigns">
                Create Campaign <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default MarketingLanding;
