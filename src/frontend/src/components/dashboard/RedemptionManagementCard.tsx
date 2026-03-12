import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Settings, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import type { RedemptionRequest } from "./PhilRedemptionCard";

const RATE_KEY = "phil3:philIcpRate";
const REQUESTS_KEY = "phil3:redemptionRequests";

function getStoredRate(): number {
  const stored = localStorage.getItem(RATE_KEY);
  if (!stored) return 0;
  const n = Number.parseFloat(stored);
  return Number.isNaN(n) ? 0 : n;
}

function getRequests(): RedemptionRequest[] {
  const stored = localStorage.getItem(REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveRequests(list: RedemptionRequest[]): void {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
}

export default function RedemptionManagementCard() {
  const { t } = useLanguage();
  const [rateInput, setRateInput] = useState("");
  const [currentRate, setCurrentRate] = useState(0);
  const [rateSaved, setRateSaved] = useState(false);
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);

  useEffect(() => {
    const r = getStoredRate();
    setCurrentRate(r);
    setRateInput(r > 0 ? String(r) : "");
    setRequests(
      getRequests().filter(
        (req) => req.status === "pending" || req.status === "approved",
      ),
    );
  }, []);

  const handleSaveRate = () => {
    const n = Number.parseFloat(rateInput);
    if (Number.isNaN(n) || n <= 0) return;
    localStorage.setItem(RATE_KEY, String(n));
    setCurrentRate(n);
    setRateSaved(true);
    setTimeout(() => setRateSaved(false), 3000);
  };

  const handleApprove = (id: string) => {
    const updated = getRequests().map((req) =>
      req.id === id ? { ...req, status: "approved" as const } : req,
    );
    saveRequests(updated);
    setRequests(
      updated.filter(
        (req) => req.status === "pending" || req.status === "approved",
      ),
    );
  };

  const handleReject = (id: string) => {
    const updated = getRequests().filter((req) => req.id !== id);
    saveRequests(updated);
    setRequests(
      updated.filter(
        (req) => req.status === "pending" || req.status === "approved",
      ),
    );
  };

  const pendingRequests = requests.filter((req) => req.status === "pending");
  const approvedRequests = requests.filter((req) => req.status === "approved");

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>{t.redemption.managementTitle}</CardTitle>
            <CardDescription>{t.redemption.managementDesc}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rate setting */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">{t.redemption.setRate}</h4>
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="mgmt-rate-input">{t.redemption.rateLabel}</Label>
              <Input
                id="mgmt-rate-input"
                type="number"
                min="1"
                placeholder="e.g. 1000"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                data-ocid="redemption_mgmt.rate_input"
              />
            </div>
            <Button
              onClick={handleSaveRate}
              disabled={!rateInput || Number.parseFloat(rateInput) <= 0}
              data-ocid="redemption_mgmt.save_button"
            >
              {t.redemption.saveRate}
            </Button>
          </div>
          {rateSaved && (
            <p
              className="text-xs text-primary"
              data-ocid="redemption_mgmt.success_state"
            >
              ✓ {t.redemption.rateSaved} ({currentRate} {t.redemption.rateUnit})
            </p>
          )}
        </div>

        <Separator />

        {/* Pending requests */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">
            {t.redemption.pendingRequests}
          </h4>

          {pendingRequests.length === 0 && approvedRequests.length === 0 ? (
            <p
              className="text-sm text-muted-foreground py-2"
              data-ocid="redemption_mgmt.empty_state"
            >
              {t.redemption.noRequests}
            </p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req, i) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-border p-3 space-y-2"
                  data-ocid={`redemption_mgmt.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {req.username || `${req.principalId.slice(0, 10)}...`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.philAmount.toLocaleString()} PHIL &rarr;{" "}
                        {req.icpAmount.toFixed(4)} ICP
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(req.requestedAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      pending
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(req.id)}
                      className="flex-1"
                      data-ocid={`redemption_mgmt.approve_button.${i + 1}`}
                    >
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      {t.redemption.approve}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(req.id)}
                      className="flex-1"
                      data-ocid={`redemption_mgmt.reject_button.${i + 1}`}
                    >
                      <XCircle className="mr-1.5 h-3.5 w-3.5" />
                      {t.redemption.reject}
                    </Button>
                  </div>
                </div>
              ))}

              {/* Approved — show processing note */}
              {approvedRequests.map((req, i) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2"
                  data-ocid={`redemption_mgmt.item.${pendingRequests.length + i + 1}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        {req.username || `${req.principalId.slice(0, 10)}...`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {req.philAmount.toLocaleString()} PHIL &rarr;{" "}
                        {req.icpAmount.toFixed(4)} ICP
                      </p>
                    </div>
                    <Badge className="shrink-0 bg-primary/20 text-primary border-primary/30">
                      {t.redemption.approved}
                    </Badge>
                  </div>
                  <p className="text-xs text-primary rounded bg-primary/10 p-2">
                    {t.redemption.processingNote
                      .replace("{icpAmount}", req.icpAmount.toFixed(4))
                      .replace("{principal}", req.principalId)}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(req.id)}
                    className="w-full text-xs"
                    data-ocid={`redemption_mgmt.delete_button.${pendingRequests.length + i + 1}`}
                  >
                    Mark as Completed &amp; Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
