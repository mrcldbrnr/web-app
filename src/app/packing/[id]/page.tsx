import { PackingListView } from "@/components/packing/PackingListView";

export default async function PackingListPage({
  params,
}: PageProps<"/packing/[id]">) {
  const { id } = await params;
  return <PackingListView id={id} />;
}
