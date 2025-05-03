
import React, { useState } from 'react';
import MarketingLayout from '@/components/layouts/MarketingLayout';
import { useMarketing } from '@/context/MarketingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  BarChart3, 
  Send, 
  Mail, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Share2,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CampaignsPage = () => {
  const { campaigns, segments, templates, createCampaign, updateCampaign, deleteCampaign, selectCampaign, getCustomersInSegment } = useMarketing();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    status: 'draft',
    type: 'email',
    segmentId: '',
    templateId: '',
    subject: '',
    body: '',
    scheduledFor: ''
  });

  const filteredCampaigns = currentTab === 'all' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.status === currentTab);

  const handleCreateCampaign = () => {
    // Validate form fields
    if (!campaignData.name || !campaignData.type || !campaignData.segmentId || !campaignData.templateId) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields."
      });
      return;
    }

    // Validate email subject for email campaigns
    if (campaignData.type === 'email' && !campaignData.subject) {
      toast({
        variant: "destructive",
        title: "Missing subject line",
        description: "Email campaigns require a subject line."
      });
      return;
    }

    // Get customer count in the selected segment
    const selectedSegment = segments.find(s => s.id === campaignData.segmentId);
    if (!selectedSegment) return;

    const customersInSegment = getCustomersInSegment(campaignData.segmentId);

    // Create the campaign
    const newCampaign = {
      name: campaignData.name,
      description: campaignData.description,
      status: campaignData.scheduledFor ? 'scheduled' : 'draft' as 'draft' | 'scheduled',
      type: campaignData.type as 'email' | 'social' | 'sms' | 'push',
      segmentId: campaignData.segmentId,
      content: {
        templateId: campaignData.templateId,
        subject: campaignData.type === 'email' ? campaignData.subject : undefined,
        body: campaignData.body,
      },
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      },
      scheduledFor: campaignData.scheduledFor ? new Date(campaignData.scheduledFor).toISOString() : null,
      sentAt: null
    };

    createCampaign(newCampaign);
    
    toast({
      title: "Campaign created",
      description: `Campaign "${campaignData.name}" targeting ${customersInSegment.length} customers has been created.`
    });

    // Reset form and close dialog
    resetCampaignForm();
    setIsDialogOpen(false);
  };

  const resetCampaignForm = () => {
    setCampaignData({
      name: '',
      description: '',
      status: 'draft',
      type: 'email',
      segmentId: '',
      templateId: '',
      subject: '',
      body: '',
      scheduledFor: ''
    });
  };

  const handleDeleteCampaign = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete campaign "${name}"?`)) {
      deleteCampaign(id);
      toast({
        title: "Campaign deleted",
        description: `Campaign "${name}" has been deleted.`
      });
    }
  };

  const handleEditCampaign = (id: string) => {
    selectCampaign(id);
    toast({
      title: "Campaign edit",
      description: "Campaign editing is not available in this demo."
    });
  };

  const getCampaignStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-primary" />;
      case 'active':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-muted-foreground" />;
      case 'social':
        return <Share2 className="h-4 w-4 text-muted-foreground" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const handleSendCampaign = (id: string, name: string) => {
    updateCampaign(id, {
      status: 'active',
      sentAt: new Date().toISOString()
    });
    
    toast({
      title: "Campaign sent",
      description: `Campaign "${name}" has been sent successfully!`
    });
    
    // In a real app, this would trigger the actual sending process
    setTimeout(() => {
      updateCampaign(id, {
        status: 'completed',
        metrics: {
          sent: 120,
          delivered: 117,
          opened: 89,
          clicked: 42,
          converted: 18
        }
      });
    }, 3000);
  };

  return (
    <MarketingLayout title="Marketing Campaigns">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            Create and manage marketing campaigns across multiple channels.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetCampaignForm();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up your campaign details and content.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Campaign Name
                  </label>
                  <Input
                    id="name"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({...campaignData, name: e.target.value})}
                    placeholder="Enter campaign name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={campaignData.description}
                    onChange={(e) => setCampaignData({...campaignData, description: e.target.value})}
                    placeholder="Enter a brief description"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      Campaign Type
                    </label>
                    <Select
                      value={campaignData.type}
                      onValueChange={(value) => setCampaignData({...campaignData, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="social">Social Media</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="segment" className="text-sm font-medium">
                      Target Segment
                    </label>
                    <Select
                      value={campaignData.segmentId}
                      onValueChange={(value) => setCampaignData({...campaignData, segmentId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent>
                        {segments.map((segment) => (
                          <SelectItem key={segment.id} value={segment.id}>
                            {segment.name} ({segment.customerCount})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="template" className="text-sm font-medium">
                    Template
                  </label>
                  <Select
                    value={campaignData.templateId}
                    onValueChange={(value) => setCampaignData({...campaignData, templateId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates
                        .filter(template => template.type === campaignData.type)
                        .map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {campaignData.type === 'email' && (
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject Line
                    </label>
                    <Input
                      id="subject"
                      value={campaignData.subject}
                      onChange={(e) => setCampaignData({...campaignData, subject: e.target.value})}
                      placeholder="Enter email subject line"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="body" className="text-sm font-medium">
                    Message Content
                  </label>
                  <Textarea
                    id="body"
                    value={campaignData.body}
                    onChange={(e) => setCampaignData({...campaignData, body: e.target.value})}
                    placeholder="Enter your message content"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="scheduledFor" className="text-sm font-medium">
                    Schedule (optional)
                  </label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={campaignData.scheduledFor}
                    onChange={(e) => setCampaignData({...campaignData, scheduledFor: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCampaign}>
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCampaigns.map((campaign) => {
          const segment = segments.find(s => s.id === campaign.segmentId);
          return (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getCampaignTypeIcon(campaign.type)}
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {campaign.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center px-2 py-1 rounded-full bg-muted text-xs font-medium gap-1">
                    {getCampaignStatusIcon(campaign.status)}
                    <span className="capitalize">{campaign.status}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Segment:</span>{' '}
                    <span className="text-muted-foreground">{segment?.name || 'Unknown'}</span>
                  </div>
                  
                  {campaign.scheduledFor && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Scheduled: {new Date(campaign.scheduledFor).toLocaleString()}</span>
                    </div>
                  )}
                  
                  {campaign.sentAt && (
                    <div className="flex items-center gap-1.5">
                      <Send className="h-4 w-4 text-muted-foreground" />
                      <span>Sent: {new Date(campaign.sentAt).toLocaleString()}</span>
                    </div>
                  )}
                  
                  {campaign.status === 'completed' && (
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <div className="text-xs">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          <div>Sent: {campaign.metrics.sent}</div>
                          <div>Opened: {campaign.metrics.opened}</div>
                          <div>Delivered: {campaign.metrics.delivered}</div>
                          <div>Clicked: {campaign.metrics.clicked}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-0 gap-2 flex">
                {campaign.status === 'draft' || campaign.status === 'scheduled' ? (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSendCampaign(campaign.id, campaign.name)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      // View detailed analytics (not implemented in this demo)
                      toast({
                        title: "Analytics",
                        description: "Campaign analytics is not available in this demo."
                      });
                    }}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditCampaign(campaign.id)}
                >
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {filteredCampaigns.length === 0 && (
        <div className="text-center py-12 bg-muted/40 rounded-md">
          <p className="text-muted-foreground">No campaigns found in this category.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create your first campaign
          </Button>
        </div>
      )}
    </MarketingLayout>
  );
};

export default CampaignsPage;
