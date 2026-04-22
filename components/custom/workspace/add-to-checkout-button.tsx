"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWorkspaceCheckoutStore } from "@/store/workspace-checkout";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface AddToCheckoutButtonProps {
  workspaceId: string;
  workspaceData: any;
  type: string;
  detail: string;
}

export default function AddToCheckoutButton({
  workspaceId,
  workspaceData,
  type,
  detail,
}: AddToCheckoutButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addWorkspace } = useWorkspaceCheckoutStore();
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenDialog = () => {
    // Check if user is authenticated
    if (status === "loading") {
      return; // Wait for session to load
    }

    if (!session || status !== "authenticated") {
      // Redirect to auth with callback URL
      router.push(`/auth`);
      return;
    }

    // Open dialog
    setOpen(true);
  };

  const handleAddToCheckout = () => {
    // Validate duration
    const durationNum = parseInt(duration, 10);
    if (!duration || isNaN(durationNum) || durationNum <= 0) {
      toast.error("Please enter a valid duration (number greater than 0)");
      return;
    }

    setIsSubmitting(true);

    // Add workspace to checkout store with duration
    addWorkspace({
      workspaceId: workspaceId,
      title: workspaceData?.title || "Workspace",
      location: workspaceData?.location,
      featured_image: workspaceData?.featured_image,
      itemId: workspaceData?.id, // Static value as requested
      duration: durationNum.toString(),
      meta: workspaceData,
    });

    setIsSubmitting(false);
    setOpen(false);
    setDuration("");

    // Redirect to checkout page
    router.push("/workspace/checkout");
  };

  return (
    <>
      <Button
        variant="orange"
        size="lg"
        onClick={handleOpenDialog}
        className="py-6"
        disabled={status === "loading"}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        {status === "loading" ? "Loading..." : "Add to Checkout"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Duration</DialogTitle>
            <DialogDescription>
              Please enter the duration (in {workspaceData?.price_type === "per_day"
                  ? "days"
                  : workspaceData?.price_type === "per_hour"
                  ? "hours"
                  : "months"}) for this workspace booking.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Duration ({workspaceData?.price_type === "per_day"
                  ? "days"
                  : workspaceData?.price_type === "per_hour"
                  ? "hours"
                  : "months"})
            </label>
            <Input
              id="duration"
              type="number"
              min="1"
              placeholder={
                workspaceData?.price_type === "per_day"
                  ? "No. of days"
                  : workspaceData?.price_type === "per_hour"
                  ? "No. of hours"
                  : "No. of months"
              }
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddToCheckout();
                }
              }}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setDuration("");
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="orange"
              onClick={handleAddToCheckout}
              disabled={
                isSubmitting || !duration || parseInt(duration, 10) <= 0
              }
            >
              {isSubmitting ? "Adding..." : "Add to Checkout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
