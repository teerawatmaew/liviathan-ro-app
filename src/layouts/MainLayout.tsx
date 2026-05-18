import { Outlet, NavLink } from 'react-router-dom'
import { House, BookOpen, Image, Calculator, Swords, ToggleLeft, Gem, ChevronRight } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { PATHS } from '@/routes/paths'

interface NavSection {
  label?: string
  items: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[]
}

const navSections: NavSection[] = [
  {
    items: [
      { title: 'หน้าหลัก', url: PATHS.HOME, icon: House },
    ],
  },
  {
    label: 'คอนเทนต์',
    items: [
      { title: 'บทความ / คู่มือ', url: PATHS.CONTENT, icon: BookOpen },
      { title: 'แกลเลอรี่', url: PATHS.GALLERY, icon: Image },
    ],
  },
  {
    label: 'เครื่องมือ',
    items: [
      { title: 'คำนวณ Stat', url: PATHS.TOOLS_STAT, icon: Calculator },
      { title: 'คำนวณ Damage', url: PATHS.TOOLS_DAMAGE, icon: Swords },
      { title: 'Central Lab Switch', url: PATHS.TOOLS_SWITCH, icon: ToggleLeft },
      { title: 'Enhancement Stone Cost', url: PATHS.TOOLS_ENHANCEMENT, icon: Gem },
    ],
  },
]

export default function MainLayout() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight">
              Liviatha<span className="text-primary">N</span> RO
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {navSections.map((section, i) => (
            <SidebarGroup key={i}>
              {section.label && (
                <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === PATHS.HOME}
                        >
                          {({ isActive }) => (
                            <>
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                              {isActive && (
                                <ChevronRight className="ml-auto size-3 opacity-50" />
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="px-4 py-3 text-xs text-muted-foreground border-t">
          LiviathaN RO © 2026
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex items-center gap-2 px-4 h-12 border-b shrink-0 sticky top-0 bg-background z-10">
          <SidebarTrigger />
          <div className="w-px h-4 bg-border" />
          <span className="text-sm font-medium text-muted-foreground">LiviathaN RO</span>
        </header>
        <main className="flex-1 min-h-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>

  )
}
