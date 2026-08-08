import { ItemDetailView } from "@/components/items/ItemDetailView";

export default async function ItemDetailPage({
  params,
}: PageProps<"/items/[id]">) {
  const { id } = await params;
  return <ItemDetailView id={id} />;
}
