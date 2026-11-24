
"use client";

import { useState, useMemo, useContext } from 'react';
import type { Activity, Client, HistoryEntry } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon, Download, Search } from 'lucide-react';
import { ActivityContext } from '@/context/activity-context';
import { useToast } from '@/hooks/use-toast';

export default function ReportsPage() {
  const { activities, clients } = useContext(ActivityContext);
  const { toast } = useToast();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pendiente' | 'Completada'>('all');
  const [reportData, setReportData] = useState<Activity[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = () => {
    try {
      const filtered = activities.filter(activity => {
        const activityDate = new Date(activity.registrationDate);
        if (dateRange?.from && isValid(dateRange.from) && activityDate < dateRange.from) {
          return false;
        }
        if (dateRange?.to && isValid(dateRange.to) && activityDate > dateRange.to) {
          return false;
        }
        if (selectedClient !== 'all' && activity.client !== selectedClient) {
          return false;
        }
        if (selectedStatus !== 'all' && activity.status !== selectedStatus) {
          return false;
        }
        return true;
      });
      setReportData(filtered);
      setReportGenerated(true);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error al generar reporte",
        description: "Ocurrió un error al filtrar las actividades.",
        variant: "destructive",
      });
    }
  };

  const calculateTotalTime = (history: HistoryEntry[]) => {
    const totalMinutes = history.reduce((acc, entry) => {
      const h = entry.hours || 0;
      const m = entry.minutes || 0;
      return acc + h * 60 + m;
    }, 0);
  
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const convertToCSV = (data: Activity[]) => {
    const headers = ['Codigo', 'Fecha Registro', 'Cliente', 'Tipo', 'Prioridad', 'Estado', 'Descripcion', 'Historico', 'Tiempo Total'];
    const rows = data.map(activity => {
        const historyText = activity.history.map(h => 
            `"${format(new Date(h.date), 'dd/MM/yyyy')}: ${h.action.replace(/"/g, '""')} (${h.hours || 0}h ${h.minutes || 0}m)"`
        ).join('; ');

        return [
            activity.code,
            format(new Date(activity.registrationDate), 'dd/MM/yyyy'),
            activity.client,
            activity.clientType,
            activity.priority,
            activity.status,
            `"${activity.description.replace(/"/g, '""')}"`,
            `"${historyText}"`,
            calculateTotalTime(activity.history)
        ].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  };

  const handleExport = () => {
    try {
      const csvData = convertToCSV(reportData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.href) {
        URL.revokeObjectURL(link.href);
      }
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `reporte_actividades_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV report:", error);
      toast({
        title: "Error al exportar",
        description: "No se pudo exportar el reporte a CSV.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline text-foreground">
          Reportes de Actividades
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
          <CardDescription>Seleccione los filtros para generar el reporte.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium">Rango de Fechas</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal mt-1 whitespace-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                        {format(dateRange.to, "LLL dd, y", { locale: es })}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y", { locale: es })
                    )
                  ) : (
                    <span>Seleccione un rango</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium">Cliente</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione cliente" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los Clientes</SelectItem>
                    {clients.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Estado</label>
            <Select value={selectedStatus} onValueChange={(value: 'all' | 'pendiente' | 'Completada') => setSelectedStatus(value)}>
                <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccione estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los Estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
             <Button onClick={handleGenerateReport} className="w-full inline-flex items-center justify-center gap-2">
              <Search className="h-4 w-4" />
              Generar Reporte
            </Button>
          </div>
          <div className="flex items-end">
            <Button onClick={handleExport} disabled={!reportGenerated || reportData.length === 0} className="w-full inline-flex items-center justify-center gap-2">
              <Download className="h-4 w-4" />
              Exportar a CSV
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Card>
            <CardHeader>
                <CardTitle>Resultados</CardTitle>
                 {reportGenerated && (
                    <CardDescription>
                        Se encontraron {reportData.length} actividades con los filtros seleccionados.
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Historial</TableHead>
                                <TableHead className="text-right">Tiempo Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {reportData.length > 0 ? reportData.map(activity => (
                                <TableRow key={activity.id}>
                                    <TableCell className="font-medium">{activity.code}</TableCell>
                                    <TableCell>{format(new Date(activity.registrationDate), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{activity.client}</TableCell>
                                    <TableCell className="max-w-xs truncate">{activity.description}</TableCell>
                                    <TableCell>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.status === 'pendiente' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                                          {activity.status}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <ScrollArea className="h-20 text-xs text-muted-foreground">
                                        {activity.history.map((h, i) => (
                                            <div key={i} className="whitespace-pre-wrap border-b last:border-b-0 py-1">
                                                <p><b>{format(new Date(h.date), 'dd/MM/yy')}:</b> {h.action}</p>
                                            </div>
                                        ))}
                                      </ScrollArea>
                                    </TableCell>
                                    <TableCell className="text-right">{calculateTotalTime(activity.history)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                      {reportGenerated ? 'No se encontraron resultados.' : 'Seleccione los filtros y genere un reporte para ver los resultados.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
