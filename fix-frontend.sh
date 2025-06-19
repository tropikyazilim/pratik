#!/bin/bash

# Frontend Build Fix Script
# VPS'de çalıştırın

echo "🔧 Frontend build sorunları düzeltiliyor..."

# Ana.tsx dosyasını düzelt
cat > f/src/components/Ana.tsx << 'EOF'
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router"

export default function Ana() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>
        <div className="flex flex-1  flex-col gap-4 p-2 max-w-full overflow-x-hidden bg-slate-100 ">
          <Outlet />
           </div>
        
      </SidebarInset>
    </SidebarProvider>
  )
}
EOF

# sonner.tsx dosyasını düzelt
cat > f/src/components/ui/sonner.tsx << 'EOF'
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
EOF

echo "✅ Frontend dosyaları düzeltildi"

# Build'i tekrar dene
docker compose down
docker compose up -d --build

echo "🎉 Build tamamlandı!"
