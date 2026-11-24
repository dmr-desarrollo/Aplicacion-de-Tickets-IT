
"use client";

import { useState, useMemo, useContext } from 'react';
import type { Activity, Client } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { subDays, format, getMonth, getYear, differenceInDays, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TableWrapper } from '@/components/ui/table-wrapper';
import { useRouter } from 'next/navigation';
import { ActivityContext } from '@/context/activity-context';


export default function DashboardPage() {
  const { activities } = useContext(ActivityContext);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const router = useRouter();

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const activityDate = new Date(activity.registrationDate);
      return getMonth(activityDate) === selectedMonth && getYear(activityDate) === getYear(new Date());
    });
  }, [activities, selectedMonth]);

  const pendingActivities = useMemo(() => filteredActivities.filter(a => a.status === 'pendiente'), [filteredActivities]);
  const closedActivities = useMemo(() => filteredActivities.filter(a => a.status === 'Completada'), [filteredActivities]);
  
  const overdueActivities = useMemo(() => activities.filter(a => 
      a.status === 'pendiente' && 
      isAfter(new Date(), new Date(a.dueDate))
  ), [activities]);
  
  const avgClosingTimeInDays = useMemo(() => {
    const closedWithHistory = activities.filter(a => a.history.length > 0 && a.status === 'Completada');
    if (closedWithHistory.length === 0) return 0;

    const totalTime = closedWithHistory.reduce((acc, activity) => {
        const startDate = new Date(activity.registrationDate);
        const lastHistoryEntry = activity.history.find(h => h.action.toLowerCase().includes('cierre') || h.action.toLowerCase().includes('cerrada'));
        
        if (!lastHistoryEntry) {
            const lastEntry = activity.history[activity.history.length -1];
            if (!lastEntry) return acc;

            const endDate = new Date(lastEntry.date);
            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
            return acc + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        
        const endDate = new Date(lastHistoryEntry.date);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
    }, 0);

    const average = totalTime / closedWithHistory.length;
    return isNaN(average) ? 0 : parseFloat(average.toFixed(1));
  }, [activities]);
  
  const handleRowClick = (activityId: string) => {
    router.push(`/tasks?activityId=${activityId}`);
  };

  const months = Array.from({length: 12}, (_, i) => ({
      value: i,
      label: format(new Date(0, i), 'MMMM', { locale: es })
  }));

  return (
    <>
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">
          Dashboard de Soporte
        </h1>
        <div className="w-[180px]">
           <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label.charAt(0).toUpperCase() + month.label.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
      </div>
      
      {overdueActivities.length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>¡Atención! Tareas Vencidas</AlertTitle>
          <AlertDescription>
            Existen {overdueActivities.length} tareas que han superado su fecha de vencimiento.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actividades (Mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredActivities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes (Mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingActivities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas (Mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedActivities.length}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">T. Promedio Cierre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClosingTimeInDays} días</div>
          </CardContent>
        </Card>
      </div>

       <div className="mt-6">
        <Card>
            <CardHeader>
                <CardTitle>Tareas Vencidas</CardTitle>
                <CardDescription>
                    Actividades pendientes que han superado su fecha de vencimiento.
                </CardDescription>
            </CardHeader>
            <CardContent>
              <TableWrapper>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Fecha Vencimiento</TableHead>
                            <TableHead>Días Vencida</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Prioridad</TableHead>
                            <TableHead>Descripción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {overdueActivities.length > 0 ? overdueActivities.map(activity => {
                          const overdueDays = differenceInDays(new Date(), new Date(activity.dueDate));
                          return (
                            <TableRow key={activity.id} onClick={() => handleRowClick(activity.id)} className="cursor-pointer">
                                <TableCell className="font-medium">{activity.code}</TableCell>
                                <TableCell className="text-destructive font-medium">{format(new Date(activity.dueDate), 'dd/MM/yyyy')}</TableCell>
                                <TableCell className="text-center font-bold text-destructive">{overdueDays > 0 ? overdueDays : 0}</TableCell>
                                <TableCell>{activity.client}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    activity.priority === "alta"
                                      ? "bg-orange-500/30 text-orange-800"
                                      : activity.priority === "media"
                                      ? "bg-yellow-500/30 text-yellow-800"
                                      : "bg-blue-500/30 text-blue-800"
                                  }`}>
                                    {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)}
                                  </span>
                                </TableCell>
                                <TableCell className="whitespace-nowrap max-w-sm truncate">{activity.description}</TableCell>
                            </TableRow>
                          );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No hay Tareas vencidad, ¡Excelente trabajo Peter!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
              </TableWrapper>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
