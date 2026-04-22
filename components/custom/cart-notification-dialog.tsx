"use client";

import React from "react";
import { useStore } from "@/store/cart";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartNotificationDialog() {
  const cartNotification = useStore((state) => state.cartNotification);
  const clearCartNotification = useStore((state) => state.clearCartNotification);
  const open = cartNotification !== null;

  const isSuccess = cartNotification?.type === "success";

  return (
    <Dialog open={open} onOpenChange={(open) => !open && clearCartNotification()}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={clearCartNotification}
        onEscapeKeyDown={clearCartNotification}
      >
        <DialogHeader>
          <div
            className={cn(
              "mx-auto flex h-12 w-12 items-center justify-center rounded-full",
              isSuccess ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
            )}
          >
            {isSuccess ? (
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            ) : (
              <AlertCircle className="h-7 w-7" aria-hidden />
            )}
          </div>
          <DialogTitle className="text-center">
            {isSuccess ? "Added to cart" : "Already in cart"}
          </DialogTitle>
        </DialogHeader>
        {cartNotification && (
          <p className="text-center text-muted-foreground text-sm">
            {cartNotification.message}
          </p>
        )}
        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={clearCartNotification}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
