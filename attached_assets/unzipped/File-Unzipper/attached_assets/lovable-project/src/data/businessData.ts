export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  cost: number;
  price: number;
  soldToday: number;
  soldWeek: number;
  trend: 'up' | 'down' | 'stable';
  weatherSensitive: boolean;
  seasonal: 'rainy' | 'hot' | 'cold' | 'all' | 'festival';
  lastRestocked: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  segment: 'premium' | 'frequent' | 'returning' | 'inactive';
  totalSpent: number;
  visits: number;
  avgSpend: number;
  lastVisit: string;
  loyaltyPoints: number;
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  deliveryDays: number;
  minOrder: number;
  categories: string[];
  priceIndex: number;
  contact: string;
}

export interface Transaction {
  id: string;
  product: string;
  qty: number;
  amount: number;
  method: 'cash' | 'upi' | 'card';
  time: string;
}

export interface WeatherDay {
  day: string;
  condition: 'rainy' | 'sunny' | 'hot' | 'cloudy' | 'cold' | 'storm';
  temp: number;
  humidity: number;
  wind: number;
  precipitation: number;
  uv: number;
}

export interface Festival {
  id: string;
  name: string;
  date: string;
  daysUntil: number;
  products: string[];
  demandMultiplier: number;
  offerTypes: string[];
}

export interface LocalEvent {
  id: string;
  name: string;
  date: string;
  impact: 'high' | 'medium' | 'low';
  products: string[];
  expectedRevenue: number;
}

export const products: Product[] = [
  { id: 'p1', name: 'Tea', category: 'Beverages', stock: 80, reorderLevel: 40, cost: 12, price: 20, soldToday: 45, soldWeek: 280, trend: 'up', weatherSensitive: true, seasonal: 'rainy', lastRestocked: '2 days ago' },
  { id: 'p2', name: 'Milk', category: 'Dairy', stock: 120, reorderLevel: 60, cost: 25, price: 35, soldToday: 60, soldWeek: 400, trend: 'up', weatherSensitive: true, seasonal: 'all', lastRestocked: '1 day ago' },
  { id: 'p3', name: 'Biscuits', category: 'Snacks', stock: 200, reorderLevel: 80, cost: 8, price: 15, soldToday: 55, soldWeek: 350, trend: 'up', weatherSensitive: true, seasonal: 'rainy', lastRestocked: '3 days ago' },
  { id: 'p4', name: 'Ice Cream', category: 'Frozen', stock: 100, reorderLevel: 30, cost: 30, price: 60, soldToday: 20, soldWeek: 180, trend: 'down', weatherSensitive: true, seasonal: 'hot', lastRestocked: '4 days ago' },
  { id: 'p5', name: 'Cold Drinks', category: 'Beverages', stock: 150, reorderLevel: 50, cost: 15, price: 25, soldToday: 30, soldWeek: 220, trend: 'down', weatherSensitive: true, seasonal: 'hot', lastRestocked: '2 days ago' },
  { id: 'p6', name: 'Bread', category: 'Bakery', stock: 40, reorderLevel: 30, cost: 18, price: 30, soldToday: 35, soldWeek: 210, trend: 'stable', weatherSensitive: true, seasonal: 'all', lastRestocked: '1 day ago' },
  { id: 'p7', name: 'Chips', category: 'Snacks', stock: 90, reorderLevel: 40, cost: 10, price: 20, soldToday: 40, soldWeek: 260, trend: 'up', weatherSensitive: false, seasonal: 'all', lastRestocked: '2 days ago' },
  { id: 'p8', name: 'Water Bottles', category: 'Beverages', stock: 300, reorderLevel: 100, cost: 8, price: 20, soldToday: 50, soldWeek: 320, trend: 'stable', weatherSensitive: true, seasonal: 'hot', lastRestocked: '1 day ago' },
  { id: 'p9', name: 'Instant Noodles', category: 'Instant Foods', stock: 160, reorderLevel: 50, cost: 12, price: 25, soldToday: 38, soldWeek: 240, trend: 'up', weatherSensitive: true, seasonal: 'rainy', lastRestocked: '3 days ago' },
  { id: 'p10', name: 'Coffee', category: 'Beverages', stock: 70, reorderLevel: 30, cost: 15, price: 30, soldToday: 28, soldWeek: 190, trend: 'up', weatherSensitive: true, seasonal: 'rainy', lastRestocked: '2 days ago' },
  { id: 'p11', name: 'Chocolates', category: 'Confectionery', stock: 250, reorderLevel: 60, cost: 20, price: 50, soldToday: 15, soldWeek: 120, trend: 'stable', weatherSensitive: false, seasonal: 'festival', lastRestocked: '5 days ago' },
  { id: 'p12', name: 'Dry Fruits', category: 'Premium', stock: 60, reorderLevel: 20, cost: 200, price: 400, soldToday: 5, soldWeek: 40, trend: 'up', weatherSensitive: false, seasonal: 'festival', lastRestocked: '6 days ago' },
  { id: 'p13', name: 'Umbrellas', category: 'Seasonal', stock: 25, reorderLevel: 10, cost: 80, price: 200, soldToday: 8, soldWeek: 35, trend: 'up', weatherSensitive: true, seasonal: 'rainy', lastRestocked: '1 day ago' },
  { id: 'p14', name: 'Detergent', category: 'Household', stock: 85, reorderLevel: 30, cost: 40, price: 80, soldToday: 12, soldWeek: 85, trend: 'stable', weatherSensitive: false, seasonal: 'all', lastRestocked: '4 days ago' },
  { id: 'p15', name: 'Rice 5kg', category: 'Grains', stock: 50, reorderLevel: 20, cost: 250, price: 320, soldToday: 8, soldWeek: 55, trend: 'stable', weatherSensitive: false, seasonal: 'all', lastRestocked: '3 days ago' },
  { id: 'p16', name: 'Cooking Oil 1L', category: 'Household', stock: 45, reorderLevel: 25, cost: 90, price: 140, soldToday: 18, soldWeek: 120, trend: 'stable', weatherSensitive: false, seasonal: 'all', lastRestocked: '2 days ago' },
];

export const customers: Customer[] = [
  { id: 'c1', name: 'Ramesh Kumar', phone: '+91 98765 43210', segment: 'premium', totalSpent: 45200, visits: 156, avgSpend: 290, lastVisit: 'Today', loyaltyPoints: 4520 },
  { id: 'c2', name: 'Lakshmi Devi', phone: '+91 98765 43211', segment: 'frequent', totalSpent: 28400, visits: 210, avgSpend: 135, lastVisit: 'Yesterday', loyaltyPoints: 2840 },
  { id: 'c3', name: 'Suresh Reddy', phone: '+91 98765 43212', segment: 'frequent', totalSpent: 19800, visits: 180, avgSpend: 110, lastVisit: 'Today', loyaltyPoints: 1980 },
  { id: 'c4', name: 'Padma Rao', phone: '+91 98765 43213', segment: 'returning', totalSpent: 12300, visits: 45, avgSpend: 273, lastVisit: '3 days ago', loyaltyPoints: 1230 },
  { id: 'c5', name: 'Venkat Naidu', phone: '+91 98765 43214', segment: 'premium', totalSpent: 52100, visits: 198, avgSpend: 263, lastVisit: 'Today', loyaltyPoints: 5210 },
  { id: 'c6', name: 'Sita Devi', phone: '+91 98765 43215', segment: 'returning', totalSpent: 8900, visits: 32, avgSpend: 278, lastVisit: '5 days ago', loyaltyPoints: 890 },
  { id: 'c7', name: 'Krishna Murthy', phone: '+91 98765 43216', segment: 'inactive', totalSpent: 5600, visits: 12, avgSpend: 467, lastVisit: '28 days ago', loyaltyPoints: 560 },
  { id: 'c8', name: 'Anjali Rao', phone: '+91 98765 43217', segment: 'frequent', totalSpent: 22100, visits: 165, avgSpend: 134, lastVisit: 'Yesterday', loyaltyPoints: 2210 },
  { id: 'c9', name: 'Gopal Naidu', phone: '+91 98765 43218', segment: 'inactive', totalSpent: 3400, visits: 8, avgSpend: 425, lastVisit: '45 days ago', loyaltyPoints: 340 },
  { id: 'c10', name: 'Saroja Devi', phone: '+91 98765 43219', segment: 'premium', totalSpent: 38900, visits: 175, avgSpend: 222, lastVisit: 'Today', loyaltyPoints: 3890 },
];

export const suppliers: Supplier[] = [
  { id: 's1', name: 'Sri Balaji Distributors', rating: 4.8, deliveryDays: 1, minOrder: 2000, categories: ['Beverages', 'Snacks'], priceIndex: 95, contact: '+91 90000 11111' },
  { id: 's2', name: 'Annapurna Wholesale', rating: 4.6, deliveryDays: 2, minOrder: 1500, categories: ['Grains', 'Household'], priceIndex: 92, contact: '+91 90000 22222' },
  { id: 's3', name: 'Cool Chain Foods', rating: 4.9, deliveryDays: 1, minOrder: 3000, categories: ['Frozen', 'Dairy'], priceIndex: 98, contact: '+91 90000 33333' },
  { id: 's4', name: 'Metro Suppliers', rating: 4.3, deliveryDays: 3, minOrder: 1000, categories: ['Beverages', 'Snacks', 'Household'], priceIndex: 88, contact: '+91 90000 44444' },
  { id: 's5', name: 'Festival Bazaar', rating: 4.7, deliveryDays: 2, minOrder: 2500, categories: ['Confectionery', 'Premium'], priceIndex: 96, contact: '+91 90000 55555' },
];

export const transactions: Transaction[] = [
  { id: 't1', product: 'Tea', qty: 5, amount: 100, method: 'upi', time: '10:30 AM' },
  { id: 't2', product: 'Milk', qty: 3, amount: 105, method: 'cash', time: '10:15 AM' },
  { id: 't3', product: 'Biscuits', qty: 4, amount: 60, method: 'upi', time: '09:50 AM' },
  { id: 't4', product: 'Rice 5kg', qty: 1, amount: 320, method: 'card', time: '09:30 AM' },
  { id: 't5', product: 'Cold Drinks', qty: 2, amount: 50, method: 'cash', time: '09:10 AM' },
  { id: 't6', product: 'Instant Noodles', qty: 3, amount: 75, method: 'upi', time: '08:45 AM' },
  { id: 't7', product: 'Chips', qty: 2, amount: 40, method: 'cash', time: '08:30 AM' },
  { id: 't8', product: 'Coffee', qty: 4, amount: 120, method: 'upi', time: '08:15 AM' },
];

export const weatherForecast: WeatherDay[] = [
  { day: 'Today', condition: 'cloudy', temp: 28, humidity: 65, wind: 12, precipitation: 20, uv: 4 },
  { day: 'Tomorrow', condition: 'rainy', temp: 24, humidity: 85, wind: 22, precipitation: 80, uv: 2 },
  { day: 'Day 3', condition: 'rainy', temp: 23, humidity: 88, wind: 18, precipitation: 70, uv: 2 },
  { day: 'Day 4', condition: 'sunny', temp: 30, humidity: 55, wind: 8, precipitation: 5, uv: 7 },
  { day: 'Day 5', condition: 'hot', temp: 36, humidity: 40, wind: 6, precipitation: 0, uv: 9 },
  { day: 'Day 6', condition: 'sunny', temp: 32, humidity: 50, wind: 10, precipitation: 10, uv: 8 },
  { day: 'Day 7', condition: 'cloudy', temp: 27, humidity: 70, wind: 14, precipitation: 30, uv: 5 },
];

export const festivals: Festival[] = [
  { id: 'f1', name: 'Diwali', date: 'Oct 31, 2025', daysUntil: 107, products: ['Chocolates', 'Dry Fruits', 'Cooking Oil 1L'], demandMultiplier: 3.5, offerTypes: ['Combo packs', 'Bulk discount', 'Gift hampers'] },
  { id: 'f2', name: 'Sankranti', date: 'Jan 14, 2026', daysUntil: 182, products: ['Tea', 'Chocolates', 'Dry Fruits'], demandMultiplier: 2.8, offerTypes: ['Festival special', 'Buy 2 Get 1'] },
  { id: 'f3', name: 'Independence Day', date: 'Aug 15, 2025', daysUntil: 30, products: ['Chips', 'Cold Drinks', 'Biscuits'], demandMultiplier: 1.8, offerTypes: ['Tricolor combo', 'Flag day offer'] },
  { id: 'f4', name: 'Christmas', date: 'Dec 25, 2025', daysUntil: 162, products: ['Chocolates', 'Biscuits', 'Dry Fruits'], demandMultiplier: 2.5, offerTypes: ['Gift boxes', 'Merry Christmas offer'] },
  { id: 'f5', name: 'Republic Day', date: 'Jan 26, 2026', daysUntil: 194, products: ['Chips', 'Cold Drinks', 'Snacks'], demandMultiplier: 1.5, offerTypes: ['Patriotic offer', 'Flag day combo'] },
];

export const localEvents: LocalEvent[] = [
  { id: 'e1', name: 'IPL Final Match', date: 'Jul 21, 2025', impact: 'high', products: ['Chips', 'Cold Drinks', 'Ice Cream'], expectedRevenue: 8500 },
  { id: 'e2', name: 'Local Temple Festival', date: 'Jul 25, 2025', impact: 'high', products: ['Tea', 'Milk', 'Biscuits', 'Chocolates'], expectedRevenue: 6200 },
  { id: 'e3', name: 'College Annual Day', date: 'Aug 5, 2025', impact: 'medium', products: ['Chips', 'Cold Drinks', 'Water Bottles'], expectedRevenue: 3800 },
  { id: 'e4', name: 'Public Holiday', date: 'Aug 15, 2025', impact: 'medium', products: ['Tea', 'Milk', 'Bread'], expectedRevenue: 4500 },
];

export const weeklySalesData = [
  { day: 'Mon', sales: 4200, profit: 840, customers: 85 },
  { day: 'Tue', sales: 3800, profit: 760, customers: 78 },
  { day: 'Wed', sales: 5100, profit: 1020, customers: 102 },
  { day: 'Thu', sales: 4600, profit: 920, customers: 95 },
  { day: 'Fri', sales: 6200, profit: 1240, customers: 125 },
  { day: 'Sat', sales: 7800, profit: 1560, customers: 158 },
  { day: 'Sun', sales: 6900, profit: 1380, customers: 142 },
];

export const monthlyRevenueData = [
  { month: 'Jan', revenue: 95000, expense: 62000, profit: 33000 },
  { month: 'Feb', revenue: 88000, expense: 58000, profit: 30000 },
  { month: 'Mar', revenue: 102000, expense: 65000, profit: 37000 },
  { month: 'Apr', revenue: 98000, expense: 64000, profit: 34000 },
  { month: 'May', revenue: 115000, expense: 72000, profit: 43000 },
  { month: 'Jun', revenue: 108000, expense: 68000, profit: 40000 },
  { month: 'Jul', revenue: 124000, expense: 78000, profit: 46000 },
];

export const categoryData = [
  { name: 'Beverages', value: 28, color: '#1f9e6a' },
  { name: 'Snacks', value: 22, color: '#45b985' },
  { name: 'Dairy', value: 18, color: '#7ad1a8' },
  { name: 'Household', value: 14, color: '#aee3c8' },
  { name: 'Frozen', value: 10, color: '#d6f1e3' },
  { name: 'Other', value: 8, color: '#eceef2' },
];

export const paymentMethodData = [
  { name: 'UPI', value: 45, color: '#1f9e6a' },
  { name: 'Cash', value: 35, color: '#45b985' },
  { name: 'Card', value: 20, color: '#7ad1a8' },
];

export const hourlySalesData = [
  { hour: '6-9', sales: 1200 },
  { hour: '9-12', sales: 3400 },
  { hour: '12-15', sales: 2800 },
  { hour: '15-18', sales: 2200 },
  { hour: '18-21', sales: 4100 },
  { hour: '21-23', sales: 1500 },
];

export const businessMetrics = {
  todayRevenue: 12450,
  todayProfit: 3120,
  todaySales: 384,
  activeCustomers: 785,
  avgOrderValue: 185,
  conversionRate: 68,
  repeatRate: 72,
  newCustomers: 12,
  totalProducts: 16,
  lowStockCount: 3,
  deadStockCount: 1,
  monthlyRevenue: 124000,
  monthlyProfit: 46000,
  growthRate: 14.8,
};

export const healthScores = {
  inventory: 82,
  finance: 91,
  sales: 88,
  profit: 85,
  customer: 79,
  marketing: 74,
  demand: 86,
  accuracy: 92,
  overall: 85,
};

export const achievements = [
  { id: 'a1', name: 'profitMaster', icon: 'TrendingUp', earned: true, desc: 'Achieved 40%+ profit margin for 3 months' },
  { id: 'a2', name: 'growthChampion', icon: 'Rocket', earned: true, desc: '15%+ month-over-month growth' },
  { id: 'a3', name: 'inventoryExpert', icon: 'Package', earned: true, desc: 'Maintained 80%+ stock health' },
  { id: 'a4', name: 'salesLeader', icon: 'Award', earned: true, desc: 'Crossed ₹1L monthly revenue' },
  { id: 'a5', name: 'marketingGenius', icon: 'Megaphone', earned: false, desc: 'Run 10+ successful campaigns' },
  { id: 'a6', name: 'businessInnovator', icon: 'Lightbulb', earned: false, desc: 'Adopt 5+ AI recommendations' },
];

export const growthScore = {
  current: 78,
  level: 4,
  points: 7800,
  nextLevelPoints: 10000,
  streak: 12,
};
