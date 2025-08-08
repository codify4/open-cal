import TopNav from "@/components/landing/top-nav"
import { Footer } from "@/components/landing/footer"
import { RoadmapCTA } from "@/components/roadmap/roadmap-cta"
import { Badge } from "@/components/ui/badge"

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold">
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
                <h3 className="text-xl font-semibold">Core UI</h3>
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
                <h3 className="text-xl font-semibold">Core Calendar Functionality</h3>
                <Badge className="bg-green-500 font-medium">Completed</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              The heart of any calendar app. Event creation, editing, deletion, calendar views, and basic scheduling features. This part has to be perfect because it's what users interact with 99% of the time.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-semibold">3</div>
              <div>
                <h3 className="text-xl font-semibold">AI Agent</h3>
                <Badge className="bg-yellow-500 font-medium">In Progress</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              Intelligent scheduling assistant with natural language processing. Smart scheduling suggestions, conflict resolution, and AI-powered calendar optimization.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-semibold">4</div>
              <div>
                <h3 className="text-xl font-semibold">Google Calendar Integration</h3>
                <Badge className="bg-yellow-500 font-medium">Not Started</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              Seamless synchronization with Google Calendar. Two-way sync, real-time updates, calendar selection, and conflict resolution.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-semibold">5</div>
              <div>
                <h3 className="text-xl font-semibold">Full Convex DB Integration</h3>
                <Badge className="bg-yellow-500 font-medium">Not Started</Badge>
              </div>
            </div>
            <p className="text-muted-foreground ml-12">
              Complete database integration and real-time sync. User authentication, data persistence, and scalable backend infrastructure.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center font-semibold">6</div>
              <div>
                <h3 className="text-xl font-semibold">Launch</h3>
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