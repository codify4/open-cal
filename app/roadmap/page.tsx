import { Footer } from '@/components/landing/footer';
import TopNav from '@/components/landing/top-nav';
import { RoadmapCTA } from '@/components/roadmap/roadmap-cta';
import { Badge } from '@/components/ui/badge';

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-6 text-center">
          <h1 className="font-bold text-4xl sm:text-5xl">Roadmap</h1>
          <p className="text-muted-foreground text-xl">
            What's coming next for OpenCal
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-semibold text-white">
                1
              </div>
              <div>
                <h3 className="font-semibold text-xl">Core UI</h3>
                <Badge className="bg-green-500 font-medium">Completed</Badge>
              </div>
            </div>
            <p className="ml-12 text-muted-foreground">
              Built the foundation - main layout, header, sidebar, calendar
              container, and basic component structure. Not all functionality
              yet, but the UI framework that everything else builds on.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-semibold text-white">
                2
              </div>
              <div>
                <h3 className="font-semibold text-xl">
                  Core Calendar Functionality
                </h3>
                <Badge className="bg-green-500 font-medium">Completed</Badge>
              </div>
            </div>
            <p className="ml-12 text-muted-foreground">
              The heart of any calendar app. Event creation, editing, deletion,
              calendar views, and basic scheduling features. This part has to be
              perfect because it's what users interact with 99% of the time.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 font-semibold text-white">
                3
              </div>
              <div>
                <h3 className="font-semibold text-xl">AI Agent</h3>
                <Badge className="bg-yellow-500 font-medium">In Progress</Badge>
              </div>
            </div>
            <p className="ml-12 text-muted-foreground">
              Intelligent scheduling assistant with natural language processing.
              Smart scheduling suggestions, conflict resolution, and AI-powered
              calendar optimization.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 font-semibold text-white">
                4
              </div>
              <div>
                <h3 className="font-semibold text-xl">
                  Google Calendar Integration
                </h3>
                <Badge className="bg-yellow-500 font-medium">Not Started</Badge>
              </div>
            </div>
            <p className="ml-12 text-muted-foreground">
              Seamless synchronization with Google Calendar. Two-way sync,
              real-time updates, calendar selection, and conflict resolution.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 font-semibold text-white">
                5
              </div>
              <div>
                <h3 className="font-semibold text-xl">
                  Full Convex DB Integration
                </h3>
                <Badge className="bg-yellow-500 font-medium">Not Started</Badge>
              </div>
            </div>
            <p className="ml-12 text-muted-foreground">
              Complete database integration and real-time sync. User
              authentication, data persistence, and scalable backend
              infrastructure.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 font-semibold text-white">
                6
              </div>
              <div>
                <h3 className="font-semibold text-xl">Launch</h3>
                <Badge className="font-medium text-white" variant="outline">
                  Future
                </Badge>
              </div>
            </div>
            <p className="ml-12 text-muted-foreground">
              Public release and deployment. Once we nail the above, we have a
              solid foundation to build anything. Advanced features, performance
              optimizations, mobile support.
            </p>
          </div>
        </div>
      </div>

      <RoadmapCTA />
      <Footer />
    </div>
  );
}
