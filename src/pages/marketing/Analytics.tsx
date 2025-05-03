
import React from 'react';
import MarketingLayout from '@/components/layouts/MarketingLayout';
import { useMarketing } from '@/context/MarketingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Users, Mail, Share2, MessageSquare, ArrowUp, ArrowDown } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsPage = () => {
  const { customers, campaigns } = useMarketing();
  const [timeRange, setTimeRange] = React.useState('7d');

  // Calculate campaign metrics
  const totalSent = campaigns.reduce((sum, campaign) => sum + campaign.metrics.sent, 0);
  const totalOpened = campaigns.reduce((sum, campaign) => sum + campaign.metrics.opened, 0);
  const totalClicked = campaigns.reduce((sum, campaign) => sum + campaign.metrics.clicked, 0);
  const totalConverted = campaigns.reduce((sum, campaign) => sum + campaign.metrics.converted, 0);
  
  const openRate = totalSent > 0 ? (totalOpened / totalSent * 100).toFixed(1) : 0;
  const clickRate = totalOpened > 0 ? (totalClicked / totalOpened * 100).toFixed(1) : 0;
  const conversionRate = totalClicked > 0 ? (totalConverted / totalClicked * 100).toFixed(1) : 0;

  // Dummy data for charts
  const campaignPerformanceData = [
    { name: 'Summer Sale', sent: 450, opened: 378, clicked: 220, converted: 145 },
    { name: 'New Collection', sent: 320, opened: 250, clicked: 180, converted: 95 },
    { name: 'Holiday Special', sent: 280, opened: 214, clicked: 125, converted: 78 },
    { name: 'Exclusive Offer', sent: 390, opened: 310, clicked: 195, converted: 112 },
  ];

  const engagementTrendsData = [
    { date: '1/7', email: 65, social: 28, sms: 15 },
    { date: '2/7', email: 59, social: 32, sms: 18 },
    { date: '3/7', email: 80, social: 41, sms: 26 },
    { date: '4/7', email: 81, social: 37, sms: 22 },
    { date: '5/7', email: 56, social: 33, sms: 12 },
    { date: '6/7', email: 55, social: 42, sms: 20 },
    { date: '7/7', email: 72, social: 45, sms: 28 },
  ];

  const customersByLocationData = [
    { name: 'United States', value: 45 },
    { name: 'United Kingdom', value: 25 },
    { name: 'Canada', value: 15 },
    { name: 'Australia', value: 10 },
    { name: 'Germany', value: 5 },
  ];

  const customerMetrics = [
    { name: 'Total Customers', value: customers.length, icon: <Users className="h-5 w-5" />, change: '+5%' },
    { name: 'Email Subscribers', value: Math.floor(customers.length * 0.85), icon: <Mail className="h-5 w-5" />, change: '+12%' },
    { name: 'Social Followers', value: Math.floor(customers.length * 0.7), icon: <Share2 className="h-5 w-5" />, change: '+8%' },
    { name: 'SMS Subscribers', value: Math.floor(customers.length * 0.4), icon: <MessageSquare className="h-5 w-5" />, change: '+3%' },
  ];

  const renderCustomerMetricCard = (metric: any) => (
    <Card key={metric.name}>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="p-2 bg-primary/10 text-primary rounded-md">
            {metric.icon}
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            metric.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {metric.change.startsWith('+') ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {metric.change}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{metric.name}</p>
          <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MarketingLayout title="Analytics Dashboard">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">
            Track your marketing performance and customer engagement.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {customerMetrics.map(renderCustomerMetricCard)}
      </div>

      <div className="grid gap-6 mb-8 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Comparing campaign metrics across different marketing initiatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignPerformanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent" fill="#8884d8" name="Sent" />
                <Bar dataKey="opened" fill="#82ca9d" name="Opened" />
                <Bar dataKey="clicked" fill="#ffc658" name="Clicked" />
                <Bar dataKey="converted" fill="#ff7300" name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Distribution</CardTitle>
            <CardDescription>
              Breakdown by location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={265}>
              <PieChart>
                <Pie
                  data={customersByLocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {customersByLocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value} customers`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
          <CardDescription>
            Channel performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="combined">
            <TabsList className="mb-4">
              <TabsTrigger value="combined">Combined</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="sms">SMS</TabsTrigger>
            </TabsList>
            <TabsContent value="combined">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="email" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="social" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="sms" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="email">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="email" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="social">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="social" stroke="#82ca9d" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="sms">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sms" stroke="#ff7300" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Email Open Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">of emails sent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Click Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clickRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">of opened emails</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">of clicked links</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Avg. Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(84.28).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">per conversion</p>
          </CardContent>
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default AnalyticsPage;
