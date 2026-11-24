
'use client';

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ListTodo, FileText } from "lucide-react";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { ActivityProvider } from "@/context/activity-context";
import { Button } from "@/components/ui/button";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Soporte IT DMR</title>
        <meta
          name="description"
          content="Sistema de gestión de actividades, seguimiento de tareas y reportes de soporte IT DMR"
        />
        <meta property="og:title" content="Soporte IT DMR" />
        <meta
          property="og:description"
          content="Sistema de gestión de actividades, seguimiento de tareas y reportes de soporte IT DMR"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Source+Code+Pro:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ActivityProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarContent>
                <SidebarHeader>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold font-headline text-foreground group-data-[collapsible=icon]:hidden">
                      Soporte IT DMR
                    </h2>
                    <SidebarTrigger className="ml-auto" />
                  </div>
                </SidebarHeader>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/">
                      <SidebarMenuButton tooltip="Dashboard">
                        <LayoutDashboard />
                        <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/tasks">
                      <SidebarMenuButton tooltip="Actividades">
                        <ListTodo />
                        <span className="group-data-[collapsible=icon]:hidden">Actividades</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                     <Link href="/reports">
                      <SidebarMenuButton tooltip="Reportes">
                        <FileText />
                        <span className="group-data-[collapsible=icon]:hidden">Reportes</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
                <SidebarTrigger size="icon" variant="outline" className="md:hidden">
                  <LayoutDashboard />
                  <span className="sr-only">Toggle Menu</span>
                </SidebarTrigger>
              </header>
               <main className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
                  {children}
               </main>
               <footer className="py-4 px-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
                  <Image
                      src="https://firebasestorage.googleapis.com/v0/b/activity-compass-qiuxy.firebasestorage.app/o/logo_dmr_transparente.png?alt=media&token=ede1808f-81f2-418d-9de0-c15bb2b146a2"
                      alt="Logo DMR"
                      width={80}
                      height={40}
                      className="object-contain"
                      referrerPolicy="no-referrer"
                  />
                  Desarrollado por DMR
              </footer>
              <Toaster />
            </SidebarInset>
          </SidebarProvider>
        </ActivityProvider>
      </body>
    </html>
  );
}
