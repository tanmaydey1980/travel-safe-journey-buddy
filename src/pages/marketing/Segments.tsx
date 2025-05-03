
import React, { useState } from 'react';
import MarketingLayout from '@/components/layouts/MarketingLayout';
import { useMarketing } from '@/context/MarketingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Segment, SegmentFilter } from '@/types/marketing';

const SegmentsPage = () => {
  const { segments, createSegment, updateSegment, deleteSegment, selectSegment, getCustomersInSegment } = useMarketing();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<Partial<Segment>>({
    name: '',
    description: '',
    filters: []
  });
  const [filters, setFilters] = useState<Partial<SegmentFilter>[]>([{ field: '', operator: 'equals', value: '' }]);

  const fieldOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Email', value: 'email' },
    { label: 'City', value: 'location.city' },
    { label: 'State', value: 'location.state' },
    { label: 'Country', value: 'location.country' },
    { label: 'Tags', value: 'tags' },
    { label: 'Total Spent', value: 'totalSpent' },
    { label: 'Engagement Score', value: 'engagementScore' },
  ];

  const operatorOptions = {
    default: [
      { label: 'Equals', value: 'equals' },
      { label: 'Contains', value: 'contains' },
    ],
    numeric: [
      { label: 'Greater than or equal', value: 'gte' },
      { label: 'Less than or equal', value: 'lte' },
      { label: 'Equal to', value: 'equals' },
    ],
  };

  const getOperatorOptionsForField = (field: string) => {
    if (field === 'totalSpent' || field === 'engagementScore') {
      return operatorOptions.numeric;
    }
    return operatorOptions.default;
  };

  const handleAddFilter = () => {
    setFilters([...filters, { field: '', operator: 'equals', value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const handleFilterChange = (index: number, field: string, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const handleCreateSegment = () => {
    // Validate required fields
    if (!currentSegment.name || filters.some(f => !f.field || !f.operator || f.value === '')) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please fill in all required fields."
      });
      return;
    }

    // Map filters to proper format
    const segmentFilters = filters.map((filter, index) => ({
      id: `filter_${Date.now()}_${index}`,
      field: filter.field || '',
      operator: filter.operator || 'equals',
      value: filter.value || ''
    }));

    if (isEditMode && currentSegment.id) {
      updateSegment(currentSegment.id, {
        ...currentSegment,
        filters: segmentFilters
      });
      toast({
        title: "Segment updated",
        description: `The segment "${currentSegment.name}" has been updated.`
      });
    } else {
      createSegment({
        name: currentSegment.name || '',
        description: currentSegment.description || '',
        filters: segmentFilters
      });
      toast({
        title: "Segment created",
        description: `The segment "${currentSegment.name}" has been created.`
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditSegment = (segment: Segment) => {
    setIsEditMode(true);
    setCurrentSegment(segment);
    setFilters(segment.filters);
    setIsDialogOpen(true);
  };

  const handleDeleteSegment = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the segment "${name}"?`)) {
      deleteSegment(id);
      toast({
        title: "Segment deleted",
        description: `The segment "${name}" has been deleted.`
      });
    }
  };

  const resetForm = () => {
    setCurrentSegment({
      name: '',
      description: '',
      filters: []
    });
    setFilters([{ field: '', operator: 'equals', value: '' }]);
    setIsEditMode(false);
  };

  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const previewSegment = (segmentId: string) => {
    const customers = getCustomersInSegment(segmentId);
    selectSegment(segmentId);
    toast({
      title: "Segment preview",
      description: `This segment contains ${customers.length} customers.`
    });
  };

  return (
    <MarketingLayout title="Customer Segments">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            Create targeted customer segments based on behavior, demographics, and purchasing patterns.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Segment' : 'Create New Segment'}</DialogTitle>
              <DialogDescription>
                Define your customer segment using demographic, behavioral, and purchasing criteria.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Segment Name
                </label>
                <Input
                  id="name"
                  value={currentSegment.name}
                  onChange={(e) => setCurrentSegment({...currentSegment, name: e.target.value})}
                  placeholder="Enter segment name (e.g. 'VIP Customers')"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  value={currentSegment.description}
                  onChange={(e) => setCurrentSegment({...currentSegment, description: e.target.value})}
                  placeholder="Enter a brief description of this segment"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Filters</h4>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddFilter}>
                    <Plus className="h-4 w-4 mr-1" /> Add Filter
                  </Button>
                </div>
                {filters.map((filter, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex flex-wrap gap-3">
                      <div className="flex-1">
                        <label className="text-xs font-medium mb-1 block">Field</label>
                        <Select
                          value={filter.field}
                          onValueChange={(value) => handleFilterChange(index, 'field', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium mb-1 block">Operator</label>
                        <Select
                          value={filter.operator}
                          onValueChange={(value) => handleFilterChange(index, 'operator', value)}
                          disabled={!filter.field}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {getOperatorOptionsForField(filter.field || '').map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-medium mb-1 block">Value</label>
                        <Input
                          value={filter.value ? String(filter.value) : ''}
                          onChange={(e) => {
                            const fieldType = filter.field;
                            let value: string | number = e.target.value;
                            
                            if (fieldType === 'totalSpent' || fieldType === 'engagementScore') {
                              value = e.target.value !== '' ? Number(e.target.value) : '';
                            }
                            
                            handleFilterChange(index, 'value', value);
                          }}
                          placeholder="Enter value"
                          disabled={!filter.field || !filter.operator}
                          type={filter.field === 'totalSpent' || filter.field === 'engagementScore' ? 'number' : 'text'}
                        />
                      </div>
                      {filters.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="mt-6"
                          onClick={() => handleRemoveFilter(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSegment}>
                {isEditMode ? 'Update Segment' : 'Create Segment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {segments.map((segment) => (
          <Card key={segment.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>{segment.name}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {segment.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-3">
                <Users className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="font-medium">{segment.customerCount} customers</span>
              </div>
              <div className="bg-muted/40 p-3 rounded-md max-h-32 overflow-y-auto">
                <p className="text-xs font-medium text-muted-foreground mb-2">Filters:</p>
                <ul className="space-y-1.5">
                  {segment.filters.map((filter, index) => (
                    <li key={index} className="text-xs">
                      <span className="font-medium">{fieldOptions.find(f => f.value === filter.field)?.label || filter.field}</span>
                      <span className="text-muted-foreground"> {filter.operator} </span>
                      <span className="font-medium">{filter.value.toString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="pt-0 gap-2 flex">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => previewSegment(segment.id)}
              >
                <Users className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditSegment(segment)}
              >
                <Edit className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteSegment(segment.id, segment.name)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </MarketingLayout>
  );
};

export default SegmentsPage;
