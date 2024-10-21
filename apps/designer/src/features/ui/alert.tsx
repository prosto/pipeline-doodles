import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components";

interface AlertDestructiveProps {
  message: string;
}

export function AlertDestructive({
  message,
}: AlertDestructiveProps): JSX.Element {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
