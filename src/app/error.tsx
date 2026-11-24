"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">Ha ocurrido un error inesperado</h2>
      <p className="text-sm text-muted-foreground">
        {error.message || "Error interno de la aplicación."}
      </p>
      <Button onClick={() => reset()}>Reintentar</Button>
    </div>
  );
}
