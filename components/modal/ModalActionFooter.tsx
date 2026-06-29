import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

type ModalActionFooterProps = {
  isEdit: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  submitLabel: string;
  onCancel: () => void;
  onDelete: () => void;
};

export default function ModalActionFooter({
  isEdit,
  isSubmitting,
  isDeleting,
  submitLabel,
  onCancel,
  onDelete,
}: ModalActionFooterProps) {
  return (
    <DialogFooter className="justify-between">
      <div className="flex gap-2 flex-col sm:flex-row">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting || isDeleting}
        >
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isSubmitting || isDeleting}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
      {isEdit && (
        <Button
          type="button"
          className="bg-red-500"
          onClick={onDelete}
          isLoading={isDeleting}
          disabled={isSubmitting || isDeleting}
        >
          Delete
        </Button>
      )}
    </DialogFooter>
  );
}
