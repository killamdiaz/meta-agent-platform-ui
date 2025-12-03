import { Ticket } from "@/data/mockTickets";
import TicketList from "./TicketList";
import TicketDetail from "./TicketDetail";

type TicketDrawerProps = {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  onSelectTicket: (ticket: Ticket) => void;
  onClearSelection: () => void;
};

export default function TicketDrawer({ tickets, selectedTicket, onSelectTicket, onClearSelection }: TicketDrawerProps) {
  return (
    <div className="h-full bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-5 overflow-y-auto">
      {selectedTicket ? (
        <TicketDetail ticket={selectedTicket} onBack={onClearSelection} />
      ) : (
        <>
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Tickets</h2>
          <TicketList 
            tickets={tickets} 
            selectedTicket={selectedTicket} 
            onSelectTicket={onSelectTicket} 
          />
        </>
      )}
    </div>
  );
}
