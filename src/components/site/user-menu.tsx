
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarCheckIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  ListIcon,
  LogOutIcon,
  PlusIcon,
  HeartIcon
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { SessionUser } from "@/lib/session"
import { useSession } from "@/lib/session"

const MENU_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/add-studio", label: "Add New Studio", icon: PlusIcon },
  { href: "/my-listings", label: "My Studio Listings", icon: ListIcon },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarCheckIcon },
  { href: "/wishlist", label: "Saved Studios", icon: HeartIcon },
]

export function UserMenu({ user }: { user: SessionUser }) {
  const { signOut } = useSession()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
           className="group gap-2 rounded-full border border-border pr-3 pl-1"
            aria-label="Open user menu"
          >
            <Avatar size="sm">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt="" />
              ) : null}
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>

            <span className="hidden max-w-32 truncate text-sm font-medium sm:inline">
              {user.name}
            </span>
            <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[popup-open]:rotate-180" />
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="truncate text-sm font-medium text-foreground">
            {user.name}
          </p>
          <p className="truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {MENU_ITEMS.map((item) => (
          <DropdownMenuItem
            key={item.href}
            render={<Link href={item.href} />}
          >
            <item.icon className="text-muted-foreground" />
            {item.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleLogout}
        >
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
