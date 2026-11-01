
"use client"
import { ThemeToggle } from "@/components/site/theme-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { MenuIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Logo } from "@/components/site/logo"
import { UserMenu } from "@/components/site/user-menu"
import { useSession } from "@/lib/session"


const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
]

function isLinkActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

function NavLink({
  href,
  label,
  pathname,
  onNavigate,
}: {
  href: string
  label: string
  pathname: string
  onNavigate?: () => void
}) {
  const active = isLinkActive(pathname, href)

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {label}

      {active && (
        <span
          aria-hidden
          className="absolute inset-x-3 -bottom-[7px] h-0.5 rounded-full bg-primary"
        />
      )}
    </Link>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const { user, isPending } = useSession()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-4 sm:px-6">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open navigation menu"
              />
            }
          >
            <MenuIcon />
          </SheetTrigger>

          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>

            <nav
              aria-label="Site navigation"
              className="flex flex-col gap-1 px-4"
            >
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  {...link}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Logo className="mr-2 md:mr-6" />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} pathname={pathname} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {isPending ? null : user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button
                variant="ghost"
                render={<Link href="/login" />}
                className="hidden sm:inline-flex"
              >
                Login
              </Button>

              <Button render={<Link href="/register" />}>
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
