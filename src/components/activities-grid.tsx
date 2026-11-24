
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Activity } from "@/lib/data";
import { format, isAfter } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { TableWrapper } from "./ui/table-wrapper";

export function ActivitiesGrid({
  activities,
  onActivitySelect,
  selectedActivityId,
}: {
  activities: Activity[];
  onActivitySelect: (activity: Activity) => void;
  selectedActivityId?: string | null;
}) {

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Fecha Reg.</TableHead>
            <TableHead>Fecha Venc.</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Prioridad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No hay actividades pendientes.
              </TableCell>
            </TableRow>
          ) : (
            activities.map((activity) => {
              const isOverdue = isAfter(new Date(), new Date(activity.dueDate));
              return (
                <TableRow
                  key={activity.id}
                  onClick={() => onActivitySelect(activity)}
                  className={cn(
                    "cursor-pointer",
                    selectedActivityId === activity.id ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"
                  )}
                >
                  <TableCell className="font-medium">{activity.code}</TableCell>
                  <TableCell>
                    {format(new Date(activity.registrationDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className={cn(isOverdue && "text-destructive font-bold")}>
                    {format(new Date(activity.dueDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{activity.client}</TableCell>
                  <TableCell>{activity.requester}</TableCell>
                  <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.clientType === 'interno' ? 'bg-blue-500/20 text-blue-800' : 'bg-purple-500/20 text-purple-800'
                      }`}>
                          {activity.clientType.charAt(0).toUpperCase() + activity.clientType.slice(1)}
                      </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.priority === "alta"
                          ? "bg-orange-500/30 text-orange-800"
                          : activity.priority === "media"
                          ? "bg-yellow-500/30 text-yellow-800"
                          : "bg-blue-500/30 text-blue-800"
                      }`}
                    >
                      {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}
