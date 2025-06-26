import * as React from "react"
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { NavLink } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Stok Modülü",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
        },
        {
          title: "Project Structure",
          url: "#",
        },
      ],
    },
    {
      title: "Cari Modülü",
      url: "#",
      items: [
        {
          title: "Cari Ekle",
          url: "cariekle",
        },
        {
          title: "Data Fetching",
          url: "#",
          isActive: true,
        },
        {
          title: "Rendering",
          url: "#",
        },
        {
          title: "Caching",
          url: "#",
        },
        {
          title: "Styling",
          url: "#",
        },
        {
          title: "Optimizing",
          url: "#",
        },
        {
          title: "Configuring",
          url: "#",
        },
        {
          title: "Testing",
          url: "#",
        },
        {
          title: "Authentication",
          url: "#",
        },
        {
          title: "Deploying",
          url: "#",
        },
        {
          title: "Upgrading",
          url: "#",
        },
        {
          title: "Examples",
          url: "#",
        },
      ],
    },
    {
      title: "Kasa Modülü",
      url: "#",
      items: [
        {
          title: "Components",
          url: "#",
        },
        {
          title: "File Conventions",
          url: "#",
        },
        {
          title: "Functions",
          url: "#",
        },
        {
          title: "next.config.js Options",
          url: "#",
        },
        {
          title: "CLI",
          url: "#",
        },
        {
          title: "Edge Runtime",
          url: "#",
        },
      ],
    },
    {
      title: "Fatura Modülü",
      url: "#",
      items: [
        {
          title: "Accessibility",
          url: "#",
        },
        {
          title: "Fast Refresh",
          url: "#",
        },
        {
          title: "Next.js Compiler",
          url: "#",
        },
        {
          title: "Supported Browsers",
          url: "#",
        },
        {
          title: "Turbopack",
          url: "#",
        },
      ],
    },
    {
      title: "Ayarlar",
      url: "#",
      items: [
        {
          title: "Contribution Guide",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Tropik Yazılım</span>
                  <span className="">v1.0.1</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={item.isActive}
                            >
                              <NavLink to={item.url}>{item.title}</NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <div style={{padding: 16}}>
        <button
          onClick={() => {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
          }}
          style={{width: '100%', padding: '8px 0', background: '#e53e3e', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}
        >
          Çıkış Yap
        </button>
      </div>
    </Sidebar>
  )
}
