import { useEffect, useMemo, useState } from "react";
import {
  Bike,
  ChefHat,
  Flame,
  LayoutDashboard,
  Megaphone,
  Menu as MenuIcon,
  Package,
  Receipt,
  Settings as SettingsIcon,
  Sparkles,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import {
  ORDER_FLOW,
  initialCustomers,
  initialDrivers,
  initialMenu,
  initialOrders,
  initialPromos,
  initialStock,
  salesByDay,
  rand,
  type Driver,
  type MenuItem,
  type Order,
  type OrderStatus,
  type Promo,
  type StockItem,
} from "./data";

const SECTIONS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Receipt },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "aichef", label: "Chef S'bongi", icon: ChefHat },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "promotions", label: "Promotions", icon: Megaphone },
  { id: "delivery", label: "Delivery", icon: Bike },
  { id: "settings", label: "Settings", icon: SettingsIcon },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const rands = (n: number) => `R${n.toLocaleString("en-ZA")}`;

function Panel({
  title,
  kicker,
  action,
  children,
  className,
}: {
  title: string;
  kicker?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          {kicker && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              {kicker}
            </p>
          )}
          <h3 className="text-2xl leading-none text-foreground">{title}</h3>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "primary" | "accent" | "success" | "info";
}) {
  const toneMap = {
    primary: "text-primary",
    accent: "text-accent",
    success: "text-success",
    info: "text-info",
  } as const;
  return (
    <div className="kasi-grain overflow-hidden rounded-xl border border-border bg-card p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-2 font-display text-4xl leading-none", toneMap[tone])}>{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

const statusTone: Record<OrderStatus, string> = {
  New: "bg-accent/15 text-accent border-accent/40",
  Cooking: "bg-primary/15 text-primary border-primary/40",
  Ready: "bg-success/15 text-success border-success/40",
  "Out for delivery": "bg-info/15 text-info border-info/40",
  Delivered: "bg-muted text-muted-foreground border-border",
};

export default function KasiApp() {
  const [section, setSection] = useState<SectionId>("dashboard");
  const [navOpen, setNavOpen] = useState(false);

  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [customers] = useState(initialCustomers);
  const [promos, setPromos] = useState<Promo[]>(initialPromos);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [storeOpen, setStoreOpen] = useState(true);

  useEffect(() => {
    if (navOpen) setNavOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const revenue = useMemo(
    () =>
      orders.reduce(
        (sum, o) => sum + o.items.reduce((s, i) => s + i.qty * i.price, 0),
        0,
      ),
    [orders],
  );
  const liveOrders = orders.filter((o) => o.status !== "Delivered").length;
  const lowStock = stock.filter((s) => s.qty < s.par);

  const advance = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = ORDER_FLOW[Math.min(ORDER_FLOW.indexOf(o.status) + 1, ORDER_FLOW.length - 1)]!;
        if (next !== o.status) toast.success(`${o.id} moved to ${next}`);
        return { ...o, status: next };
      }),
    );
  };

  const simulateOrder = () => {
    const names = ["Karabo M.", "Zodwa N.", "Tshepo R.", "Ayanda B.", "Mpho L."];
    const pick = rand(menu.filter((m) => m.available));
    const id = `KK-${1043 + orders.length}`;
    const now = new Date();
    setOrders((prev) => [
      {
        id,
        customer: rand(names),
        phone: "07x xxx xxxx",
        items: [{ name: pick.name, qty: 1 + Math.floor(Math.random() * 2), price: pick.price }],
        status: "New",
        channel: rand(["WhatsApp", "Walk-in", "Delivery app"] as const),
        placedAt: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      },
      ...prev,
    ]);
    toast(`New order ${id} just landed 🔔`, { description: `${pick.name} · fresh off WhatsApp` });
  };

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Toaster position="top-right" />
      <div className="kasi-stripe h-1.5 w-full" />

      <div className="mx-auto flex min-h-[calc(100vh-6px)] max-w-[1500px]">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            navOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between gap-2 border-b border-sidebar-border px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Flame className="size-6" />
              </div>
              <div>
                <p className="font-display text-2xl leading-none text-sidebar-foreground">
                  KasiKitchen
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
                  AI · Ekasi
                </p>
              </div>
            </div>
            <button
              onClick={() => setNavOpen(false)}
              className="text-muted-foreground lg:hidden"
              aria-label="Close navigation"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const active = section === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4.5" />
                  {s.label}
                  {s.id === "orders" && liveOrders > 0 && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-0.5 text-[11px]",
                        active ? "bg-sidebar text-primary" : "bg-accent text-accent-foreground",
                      )}
                    >
                      {liveOrders}
                    </span>
                  )}
                  {s.id === "inventory" && lowStock.length > 0 && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-0.5 text-[11px]",
                        active ? "bg-sidebar text-primary" : "bg-destructive text-destructive-foreground",
                      )}
                    >
                      {lowStock.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center justify-between rounded-lg bg-sidebar-accent px-3 py-3">
              <div>
                <p className="text-sm font-semibold">Shop status</p>
                <p className="text-xs text-muted-foreground">
                  {storeOpen ? "Open · taking orders" : "Closed for the night"}
                </p>
              </div>
              <Switch
                checked={storeOpen}
                onCheckedChange={(v) => {
                  setStoreOpen(v);
                  toast(v ? "Shop is open, let's cook 🔥" : "Shop closed. Rest well.");
                }}
              />
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Demo prototype · no live data
            </p>
          </div>
        </aside>

        {navOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}

        {/* Main */}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-background/90 px-4 py-4 backdrop-blur md:px-8">
            <button
              onClick={() => setNavOpen(true)}
              className="rounded-lg border border-border p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <MenuIcon className="size-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-3xl leading-none">
                {SECTIONS.find((s) => s.id === section)?.label}
              </h1>
              <p className="text-xs text-muted-foreground">
                Vosloorus branch · Thursday shift · Chef Phihle
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "border-success/40 bg-success/10 text-success",
                  !storeOpen && "border-border bg-muted text-muted-foreground",
                )}
              >
                {storeOpen ? "LIVE" : "CLOSED"}
              </Badge>
              <Button size="sm" onClick={simulateOrder}>
                <Sparkles className="size-4" /> Simulate order
              </Button>
            </div>
          </header>

          <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
            {section === "dashboard" && (
              <Dashboard revenue={revenue} orders={orders} lowStock={lowStock} menu={menu} />
            )}
            {section === "orders" && <Orders orders={orders} advance={advance} />}
            {section === "menu" && <MenuBoard menu={menu} setMenu={setMenu} />}
            {section === "aichef" && <AIChef />}
            {section === "inventory" && <Inventory stock={stock} setStock={setStock} />}
            {section === "customers" && <Customers customers={customers} />}
            {section === "promotions" && <Promotions promos={promos} setPromos={setPromos} />}
            {section === "delivery" && (
              <Delivery drivers={drivers} setDrivers={setDrivers} orders={orders} />
            )}
            {section === "settings" && <SettingsPanel storeOpen={storeOpen} />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

function Dashboard({
  revenue,
  orders,
  lowStock,
  menu,
}: {
  revenue: number;
  orders: Order[];
  lowStock: StockItem[];
  menu: MenuItem[];
}) {
  const top = [...menu].sort((a, b) => b.sold - a.sold).slice(0, 5);
  return (
    <>
      <div className="kasi-grain overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
          Sawubona, Chef
        </p>
        <h2 className="mt-1 text-4xl md:text-5xl">The pots are hot today 🔥</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          AI says push the Braai Pack this afternoon — month-end pay hits and the yard gets busy
          after 4pm.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Today's takings" value={rands(revenue)} hint="+18% vs last Thursday" />
        <Stat label="Live orders" value={`${orders.filter((o) => o.status !== "Delivered").length}`} hint="Kitchen queue" tone="accent" />
        <Stat label="Avg prep time" value="14 min" hint="2 min faster this week" tone="success" />
        <Stat label="Low stock" value={`${lowStock.length}`} hint="Items below par level" tone="info" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Weekly takings" kicker="Sales" className="xl:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <RTooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="sales" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Top sellers" kicker="This month">
          <ul className="space-y-3">
            {top.map((m, i) => (
              <li key={m.id} className="flex items-center gap-3">
                <span className="font-display text-2xl text-primary">{i + 1}</span>
                <span className="text-xl">{m.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.name}</p>
                  <Progress value={(m.sold / (top[0]?.sold || 1)) * 100} className="mt-1 h-1.5" />
                </div>
                <span className="text-sm text-muted-foreground">{m.sold}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Order rhythm" kicker="Footfall">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <RTooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
              />
              <Line type="monotone" dataKey="orders" stroke="var(--accent)" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </>
  );
}

/* ---------------- Orders ---------------- */

function Orders({ orders, advance }: { orders: Order[]; advance: (id: string) => void }) {
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const list = orders.filter((o) => filter === "All" || o.status === filter);

  return (
    <Panel
      title="Kitchen queue"
      kicker="Orders"
      action={
        <div className="flex flex-wrap gap-2">
          {(["All", ...ORDER_FLOW] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid gap-3">
        {list.map((o) => {
          const total = o.items.reduce((s, i) => s + i.qty * i.price, 0);
          return (
            <article
              key={o.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background/40 p-4"
            >
              <div className="min-w-40">
                <p className="font-display text-2xl leading-none">{o.id}</p>
                <p className="text-xs text-muted-foreground">
                  {o.customer} · {o.placedAt} · {o.channel}
                </p>
              </div>
              <ul className="min-w-48 flex-1 text-sm text-muted-foreground">
                {o.items.map((i) => (
                  <li key={i.name}>
                    {i.qty}× {i.name}
                  </li>
                ))}
              </ul>
              <p className="font-display text-2xl text-primary">{rands(total)}</p>
              <Badge variant="outline" className={cn("border", statusTone[o.status])}>
                {o.status}
              </Badge>
              <Button
                size="sm"
                variant={o.status === "Delivered" ? "secondary" : "default"}
                disabled={o.status === "Delivered"}
                onClick={() => advance(o.id)}
              >
                {o.status === "Delivered" ? "Done" : "Advance"}
              </Button>
            </article>
          );
        })}
        {list.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nothing in this lane right now.
          </p>
        )}
      </div>
    </Panel>
  );
}

/* ---------------- Menu ---------------- */

function MenuBoard({
  menu,
  setMenu,
}: {
  menu: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const cats = ["Braai & Meat", "Pap & Sides", "Kotas & Rolls", "Drinks"] as const;

  const addItem = () => {
    if (!name.trim() || !Number(price)) {
      toast.error("Give the dish a name and a price, chef.");
      return;
    }
    setMenu((prev) => [
      {
        id: `m${prev.length + 1}-${Date.now()}`,
        name: name.trim(),
        desc: "Freshly added to the kasi board.",
        price: Number(price),
        category: "Braai & Meat",
        available: true,
        emoji: "🍲",
        img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=60",
        sold: 0,
      },
      ...prev,
    ]);
    setName("");
    setPrice("");
    toast.success("Dish added to the board");
  };

  return (
    <>
      <Panel title="Add a dish" kicker="Menu board">
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Dish name e.g. Skopo Platter"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-w-56 flex-1"
          />
          <Input
            placeholder="Price (R)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-32"
          />
          <Button onClick={addItem}>Add to menu</Button>
        </div>
      </Panel>

      {cats.map((c) => {
        const items = menu.filter((m) => m.category === c);
        if (!items.length) return null;
        return (
          <Panel key={c} title={c} kicker="Section">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((m) => (
                <article
                  key={m.id}
                  className={cn(
                    "overflow-hidden rounded-lg border border-border bg-background/40",
                    !m.available && "opacity-55",
                  )}
                >
                  <div className="relative h-28">
                    <img
                      src={m.img}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <span className="absolute bottom-2 left-3 rounded-md bg-background/80 px-2 py-0.5 text-2xl">
                      {m.emoji}
                    </span>
                    <span className="absolute right-3 bottom-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                      {rands(m.price)}
                    </span>
                    <div className="shweshwe-band absolute inset-x-0 top-0 h-1.5 opacity-80" />
                  </div>
                  <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <p className="font-display text-3xl text-primary">{rands(m.price)}</p>
                    <div className="ml-auto flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-8"
                        onClick={() =>
                          setMenu((prev) =>
                            prev.map((x) =>
                              x.id === m.id ? { ...x, price: Math.max(5, x.price - 5) } : x,
                            ),
                          )
                        }
                      >
                        −
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-8"
                        onClick={() =>
                          setMenu((prev) =>
                            prev.map((x) => (x.id === m.id ? { ...x, price: x.price + 5 } : x)),
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">
                      {m.available ? "On the board" : "Sold out"}
                    </span>
                    <Switch
                      checked={m.available}
                      onCheckedChange={(v) => {
                        setMenu((prev) =>
                          prev.map((x) => (x.id === m.id ? { ...x, available: v } : x)),
                        );
                        toast(v ? `${m.name} is back on` : `${m.name} marked sold out`);
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </Panel>
        );
      })}
    </>
  );
}

/* ---------------- Chef S'bongi ---------------- */

const IDEAS = [
  {
    title: "Chakalaka Kota Deluxe",
    why: "Your kota sales spike after 6pm and chakalaka stock is high.",
    steps: [
      "Hollow a quarter loaf, brush inside with garlic butter.",
      "Layer chips, russian, cheese, then a heavy spoon of chakalaka.",
      "Finish with atchar and a squeeze of lemon.",
    ],
    price: 72,
    margin: "61%",
  },
  {
    title: "Braai Sunday Family Tray",
    why: "Sunday orders average 3.4 people — bundle to lift basket size.",
    steps: [
      "Marinate wors and chops overnight in kasi spice and vinegar.",
      "Grill low over coals, rest 5 minutes.",
      "Serve with pap, chakalaka and a 2L cold drink.",
    ],
    price: 289,
    margin: "48%",
  },
  {
    title: "Morogo & Feta Vetkoek",
    why: "Vegetarian searches up 22% in your area this month.",
    steps: [
      "Fry vetkoek until golden and hollow slightly.",
      "Sauté morogo with onion, chilli and garlic.",
      "Stuff, crumble feta, drizzle chilli oil.",
    ],
    price: 58,
    margin: "66%",
  },
];

const SBONGI_EXAMPLES = [
  "S'bongi, it's month-end — what special will pull a crowd?",
  "Help me use up my bread stock before Friday",
  "Give me a vegetarian kota under R60",
  "What can I plate for under R40 on a rainy Tuesday?",
  "Sunday after-church rush — what should I push?",
];

const SBONGI_SKILLS = [
  {
    emoji: "🔥",
    title: "Specials & menu ideas",
    desc: "Payday specials, seasonal dishes and combos matched to what your customers already love.",
  },
  {
    emoji: "📦",
    title: "Stock rescue",
    desc: "S'bongi checks what's sitting in your fridges and turns it into a dish before it goes to waste.",
  },
  {
    emoji: "💰",
    title: "Pricing & margins",
    desc: "Every suggestion comes with a street-smart price and an estimated margin, kasi economics included.",
  },
  {
    emoji: "🌦️",
    title: "Day & weather sense",
    desc: "Rainy Tuesday? Sunday after church? S'bongi reads the day and suggests what will move.",
  },
];

function AIChef() {
  const [prompt, setPrompt] = useState("S'bongi, it's month-end — what special will pull a crowd?");
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState<(typeof IDEAS)[number] | null>(IDEAS[0]!);

  const generate = () => {
    if (!prompt.trim()) {
      toast.error("Tell S'bongi what you're craving, my chef.");
      return;
    }
    setLoading(true);
    setIdea(null);
    setTimeout(() => {
      setIdea(rand(IDEAS));
      setLoading(false);
      toast.success("S'bongi cooked up something lekker");
    }, 1100);
  };

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary via-card to-card p-6 md:p-8 kasi-grain">
        <div className="kasi-stripe absolute inset-x-0 top-0 h-1.5" />
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
            <ChefHat className="size-8 text-primary" />
          </div>
          <div>
            <h3 className="text-3xl text-primary md:text-4xl">Sawubona, my chef! I'm S'bongi.</h3>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground md:text-base">
              Your kasi kitchen co-pilot. I know your menu, your stock, and what your neighbours are
              craving. Ask me anything — a payday special, a way to save that bread stock, or a new
              dish to make the whole street talk. Sharp sharp, let's cook.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {SBONGI_EXAMPLES.map((chip) => (
            <button
              key={chip}
              onClick={() => setPrompt(chip)}
              className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* What S'bongi can help with */}
      <Panel title="What Chef S'bongi can help with" kicker="Your co-pilot">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SBONGI_SKILLS.map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-2xl">{s.emoji}</div>
              <h4 className="mt-2 text-lg">{s.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Panel title="Chat to S'bongi" kicker="Kasi intelligence">
          <Textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. S'bongi, cheap winter dish for a rainy Tuesday"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {["Payday special", "Use up bread stock", "Vegetarian kota", "Under R40 plate"].map(
              (chip) => (
                <button
                  key={chip}
                  onClick={() => setPrompt(chip)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                >
                  {chip}
                </button>
              ),
            )}
          </div>
          <Button className="mt-4 w-full" onClick={generate} disabled={loading}>
            <ChefHat className="size-4" /> {loading ? "S'bongi is cooking…" : "Ask Chef S'bongi"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Prototype only — S'bongi's answers are pre-written demo content.
          </p>
        </Panel>

        <Panel title="S'bongi's suggestion" kicker="Fresh from the coals">
          {loading && (
            <div className="space-y-3">
              <p className="text-sm italic text-muted-foreground">
                "Eish, give me a second, my chef… something lekker is coming." 🔥
              </p>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-muted" />
              ))}
            </div>
          )}
          {!loading && idea && (
            <div className="space-y-4">
              <p className="text-sm italic text-muted-foreground">
                "Okay my chef, listen — I've got just the thing for you:"
              </p>
              <div>
                <h4 className="text-3xl text-primary">{idea.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">Why it works: {idea.why}</p>
              </div>
              <div className="flex gap-3">
                <Badge className="bg-primary text-primary-foreground">
                  Suggested price {rands(idea.price)}
                </Badge>
                <Badge variant="outline" className="border-success/40 bg-success/10 text-success">
                  Margin {idea.margin}
                </Badge>
              </div>
              <ol className="space-y-2 text-sm">
                {idea.steps.map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span className="font-display text-xl text-accent">{i + 1}</span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ol>
              <Button
                variant="secondary"
                onClick={() => toast.success("S'bongi saved it to your menu drafts")}
              >
                Save to menu drafts
              </Button>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ---------------- Inventory ---------------- */

function Inventory({
  stock,
  setStock,
}: {
  stock: StockItem[];
  setStock: React.Dispatch<React.SetStateAction<StockItem[]>>;
}) {
  const adjust = (id: string, delta: number) =>
    setStock((prev) =>
      prev.map((s) => (s.id === id ? { ...s, qty: Math.max(0, s.qty + delta) } : s)),
    );

  const low = stock.filter((s) => s.qty < s.par);

  return (
    <>
      {low.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4">
          <Package className="size-5 text-destructive" />
          <p className="flex-1 text-sm">
            <span className="font-semibold">{low.length} items below par.</span>{" "}
            <span className="text-muted-foreground">
              AI suggests ordering from {low[0]?.supplier} before the 3pm cut-off.
            </span>
          </p>
          <Button
            size="sm"
            onClick={() => {
              setStock((prev) => prev.map((s) => (s.qty < s.par ? { ...s, qty: s.par + 5 } : s)));
              toast.success("Restock order drafted with suppliers");
            }}
          >
            Auto-restock
          </Button>
        </div>
      )}

      <Panel title="Store room" kicker="Inventory">
        <div className="grid gap-3">
          {stock.map((s) => {
            const pct = Math.min(100, (s.qty / s.par) * 100);
            return (
              <div
                key={s.id}
                className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background/40 p-4"
              >
                <div className="min-w-44">
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.supplier}</p>
                </div>
                <div className="min-w-40 flex-1">
                  <Progress value={pct} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.qty} {s.unit} · par {s.par}
                  </p>
                </div>
                {s.qty < s.par ? (
                  <Badge variant="outline" className="border-destructive/40 bg-destructive/10 text-destructive">
                    Low
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-success/40 bg-success/10 text-success">
                    Healthy
                  </Badge>
                )}
                <div className="flex gap-1">
                  <Button size="icon" variant="outline" className="size-8" onClick={() => adjust(s.id, -1)}>
                    −
                  </Button>
                  <Button size="icon" variant="outline" className="size-8" onClick={() => adjust(s.id, 1)}>
                    +
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}

/* ---------------- Customers ---------------- */

function Customers({ customers }: { customers: typeof initialCustomers }) {
  const [q, setQ] = useState("");
  const list = customers.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  const tierTone = {
    Legend: "border-primary/40 bg-primary/10 text-primary",
    Gold: "border-info/40 bg-info/10 text-info",
    Regular: "border-border bg-muted text-muted-foreground",
  } as const;

  return (
    <Panel
      title="The regulars"
      kicker="Customers"
      action={
        <Input
          placeholder="Search a name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-56"
        />
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <article key={c.id} className="rounded-lg border border-border bg-background/40 p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-accent/20 font-display text-xl text-accent">
                {c.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.phone}</p>
              </div>
              <Badge variant="outline" className={cn("ml-auto", tierTone[c.tier])}>
                {c.tier}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-display text-2xl text-primary">{c.orders}</p>
                <p className="text-xs text-muted-foreground">orders</p>
              </div>
              <div>
                <p className="font-display text-2xl text-primary">{rands(c.spend)}</p>
                <p className="text-xs text-muted-foreground">lifetime spend</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Usual: {c.favourite}</p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-3 w-full"
              onClick={() => toast.success(`Voucher sent to ${c.name} on WhatsApp`)}
            >
              Send a voucher
            </Button>
          </article>
        ))}
        {list.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No customer by that name.</p>
        )}
      </div>
    </Panel>
  );
}

/* ---------------- Promotions ---------------- */

const PROMO_COPY = [
  "Sun's out, coals out ☀️🔥 Braai Pack for 6 only R280 today. Bring the crew.",
  "Kota o clock! 🥪 Buy two Full Kotas and get a free Stoney. Till stock finish.",
  "Rainy day special: hot pap & chakalaka for R25. Warm the belly, ekasi style. 🌧️",
  "Month-end move: R50 off any order over R250. Just say 'PAYDAY' at the window.",
];

function Promotions({
  promos,
  setPromos,
}: {
  promos: Promo[];
  setPromos: React.Dispatch<React.SetStateAction<Promo[]>>;
}) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const generate = () => {
    setBusy(true);
    setTimeout(() => {
      setDraft(rand(PROMO_COPY));
      setBusy(false);
    }, 800);
  };

  return (
    <>
      <Panel title="AI promo writer" kicker="Marketing">
        <Textarea
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Click generate and the AI writes kasi-flavoured promo copy…"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={generate} disabled={busy}>
            <Sparkles className="size-4" /> {busy ? "Writing…" : "Generate copy"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (!draft.trim()) {
                toast.error("Generate or write some copy first.");
                return;
              }
              setPromos((prev) => [
                {
                  id: `p${Date.now()}`,
                  title: draft.split(" ").slice(0, 4).join(" "),
                  copy: draft,
                  channel: "WhatsApp status",
                  live: true,
                  reach: 0,
                },
                ...prev,
              ]);
              setDraft("");
              toast.success("Campaign published to WhatsApp status");
            }}
          >
            Publish campaign
          </Button>
        </div>
      </Panel>

      <Panel title="Campaigns" kicker="Running now">
        <div className="grid gap-4 md:grid-cols-2">
          {promos.map((p) => (
            <article key={p.id} className="rounded-lg border border-border bg-background/40 p-4">
              <div className="flex items-center gap-2">
                <h4 className="text-2xl">{p.title}</h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-auto",
                    p.live
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-border bg-muted text-muted-foreground",
                  )}
                >
                  {p.live ? "Live" : "Paused"}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.copy}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>
                  {p.channel} · {p.reach.toLocaleString("en-ZA")} reached
                </span>
                <Switch
                  checked={p.live}
                  onCheckedChange={(v) =>
                    setPromos((prev) => prev.map((x) => (x.id === p.id ? { ...x, live: v } : x)))
                  }
                />
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </>
  );
}

/* ---------------- Delivery ---------------- */

function Delivery({
  drivers,
  setDrivers,
  orders,
}: {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  orders: Order[];
}) {
  useEffect(() => {
    const t = setInterval(() => {
      setDrivers((prev) =>
        prev.map((d) => (d.status === "On a run" ? { ...d, eta: Math.max(1, d.eta - 1) } : d)),
      );
    }, 4000);
    return () => clearInterval(t);
  }, [setDrivers]);

  const waiting = orders.filter((o) => o.status === "Ready");

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <Panel title="Riders on the road" kicker="Delivery">
        <div className="grid gap-3">
          {drivers.map((d) => (
            <div
              key={d.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background/40 p-4"
            >
              <div className="grid size-11 place-items-center rounded-full bg-primary/15 text-primary">
                <Bike className="size-5" />
              </div>
              <div className="min-w-40 flex-1">
                <p className="font-semibold">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.zone}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl text-primary">{d.drops}</p>
                <p className="text-xs text-muted-foreground">drops today</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  d.status === "Available" && "border-success/40 bg-success/10 text-success",
                  d.status === "On a run" && "border-info/40 bg-info/10 text-info",
                  d.status === "Off shift" && "border-border bg-muted text-muted-foreground",
                )}
              >
                {d.status === "On a run" ? `On a run · ${d.eta} min` : d.status}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                disabled={d.status !== "Available"}
                onClick={() => {
                  setDrivers((prev) =>
                    prev.map((x) =>
                      x.id === d.id
                        ? { ...x, status: "On a run", eta: 15, drops: x.drops + 1 }
                        : x,
                    ),
                  );
                  toast.success(`${d.name} dispatched`);
                }}
              >
                Dispatch
              </Button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Waiting for a rider" kicker="Handover">
        {waiting.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">
            Nothing packed and waiting. Kitchen is on top of it.
          </p>
        ) : (
          <ul className="space-y-3">
            {waiting.map((o) => (
              <li
                key={o.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3"
              >
                <span className="font-display text-xl">{o.id}</span>
                <span className="text-sm text-muted-foreground">{o.customer}</span>
                <Badge variant="outline" className="ml-auto border-success/40 bg-success/10 text-success">
                  Ready
                </Badge>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm">
          <p className="font-semibold text-primary">AI routing tip</p>
          <p className="mt-1 text-muted-foreground">
            Group the Zone A drops between 17:00 and 17:30 — saves roughly 22 minutes of riding.
          </p>
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- Settings ---------------- */

function SettingsPanel({ storeOpen }: { storeOpen: boolean }) {
  const [spice, setSpice] = useState([70]);
  const [radius, setRadius] = useState([6]);
  const [prefs, setPrefs] = useState({
    whatsapp: true,
    aiPricing: true,
    lowStockAlerts: true,
    loadshedding: false,
  });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Shop profile" kicker="Settings">
        <div className="space-y-4">
          <label className="block text-sm">
            <span className="text-muted-foreground">Shop name</span>
            <Input defaultValue="KasiKitchen · Vosloorus" className="mt-1" />
          </label>
          <label className="block text-sm">
            <span className="text-muted-foreground">Trading hours</span>
            <Input defaultValue="09:00 – 22:00 daily" className="mt-1" />
          </label>
          <div className="text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Default spice level</span>
              <span className="text-primary">{spice[0]}% hot</span>
            </div>
            <Slider value={spice} onValueChange={setSpice} max={100} step={5} className="mt-2" />
          </div>
          <div className="text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery radius</span>
              <span className="text-primary">{radius[0]} km</span>
            </div>
            <Slider value={radius} onValueChange={setRadius} min={1} max={15} className="mt-2" />
          </div>
          <Button onClick={() => toast.success("Settings saved (demo only)")}>Save changes</Button>
        </div>
      </Panel>

      <Panel title="Automation" kicker="Preferences">
        <div className="space-y-1">
          {(
            [
              ["whatsapp", "WhatsApp order intake", "Let customers order straight from chat"],
              ["aiPricing", "AI dynamic pricing", "Nudge prices on peak evenings"],
              ["lowStockAlerts", "Low stock alerts", "Ping when items drop below par"],
              ["loadshedding", "Load-shedding mode", "Auto-pause orders during outages"],
            ] as const
          ).map(([key, label, desc]) => (
            <div
              key={key}
              className="flex items-center gap-4 border-b border-border py-3 last:border-0"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={prefs[key]}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
              />
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-lg border border-border bg-background/40 p-4 text-sm text-muted-foreground">
          Shop is currently <span className="text-foreground">{storeOpen ? "open" : "closed"}</span>.
          This prototype keeps everything in the browser — no accounts, no servers, nothing saved.
        </div>
      </Panel>
    </div>
  );
}
