
"use client";
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Textarea } from './ui/textarea';
import type { Activity, Client } from '@/lib/data';
import { Calendar as CalendarIcon, PlusCircle, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ClientSearchDialog } from './client-search-dialog';
import { useToast } from '@/hooks/use-toast';

interface EditActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activityId: string, updatedData: Partial<Activity>) => Promise<void>;
  activity: Activity;
  clients: Client[];
  onAddNewClient: (name: string, technicalDetail?: string, contact?: string) => Promise<Client>;
}

export function EditActivityDialog({ isOpen, onClose, onSave, activity, clients, onAddNewClient }: EditActivityDialogProps) {
  const [code, setCode] = useState('');
  const [requester, setRequester] = useState('');
  const [registrationDate, setRegistrationDate] = useState<Date | undefined>();
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [clientId, setClientId] = useState('');
  const [clientType, setClientType] = useState<'interno' | 'externo'>('externo');
  const [priority, setPriority] = useState<'baja' | 'media' | 'alta'>('media');
  const [description, setDescription] = useState('');
  
  const [isAddClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [isSearchClientDialogOpen, setSearchClientDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientTechnicalDetail, setNewClientTechnicalDetail] = useState('');
  const [newClientContact, setNewClientContact] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && activity) {
      const selectedClient = clients.find(c => c.name === activity.client);
      setCode(activity.code);
      setRequester(activity.requester);
      setRegistrationDate(new Date(activity.registrationDate));
      setDueDate(new Date(activity.dueDate));
      setClientId(selectedClient?.id || '');
      setClientType(activity.clientType);
      setPriority(activity.priority);
      setDescription(activity.description);
    }
  }, [isOpen, activity, clients]);

  const handleSave = async () => {
    const selectedClient = clients.find(c => c.id === clientId);
     if (!selectedClient) {
        toast({
            title: "Error",
            description: "Por favor seleccione un cliente.",
            variant: "destructive",
        });
        return;
    }
    
    const updatedData: Partial<Activity> = {
      requester,
      registrationDate: registrationDate?.toISOString(),
      dueDate: dueDate?.toISOString(),
      client: selectedClient.name,
      clientType,
      priority,
      description,
    };
    
    try {
      await onSave(activity.id, updatedData);
      onClose();
    } catch (error) {
      console.error("Error actualizando actividad:", error);
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la actividad. Inténtelo de nuevo.",
        variant: "destructive",
      });
    }
  };
  
  const handleOpenAddClientDialog = () => {
    setAddClientDialogOpen(true);
  };

  const handleSaveNewClient = async () => {
    if (newClientName.trim()) {
      const existingClient = clients.find(
        (c) => c.name.toLowerCase() === newClientName.trim().toLowerCase()
      );
      if (existingClient) {
        toast({
          title: "Cliente Duplicado",
          description: `El cliente "${newClientName}" ya existe.`,
          variant: "destructive",
        });
        return;
      }
      try {
        const newClient = await onAddNewClient(newClientName.trim(), newClientTechnicalDetail.trim(), newClientContact.trim());
        setClientId(newClient.id);
        setNewClientName('');
        setNewClientTechnicalDetail('');
        setNewClientContact('');
        setAddClientDialogOpen(false);
      } catch (error) {
        console.error("Error guardando nuevo cliente:", error);
        toast({
          title: "Error al guardar cliente",
          description: "No se pudo guardar el cliente. Inténtelo de nuevo.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Editar Actividad</DialogTitle>
          <DialogDescription>
            Modifique los detalles de la tarea o actividad.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Código
            </Label>
            <Input id="code" value={code} readOnly className="col-span-3 bg-muted" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="requester" className="text-right">
              Solicitante
            </Label>
            <Input id="requester" value={requester} onChange={e => setRequester(e.target.value)} className="col-span-3" placeholder="Nombre del solicitante" />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Fecha Sol.
            </Label>
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !registrationDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {registrationDate ? format(registrationDate, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={registrationDate}
                  onSelect={setRegistrationDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Fecha Venc.
            </Label>
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP", { locale: es }) : <span>Opcional (auto)</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="client" className="text-right">
                Cliente
            </Label>
            <div className="col-span-3 flex gap-2">
                <Select onValueChange={setClientId} value={clientId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione un cliente"/>
                    </SelectTrigger>
                    <SelectContent>
                        {clients.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Button variant="outline" size="icon" onClick={() => setSearchClientDialogOpen(true)}>
                    <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleOpenAddClientDialog}>
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client-type" className="text-right">
              Tipo Atención
            </Label>
            <Select onValueChange={(v: 'interno' | 'externo') => setClientType(v)} value={clientType}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Tipo de atención"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="externo">Externo</SelectItem>
                    <SelectItem value="interno">Interno</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Prioridad
            </Label>
            <Select onValueChange={(v: 'baja'|'media'|'alta') => setPriority(v)} value={priority}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Nivel de prioridad"/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Descripción detallada de la actividad..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" onClick={handleSave}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <Dialog open={isAddClientDialogOpen} onOpenChange={setAddClientDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div>
                    <Label htmlFor="new-client-name">Nombre del Cliente</Label>
                    <Input 
                        id="new-client-name"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder="Ingrese el nombre"
                    />
                </div>
                 <div>
                    <Label htmlFor="new-client-contact">Contacto</Label>
                    <Input 
                        id="new-client-contact"
                        value={newClientContact}
                        onChange={(e) => setNewClientContact(e.target.value)}
                        placeholder="Ingrese el contacto"
                    />
                </div>
                <div>
                    <Label htmlFor="new-client-tech-detail">Detalle Técnico</Label>
                    <Textarea 
                        id="new-client-tech-detail"
                        value={newClientTechnicalDetail}
                        onChange={(e) => setNewClientTechnicalDetail(e.target.value)}
                        placeholder="Ingrese detalles técnicos"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setAddClientDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleSaveNewClient}>Guardar Cliente</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    <ClientSearchDialog
      isOpen={isSearchClientDialogOpen}
      onClose={() => setSearchClientDialogOpen(false)}
      clients={clients}
      onSelectClient={(clientId) => {
        setClientId(clientId);
        setSearchClientDialogOpen(false);
      }}
    />
    </>
  );
}
