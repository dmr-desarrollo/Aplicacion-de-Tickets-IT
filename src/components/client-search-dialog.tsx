
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Client } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "./ui/scroll-area";

interface ClientSearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onSelectClient: (clientId: string) => void;
}

export function ClientSearchDialog({
  isOpen,
  onClose,
  clients,
  onSelectClient,
}: ClientSearchDialogProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);
  
  const clientMap = useMemo(() => {
    const map = new Map<string, string>();
    clients.forEach(client => {
        map.set(client.name.toLowerCase(), client.id);
    });
    return map;
  }, [clients]);

  const handleSelect = (clientName: string) => {
    const clientId = clientMap.get(clientName.toLowerCase());
    if (clientId) {
      onSelectClient(clientId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>Buscar Cliente</DialogTitle>
        </DialogHeader>
        <Command shouldFilter={true} >
          <CommandInput 
            placeholder="Escriba para buscar un cliente..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <ScrollArea className="h-72">
                <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                <CommandGroup>
                {clients.map((client) => (
                    <CommandItem
                      key={client.id}
                      value={client.name}
                      onSelect={handleSelect}
                    >
                    {client.name}
                    </CommandItem>
                ))}
                </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
