
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
