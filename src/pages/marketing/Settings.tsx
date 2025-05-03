
import React from 'react';
import MarketingLayout from '@/components/layouts/MarketingLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const [emailSettings, setEmailSettings] = React.useState({
    senderName: 'Marketing Team',
    senderEmail: 'marketing@example.com',
    replyToEmail: 'support@example.com',
    emailSignature: 'Best regards,\nThe Marketing Team',
    trackOpens: true,
    trackClicks: true,
    includeUnsubscribeLink: true,
  });

  const [socialSettings, setSocialSettings] = React.useState({
    facebookConnected: false,
    twitterConnected: false,
    instagramConnected: false,
    linkedinConnected: false,
  });

  const [notificationSettings, setNotificationSettings] = React.useState({
    campaignCompleted: true,
    highEngagement: true,
    lowEngagement: false,
    newSubscribers: true,
    unsubscribes: true,
  });

  const handleEmailSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: value,
    });
  };

  const handleSwitchChange = (
    setting: keyof typeof emailSettings | keyof typeof notificationSettings,
    category: 'email' | 'notification'
  ) => {
    if (category === 'email') {
      setEmailSettings({
        ...emailSettings,
        [setting]: !emailSettings[setting as keyof typeof emailSettings],
      });
    } else {
      setNotificationSettings({
        ...notificationSettings,
        [setting]: !notificationSettings[setting as keyof typeof notificationSettings],
      });
    }
  };

  const handleSocialConnect = (platform: keyof typeof socialSettings) => {
    // In a real app, this would initiate OAuth flow
    setSocialSettings({
      ...socialSettings,
      [platform]: !socialSettings[platform],
    });

    if (!socialSettings[platform]) {
      toast({
        title: "Platform connected",
        description: `Successfully connected to ${platform.replace('Connected', '')}.`
      });
    } else {
      toast({
        title: "Platform disconnected",
        description: `Disconnected from ${platform.replace('Connected', '')}.`
      });
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your marketing settings have been updated."
    });
  };

  return (
    <MarketingLayout title="Settings">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>
              Configure how your marketing emails appear to recipients.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  name="senderName"
                  value={emailSettings.senderName}
                  onChange={handleEmailSettingsChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="senderEmail">Sender Email</Label>
                <Input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  value={emailSettings.senderEmail}
                  onChange={handleEmailSettingsChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="replyToEmail">Reply-To Email</Label>
              <Input
                id="replyToEmail"
                name="replyToEmail"
                type="email"
                value={emailSettings.replyToEmail}
                onChange={handleEmailSettingsChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailSignature">Email Signature</Label>
              <textarea
                id="emailSignature"
                name="emailSignature"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={emailSettings.emailSignature}
                onChange={handleEmailSettingsChange}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackOpens">Track Opens</Label>
                  <p className="text-sm text-muted-foreground">
                    Track when recipients open your emails
                  </p>
                </div>
                <Switch
                  id="trackOpens"
                  checked={emailSettings.trackOpens}
                  onCheckedChange={() => handleSwitchChange('trackOpens', 'email')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="trackClicks">Track Clicks</Label>
                  <p className="text-sm text-muted-foreground">
                    Track when recipients click links in your emails
                  </p>
                </div>
                <Switch
                  id="trackClicks"
                  checked={emailSettings.trackClicks}
                  onCheckedChange={() => handleSwitchChange('trackClicks', 'email')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="includeUnsubscribeLink">Include Unsubscribe Link</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an unsubscribe link at the bottom of emails
                  </p>
                </div>
                <Switch
                  id="includeUnsubscribeLink"
                  checked={emailSettings.includeUnsubscribeLink}
                  onCheckedChange={() => handleSwitchChange('includeUnsubscribeLink', 'email')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Accounts</CardTitle>
            <CardDescription>
              Connect your social media accounts to publish campaigns across platforms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-border">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Facebook</p>
                      <p className="text-sm text-muted-foreground">
                        {socialSettings.facebookConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={socialSettings.facebookConnected ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleSocialConnect('facebookConnected')}
                  >
                    {socialSettings.facebookConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-400"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-sm text-muted-foreground">
                        {socialSettings.twitterConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={socialSettings.twitterConnected ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleSocialConnect('twitterConnected')}
                  >
                    {socialSettings.twitterConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-pink-600"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Instagram</p>
                      <p className="text-sm text-muted-foreground">
                        {socialSettings.instagramConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={socialSettings.instagramConnected ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleSocialConnect('instagramConnected')}
                  >
                    {socialSettings.instagramConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-700"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-sm text-muted-foreground">
                        {socialSettings.linkedinConnected ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={socialSettings.linkedinConnected ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleSocialConnect('linkedinConnected')}
                  >
                    {socialSettings.linkedinConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose when you want to receive notifications about your marketing activities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Campaign Completed</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when a campaign finishes sending
                </p>
              </div>
              <Switch
                checked={notificationSettings.campaignCompleted}
                onCheckedChange={() => handleSwitchChange('campaignCompleted', 'notification')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Engagement</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when a campaign achieves above-average engagement
                </p>
              </div>
              <Switch
                checked={notificationSettings.highEngagement}
                onCheckedChange={() => handleSwitchChange('highEngagement', 'notification')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Engagement</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when a campaign has below-average engagement
                </p>
              </div>
              <Switch
                checked={notificationSettings.lowEngagement}
                onCheckedChange={() => handleSwitchChange('lowEngagement', 'notification')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Subscribers</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new people subscribe to your marketing
                </p>
              </div>
              <Switch
                checked={notificationSettings.newSubscribers}
                onCheckedChange={() => handleSwitchChange('newSubscribers', 'notification')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Unsubscribes</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when people unsubscribe from your marketing
                </p>
              </div>
              <Switch
                checked={notificationSettings.unsubscribes}
                onCheckedChange={() => handleSwitchChange('unsubscribes', 'notification')}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </MarketingLayout>
  );
};

export default SettingsPage;
