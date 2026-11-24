
"use client"
import type { Activity, Client } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

export function ActivityDescription({ activity, client }: { activity: Activity | null, client: Client | null }) {
    if (!activity) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Descripción de la Actividad</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground">
                        <p>Seleccione una actividad para ver su descripción.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Actividad: {activity.code}</CardTitle>
                <CardDescription>Cliente: {activity.client} | Solicitante: {activity.requester}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label>Descripción de la Actividad</Label>
                    <ScrollArea className="h-24 mt-1">
                      <Textarea
                          value={activity.description}
                          readOnly
                          className="h-full resize-none text-base"
                      />
                    </ScrollArea>
                </div>
                {client && (
                    <div className="space-y-4 pt-4 border-t">
                        <CardTitle className="text-lg">Información del Cliente</CardTitle>
                        <div>
                            <Label>Contacto</Label>
                            <p className="text-sm text-muted-foreground mt-1">{client.contact || 'No disponible'}</p>
                        </div>
                        <div>
                            <Label>Detalle Técnico</Label>
                             <ScrollArea className="h-24 mt-1 border rounded-md p-2">
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {client.technicalDetail || 'No disponible'}
                                </p>
                            </ScrollArea>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

    