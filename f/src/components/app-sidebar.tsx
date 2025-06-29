import * as React from "react"
import { useEffect, useState } from "react"
import { GalleryVerticalEnd, Minus, Plus, Home, Box, Users, Wallet, FileText, Settings } from "lucide-react"
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
      title: "Ana Sayfa",
      url: "/",
      
      
    },
    {
      title: "Stok Modülü",
      url: "#",
      items: [
        { title: "Installation", url: "a" },
        { title: "Project Structure", url: "a" },
      ],
    },
    {
      title: "Cari Modülü",
      url: "#",
      items: [
        { title: "Cari Ekle", url: "cariekle" },
        { title: "Kullanıcı Ekle", url: "kullaniciekle"},
        { title: "Kitaplık", url: "kitaplik" },
        { title: "Caching", url: "a" },
        { title: "Styling", url: "a" },
        { title: "Optimizing", url: "a" },
        { title: "Configuring", url: "a" },
        { title: "Testing", url: "a" },
        { title: "Authentication", url: "a" },
        { title: "Deploying", url: "a" },
        { title: "Upgrading", url: "a" },
        { title: "Examples", url: "a" },
      ],
    },
    {
      title: "Kasa Modülü",
      url: "#",
      items: [
        { title: "Components", url: "a" },
        { title: "File Conventions", url: "a" },
        { title: "Functions", url: "a" },
        { title: "next.config.js Options", url: "a" },
        { title: "CLI", url: "a" },
        { title: "Edge Runtime", url: "a" },
      ],
    },
    {
      title: "Fatura Modülü",
      url: "#",
      items: [
        { title: "Accessibility", url: "a" },
        { title: "Fast Refresh", url: "a" },
        { title: "Next.js Compiler", url: "a" },
        { title: "Supported Browsers", url: "a" },
        { title: "Turbopack", url: "a" },
      ],
    },
    {
      title: "Ayarlar",
      url: "#",
      items: [
        { title: "Contribution Guide", url: "a" },
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
                <div className="flex items-center gap-2">
                  <img src="/logotrans.png" alt="Tropik Yazılım Logo" className="w-10 h-10 rounded" />
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Tropik Yazılım</span>
                    <span className="">v1.0.1</span>
                  </div>
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
              item.items && item.items.length > 0 ? (
                <Collapsible
                  key={item.title}
                  open={openSections.has(item.title)}
                  onOpenChange={(isOpen) => handleSectionToggle(item.title, isOpen)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="hover:bg-sidebar-accent hover:text-gray-900 text-gray-700">
                        {item.title === "Stok Modülü" && <Box className="size-5 mr-2" />}
                        {item.title === "Cari Modülü" && <Users className="size-5 mr-2" />}
                        {item.title === "Kasa Modülü" && <Wallet className="size-5 mr-2" />}
                        {item.title === "Fatura Modülü" && <FileText className="size-5 mr-2" />}
                        {item.title === "Ayarlar" && <Settings className="size-5 mr-2" />}
                        {item.title} {" "}
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem: { title: string; url: string }) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <NavLink
                              to={subItem.url}
                              end
                              className={({ isActive }) =>
                                `flex items-center gap-2 rounded-md px-2 py-2 transition-colors w-full text-left text-sm font-medium outline-none
                                text-gray-700 hover:text-gray-900
                                ${isActive ? "bg-gradient-to-r from-green-400 to-green-500 text-white" : "hover:bg-sidebar-accent"}
                                `
                              }
                            >
                              {subItem.title}
                            </NavLink>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url || "/"}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-md px-2 py-2 transition-colors w-full text-left text-sm font-medium outline-none
                      text-gray-700 hover:text-gray-900
                      ${isActive ? "bg-gradient-to-r from-green-400 to-green-500 text-white" : "hover:bg-sidebar-accent"}
                      `
                    }
                  >
                    {item.title === "Ana Sayfa" && <Home className="size-5 mr-2" />}
                    {item.title}
                  </NavLink>
                </SidebarMenuItem>
              )
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
