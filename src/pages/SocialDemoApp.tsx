
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Share2, ThumbsUp, MessageSquare, Send } from "lucide-react";

const SocialDemoApp = () => {
  const { toast } = useToast();
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([
    "Great app!", 
    "This works nicely across platforms"
  ]);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setLikes(likes + 1);
    toast({
      title: "Thanks for your like!",
      description: "Your engagement helps us improve."
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Thank you for your feedback!"
      });
    }
  };

  const handleShare = () => {
    // This would integrate with the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Check out this unified platform app!',
        text: 'This app works across multiple platforms including Facebook and WhatsApp.',
        url: window.location.href,
      })
      .then(() => {
        toast({
          title: "Shared successfully",
          description: "Thank you for sharing our app!"
        });
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      toast({
        title: "Share feature",
        description: "Native sharing not supported on this browser. Copy the URL to share!"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Cross-Platform Demo App</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Platform-Agnostic Content</CardTitle>
            <CardDescription>
              This app works across web, mobile, and social platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This demo showcases how a single web application can be deployed across:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Web browsers</li>
              <li>Mobile apps (via WebView)</li>
              <li>Facebook (as a tab or embedded app)</li>
              <li>WhatsApp (via link sharing)</li>
            </ul>
            <p>
              The responsive design ensures it works well on all screen sizes, and the 
              social features make it suitable for social media platforms.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleLike} variant="outline" className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Like ({likes})
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="bg-muted p-3 rounded-md">
                  {comment}
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={handleAddComment} className="rounded-l-none flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Deployment Instructions</h2>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Facebook Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This app can be integrated with Facebook Pages as a Tab application by:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>Create a Facebook Developer account</li>
                <li>Register this app in the Facebook Developer Console</li>
                <li>Add the Page Tab integration</li>
                <li>Configure the Secure Page Tab URL to point to this app</li>
              </ol>
              
              <Separator className="my-4" />
              
              <h3 className="font-medium mb-2">Mobile App Integration</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For native mobile apps, this web application can be embedded using:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>WebView components in React Native or native apps</li>
                <li>Progressive Web App (PWA) capabilities for offline support</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialDemoApp;
