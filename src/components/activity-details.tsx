
"use client";

import { useState, useEffect } from "react";
import type { Activity, HistoryEntry } from "@/lib/data";
import { Button, buttonVariants } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Save, X, Trash2, CheckCircle, Calendar as CalendarIcon, RefreshCcw, Ban, Pencil } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface ActivityDetailsProps {
  activity: Activity | null;
  onSaveHistory: (activityId: string, action: string, hours: number, minutes: number, date: Date) => Promise<void>;
  onUpdateHistory: (activityId: string, index: number, updatedEntry: Omit<HistoryEntry, 'date'> & { date: Date }) => Promise<void>;
  onCompleteTask: (activityId: string, action: string, hours: number, minutes: number, date: Date) => Promise<void>;
  onClear: () => void;
  onEdit: () => void;
  onDelete: (activityId: string) => Promise<void>;
  editingEntry: { entry: HistoryEntry, index: number } | null;
  onCancelEdit: () => void;
}

export function ActivityDetails({
  activity,
  onSaveHistory,
  onUpdateHistory,
  onCompleteTask,
  onClear,
  onEdit,
  onDelete,
  editingEntry,
  onCancelEdit,
}: ActivityDetailsProps) {
  const [action, setAction] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(new Date());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();
  
  const isEditing = editingEntry !== null;

  useEffect(() => {
    if (isEditing) {
      setAction(editingEntry.entry.action);
      setHours(editingEntry.entry.hours || 0);
      setMinutes(editingEntry.entry.minutes || 0);
      setFollowUpDate(new Date(editingEntry.entry.date));
    } else {
      resetForm();
    }
  }, [editingEntry, activity]);

  const resetForm = () => {
    setAction("");
    setHours(0);
    setMinutes(0);
    setFollowUpDate(new Date());
  };

  const handleSave = async () => {
    if (activity && action.trim() && followUpDate) {
      try {
        if (isEditing) {
          await onUpdateHistory(activity.id, editingEntry.index, { action: action.trim(), hours, minutes, date: followUpDate });
        } else {
          await onSaveHistory(activity.id, action.trim(), hours, minutes, followUpDate);
        }
        resetForm();
      } catch (error) {
        console.error("Error guardando acción de historial:", error);
        toast({
          title: "Error al guardar",
          description: "No se pudo guardar la acción. Inténtelo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  const handleComplete = async () => {
    if (activity && action.trim() && followUpDate) {
      try {
        await onCompleteTask(activity.id, action.trim(), hours, minutes, followUpDate);
        resetForm();
      } catch (error) {
        console.error("Error completando tarea:", error);
        toast({
          title: "Error al completar",
          description: "No se pudo completar la tarea. Inténtelo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleCancelEdit = () => {
    onCancelEdit();
    resetForm();
  };

  if (!activity) {
    return null;
  }
  
  const calculateTotalTime = () => {
    const totalMinutes = activity.history.reduce((acc, entry) => {
        const h = entry.hours || 0;
        const m = entry.minutes || 0;
        return acc + h * 60 + m;
    }, 0);

    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs}h ${mins}m`;
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
              <div>
                  <CardTitle>{isEditing ? 'Editando Acción' : 'Registrar Acción'}</CardTitle>
                   <CardDescription>
                    Actividad: {activity.code} | Solicitante: {activity.requester}
                    <br/>
                    Tiempo total: {calculateTotalTime()}
                  </CardDescription>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                    <Pencil className="h-4 w-4"/>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(true)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4"/>
                </Button>
                <Button variant="ghost" size="icon" onClick={onClear} className="h-8 w-8">
                    <X className="h-5 w-5"/>
                </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">{isEditing ? 'Fecha de Acción' : 'Fecha Seguimiento'}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !followUpDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {followUpDate ? format(followUpDate, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={followUpDate}
                      onSelect={setFollowUpDate}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
          </div>
          <div>
            <Label htmlFor="action">Descripción de la Acción</Label>
            <Textarea
              id="action"
              placeholder="Describe la acción realizada..."
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hours">Horas</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="minutes">Minutos</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button onClick={handleSave} disabled={!action.trim()}>
                  <RefreshCcw className="mr-2 h-4 w-4"/> Actualizar
              </Button>
              <Button onClick={handleCancelEdit} variant="outline">
                  <Ban className="mr-2 h-4 w-4" /> Cancelar
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 w-full">
                  <Button onClick={handleSave} disabled={!action.trim()}>
                      <Save className="mr-2"/> Guardar Acción
                  </Button>
                  <Button onClick={resetForm} variant="outline">
                      <Trash2 className="mr-2" /> Limpiar
                  </Button>
              </div>
              <Button onClick={handleComplete} disabled={!action.trim()} className="w-full" variant="destructive">
                  <CheckCircle className="mr-2" /> Completar Tarea
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro que desea eliminar?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la actividad y todo su historial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (activity) {
                  try {
                    await onDelete(activity.id);
                  } catch (error) {
                    console.error("Error eliminando actividad:", error);
                    toast({
                      title: "Error al eliminar",
                      description: "No se pudo eliminar la actividad. Inténtelo de nuevo.",
                      variant: "destructive",
                    });
                  }
                }
              }}
              className={buttonVariants({ variant: "destructive" })}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
