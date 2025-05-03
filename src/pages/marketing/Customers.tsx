
import React, { useState } from 'react';
import MarketingLayout from '@/components/layouts/MarketingLayout';
import { useMarketing } from '@/context/MarketingContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Filter, X, Tags } from 'lucide-react';
import AddCustomerDialog from '@/components/marketing/AddCustomerDialog';
import ManageTagsDialog from '@/components/marketing/ManageTagsDialog';
import CustomerTagsDialog from '@/components/marketing/CustomerTagsDialog';

const CustomersPage = () => {
  const { customers, filteredCustomers, filterCustomers } = useMarketing();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    country: '',
    state: '',
    tag: '',
    spendMin: '',
    spendMax: ''
  });

  // Get unique countries, states, and tags for filter dropdowns
  const countries = Array.from(new Set(customers.map(c => c.location.country)));
  const states = Array.from(new Set(customers.map(c => c.location.state)));
  const allTags = Array.from(new Set(customers.flatMap(c => c.tags)));

  const handleSearch = () => {
    filterCustomers({
      name: searchTerm,
      email: searchTerm,
      location: {
        country: filters.country,
        state: filters.state
      },
      tags: filters.tag ? [filters.tag] : [],
      totalSpent: {
        min: filters.spendMin ? Number(filters.spendMin) : undefined,
        max: filters.spendMax ? Number(filters.spendMax) : undefined
      }
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      country: '',
      state: '',
      tag: '',
      spendMin: '',
      spendMax: ''
    });
    filterCustomers({});
  };

  const exportCustomers = () => {
    // In a real app, this would generate a CSV file for download
    console.log('Exporting customers', filteredCustomers);
    alert('Customers exported successfully!');
  };

  return (
    <MarketingLayout title="Customer List">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
            <div className="flex gap-2">
              <ManageTagsDialog />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCustomers}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <AddCustomerDialog />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {showFilters && (
            <Card className="p-4 mb-4 bg-muted/40">
              <div className="flex flex-wrap gap-4">
                <div className="w-full sm:w-[calc(33.33%-1rem)]">
                  <label className="text-sm font-medium mb-1 block">Country</label>
                  <Select
                    value={filters.country}
                    onValueChange={(value) => setFilters({...filters, country: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Countries</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-[calc(33.33%-1rem)]">
                  <label className="text-sm font-medium mb-1 block">State</label>
                  <Select
                    value={filters.state}
                    onValueChange={(value) => setFilters({...filters, state: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All States</SelectItem>
                      {states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-[calc(33.33%-1rem)]">
                  <label className="text-sm font-medium mb-1 block">Tag</label>
                  <Select
                    value={filters.tag}
                    onValueChange={(value) => setFilters({...filters, tag: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Tags</SelectItem>
                      {allTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full sm:w-[calc(50%-1rem)]">
                  <label className="text-sm font-medium mb-1 block">Total Spent (Min)</label>
                  <Input
                    type="number"
                    placeholder="Min amount"
                    value={filters.spendMin}
                    onChange={(e) => setFilters({...filters, spendMin: e.target.value})}
                  />
                </div>

                <div className="w-full sm:w-[calc(50%-1rem)]">
                  <label className="text-sm font-medium mb-1 block">Total Spent (Max)</label>
                  <Input
                    type="number"
                    placeholder="Max amount"
                    value={filters.spendMax}
                    onChange={(e) => setFilters({...filters, spendMax: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mr-2"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
                <Button onClick={handleSearch}>
                  Apply Filters
                </Button>
              </div>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Customer Since</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.location.city}, {customer.location.country}</TableCell>
                    <TableCell>{new Date(customer.customerSince).toLocaleDateString()}</TableCell>
                    <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <CustomerTagsDialog 
                        customer={customer} 
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Tags className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No customers found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </MarketingLayout>
  );
};

export default CustomersPage;
