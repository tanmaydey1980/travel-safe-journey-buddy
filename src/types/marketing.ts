
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
  tags: string[];
  customerSince: string;
  lastPurchase: string | null;
  totalSpent: number;
  purchaseHistory: Purchase[];
  engagementScore: number;
}

export interface Purchase {
  id: string;
  date: string;
  amount: number;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  filters: SegmentFilter[];
  customerCount: number;
}

export interface SegmentFilter {
  id: string;
  field: string;
  operator: string;
  value: string | number | boolean | string[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: "draft" | "scheduled" | "active" | "completed";
  type: "email" | "social" | "sms" | "push";
  segmentId: string;
  content: {
    templateId: string;
    subject?: string;
    body: string;
    mediaUrl?: string;
  };
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  scheduledFor: string | null;
  sentAt: string | null;
}

export interface Template {
  id: string;
  name: string;
  type: "email" | "social" | "sms" | "push";
  thumbnail: string;
  content: string;
}
