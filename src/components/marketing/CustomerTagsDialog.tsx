
import React, { useState, useEffect } from 'react';
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
import { Tags, Plus, X, Search } from 'lucide-react';
import { Customer } from '@/types/marketing';

interface CustomerTagsDialogProps {
  customer: Customer;
  trigger?: React.ReactNode;
}

const CustomerTagsDialog: React.FC<CustomerTagsDialogProps> = ({ customer, trigger }) => {
  const { tags, addTag, addTagToCustomer, removeTagFromCustomer } = useMarketing();
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerTags, setCustomerTags] = useState<string[]>([]);
  
  useEffect(() => {
    if (open && customer) {
      setCustomerTags(customer.tags || []);
    }
  }, [open, customer]);
  
  const handleAddTag = () => {
    if (newTag.trim() && !customerTags.includes(newTag.trim())) {
      addTag(newTag.trim());
      addTagToCustomer(customer.id, newTag.trim());
      setCustomerTags([...customerTags, newTag.trim()]);
      toast({
        title: "Success",
        description: "Tag added to customer",
      });
      setNewTag('');
    }
  };
  
  const toggleTag = (tag: string) => {
    if (customerTags.includes(tag)) {
      removeTagFromCustomer(customer.id, tag);
      setCustomerTags(customerTags.filter(t => t !== tag));
    } else {
      addTagToCustomer(customer.id, tag);
      setCustomerTags([...customerTags, tag]);
    }
  };
  
  const availableTags = tags.filter(tag => !customerTags.includes(tag));
  const filteredAvailableTags = availableTags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Tags className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Tags for {customer.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Current Tags</h3>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {customerTags.length > 0 ? (
                customerTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => toggleTag(tag)}
                    />
                  </Badge>
                ))
              ) : (
                <div className="w-full text-sm text-muted-foreground">
                  No tags assigned to this customer
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Create new tag"
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
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Available Tags</h3>
              <div className="relative w-[200px]">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input 
                  className="h-7 pl-7 text-sm"
                  placeholder="Search tags..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="border rounded-md p-3 min-h-[100px] max-h-[200px] overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {filteredAvailableTags.length > 0 ? (
                  filteredAvailableTags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <div className="w-full text-center text-muted-foreground py-6 text-sm">
                    {searchQuery ? "No tags found matching your search" : "No additional tags available"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerTagsDialog;
