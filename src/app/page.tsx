import { FlowNoteApp } from "@/components/layout/flownote-app";
import { getWorkspace } from "@/lib/server/data";
export default async function Home() {
  return <FlowNoteApp initialData={await getWorkspace()} />;
}
