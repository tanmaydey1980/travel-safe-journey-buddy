import React, { createContext, useContext, useState, useEffect } from "react";
import { Customer, Segment, Campaign, Template } from "@/types/marketing";
import { generateDummyCustomers, generateDummySegments, generateDummyCampaigns, generateDummyTemplates } from "@/lib/dummyData";

interface MarketingContextType {
  customers: Customer[];
  segments: Segment[];
  campaigns: Campaign[];
  templates: Template[];
  filteredCustomers: Customer[];
  selectedSegment: Segment | null;
  selectedCampaign: Campaign | null;
  selectedTemplate: Template | null;
  tags: string[];  // New state for available tags
  filterCustomers: (filters: Record<string, any>) => void;
  createSegment: (segment: Omit<Segment, "id" | "createdAt" | "updatedAt" | "customerCount">) => void;
  updateSegment: (id: string, segment: Partial<Segment>) => void;
  deleteSegment: (id: string) => void;
  selectSegment: (id: string | null) => void;
  createCampaign: (campaign: Omit<Campaign, "id">) => void;
  updateCampaign: (id: string, campaign: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  selectCampaign: (id: string | null) => void;
  selectTemplate: (id: string | null) => void;
  getCustomersInSegment: (segmentId: string) => Customer[];
  addCustomer: (customer: Omit<Customer, "id">) => void;
  updateCustomer: (id: string, customerData: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addTag: (tag: string) => void;
  addTagToCustomer: (customerId: string, tag: string) => void;
  removeTagFromCustomer: (customerId: string, tag: string) => void;
}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined);

export const MarketingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    // Load dummy data
    const dummyCustomers = generateDummyCustomers(100);
    const dummySegments = generateDummySegments();
    const dummyCampaigns = generateDummyCampaigns();
    const dummyTemplates = generateDummyTemplates();

    setCustomers(dummyCustomers);
    setSegments(dummySegments);
    setCampaigns(dummyCampaigns);
    setTemplates(dummyTemplates);
    setFilteredCustomers(dummyCustomers);
    
    // Extract all unique tags from customers
    const allTags = Array.from(new Set(dummyCustomers.flatMap(c => c.tags)));
    setTags(allTags);
  }, []);

  const filterCustomers = (filters: Record<string, any>) => {
    let result = [...customers];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        switch (key) {
          case "name":
          case "email":
            result = result.filter(customer => 
              customer[key as keyof Customer].toString().toLowerCase().includes(value.toLowerCase())
            );
            break;
          case "location":
            if (value.city) {
              result = result.filter(customer => 
                customer.location.city.toLowerCase().includes(value.city.toLowerCase())
              );
            }
            if (value.state) {
              result = result.filter(customer => 
                customer.location.state.toLowerCase().includes(value.state.toLowerCase())
              );
            }
            if (value.country) {
              result = result.filter(customer => 
                customer.location.country.toLowerCase().includes(value.country.toLowerCase())
              );
            }
            break;
          case "tags":
            result = result.filter(customer => 
              value.every((tag: string) => customer.tags.includes(tag))
            );
            break;
          case "totalSpent":
            if (value.min !== undefined) {
              result = result.filter(customer => customer.totalSpent >= value.min);
            }
            if (value.max !== undefined) {
              result = result.filter(customer => customer.totalSpent <= value.max);
            }
            break;
          case "customerSince":
            if (value.from) {
              result = result.filter(customer => 
                new Date(customer.customerSince) >= new Date(value.from)
              );
            }
            if (value.to) {
              result = result.filter(customer => 
                new Date(customer.customerSince) <= new Date(value.to)
              );
            }
            break;
          case "lastPurchase":
            if (value.from) {
              result = result.filter(customer => 
                customer.lastPurchase && new Date(customer.lastPurchase) >= new Date(value.from)
              );
            }
            if (value.to) {
              result = result.filter(customer => 
                customer.lastPurchase && new Date(customer.lastPurchase) <= new Date(value.to)
              );
            }
            break;
          default:
            break;
        }
      }
    });

    setFilteredCustomers(result);
  };

  const createSegment = (segment: Omit<Segment, "id" | "createdAt" | "updatedAt" | "customerCount">) => {
    const newSegment: Segment = {
      ...segment,
      id: `segment_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerCount: 0,
    };

    setSegments([...segments, newSegment]);
  };

  const updateSegment = (id: string, segment: Partial<Segment>) => {
    const updatedSegments = segments.map(s => 
      s.id === id ? { ...s, ...segment, updatedAt: new Date().toISOString() } : s
    );
    
    setSegments(updatedSegments);

    if (selectedSegment && selectedSegment.id === id) {
      setSelectedSegment({ ...selectedSegment, ...segment, updatedAt: new Date().toISOString() });
    }
  };

  const deleteSegment = (id: string) => {
    setSegments(segments.filter(s => s.id !== id));
    
    if (selectedSegment && selectedSegment.id === id) {
      setSelectedSegment(null);
    }
  };

  const selectSegment = (id: string | null) => {
    if (id === null) {
      setSelectedSegment(null);
      return;
    }

    const segment = segments.find(s => s.id === id);
    setSelectedSegment(segment || null);
  };

  const createCampaign = (campaign: Omit<Campaign, "id">) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: `campaign_${Date.now()}`,
    };

    setCampaigns([...campaigns, newCampaign]);
  };

  const updateCampaign = (id: string, campaign: Partial<Campaign>) => {
    const updatedCampaigns = campaigns.map(c => 
      c.id === id ? { ...c, ...campaign } : c
    );
    
    setCampaigns(updatedCampaigns);

    if (selectedCampaign && selectedCampaign.id === id) {
      setSelectedCampaign({ ...selectedCampaign, ...campaign });
    }
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    
    if (selectedCampaign && selectedCampaign.id === id) {
      setSelectedCampaign(null);
    }
  };

  const selectCampaign = (id: string | null) => {
    if (id === null) {
      setSelectedCampaign(null);
      return;
    }

    const campaign = campaigns.find(c => c.id === id);
    setSelectedCampaign(campaign || null);
  };

  const selectTemplate = (id: string | null) => {
    if (id === null) {
      setSelectedTemplate(null);
      return;
    }

    const template = templates.find(t => t.id === id);
    setSelectedTemplate(template || null);
  };

  const getCustomersInSegment = (segmentId: string): Customer[] => {
    const segment = segments.find(s => s.id === segmentId);
    if (!segment) return [];

    // Apply segment filters to customer list
    return customers.filter(customer => {
      return segment.filters.every(filter => {
        switch (filter.field) {
          case "name":
          case "email":
            return customer[filter.field as keyof Customer].toString().toLowerCase().includes(filter.value.toString().toLowerCase());
          case "location.city":
            return customer.location.city.toLowerCase().includes(filter.value.toString().toLowerCase());
          case "location.state":
            return customer.location.state.toLowerCase().includes(filter.value.toString().toLowerCase());
          case "location.country":
            return customer.location.country.toLowerCase().includes(filter.value.toString().toLowerCase());
          case "tags":
            return (filter.value as string[]).every(tag => customer.tags.includes(tag));
          case "totalSpent":
            if (filter.operator === "gte") {
              return customer.totalSpent >= Number(filter.value);
            }
            if (filter.operator === "lte") {
              return customer.totalSpent <= Number(filter.value);
            }
            return true;
          case "engagementScore":
            if (filter.operator === "gte") {
              return customer.engagementScore >= Number(filter.value);
            }
            if (filter.operator === "lte") {
              return customer.engagementScore <= Number(filter.value);
            }
            return true;
          default:
            return true;
        }
      });
    });
  };

  // New function to add a customer
  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...customer,
      id: `customer_${Date.now()}`,
    };
    
    setCustomers([...customers, newCustomer]);
    setFilteredCustomers([...filteredCustomers, newCustomer]);
    
    // Add any new tags
    const newTags = customer.tags.filter(tag => !tags.includes(tag));
    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
    }
  };

  // Update customer data
  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    const updatedCustomers = customers.map(c => 
      c.id === id ? { ...c, ...customerData } : c
    );
    
    setCustomers(updatedCustomers);
    
    // Update filtered customers if the updated customer is part of it
    if (filteredCustomers.some(c => c.id === id)) {
      setFilteredCustomers(filteredCustomers.map(c => 
        c.id === id ? { ...c, ...customerData } : c
      ));
    }

    // Add any new tags
    if (customerData.tags) {
      const newTags = customerData.tags.filter(tag => !tags.includes(tag));
      if (newTags.length > 0) {
        setTags([...tags, ...newTags]);
      }
    }
  };

  // Delete a customer
  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    setFilteredCustomers(filteredCustomers.filter(c => c.id !== id));
  };

  // Add a new tag to available tags
  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  // Add a tag to a specific customer
  const addTagToCustomer = (customerId: string, tag: string) => {
    // Add to tags list if it's a new tag
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }

    // Add tag to customer
    updateCustomer(customerId, {
      tags: [
        ...customers.find(c => c.id === customerId)?.tags || [],
        tag
      ]
    });
  };

  // Remove a tag from a specific customer
  const removeTagFromCustomer = (customerId: string, tag: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      updateCustomer(customerId, {
        tags: customer.tags.filter(t => t !== tag)
      });
    }
  };

  return (
    <MarketingContext.Provider
      value={{
        customers,
        segments,
        campaigns,
        templates,
        filteredCustomers,
        selectedSegment,
        selectedCampaign,
        selectedTemplate,
        tags,
        filterCustomers,
        createSegment,
        updateSegment,
        deleteSegment,
        selectSegment,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        selectCampaign,
        selectTemplate,
        getCustomersInSegment,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addTag,
        addTagToCustomer,
        removeTagFromCustomer,
      }}
    >
      {children}
    </MarketingContext.Provider>
  );
};

export const useMarketing = () => {
  const context = useContext(MarketingContext);
  
  if (context === undefined) {
    throw new Error("useMarketing must be used within a MarketingProvider");
  }
  
  return context;
};
