//Page for editing/viewing a designer's rubric.

import EditRubric from "../../../../boundaries/EditRubric";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditRubricPage({ params }: Props) {
  const { id } = await params;
  return <EditRubric rubricId={id} />;
}
