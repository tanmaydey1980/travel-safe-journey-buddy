
import React, { useState } from 'react';
import { useMarketing } from '@/context/MarketingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Tags, Plus, Search } from 'lucide-react';

const ManageTagsDialog: React.FC = () => {
  const { tags, addTag } = useMarketing();
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      toast({
        title: "Success",
        description: "Tag added successfully",
      });
      setNewTag('');
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Tags className="mr-2 h-4 w-4" />
          Manage Tags
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter new tag"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag();
                }
              }}
            />
            <Button onClick={handleAddTag}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9"
              placeholder="Search tags..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="border rounded-md p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))
              ) : (
                <div className="w-full text-center text-muted-foreground py-8">
                  {searchQuery ? "No tags found matching your search" : "No tags available"}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTagsDialog;
