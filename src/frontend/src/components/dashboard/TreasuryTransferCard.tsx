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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Principal } from "@icp-sdk/core/principal";
import { AlertCircle, CheckCircle2, Loader2, Send, Vault } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TreasuryTarget } from "../../backend";
import {
  useGetTreasuryBalances,
  useTransferFromTreasury,
} from "../../hooks/useQueries";

function formatPHIL(amount: bigint): string {
  return Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function getTreasuryBalance(
  balances: { rewards: bigint; marketing: bigint; council: bigint } | undefined,
  treasury: TreasuryTarget,
): bigint | null {
  if (!balances) return null;
  switch (treasury) {
    case TreasuryTarget.rewards:
      return balances.rewards;
    case TreasuryTarget.marketing:
      return balances.marketing;
    case TreasuryTarget.council:
      return balances.council;
    default:
      return null;
  }
}

export default function TreasuryTransferCard() {
  const [selectedTreasury, setSelectedTreasury] = useState<TreasuryTarget | "">(
    "",
  );
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transferStatus, setTransferStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const { data: treasuryBalances } = useGetTreasuryBalances();
  const transferMutation = useTransferFromTreasury();

  const selectedBalance = selectedTreasury
    ? getTreasuryBalance(treasuryBalances, selectedTreasury as TreasuryTarget)
    : null;

  const handleSubmit = async () => {
    setTransferStatus("idle");

    // Validation
    if (!selectedTreasury) {
      toast.error("Please select a treasury account");
      return;
    }

    if (!recipient.trim()) {
      toast.error("Please enter a recipient principal address");
      return;
    }

    const amountNum = Number.parseFloat(amount);
    if (!amount || Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }

    // Validate and parse principal
    let recipientPrincipal: Principal;
    try {
      recipientPrincipal = Principal.fromText(recipient.trim());
    } catch {
      toast.error(
        "Invalid principal address. Please check the recipient and try again.",
      );
      setTransferStatus("error");
      return;
    }

    // Convert amount to bigint
    const amountBigInt = BigInt(Math.floor(amountNum));

    try {
      await transferMutation.mutateAsync({
        treasury: selectedTreasury as TreasuryTarget,
        recipient: recipientPrincipal,
        amount: amountBigInt,
      });

      setTransferStatus("success");
      toast.success(
        `Successfully transferred ${formatPHIL(amountBigInt)} PHIL to ${recipient.trim().slice(0, 20)}...`,
      );

      // Reset form
      setRecipient("");
      setAmount("");
      setSelectedTreasury("");

      // Reset success indicator after 3 seconds
      setTimeout(() => setTransferStatus("idle"), 3000);
    } catch (error: unknown) {
      setTransferStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Transfer failed: ${errorMessage}`);
      setTimeout(() => setTransferStatus("idle"), 3000);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Vault className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Send PHIL from Treasury</CardTitle>
            <CardDescription>
              Transfer PHIL tokens from a treasury account directly to a user
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Treasury Select */}
        <div className="space-y-2">
          <Label htmlFor="treasury-select">Treasury Account</Label>
          <Select
            value={selectedTreasury}
            onValueChange={(val) => setSelectedTreasury(val as TreasuryTarget)}
          >
            <SelectTrigger
              id="treasury-select"
              data-ocid="treasury_transfer.select"
              className="w-full"
            >
              <SelectValue placeholder="Select treasury..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TreasuryTarget.rewards}>
                <div className="flex items-center gap-2">
                  <span>Rewards Treasury</span>
                  {treasuryBalances && (
                    <Badge variant="secondary" className="text-xs font-mono">
                      {formatPHIL(treasuryBalances.rewards)} PHIL
                    </Badge>
                  )}
                </div>
              </SelectItem>
              <SelectItem value={TreasuryTarget.marketing}>
                <div className="flex items-center gap-2">
                  <span>Marketing Treasury</span>
                  {treasuryBalances && (
                    <Badge variant="secondary" className="text-xs font-mono">
                      {formatPHIL(treasuryBalances.marketing)} PHIL
                    </Badge>
                  )}
                </div>
              </SelectItem>
              <SelectItem value={TreasuryTarget.council}>
                <div className="flex items-center gap-2">
                  <span>Council Treasury</span>
                  {treasuryBalances && (
                    <Badge variant="secondary" className="text-xs font-mono">
                      {formatPHIL(treasuryBalances.council)} PHIL
                    </Badge>
                  )}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Available balance indicator */}
          {selectedTreasury && selectedBalance !== null && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <span>Available:</span>
              <span className="font-mono font-medium text-foreground">
                {formatPHIL(selectedBalance)} PHIL
              </span>
            </p>
          )}
        </div>

        {/* Recipient Principal */}
        <div className="space-y-2">
          <Label htmlFor="recipient-input">Recipient Principal</Label>
          <Input
            id="recipient-input"
            data-ocid="treasury_transfer.input"
            placeholder="e.g. 2vxsx-fae or full principal address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Enter the recipient's Internet Identity principal address
          </p>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount-input">Amount (PHIL)</Label>
          <Input
            id="amount-input"
            type="number"
            min="1"
            step="1"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {selectedBalance !== null &&
            amount &&
            Number.parseFloat(amount) > Number(selectedBalance) && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Amount exceeds available treasury balance
              </p>
            )}
        </div>

        {/* Status indicators */}
        {transferStatus === "success" && (
          <div
            data-ocid="treasury_transfer.success_state"
            className="flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-sm text-success-foreground"
          >
            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
            <span>Transfer completed successfully</span>
          </div>
        )}

        {transferStatus === "error" && (
          <div
            data-ocid="treasury_transfer.error_state"
            className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive-foreground"
          >
            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
            <span>
              Transfer failed. Please check the details and try again.
            </span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          data-ocid="treasury_transfer.submit_button"
          onClick={handleSubmit}
          disabled={
            transferMutation.isPending ||
            !selectedTreasury ||
            !recipient.trim() ||
            !amount
          }
          className="w-full"
        >
          {transferMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending PHIL...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send PHIL
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
