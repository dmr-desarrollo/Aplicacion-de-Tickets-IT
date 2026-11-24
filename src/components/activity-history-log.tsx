
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Activity, HistoryEntry } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface ActivityHistoryLogProps {
  activity: Activity | null;
  onSelectHistoryEntry: (entry: HistoryEntry, index: number) => void;
  selectedEntryIndex?: number | null;
}

export function ActivityHistoryLog({ activity, onSelectHistoryEntry, selectedEntryIndex }: ActivityHistoryLogProps) {
  const hasHistory = activity && activity.history && activity.history.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalle del Histórico</CardTitle>
        {activity && !hasHistory && (
             <CardDescription>
                Aún no hay acciones registradas para la actividad {activity.code}.
             </CardDescription>
        )}
         {hasHistory && (
             <CardDescription>
                Seleccione una entrada para editarla.
             </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {!activity ? (
            <div className="flex items-center justify-center h-full text-muted-foreground min-h-[300px]">
                <p>Seleccione una actividad para ver su historial.</p>
            </div>
        ) : !hasHistory ? (
          <div className="text-center text-sm text-muted-foreground py-10 min-h-[300px] flex flex-col justify-center">
            <p>No hay historial para esta actividad todavía.</p>
            <p>Agregue una acción para comenzar.</p>
          </div>
        ) : (
          <ScrollArea className="h-72">
            <div className="border rounded-md">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead className="text-right">Tiempo</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {activity.history.map((entry, index) => (
                    <TableRow 
                      key={index}
                      onClick={() => onSelectHistoryEntry(entry, index)}
                      className={cn(
                        "cursor-pointer",
                        selectedEntryIndex === index ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"
                      )}
                    >
                    <TableCell className="font-medium">
                        {format(new Date(entry.date), "dd/MM/yy")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{entry.action}</TableCell>
                    <TableCell className="text-right">{`${
                        entry.hours || 0
                    }h ${entry.minutes || 0}m`}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
