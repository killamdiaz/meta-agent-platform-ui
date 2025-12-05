import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Plus, Radio } from "lucide-react";
import { mockExhausts, ExhaustStream } from "@/data/mockExhausts";
import { ExhaustsTable } from "@/components/Exhausts/ExhaustsTable";
import { CreateStreamModal } from "@/components/Exhausts/CreateStreamModal";
import { LogStreamView } from "@/components/Exhausts/LogStreamView";
import { toast } from "sonner";

const Exhausts = () => {
  const [streams, setStreams] = useState<ExhaustStream[]>(mockExhausts);
  const [selectedStream, setSelectedStream] = useState<ExhaustStream | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateStream = (name: string, ticketKey: string | null) => {
    const newStream: ExhaustStream = {
      id: String(Date.now()),
      name,
      status: 'waiting',
      linkedTicket: ticketKey ? `Ticket ${ticketKey}` : null,
      ticketKey,
      createdBy: 'You',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      streamUrl: `https://atlas.exhaust.io/stream/${name.toLowerCase().replace(/\s+/g, '-')}`,
      token: `exh_live_${Math.random().toString(36).substring(2, 22)}`,
      logs: []
    };
    setStreams([newStream, ...streams]);
    toast.success("Stream created successfully");
  };

  const handleDeleteStream = (streamId: string) => {
    setStreams(streams.filter(s => s.id !== streamId));
    if (selectedStream?.id === streamId) {
      setSelectedStream(null);
    }
    toast.success("Stream deleted");
  };

  const handleDisconnectStream = () => {
    if (selectedStream) {
      setStreams(streams.map(s => 
        s.id === selectedStream.id ? { ...s, status: 'disconnected' as const } : s
      ));
      setSelectedStream({ ...selectedStream, status: 'disconnected' });
      toast.success("Stream disconnected");
    }
  };

  // Stats
  const activeCount = streams.filter(s => s.status === 'active').length;
  const waitingCount = streams.filter(s => s.status === 'waiting').length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {selectedStream ? (
            <LogStreamView
              stream={selectedStream}
              onBack={() => setSelectedStream(null)}
              onDisconnect={handleDisconnectStream}
              onDelete={() => handleDeleteStream(selectedStream.id)}
            />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <SidebarTrigger />
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
                        <Radio className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold">Exhausts</h1>
                        <p className="text-sm text-muted-foreground">Real-Time Log Streams</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Log Stream
                </Button>
              </div>

              {/* Stats */}
              <div className="px-6 py-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{activeCount}</span> Active
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{waitingCount}</span> Waiting
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {streams.filter(s => s.status === 'disconnected').length}
                    </span> Disconnected
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 px-6 pb-6 overflow-auto">
                <ExhaustsTable
                  streams={streams}
                  onViewStream={setSelectedStream}
                  onDeleteStream={handleDeleteStream}
                />
              </div>
            </>
          )}

          {/* Create Modal */}
          <CreateStreamModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            onCreateStream={handleCreateStream}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Exhausts;
