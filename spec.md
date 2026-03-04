# Phil3

## Current State
The `transferFromTreasury` backend function exists in `main.mo` and is declared in `backend.d.ts` (on the `backendInterface` interface), but it is **missing from the generated `backend.ts` actor class**. It is also missing from the candid declarations (`backend.did.d.ts` and `backend.did.js`).

The `useTransferFromTreasury` hook in `useQueries.ts` attempts to work around this with a TypeScript cast, but at runtime the method does not exist, causing: "actorWithTransfer.transferFromTreasury is not a function".

## Requested Changes (Diff)

### Add
- `transferFromTreasury` method to `backend.ts` actor class, following the same pattern as `donatePHIL` (takes TreasuryTarget, Principal, bigint; returns Promise<void>)
- `transferFromTreasury` entry to both `backend.did.d.ts` (TypeScript interface) and `backend.did.js` (IDL factory)

### Modify
- `useTransferFromTreasury` hook in `useQueries.ts`: remove the hacky cast workaround and call `actor.transferFromTreasury(...)` directly once it's properly implemented in the actor class

### Remove
- Nothing

## Implementation Plan
1. Add `transferFromTreasury` to `backend.did.d.ts` service interface: `'transferFromTreasury': ActorMethod<[TreasuryTarget, Principal, bigint], undefined>`
2. Add `transferFromTreasury` to `backend.did.js` IDL service: `'transferFromTreasury': IDL.Func([TreasuryTarget, IDL.Principal, IDL.Nat], [], [])` — add it in BOTH the partial and full service definitions (there appear to be two service blocks in that file)
3. Add `async transferFromTreasury(arg0: TreasuryTarget, arg1: Principal, arg2: bigint): Promise<void>` implementation to `backend.ts` actor class, following the exact same pattern as `mintRewards` / `donatePHIL` (call `this.actor.transferFromTreasury(...)` with proper candid encoding for TreasuryTarget using the existing `to_candid_TreasuryTarget_n12` helper, Principal passes through directly, bigint passes through directly)
4. Update `useTransferFromTreasury` in `useQueries.ts` to remove the cast and call `await actor.transferFromTreasury(treasury, recipient, amount)` directly
5. Run typecheck and build to confirm no errors
