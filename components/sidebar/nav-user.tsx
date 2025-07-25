"use client"

import { Moon, Sun, User, CreditCard, Settings, Palette, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Separator } from "../ui/separator"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

const SETTINGS_SECTIONS = [
  {
    id: "profile",
    title: "Profile",
    description: "Manage your account",
    icon: User,
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Customize your theme",
    icon: Palette,
  },
  {
    id: "billing",
    title: "Billing",
    description: "Manage your subscription",
    icon: CreditCard,
  },
]

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
  const [activeSection, setActiveSection] = useState("profile")

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection user={user} />
      case "appearance":
        return <AppearanceSection />
      case "billing":
        return <BillingSection />
      default:
        return <ProfileSection user={user} />
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent className="w-[1000px] h-[600px] p-0 bg-neutral-950">
            <div className="flex h-full">
              <div className="w-1/4 border-r border-neutral-800 py-4 px-3">
                <div className="mb-6">
                  <DialogTitle className="text-lg font-semibold text-white">Settings</DialogTitle>
                  <p className="text-sm text-neutral-400">Manage your account preferences</p>
                </div>
                
                <nav className="space-y-2">
                  {SETTINGS_SECTIONS.map((section) => {
                    const Icon = section.icon
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 p-2 rounded-lg text-sm transition-colors cursor-pointer ${
                          activeSection === section.id
                            ? "bg-neutral-800 text-white"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-800/50"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">{section.title}</div>
                          <div className="text-xs text-neutral-500">{section.description}</div>
                        </div>
                      </button>
                    )
                  })}
                </nav>
              </div>

              <div className="w-3/4 p-6 overflow-y-auto">
                {renderSectionContent()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function ProfileSection({ user }: { user: { name: string; email: string; avatar: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Profile</h3>
        <p className="text-neutral-400">Your account information and preferences.</p>
      </div>

      <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
            <CardDescription className="text-neutral-400">
              Your profile details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg bg-neutral-800">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="grid grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-white text-sm font-medium">Name</Label>
                  <p className="text-neutral-300">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm font-medium">Email</Label>
                  <p className="text-neutral-300">{user.email}</p>
                </div>
              </div>
            </div>

            <Separator className="bg-neutral-800" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Email Notifications</Label>
                  <p className="text-sm text-neutral-400">Receive email updates about your account</p>
                </div>
                <Switch defaultChecked className="cursor-pointer" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    )
  }

function AppearanceSection() {
  const { theme, setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState(theme || "system")

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme)
    setTheme(newTheme)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Appearance</h3>
        <p className="text-neutral-400">Customize how the application looks and feels.</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Theme</CardTitle>
            <CardDescription className="text-neutral-400">
              Choose your preferred color scheme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleThemeChange("light")}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedTheme === "light"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-neutral-700 hover:border-neutral-600"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Sun className="h-4 w-4" />
                  <span className="font-medium text-white">Light</span>
                </div>
                <div className="h-8 bg-white rounded border-2 border-gray-200"></div>
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedTheme === "dark"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-neutral-700 hover:border-neutral-600"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Moon className="h-4 w-4" />
                  <span className="font-medium text-white">Dark</span>
                </div>
                <div className="h-8 bg-neutral-900 rounded border-2 border-neutral-700"></div>
              </button>

              <button
                onClick={() => handleThemeChange("system")}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedTheme === "system"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-neutral-700 hover:border-neutral-600"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium text-white">System</span>
                </div>
                <div className="h-8 bg-gradient-to-r from-white to-neutral-900 rounded border-2 border-gray-200"></div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function BillingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Billing & Subscription</h3>
        <p className="text-neutral-400">Manage your subscription and payment methods.</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Current Plan</CardTitle>
            <CardDescription className="text-neutral-400">
              Your current subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold">P</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Pro Plan</h4>
                  <p className="text-sm text-neutral-400">$29/month</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                Active
              </Badge>
            </div>
            <div className="text-sm text-neutral-400">
              <p>Next billing date: January 15, 2024</p>
              <p>Billed monthly • Auto-renewal enabled</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Subscription Actions</CardTitle>
            <CardDescription className="text-neutral-400">
              Manage your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Change Plan
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
