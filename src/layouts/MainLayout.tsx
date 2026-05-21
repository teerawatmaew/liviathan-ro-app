import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { House, BookOpen, Image, Swords, ToggleLeft, Gem, Puzzle, Hammer, ChevronRight, Sparkles, ScrollText, Coins, Sun, Moon } from 'lucide-react'
import DonateButton from '@/layouts/DonateButton'
import { useTheme } from '@/hooks/use-theme'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

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
      { title: 'Changelog', url: PATHS.CHANGELOG, icon: ScrollText },
    ],
  },
  {
    label: 'เครื่องมือ',
    items: [
      { title: 'คำนวณ Damage', url: PATHS.TOOLS_DAMAGE, icon: Swords },
      { title: 'Central Lab Helper', url: PATHS.TOOLS_CENTRAL_LAB, icon: ToggleLeft },
      { title: 'Item Cost Calculator', url: PATHS.TOOLS_ITEM_COST, icon: Gem },
      { title: 'MP Jigsaw Calculator', url: PATHS.TOOLS_MP_JIGSAW, icon: Puzzle },
      { title: 'Refine Simulator', url: PATHS.TOOLS_REFINE_SIMULATOR, icon: Hammer },
      { title: 'Zeny → Baht', url: PATHS.TOOLS_ZENY_CALCULATOR, icon: Coins },
    ],
  },
]

const PAGE_LABELS: Record<string, string> = {
  [PATHS.TOOLS_STAT]: 'คำนวณ Stat',
  ...Object.fromEntries(
    navSections.flatMap((s) => s.items).map((item) => [item.url, item.title]),
  ),
  [PATHS.COMING_SOON]: 'Coming Soon',
}

export default function MainLayout() {
  const location = useLocation()
  const [theme, toggleTheme] = useTheme()
  const pageTitle = PAGE_LABELS[location.pathname] ?? null
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 py-3 border-b">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo/LVT.png"
              alt="LiviathaN RO"
              className="size-7 shrink-0"
            />
            <span className="text-base font-bold tracking-tight">
              LiviathaN RO
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {navSections.map((section) => (
            <SidebarGroup key={section.label ?? '__home__'}>
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
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to={PATHS.COMING_SOON}>
                      {({ isActive }) => (
                        <>
                          <Sparkles className="size-4" />
                          <span>Coming Soon</span>
                          {isActive && (
                            <ChevronRight className="ml-auto size-3 opacity-50" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-4 py-3 border-t space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">ติดต่อเรา</p>
            <a
              href="https://www.facebook.com/maewtrw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <FacebookIcon className="size-4" />
              <span>Facebook</span>
            </a>
          </div>
          <NavLink
            to={PATHS.CHANGELOG}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            LiviathaN RO © 2026 · v{__APP_VERSION__}
          </NavLink>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex items-center gap-2 px-4 h-12 border-b shrink-0 sticky top-0 bg-background z-10">
          <SidebarTrigger />
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`text-sm shrink-0 ${location.pathname !== PATHS.HOME && pageTitle ? 'text-muted-foreground/60' : 'font-medium'}`}>
              LiviathaN RO
            </span>
            {location.pathname !== PATHS.HOME && pageTitle && (
              <>
                <ChevronRight className="size-3 text-muted-foreground/40 shrink-0" />
                <span className="text-sm font-medium truncate">{pageTitle}</span>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label={theme === 'dark' ? 'เปลี่ยนเป็น Light mode' : 'เปลี่ยนเป็น Dark mode'}
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <a
              href="https://www.facebook.com/maewtrw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center size-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="size-4" />
            </a>
            <DonateButton />
          </div>
        </header>
        <main className="flex-1 min-h-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>

  )
}
