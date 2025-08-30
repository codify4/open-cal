import TopNav from "@/components/landing/top-nav"
import { Footer } from "@/components/landing/footer"
import { RoadmapCTA } from "@/components/roadmap/roadmap-cta"
import { Badge } from "@/components/ui/badge"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Roadmap - Caly',
  description: 'What\'s coming next for Caly. The full roadmap for the project.',
  alternates: {
    canonical: 'https://www.trycaly.cc/roadmap',
  },
  openGraph: {
    images: '/og-img.svg',
    title: 'Roadmap - Caly',
    description: 'What\'s coming next for Caly. The full roadmap for the project.',
    url: 'https://www.trycaly.cc/roadmap',
    siteName: 'Caly',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roadmap - Caly',
    description: 'What\'s coming next for Caly. The full roadmap for the project.',
    images: '/og-img.svg',
  },
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-black dark:bg-black">
      <TopNav />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mt-20 text-white">
            Roadmap
          </h1>
          <p className="text-xl text-muted-foreground">
            What's coming next for Caly
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">1</div>
              <div>
                <h3 className="text-xl font-semibold text-white">Core UI</h3>
                <Badge className="bg-green-500 font-medium">Completed</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              Built the foundation - main layout, header, sidebar, calendar container, and basic component structure. Not all functionality yet, but the UI framework that everything else builds on.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">2</div>
              <div>
                <h3 className="text-xl font-semibold text-white">Core Calendar Functionality</h3>
                <Badge className="bg-green-500 font-medium">Completed</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              The heart of any calendar app. Event creation, editing, deletion, calendar views, and basic scheduling features. This part has to be perfect because it's what users interact with 99% of the time.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">3</div>
              <div>
                <h3 className="text-xl font-semibold text-white">AI Agent</h3>
                <Badge className="bg-green-500 font-medium">Done</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              Intelligent scheduling assistant with natural language processing. Smart scheduling suggestions, conflict resolution, and AI-powered calendar optimization.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">4</div>
              <div>
                <h3 className="text-xl font-semibold text-white">Google Calendar Integration</h3>
                <Badge className="bg-green-500 font-medium">Done</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              Seamless synchronization with Google Calendar. Two-way sync, real-time updates, calendar selection, and conflict resolution.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">5</div>
              <div>
                <h3 className="text-xl font-semibold text-white">Full mobile support</h3>
                <Badge className="bg-green-500 font-medium">Done</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              Make the calendar experience as smooth as possible on mobile.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">6</div>
              <div>
                <h3 className="text-xl font-semibold text-white">Bug fixes and little improvements</h3>
                <Badge className="bg-blue-500 font-medium">In Progress</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              Fixing bugs and making little improvements to the calendar experience before launching the first version.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">7</div>
              <div>
                <h3 className="text-xl font-semibold text-white">Prepare for launch</h3>
                <Badge className="bg-blue-500 font-medium">In Progress</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              Prepare for the big launch. Film content, landing page updates, and more.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-semibold">8</div>
              <div>
                <h3 className="text-xl font-semibold text-white">Launch</h3>
                <Badge variant="outline" className="text-white font-medium">Future</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              Public release and deployment. Once we nail the above, we have a solid foundation to build anything. Advanced features, performance optimizations, mobile support.
            </p>
          </div>
        </div>
      </div>
      
      <RoadmapCTA />
      <Footer />
    </div>
  )
}