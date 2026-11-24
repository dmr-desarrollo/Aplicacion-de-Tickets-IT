
"use client";

import { useState, useEffect, Suspense, useContext } from "react";
import { useSearchParams } from 'next/navigation';
import type { Activity, Client, HistoryEntry } from "@/lib/data";
import { ActivitiesGrid } from "@/components/activities-grid";
import { ActivityDetails } from "@/components/activity-details";
import { ActivityDescription } from "@/components/activity-description";
import { ActivityHistoryLog } from "@/components/activity-history-log";
import { NewActivityDialog } from "@/components/new-activity-dialog";
import { EditActivityDialog } from "@/components/edit-activity-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { isAfter } from "date-fns";
import { ActivityContext } from "@/context/activity-context";


type Priority = 'todos' | 'alta' | 'media' | 'baja';

function TasksComponent() {
  const { 
    activities, 
    clients, 
    addActivity, 
    addClient, 
    addHistoryEntry,
    updateHistoryEntry,
    closeActivity,
    updateActivity,
    deleteActivity
  } = useContext(ActivityContext);

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<{ entry: HistoryEntry, index: number } | null>(null);
  const [typeFilter, setTypeFilter] = useState("todos");
  const [priorityFilter, setPriorityFilter] = useState<Priority>("todos");
  const [isNewActivityDialogOpen, setIsNewActivityDialogOpen] = useState(false);
  const [isEditActivityDialogOpen, setIsEditActivityDialogOpen] = useState(false);
  const [nextActivityCode, setNextActivityCode] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const activityId = searchParams.get('activityId');
    if (activityId) {
      const activityToSelect = activities.find(a => a.id === activityId && a.status === 'pendiente');
      if (activityToSelect) {
        setSelectedActivity(activityToSelect);
      }
    }
  }, [searchParams, activities]);

  useEffect(() => {
    if (selectedActivity) {
      const updatedActivity = activities.find(a => a.id === selectedActivity.id);
      setSelectedActivity(updatedActivity || null);
    }
  }, [activities, selectedActivity]);

  useEffect(() => {
    // If the selected activity is updated (e.g. status changes), clear the selection
    if (selectedActivity && !activities.some(a => a.id === selectedActivity.id && a.status === 'pendiente')) {
      setSelectedActivity(null);
      setSelectedHistoryEntry(null);
    }
  }, [activities, selectedActivity]);

  const handleOpenNewActivityDialog = () => {
    const maxCode = activities.reduce((max, act) => {
      if (act.code && act.code.startsWith('ACT-')) {
        const codeNum = parseInt(act.code.split('-')[1], 10);
        return codeNum > max ? codeNum : max;
      }
      return max;
    }, 0);
    const nextId = maxCode + 1;
    const formattedId = nextId.toString().padStart(3, '0');
    setNextActivityCode(`ACT-${formattedId}`);
    setIsNewActivityDialogOpen(true);
  };
  
  const handleOpenEditActivityDialog = () => {
    if(selectedActivity) {
      setIsEditActivityDialogOpen(true);
    }
  };

  const handleSelectActivity = (activity: Activity) => {
    if (selectedActivity && selectedActivity.id === activity.id) {
        setSelectedActivity(null);
        setSelectedHistoryEntry(null);
    } else {
        setSelectedActivity(activity);
        setSelectedHistoryEntry(null);
    }
  };
  
  const handleSelectHistoryEntry = (entry: HistoryEntry, index: number) => {
    if (selectedHistoryEntry && selectedHistoryEntry.index === index) {
      setSelectedHistoryEntry(null); // Deselect if clicking the same entry
    } else {
      setSelectedHistoryEntry({ entry, index });
    }
  };

  const handleClearSelection = () => {
    setSelectedActivity(null);
    setSelectedHistoryEntry(null);
  };
  
  const handleSaveHistory = async (
    activityId: string,
    action: string,
    hours: number,
    minutes: number,
    date: Date
  ) => {
    await addHistoryEntry(activityId, action, hours, minutes, date);
  };

  const handleUpdateHistory = async (activityId: string, index: number, updatedEntry: Omit<HistoryEntry, 'date'> & { date: Date }) => {
    await updateHistoryEntry(activityId, index, {
      ...updatedEntry,
      date: updatedEntry.date.toISOString(),
    });
    setSelectedHistoryEntry(null); // Clear selection after update
  };

  const handleCompleteTask = async (
    activityId: string,
    action: string,
    hours: number,
    minutes: number,
    date: Date
  ) => {
    await closeActivity(activityId, action, hours, minutes, date);
    setSelectedActivity(null);
    setSelectedHistoryEntry(null);
  };

  const handleCreateActivity = async (newActivity: Omit<Activity, "id">) => {
    await addActivity(newActivity);
    setIsNewActivityDialogOpen(false);
  };
  
  const handleUpdateActivity = async (activityId: string, updatedData: Partial<Activity>) => {
    await updateActivity(activityId, updatedData);
    setIsEditActivityDialogOpen(false);
  }

  const handleDeleteActivity = async (activityId: string) => {
    await deleteActivity(activityId);
    setSelectedActivity(null);
    setSelectedHistoryEntry(null);
  };

  const handleAddNewClient = async (name: string, technicalDetail?: string, contact?: string): Promise<Client> => {
    const newClient = await addClient(name, technicalDetail, contact);
    return newClient;
  };

  const pendingActivities = activities.filter(
    (activity) => activity.status === "pendiente"
  );
  
  const priorityOrder: Record<'alta' | 'media' | 'baja', number> = {
    'alta': 1,
    'media': 2,
    'baja': 3
  };

  const filteredPendingActivities = pendingActivities
    .filter((activity) => {
      const typeMatch = typeFilter === "todos" || activity.clientType === typeFilter;
      const priorityMatch = priorityFilter === "todos" || activity.priority === priorityFilter;
      return typeMatch && priorityMatch;
    })
    .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        const aIsOverdue = isAfter(new Date(), new Date(a.dueDate));
        const bIsOverdue = isAfter(new Date(), new Date(b.dueDate));

        if (aIsOverdue && !bIsOverdue) return -1;
        if (!aIsOverdue && bIsOverdue) return 1;
        
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });


  const selectedClient = selectedActivity 
    ? clients.find(c => c.name === selectedActivity.client) ?? null
    : null;

  return (
    <>
      <NewActivityDialog
        isOpen={isNewActivityDialogOpen}
        onClose={() => setIsNewActivityDialogOpen(false)}
        onSave={handleCreateActivity}
        clients={clients}
        onAddNewClient={handleAddNewClient}
        generatedCode={nextActivityCode}
      />
      {selectedActivity && (
        <EditActivityDialog
          isOpen={isEditActivityDialogOpen}
          onClose={() => setIsEditActivityDialogOpen(false)}
          onSave={handleUpdateActivity}
          clients={clients}
          onAddNewClient={handleAddNewClient}
          activity={selectedActivity}
        />
      )}
      
      <div className="flex items-center justify-between space-y-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">
          Gestión de Actividades
        </h1>
        <Button onClick={handleOpenNewActivityDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ingresar Actividad
        </Button>
      </div>

       <div className="space-y-6">
          <Card>
              <CardHeader>
                  <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                      <Label>Prioridad</Label>
                      <Select value={priorityFilter} onValueChange={(value: Priority) => setPriorityFilter(value)}>
                          <SelectTrigger>
                              <SelectValue placeholder="Filtrar por prioridad" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="todos">Todas</SelectItem>
                              <SelectItem value="alta">Alta</SelectItem>
                              <SelectItem value="media">Media</SelectItem>
                              <SelectItem value="baja">Baja</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div>
                      <Label>Tipo</Label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                          <SelectTrigger>
                              <SelectValue placeholder="Filtrar por tipo" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="todos">Todos</SelectItem>
                              <SelectItem value="interno">Interno</SelectItem>
                              <SelectItem value="externo">Externo</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </CardContent>
          </Card>

          <Card>
              <CardHeader>
                  <CardTitle>Lista de Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                  <ActivitiesGrid
                    activities={filteredPendingActivities}
                    onActivitySelect={handleSelectActivity}
                    selectedActivityId={selectedActivity?.id}
                  />
              </CardContent>
          </Card>
        
            {selectedActivity && (
                 <div className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-1 space-y-6">
                            <ActivityDetails
                                activity={selectedActivity}
                                onSaveHistory={handleSaveHistory}
                                onCompleteTask={handleCompleteTask}
                                onClear={handleClearSelection}
                                onEdit={handleOpenEditActivityDialog}
                                editingEntry={selectedHistoryEntry}
                                onUpdateHistory={handleUpdateHistory}
                                onCancelEdit={() => setSelectedHistoryEntry(null)}
                                onDelete={handleDeleteActivity}
                            />
                        </div>
                         <div className="lg:col-span-2 space-y-6">
                            <ActivityDescription activity={selectedActivity} client={selectedClient} />
                            <ActivityHistoryLog 
                              activity={selectedActivity} 
                              onSelectHistoryEntry={handleSelectHistoryEntry}
                              selectedEntryIndex={selectedHistoryEntry?.index}
                            />
                        </div>
                    </div>
                </div>
            )}
      </div>
    </>
  );
}


export default function TasksPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <TasksComponent />
    </Suspense>
  )
}
