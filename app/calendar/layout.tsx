import { ChatSidebar } from "@/components/agent/chat-sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export const metadata = {
    title: "Digit - Calendar",
    description: "An Open Source AI alternative to Google Calendar.",
}

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar className="bg-neutral-950 border-none" variant="inset" />
            <ResizablePanelGroup direction="horizontal" className="min-h-screen p-2 gap-1">
                <ResizablePanel defaultSize={70} minSize={30}>
                    <SidebarInset className="bg-neutral-900 h-full rounded-xl shadow-sm">
                        {children}
                    </SidebarInset>
                </ResizablePanel>
                <ResizableHandle withHandle className="opacity-0 hover:opacity-100 transition-opacity duration-300"/>
                <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="bg-neutral-900 rounded-lg p-2">
                    <div className="bg-neutral-900 h-full rounded-xl shadow-sm overflow-hidden">
                        <ChatSidebar />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </SidebarProvider>
    )
}