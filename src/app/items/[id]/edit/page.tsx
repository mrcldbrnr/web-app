import { EditItemView } from "@/components/items/EditItemView";

export default async function EditItemPage({
  params,
}: PageProps<"/items/[id]/edit">) {
  const { id } = await params;
  return <EditItemView id={id} />;
}
