
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CmsLayout from "@/components/layouts/CmsLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Facebook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CmsSocialDeploy = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);
  const [facebookPageId, setFacebookPageId] = useState("");
  const [facebookTabName, setFacebookTabName] = useState("Insurance App");
  const [includeFullApp, setIncludeFullApp] = useState(true);
  const [includeDemoOnly, setIncludeDemoOnly] = useState(false);

  React.useEffect(() => {
    const auth = localStorage.getItem("cms_authenticated");
    if (auth !== "true") {
      navigate("/cms/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleDeploy = () => {
    // Validate form
    if (!facebookPageId) {
      toast({
        title: "Missing information",
        description: "Please enter a Facebook Page ID",
        variant: "destructive",
      });
      return;
    }

    // Simulate deployment process
    setIsDeploying(true);
    
    // Mock API call
    setTimeout(() => {
      setIsDeploying(false);
      setDeploymentSuccess(true);
      
      toast({
        title: "Successfully deployed!",
        description: "Your app has been deployed to Facebook Page.",
        variant: "default",
      });

      // Reset success state after some time
      setTimeout(() => {
        setDeploymentSuccess(false);
      }, 5000);
    }, 3000);
  };

  const handlePreview = () => {
    navigate("/social-demo");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <CmsLayout title="Social Platform Deployment">
      <p className="text-muted-foreground mb-6">
        Deploy your application to social media platforms
      </p>

      <Tabs defaultValue="facebook" className="space-y-4">
        <TabsList>
          <TabsTrigger value="facebook">
            <Facebook className="mr-2 h-4 w-4" /> Facebook
          </TabsTrigger>
          <TabsTrigger value="whatsapp" disabled>
            WhatsApp (Coming Soon)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="facebook" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deploy to Facebook Page</CardTitle>
              <CardDescription>
                Configure how your app will appear as a tab on your Facebook Page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="pageId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Facebook Page ID
                </label>
                <Input
                  id="pageId"
                  placeholder="123456789012345"
                  value={facebookPageId}
                  onChange={(e) => setFacebookPageId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can find your Page ID in your Facebook Page settings
                </p>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="tabName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Tab Name
                </label>
                <Input
                  id="tabName"
                  value={facebookTabName}
                  onChange={(e) => setFacebookTabName(e.target.value)}
                />
              </div>
              
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-medium">Content Options:</h4>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="fullApp" 
                    checked={includeFullApp} 
                    onCheckedChange={(checked) => setIncludeFullApp(!!checked)}
                  />
                  <label
                    htmlFor="fullApp"
                    className="text-sm font-medium leading-none"
                  >
                    Full App (Insurance Store & Social Demo)
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="demoOnly" 
                    checked={includeDemoOnly} 
                    onCheckedChange={(checked) => setIncludeDemoOnly(!!checked)}
                  />
                  <label
                    htmlFor="demoOnly"
                    className="text-sm font-medium leading-none"
                  >
                    Social Demo Only
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePreview}>
                Preview App
              </Button>
              <Button 
                onClick={handleDeploy} 
                disabled={isDeploying || deploymentSuccess}
              >
                {isDeploying ? (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : deploymentSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Deployed
                  </>
                ) : (
                  "Deploy to Facebook"
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Integration Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <h4 className="font-medium">Steps to complete the integration:</h4>
              <ol className="list-decimal list-outside ml-4 space-y-2">
                <li>Create a Facebook Developer account if you don't have one</li>
                <li>Create a new app in the Facebook Developer Console</li>
                <li>Add the Page Tab product to your app</li>
                <li>Configure the Secure Page Tab URL with the deployment URL provided above</li>
                <li>Add the tab to your Facebook Page</li>
              </ol>
              <p className="text-sm text-muted-foreground mt-4">
                Note: This is a demo interface. In a production environment, this would connect to the 
                Facebook Graph API to create and configure the Page Tab app automatically.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </CmsLayout>
  );
};

export default CmsSocialDeploy;
