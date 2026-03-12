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
import {
  AlertCircle,
  ArrowRightLeft,
  CheckCircle2,
  Coins,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { UserCategory } from "../../backend";
import { useLanguage } from "../../contexts/LanguageContext";
import {
  useGetCallerCategory,
  useGetCallerUserProfile,
  useGetTokenBalance,
} from "../../hooks/useQueries";

const RATE_KEY = "phil3:philIcpRate";
const REQUESTS_KEY = "phil3:redemptionRequests";

export interface RedemptionRequest {
  id: string;
  principalId: string;
  username: string;
  philAmount: number;
  icpAmount: number;
  rate: number;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
}

function getRate(): number {
  const stored = localStorage.getItem(RATE_KEY);
  if (!stored) return 0;
  const n = Number.parseFloat(stored);
  return Number.isNaN(n) ? 0 : n;
}

function saveRequest(req: RedemptionRequest): void {
  const stored = localStorage.getItem(REQUESTS_KEY);
  const list: RedemptionRequest[] = stored ? JSON.parse(stored) : [];
  list.push(req);
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
}

export default function PhilRedemptionCard() {
  const { t } = useLanguage();
  const { data: userCategory } = useGetCallerCategory();
  const { data: balance } = useGetTokenBalance();
  const { data: userProfile } = useGetCallerUserProfile();

  const [philAmount, setPhilAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Only show for non-visitors
  if (userCategory === undefined || userCategory === UserCategory.nonMember) {
    return null;
  }

  const rate = getRate();
  const balanceNum = balance !== undefined ? Number(balance) : 0;
  const philNum = Number.parseFloat(philAmount) || 0;
  const icpAmount = rate > 0 ? philNum / rate : 0;

  const handleSubmit = () => {
    setError("");
    if (rate === 0) return;
    if (philNum <= 0) {
      setError(t.redemption.philAmount);
      return;
    }
    if (philNum > balanceNum) {
      setError(t.redemption.insufficientBalance);
      return;
    }
    setSubmitting(true);
    try {
      const req: RedemptionRequest = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        principalId: userProfile?.principal?.toString() ?? "",
        username: userProfile?.username ?? "",
        philAmount: philNum,
        icpAmount,
        rate,
        requestedAt: new Date().toISOString(),
        status: "pending",
      };
      saveRequest(req);
      setSubmitted(true);
      setPhilAmount("");
    } catch {
      setError(t.redemption.errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{t.redemption.title}</CardTitle>
              <CardDescription>{t.redemption.desc}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rate display */}
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {t.redemption.currentRate}:
          </span>
          {rate > 0 ? (
            <Badge variant="secondary">
              {rate} {t.redemption.rateUnit}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              &mdash;
            </Badge>
          )}
        </div>

        {rate === 0 ? (
          <div className="flex items-center gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {t.redemption.rateNotSet}
          </div>
        ) : submitted ? (
          <div
            className="flex items-center gap-2 rounded-md bg-primary/10 p-3 text-sm text-primary"
            data-ocid="redemption.success_state"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {t.redemption.successMsg}
          </div>
        ) : (
          <>
            {/* Balance */}
            <div className="text-sm">
              <span className="text-muted-foreground">
                {t.redemption.yourBalance}:{" "}
              </span>
              <span className="font-semibold">
                {balanceNum.toLocaleString()} PHIL
              </span>
            </div>

            {/* PHIL amount input */}
            <div className="space-y-2">
              <Label htmlFor="phil-redeem-amount">
                {t.redemption.philAmount}
              </Label>
              <Input
                id="phil-redeem-amount"
                type="number"
                min="0"
                placeholder={t.redemption.philAmountPlaceholder}
                value={philAmount}
                onChange={(e) => {
                  setPhilAmount(e.target.value);
                  setError("");
                  setSubmitted(false);
                }}
                data-ocid="redemption.input"
              />
            </div>

            {/* ICP preview */}
            {philNum > 0 && rate > 0 && (
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <span className="text-muted-foreground">
                  {t.redemption.willReceive}:{" "}
                </span>
                <span className="font-semibold">
                  {icpAmount.toFixed(4)} ICP
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                data-ocid="redemption.error_state"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={submitting || philNum <= 0}
              className="w-full"
              data-ocid="redemption.submit_button"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.redemption.submitting}
                </>
              ) : (
                t.redemption.submitRequest
              )}
            </Button>
          </>
        )}

        {submitted && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setSubmitted(false)}
            data-ocid="redemption.secondary_button"
          >
            {t.redemption.philAmountPlaceholder}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
