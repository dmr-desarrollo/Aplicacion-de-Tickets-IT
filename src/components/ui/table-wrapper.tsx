
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

const TableWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative w-full overflow-auto", className)} {...props} />
));
TableWrapper.displayName = "TableWrapper"

export { TableWrapper };
