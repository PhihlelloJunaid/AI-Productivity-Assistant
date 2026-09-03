import { createFileRoute } from "@tanstack/react-router";
import KasiApp from "@/components/kasi/KasiApp";

const title = "KasiKitchen AI — Township Kitchen Operations Demo";
const description =
  "Interactive prototype of KasiKitchen AI: orders, menu board, Chef S'bongi co-pilot, inventory, customers, promos and delivery for a township kitchen.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KasiApp,
});
