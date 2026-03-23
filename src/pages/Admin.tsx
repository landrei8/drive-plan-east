import { AppLayout } from "@/components/AppLayout";
import { ArrowLeft, CheckCircle2, XCircle, Clock, MapPin, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const pendingStations = [
  { id: 1, name: "ChargePoint - Bucharest Mall", type: "EV", submitted: "2 hours ago", user: "user@example.com", status: "pending" },
  { id: 2, name: "Enel X - Cluj Center", type: "EV", submitted: "5 hours ago", user: "john@email.com", status: "pending" },
  { id: 3, name: "Tesla SC - Timișoara", type: "EV", submitted: "1 day ago", user: "maria@test.com", status: "pending" },
];

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Manage station submissions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Pending", value: "3", color: "text-warning" },
            { label: "Approved", value: "142", color: "text-primary" },
            { label: "Rejected", value: "8", color: "text-destructive" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-3 text-center">
              <p className={`text-xl font-display font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Pending list */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            Pending Approval
          </h2>
          {pendingStations.map((station) => (
            <div key={station.id} className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{station.name}</p>
                    <p className="text-xs text-muted-foreground">{station.user} · {station.submitted}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 h-9 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1 h-9 text-xs text-destructive border-destructive/30 hover:bg-destructive/10">
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminPage;
