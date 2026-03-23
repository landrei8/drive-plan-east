import { AppLayout } from "@/components/AppLayout";
import { ArrowLeft, MapPin, Zap, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const SubmitStationPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [connectorType, setConnectorType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Station submitted for review!");
    navigate(-1);
  };

  return (
    <AppLayout showNav={false}>
      <div className="px-4 pt-6 pb-4 space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-display font-bold text-foreground">Submit EV Station</h1>
        </div>

        <div className="glass rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            Help the community by adding EV stations you know about. They'll be visible after admin approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Station Name</label>
            <Input
              placeholder="e.g. ChargePoint - Mall Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-surface border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Address</label>
            <Input
              placeholder="Full address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 bg-surface border-border"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Connector Types</label>
            <div className="flex flex-wrap gap-2">
              {["Type 2", "CCS", "CHAdeMO", "Tesla"].map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setConnectorType(type)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                    connectorType === type
                      ? "bg-primary text-primary-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full h-12 font-semibold">
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </form>
      </div>
    </AppLayout>
  );
};

export default SubmitStationPage;
