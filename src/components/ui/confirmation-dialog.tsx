import { Modal } from "./dialog";
import { Button } from "./button";
import type { Confirmation } from "@/hooks/use-confirmation";
export function ConfirmationDialog({
  confirmation,
  onRespond,
}: {
  confirmation: Confirmation | null;
  onRespond: (value: boolean) => void;
}) {
  if (!confirmation) return null;
  return (
    <Modal
      open
      title={confirmation.title}
      description={confirmation.description}
      onOpenChange={(open) => {
        if (!open) onRespond(false);
      }}
    >
      <div className="flex justify-end gap-2">
        <Button autoFocus variant="outline" onClick={() => onRespond(false)}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={() => onRespond(true)}>
          {confirmation.action}
        </Button>
      </div>
    </Modal>
  );
}
