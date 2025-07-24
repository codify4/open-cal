"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "../ui/dialog"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between w-full px-2 py-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>My Account</DialogTitle>
              <DialogDescription>
                Manage your account settings and preferences.
              </DialogDescription>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save changes</Button>
              </DialogFooter>

            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-8 w-8 p-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
