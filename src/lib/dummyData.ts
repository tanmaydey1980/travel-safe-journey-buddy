
import { Customer, Segment, Campaign, Purchase, Template } from "@/types/marketing";

const citiesByCountry: Record<string, string[]> = {
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"],
  "United Kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Bristol", "Edinburgh", "Leeds"],
  "Canada": ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Quebec City", "Winnipeg"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle"],
  "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Leipzig"]
};

const statesByCountry: Record<string, string[]> = {
  "United States": ["New York", "California", "Texas", "Florida", "Illinois", "Pennsylvania", "Ohio", "Georgia"],
  "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"],
  "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick"],
  "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania"],
  "Germany": ["Bavaria", "North Rhine-Westphalia", "Baden-Württemberg", "Lower Saxony", "Hesse", "Saxony", "Berlin", "Hamburg"]
};

const productNames = [
  "Premium Widget", "Smart Device", "Luxury Watch", "Designer Bag", "Wireless Headphones",
  "Gaming Console", "Fitness Tracker", "Robot Vacuum", "4K Smart TV", "Bluetooth Speaker",
  "Coffee Maker", "Smartphone", "Laptop", "Tablet", "Digital Camera", "Drone",
  "Virtual Reality Headset", "Smart Home Hub", "Wireless Earbuds", "Air Purifier"
];

const tags = [
  "vip", "new-customer", "frequent-buyer", "high-value", "discount-seeker",
  "tech-enthusiast", "fashion-lover", "home-decor", "health-conscious", "eco-friendly",
  "budget-conscious", "luxury-buyer", "early-adopter", "social-media-active", "referral"
];

// Generate a random date within a range
const randomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// Generate a random number within a range
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Generate random purchases for a customer
const generatePurchases = (count: number): Purchase[] => {
  const purchases: Purchase[] = [];
  const now = new Date();
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(now.getFullYear() - 2);

  for (let i = 0; i < count; i++) {
    const productCount = randomNumber(1, 5);
    const products = [];

    for (let j = 0; j < productCount; j++) {
      const productName = productNames[Math.floor(Math.random() * productNames.length)];
      const price = randomNumber(10, 500);
      const quantity = randomNumber(1, 3);

      products.push({
        id: `product_${Date.now()}_${j}`,
        name: productName,
        price,
        quantity
      });
    }

    const date = randomDate(twoYearsAgo, now);
    const totalAmount = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    purchases.push({
      id: `purchase_${Date.now()}_${i}`,
      date,
      amount: totalAmount,
      products
    });
  }

  // Sort purchases by date (newest first)
  return purchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate dummy customers
export const generateDummyCustomers = (count: number): Customer[] => {
  const customers: Customer[] = [];
  const now = new Date();
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(now.getFullYear() - 3);

  for (let i = 0; i < count; i++) {
    // Select random country and corresponding state and city
    const countries = Object.keys(citiesByCountry);
    const country = countries[Math.floor(Math.random() * countries.length)];
    const states = statesByCountry[country];
    const state = states[Math.floor(Math.random() * states.length)];
    const cities = citiesByCountry[country];
    const city = cities[Math.floor(Math.random() * cities.length)];

    // Generate random tags (1-4 tags)
    const tagCount = randomNumber(1, 4);
    const customerTags = [];
    for (let j = 0; j < tagCount; j++) {
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      if (!customerTags.includes(randomTag)) {
        customerTags.push(randomTag);
      }
    }

    // Generate purchases
    const purchaseCount = randomNumber(0, 8);
    const purchases = generatePurchases(purchaseCount);

    // Calculate total spent
    const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    // Determine last purchase date
    const lastPurchase = purchases.length > 0 ? purchases[0].date : null;

    // Generate customer since date
    const customerSince = randomDate(threeYearsAgo, now);

    // Calculate engagement score (1-100)
    const engagementScore = randomNumber(1, 100);

    customers.push({
      id: `customer_${i + 1}`,
      name: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `+1${randomNumber(1000000000, 9999999999)}`,
      location: {
        city,
        state,
        country
      },
      tags: customerTags,
      customerSince,
      lastPurchase,
      totalSpent,
      purchaseHistory: purchases,
      engagementScore
    });
  }

  return customers;
};

// Generate dummy segments
export const generateDummySegments = (): Segment[] => {
  return [
    {
      id: "segment_1",
      name: "VIP Customers",
      description: "Customers who have spent more than $1000",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      filters: [
        {
          id: "filter_1",
          field: "totalSpent",
          operator: "gte",
          value: 1000
        }
      ],
      customerCount: 12
    },
    {
      id: "segment_2",
      name: "New US Customers",
      description: "Customers from the United States who joined in the last 3 months",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      filters: [
        {
          id: "filter_2",
          field: "location.country",
          operator: "equals",
          value: "United States"
        },
        {
          id: "filter_3",
          field: "customerSince",
          operator: "gte",
          value: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      customerCount: 28
    },
    {
      id: "segment_3",
      name: "Tech Enthusiasts",
      description: "Customers tagged as tech enthusiasts",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      filters: [
        {
          id: "filter_4",
          field: "tags",
          operator: "contains",
          value: ["tech-enthusiast"]
        }
      ],
      customerCount: 45
    }
  ];
};

// Generate dummy campaigns
export const generateDummyCampaigns = (): Campaign[] => {
  return [
    {
      id: "campaign_1",
      name: "Summer Sale Announcement",
      description: "Promotional email for our upcoming summer sale",
      status: "scheduled",
      type: "email",
      segmentId: "segment_1",
      content: {
        templateId: "template_1",
        subject: "Exclusive Summer Sale Preview for VIP Customers",
        body: "Dear Customer,\n\nWe're excited to invite you to our exclusive Summer Sale! As a valued VIP customer, you get early access to all our deals starting tomorrow.\n\nEnjoy up to 50% off on selected items and free shipping on all orders.\n\nThank you for your continued support!\n\nBest regards,\nMarketing Team"
      },
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      },
      scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      sentAt: null
    },
    {
      id: "campaign_2",
      name: "Welcome Series - Email 1",
      description: "First email in the welcome series for new customers",
      status: "active",
      type: "email",
      segmentId: "segment_2",
      content: {
        templateId: "template_2",
        subject: "Welcome to Our Store!",
        body: "Hello and welcome!\n\nWe're thrilled to have you join our community. Here's what you can expect from us:\n\n- Weekly updates on new products\n- Exclusive deals just for new members\n- Tips and guides related to your interests\n\nFeel free to explore our website and discover our collection.\n\nWarmly,\nThe Team"
      },
      metrics: {
        sent: 124,
        delivered: 120,
        opened: 78,
        clicked: 45,
        converted: 12
      },
      scheduledFor: null,
      sentAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "campaign_3",
      name: "Tech Product Announcement",
      description: "Social media announcement for new tech products",
      status: "draft",
      type: "social",
      segmentId: "segment_3",
      content: {
        templateId: "template_3",
        body: "Exciting news for tech lovers! Our new line of smart devices has just arrived. Check out these innovative products that will transform your daily routine. #TechInnovation #NewProducts",
        mediaUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1801&auto=format&fit=crop"
      },
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      },
      scheduledFor: null,
      sentAt: null
    }
  ];
};

// Generate dummy templates
export const generateDummyTemplates = (): Template[] => {
  return [
    {
      id: "template_1",
      name: "Promotional Email",
      type: "email",
      thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1740&auto=format&fit=crop",
      content: "<h1>{{subject}}</h1><p>{{body}}</p><a href='{{cta_url}}'>{{cta_text}}</a>"
    },
    {
      id: "template_2",
      name: "Welcome Email",
      type: "email",
      thumbnail: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=1740&auto=format&fit=crop",
      content: "<h1>{{subject}}</h1><p>{{body}}</p><a href='{{cta_url}}'>{{cta_text}}</a>"
    },
    {
      id: "template_3",
      name: "Social Media Post",
      type: "social",
      thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1674&auto=format&fit=crop",
      content: "{{body}} {{media}}"
    },
    {
      id: "template_4",
      name: "SMS Notification",
      type: "sms",
      thumbnail: "https://images.unsplash.com/photo-1622675273018-0d0bbb4a7d99?q=80&w=1740&auto=format&fit=crop",
      content: "{{body}}"
    }
  ];
};
