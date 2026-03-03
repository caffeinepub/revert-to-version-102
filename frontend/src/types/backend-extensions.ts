// Extended types for backend functionality that aren't exported from the generated backend interface
// These types match the backend implementation but need to be defined here since they're not in the interface

import type { Principal } from '@icp-sdk/core/principal';
import type { Time, ExternalBlob } from '../backend';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: Principal;
  createdAt: Time;
  updatedAt: Time;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: Principal;
  createdAt: Time;
  updatedAt: Time;
  published: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: Principal;
  content: string;
  createdAt: Time;
}

export interface Election {
  id: string;
  candidates: Candidate[];
  isActive: boolean;
}

export interface Candidate {
  name: string;
  profile: any; // UserProfile
  votes: bigint;
}

export enum ConsensusPhase {
  signup = 'signup',
  contribution = 'contribution',
  ranking = 'ranking',
  finalize = 'finalize',
}

export interface ConsensusMeetingView {
  id: string;
  phase: ConsensusPhase;
  participants: Principal[];
  groups: GroupView[];
  startTime: Time;
  phaseStartTime: Time;
  phaseEndTime: Time;
  repDistribution: [Principal, bigint][];
  philDistribution: [Principal, bigint][];
}

export interface GroupView {
  members: Principal[];
  contributions: [Principal, Contribution][];
  rankings: [Principal, Ranking[]][];
  consensusReached: boolean;
}

export interface Contribution {
  text: string;
  files: ExternalBlob[];
}

export interface Ranking {
  participant: Principal;
  rank: bigint;
}

export interface TokenomicsConfig {
  launchDate: Time;
  maxSupply: bigint;
  halvingInterval: Time;
  inflationRate: bigint;
  rewardsTreasuryAddress: string;
  marketingTreasuryAddress: string;
  councilTreasuryAddress: string;
}

export interface TreasuryBalance {
  rewards: bigint;
  marketing: bigint;
  council: bigint;
}

// Re-export the backend type directly to avoid type conflicts (type-only)
export type { CouncilMultiSigAction, DonationTarget } from '../backend';

// Re-export TreasuryTarget as both type and value (enum)
export { TreasuryTarget } from '../backend';
