# Phil3

## Current State

Phil3 is a decentralized community platform with a Motoko backend and React/TypeScript frontend. The backend has treasury balances (`rewards`, `marketing`, `council` fields in `TreasuryBalance`) managed in-canister. PHIL tokens are tracked per user in `tokenBalances`. Admins can mint tokens to treasury via `mintRewards()`. Users can donate PHIL to each other or to a treasury via `donatePHIL()`. The AdminTab.tsx has a General tab and Tokenomics tab. There is currently no way for an admin to send PHIL from a treasury account directly to a specific user.

## Requested Changes (Diff)

### Add
- Backend: `transferFromTreasury(treasury: TreasuryTarget, recipient: Principal, amount: Nat)` — admin-only function that deducts `amount` from the specified treasury balance and credits it to the recipient's `tokenBalances.phil`.
- Frontend: "Treasury Transfer" card in the Admin > General tab. Contains: a treasury selector (Rewards/Marketing/Council), a recipient principal input field, an amount input field, and a "Send PHIL" submit button. Shows current treasury balances for reference. Includes success/error feedback.

### Modify
- AdminTab.tsx: Add the new TreasuryTransferCard component inside the "general" TabsContent section.
- useQueries.ts: Add `useTransferFromTreasury` mutation hook.
- backend.d.ts: Add `transferFromTreasury` to the `backendInterface`.

### Remove
- Nothing removed.

## Implementation Plan

1. Add `transferFromTreasury` function to `main.mo`:
   - Admin-only guard
   - Validate amount > 0
   - Check sufficient treasury balance
   - Deduct from treasury, credit to user's phil balance
2. Update `backend.d.ts` to add the new function signature with `TreasuryTarget` parameter.
3. Add `useTransferFromTreasury` mutation in `useQueries.ts`.
4. Create `TreasuryTransferCard.tsx` component with form fields and submit logic.
5. Import and render `TreasuryTransferCard` inside `AdminTab.tsx` General tab section.
