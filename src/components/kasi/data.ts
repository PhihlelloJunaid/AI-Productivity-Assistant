export type OrderStatus = "New" | "Cooking" | "Ready" | "Out for delivery" | "Delivered";

export type OrderItem = { name: string; qty: number; price: number };

export type Order = {
  id: string;
  customer: string;
  phone: string;
  items: OrderItem[];
  status: OrderStatus;
  channel: "WhatsApp" | "Walk-in" | "Delivery app";
  placedAt: string;
};

export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: "Braai & Meat" | "Pap & Sides" | "Kotas & Rolls" | "Drinks";
  available: boolean;
  emoji: string;
  sold: number;
};

export type StockItem = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  par: number;
  supplier: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  orders: number;
  spend: number;
  tier: "Regular" | "Gold" | "Legend";
  favourite: string;
};

export type Promo = {
  id: string;
  title: string;
  copy: string;
  channel: "WhatsApp status" | "Instagram" | "SMS blast";
  live: boolean;
  reach: number;
};

export type Driver = {
  id: string;
  name: string;
  zone: string;
  status: "Available" | "On a run" | "Off shift";
  drops: number;
  eta: number;
};

export const ORDER_FLOW: OrderStatus[] = [
  "New",
  "Cooking",
  "Ready",
  "Out for delivery",
  "Delivered",
];

export const initialOrders: Order[] = [
  {
    id: "KK-1042",
    customer: "Thabo Molefe",
    phone: "072 118 4420",
    items: [
      { name: "Full Kota Special", qty: 2, price: 65 },
      { name: "Stoney 500ml", qty: 2, price: 18 },
    ],
    status: "New",
    channel: "WhatsApp",
    placedAt: "11:04",
  },
  {
    id: "KK-1041",
    customer: "Nomsa Dlamini",
    phone: "083 442 1190",
    items: [
      { name: "Shisanyama Combo", qty: 1, price: 145 },
      { name: "Pap & Chakalaka", qty: 2, price: 35 },
    ],
    status: "Cooking",
    channel: "Delivery app",
    placedAt: "10:52",
  },
  {
    id: "KK-1040",
    customer: "Sipho Khoza",
    phone: "061 903 7712",
    items: [{ name: "Vetkoek & Mince x4", qty: 1, price: 80 }],
    status: "Ready",
    channel: "Walk-in",
    placedAt: "10:39",
  },
  {
    id: "KK-1039",
    customer: "Aunty Grace",
    phone: "078 220 5510",
    items: [
      { name: "Braai Pack for 6", qty: 1, price: 320 },
      { name: "Ting & Morogo", qty: 3, price: 40 },
    ],
    status: "Out for delivery",
    channel: "WhatsApp",
    placedAt: "10:15",
  },
  {
    id: "KK-1038",
    customer: "Lerato Sithole",
    phone: "074 661 3388",
    items: [{ name: "Chicken Dust Quarter", qty: 3, price: 55 }],
    status: "Delivered",
    channel: "Walk-in",
    placedAt: "09:48",
  },
];

export const initialMenu: MenuItem[] = [
  {
    id: "m1",
    name: "Full Kota Special",
    desc: "Quarter loaf, russian, polony, chips, atchar, cheese slice.",
    price: 65,
    category: "Kotas & Rolls",
    available: true,
    emoji: "🥪",
    sold: 128,
  },
  {
    id: "m2",
    name: "Shisanyama Combo",
    desc: "Flame-grilled beef & wors, pap, chakalaka, spicy gravy.",
    price: 145,
    category: "Braai & Meat",
    available: true,
    emoji: "🔥",
    sold: 96,
  },
  {
    id: "m3",
    name: "Chicken Dust Quarter",
    desc: "Open-fire quarter chicken rubbed in kasi spice.",
    price: 55,
    category: "Braai & Meat",
    available: true,
    emoji: "🍗",
    sold: 214,
  },
  {
    id: "m4",
    name: "Pap & Chakalaka",
    desc: "Soft maize pap with hot chakalaka relish.",
    price: 35,
    category: "Pap & Sides",
    available: true,
    emoji: "🌽",
    sold: 173,
  },
  {
    id: "m5",
    name: "Vetkoek & Mince",
    desc: "Golden fried dough stuffed with savoury mince.",
    price: 80,
    category: "Kotas & Rolls",
    available: false,
    emoji: "🫓",
    sold: 61,
  },
  {
    id: "m6",
    name: "Ting & Morogo",
    desc: "Fermented sorghum porridge with wild spinach.",
    price: 40,
    category: "Pap & Sides",
    available: true,
    emoji: "🥬",
    sold: 44,
  },
  {
    id: "m7",
    name: "Braai Pack for 6",
    desc: "Wors, chops, chicken, two sides — feeds the whole yard.",
    price: 320,
    category: "Braai & Meat",
    available: true,
    emoji: "🍖",
    sold: 37,
  },
  {
    id: "m8",
    name: "Stoney Ginger Beer",
    desc: "Ice cold 500ml, straight from the fridge box.",
    price: 18,
    category: "Drinks",
    available: true,
    emoji: "🥤",
    sold: 302,
  },
];

export const initialStock: StockItem[] = [
  { id: "s1", name: "Boerewors", unit: "kg", qty: 12, par: 20, supplier: "Vosloo Butchery" },
  { id: "s2", name: "Maize meal", unit: "kg", qty: 48, par: 30, supplier: "Kasi Wholesale" },
  { id: "s3", name: "Bread loaves", unit: "loaves", qty: 9, par: 25, supplier: "Corner Bakery" },
  { id: "s4", name: "Chicken portions", unit: "kg", qty: 26, par: 25, supplier: "Vosloo Butchery" },
  { id: "s5", name: "Cooking oil", unit: "L", qty: 4, par: 15, supplier: "Kasi Wholesale" },
  { id: "s6", name: "Atchar", unit: "tubs", qty: 18, par: 10, supplier: "Mama Zodwa" },
  { id: "s7", name: "Cold drinks", unit: "crates", qty: 6, par: 12, supplier: "Depot 7" },
];

export const initialCustomers: Customer[] = [
  {
    id: "c1",
    name: "Thabo Molefe",
    phone: "072 118 4420",
    orders: 41,
    spend: 3120,
    tier: "Legend",
    favourite: "Full Kota Special",
  },
  {
    id: "c2",
    name: "Nomsa Dlamini",
    phone: "083 442 1190",
    orders: 28,
    spend: 4410,
    tier: "Gold",
    favourite: "Shisanyama Combo",
  },
  {
    id: "c3",
    name: "Aunty Grace",
    phone: "078 220 5510",
    orders: 19,
    spend: 5680,
    tier: "Legend",
    favourite: "Braai Pack for 6",
  },
  {
    id: "c4",
    name: "Sipho Khoza",
    phone: "061 903 7712",
    orders: 12,
    spend: 940,
    tier: "Regular",
    favourite: "Vetkoek & Mince",
  },
  {
    id: "c5",
    name: "Lerato Sithole",
    phone: "074 661 3388",
    orders: 9,
    spend: 720,
    tier: "Regular",
    favourite: "Chicken Dust Quarter",
  },
];

export const initialPromos: Promo[] = [
  {
    id: "p1",
    title: "Month-end Braai Blowout",
    copy: "Payday hit different 🔥 Braai Pack for 6 at R280 this weekend only. Tag your crew.",
    channel: "WhatsApp status",
    live: true,
    reach: 1840,
  },
  {
    id: "p2",
    title: "Kota Two-for-Tuesday",
    copy: "Two Full Kotas, one price. R99 all Tuesday. Tell your neighbour.",
    channel: "Instagram",
    live: false,
    reach: 620,
  },
  {
    id: "p3",
    title: "Sunday Pap Special",
    copy: "Free chakalaka with every pap plate after church. Amen to that.",
    channel: "SMS blast",
    live: true,
    reach: 410,
  },
];

export const initialDrivers: Driver[] = [
  { id: "d1", name: "Katlego M.", zone: "Zone A · Vosloorus", status: "On a run", drops: 7, eta: 12 },
  { id: "d2", name: "Bongani S.", zone: "Zone B · Katlehong", status: "Available", drops: 4, eta: 0 },
  { id: "d3", name: "Zanele P.", zone: "Zone C · Thokoza", status: "On a run", drops: 9, eta: 24 },
  { id: "d4", name: "Musa N.", zone: "Zone A · Vosloorus", status: "Off shift", drops: 0, eta: 0 },
];

export const salesByDay = [
  { day: "Mon", sales: 2400, orders: 38 },
  { day: "Tue", sales: 3100, orders: 46 },
  { day: "Wed", sales: 2800, orders: 41 },
  { day: "Thu", sales: 3900, orders: 57 },
  { day: "Fri", sales: 6200, orders: 88 },
  { day: "Sat", sales: 7400, orders: 104 },
  { day: "Sun", sales: 5100, orders: 72 },
];

export const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
