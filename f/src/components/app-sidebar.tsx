import * as React from "react"
import { useEffect, useState } from "react"
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react"
import { NavLink } from "react-router";
import { NavUser } from "@/components/nav-user"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchForm } from "@/components/search-form"
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
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/auth-context";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { accessToken, user, setUser, authenticatedFetch } = useAuth();
  const [filteredNavMain, setFilteredNavMain] = useState<any[]>([]);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Cari Modülü']));

  // Menü verisi sabit olarak tekrar eklendi
  const navMain = [
    
    {
      title: "Stok Modülü",
      url: "#",
      items: [
        { title: "Installation", url: "#" },
        { title: "Project Structure", url: "#" },
      ],
    },
    {
      title: "Cari Modülü",
      url: "#",
      items: [
        { title: "Cari Ekle", url: "cariekle" },
        { title: "Kullanıcı Ekle", url: "kullaniciekle"},
        { title: "Kitaplık", url: "kitaplik" },
        { title: "Caching", url: "#" },
        { title: "Styling", url: "#" },
        { title: "Optimizing", url: "#" },
        { title: "Configuring", url: "#" },
        { title: "Testing", url: "#" },
        { title: "Authentication", url: "#" },
        { title: "Deploying", url: "#" },
        { title: "Upgrading", url: "#" },
        { title: "Examples", url: "#" },
      ],
    },
    {
      title: "Kasa Modülü",
      url: "#",
      items: [
        { title: "Components", url: "#" },
        { title: "File Conventions", url: "#" },
        { title: "Functions", url: "#" },
        { title: "next.config.js Options", url: "#" },
        { title: "CLI", url: "#" },
        { title: "Edge Runtime", url: "#" },
      ],
    },
    {
      title: "Fatura Modülü",
      url: "#",
      items: [
        { title: "Accessibility", url: "#" },
        { title: "Fast Refresh", url: "#" },
        { title: "Next.js Compiler", url: "#" },
        { title: "Supported Browsers", url: "#" },
        { title: "Turbopack", url: "#" },
      ],
    },
    {
      title: "Ayarlar",
      url: "#",
      items: [
        { title: "Contribution Guide", url: "#" },
      ],
    },
  ];

  // Arama işlevi
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredNavMain(navMain);
      setOpenSections(new Set(['Cari Modülü']));
      return;
    }

    const filtered = navMain.map(section => {
      const filteredItems = section.items?.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        section.title.toLowerCase().includes(query.toLowerCase())
      ) || [];

      return {
        ...section,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0);

    setFilteredNavMain(filtered);
    
    // Arama sonucunda eşleşen modülleri aç
    const sectionsToOpen = new Set<string>();
    filtered.forEach(section => {
      if (section.items?.some((item: { title: string; url: string }) => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        section.title.toLowerCase().includes(query.toLowerCase())
      )) {
        sectionsToOpen.add(section.title);
      }
    });
    setOpenSections(sectionsToOpen);
  };

  const handleSectionToggle = (sectionTitle: string, isOpen: boolean) => {
    const newOpenSections = new Set(openSections);
    if (isOpen) {
      newOpenSections.add(sectionTitle);
    } else {
      newOpenSections.delete(sectionTitle);
    }
    setOpenSections(newOpenSections);
  };

  useEffect(() => {
    // İlk yüklemede tüm menüyü göster
    setFilteredNavMain(navMain);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (accessToken && !user) {
        try {
          const res = await authenticatedFetch("/api/profile");
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          }
        } catch (e) {
          // Hata yönetimi
        }
      }
    };
    fetchProfile();
  }, [accessToken, user, setUser, authenticatedFetch]);

  return (
    <Sidebar {...props} className="bg-sidebar border-r border-sidebar-border text-sidebar-foreground">
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
        <SearchForm onSearch={handleSearch} />
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarMenu>
            {filteredNavMain.map((item) => (
              <Collapsible
                key={item.title}
                open={openSections.has(item.title)}
                onOpenChange={(isOpen) => handleSectionToggle(item.title, isOpen)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                      {item.title} {" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem: { title: string; url: string }) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                              <NavLink to={subItem.url}>{subItem.title}</NavLink>
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
      <SidebarFooter className="bg-sidebar border-t border-sidebar-border">
        <div className="flex items-center gap-2 w-full">
          {user ? <NavUser user={{ name: user.username, email: user.email, avatar: "/avatars/logo.jpg" }} /> : <span>Kullanıcı Bilgisi Yükleniyor...</span>}
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
