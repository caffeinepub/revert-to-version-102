import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, TokenBalance, ExternalBlob, Time, MembershipStatusResponse, JoinRequestView, JoinRequestStatus, CouncilDashboard, DailyRewardConfig, DailyRewardResponse, TokenomicsConfig, TreasuryBalance, CouncilMultiSigAction, DonationTarget, WeeklyREPLog, WeeklyREPEntry, Notification, Proposal } from '../backend';
import { UserCategory } from '../backend';
import { Principal } from '@icp-sdk/core/principal';
import type { 
  Announcement, 
  BlogPost, 
  Comment, 
  Election, 
  ConsensusMeetingView, 
  Contribution, 
  Ranking,
} from '../types/backend-extensions';

// UCA Queries
export function useGetActiveUCA() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['activeUCA'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getActiveUCA();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHasAcceptedUCA() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasAcceptedUCA'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.hasAcceptedUCA();
      } catch (error) {
        // User not authenticated or hasn't accepted
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAcceptUCA() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.acceptUCA();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasAcceptedUCA'] });
    },
  });
}

export function useUpdateUCA() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUCA: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateUCA(newUCA);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeUCA'] });
    },
  });
}

// Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { username: string; bio: string; profilePicture: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateCallerUserProfile(params.username, params.bio, params.profilePicture);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetAllMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ['allMembers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

// User Category Query
export function useGetCallerCategory() {
  const { actor, isFetching } = useActor();

  return useQuery<UserCategory>({
    queryKey: ['callerCategory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerCategory();
      } catch (error) {
        return UserCategory.nonMember;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Weekly REP Tracking Queries
export function useGetWeeklyREPLog() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<WeeklyREPLog | null>({
    queryKey: ['weeklyREPLog'],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const principal = identity.getPrincipal();
      return actor.getWeeklyREPLog(principal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGet12WeekREPHistory() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<WeeklyREPEntry[]>({
    queryKey: ['12WeekREPHistory'],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const principal = identity.getPrincipal();
      return actor.get12WeekREPHistory(principal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// Average REP Calculation Queries
export function useCalculateAverageREP(principal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['averageREP', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) throw new Error('Actor or principal not available');
      return actor.calculateAverageREP(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
  });
}

export function useGetAverageREPForAllMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, bigint]>>({
    queryKey: ['averageREPForAllMembers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAverageREPForAllMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecalculateCouncilByAverageREP() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.recalculateCouncilByAverageREP();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['councilMembers'] });
      queryClient.invalidateQueries({ queryKey: ['councilDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['averageREPForAllMembers'] });
      queryClient.invalidateQueries({ queryKey: ['isCouncilMember'] });
    },
  });
}

// Daily Rewards Queries
export function useGetDailyRewardConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<DailyRewardConfig>({
    queryKey: ['dailyRewardConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailyRewardConfig();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDailyRewardEligibility() {
  const { actor, isFetching } = useActor();

  return useQuery<DailyRewardResponse>({
    queryKey: ['dailyRewardEligibility'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDailyRewardEligibility();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60000, // Refetch every minute to update cooldown
  });
}

export function useClaimDailyReward() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<bigint, Error>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.claimDailyReward();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyRewardEligibility'] });
      queryClient.invalidateQueries({ queryKey: ['tokenBalance'] });
      queryClient.invalidateQueries({ queryKey: ['availableDailyRewardsPool'] });
      queryClient.invalidateQueries({ queryKey: ['treasuryBalances'] });
    },
  });
}

export function useUpdateDailyRewardConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, DailyRewardConfig>({
    mutationFn: async (newConfig: DailyRewardConfig) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateDailyRewardConfig(newConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyRewardConfig'] });
      queryClient.invalidateQueries({ queryKey: ['dailyRewardEligibility'] });
    },
  });
}

export function useGetAvailableDailyRewardsPool() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['availableDailyRewardsPool'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAvailableDailyRewardsPool();
    },
    enabled: !!actor && !isFetching,
  });
}

// Weekly Consensus Distribution Allocation Queries
export function useGetConsensusDistributionAllocation() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['consensusDistributionAllocation'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getConsensusDistributionAllocation();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateConsensusDistributionAllocation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (newAllocation: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateConsensusDistributionAllocation(newAllocation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consensusDistributionAllocation'] });
      queryClient.invalidateQueries({ queryKey: ['availableConsensusDistributionPool'] });
    },
  });
}

export function useGetAvailableConsensusDistributionPool() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['availableConsensusDistributionPool'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAvailableConsensusDistributionPool();
    },
    enabled: !!actor && !isFetching,
  });
}

// Tokenomics Queries
export function useGetTokenomicsConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<TokenomicsConfig>({
    queryKey: ['tokenomicsConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTokenomicsConfig();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTreasuryBalances() {
  const { actor, isFetching } = useActor();

  return useQuery<TreasuryBalance>({
    queryKey: ['treasuryBalances'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTreasuryBalances();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCurrentSupply() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['currentSupply'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrentSupply();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMintCycleStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['mintCycleStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMintCycleStatus();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time countdown
  });
}

export function useUpdateTokenomicsConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, TokenomicsConfig>({
    mutationFn: async (newConfig: TokenomicsConfig) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateTokenomicsConfig(newConfig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenomicsConfig'] });
    },
  });
}

export function useManualMint() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.mintRewards();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treasuryBalances'] });
      queryClient.invalidateQueries({ queryKey: ['currentSupply'] });
      queryClient.invalidateQueries({ queryKey: ['mintCycleStatus'] });
    },
  });
}

// Membership Queries
export function useGetMembershipStatus() {
  const { actor, isFetching } = useActor();

  return useQuery<MembershipStatusResponse>({
    queryKey: ['membershipStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getMembershipStatus();
      } catch (error) {
        return { isMember: false, hasPendingRequest: false };
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitJoinRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitJoinRequest();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['callerCategory'] });
    },
  });
}

export function useLeaveCommunity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.leaveCommunity();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipStatus'] });
      queryClient.invalidateQueries({ queryKey: ['allMembers'] });
      queryClient.invalidateQueries({ queryKey: ['callerCategory'] });
    },
  });
}

export function useGetAllJoinRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<JoinRequestView[]>({
    queryKey: ['allJoinRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllJoinRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPendingJoinRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<JoinRequestView[]>({
    queryKey: ['pendingJoinRequests'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPendingJoinRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateJoinRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<string, Error, { user: Principal; status: JoinRequestStatus }>({
    mutationFn: async ({ user, status }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.updateJoinRequestStatus(user, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingJoinRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allJoinRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allMembers'] });
    },
  });
}

export function useApproveMemberJoinRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, Principal>({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.approveMemberJoinRequest(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingJoinRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allJoinRequests'] });
      queryClient.invalidateQueries({ queryKey: ['allMembers'] });
    },
  });
}

export function useIsCouncilMember() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCouncilMember'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCouncilMember();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCouncilMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['councilMembers'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCouncilMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

// Council Dashboard Query
export function useGetCouncilDashboard() {
  const { actor, isFetching } = useActor();

  return useQuery<CouncilDashboard | null>({
    queryKey: ['councilDashboard'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCouncilDashboard();
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Council Multi-Signature Queries
export function useGetPendingCouncilActions() {
  const { actor, isFetching } = useActor();

  return useQuery<CouncilMultiSigAction[]>({
    queryKey: ['pendingCouncilActions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPendingCouncilActions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProposeCouncilAction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { actionId: string; details: string }>({
    mutationFn: async ({ actionId, details }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.proposeCouncilAction(actionId, details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCouncilActions'] });
    },
  });
}

export function useApproveCouncilAction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (actionId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.approveCouncilAction(actionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingCouncilActions'] });
    },
  });
}

// Token Balance Query
export function useGetTokenBalance() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<TokenBalance>({
    queryKey: ['tokenBalance'],
    queryFn: async () => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const principal = identity.getPrincipal();
      return actor.getTokenBalance(principal);
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

// PHIL Donation Mutation
export function useDonatePHIL() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { target: DonationTarget; amount: bigint }>({
    mutationFn: async ({ target, amount }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.donatePHIL(target, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokenBalance'] });
      queryClient.invalidateQueries({ queryKey: ['treasuryBalances'] });
    },
  });
}

// Notification Queries
export function useGetUnreadNotifications() {
  const { actor, isFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['unreadNotifications'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUnreadNotifications();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useGetAllNotifications() {
  const { actor, isFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['allNotifications'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllNotificationsForUser();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkNotificationAsRead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (notificationId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
    },
  });
}

// Proposal Queries
export function useGetAllProposals() {
  const { actor, isFetching } = useActor();

  return useQuery<Proposal[]>({
    queryKey: ['allProposals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllProposals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProposal(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Proposal | null>({
    queryKey: ['proposal', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProposal(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateProposal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<string, Error, { title: string; description: string }>({
    mutationFn: async ({ title, description }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.createProposal(title, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProposals'] });
    },
  });
}

export function useApproveProposal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.approveProposal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProposals'] });
    },
  });
}

export function useRejectProposal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.rejectProposal(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProposals'] });
    },
  });
}

// ============================================
// ANNOUNCEMENT QUERIES (COMMENTED OUT - HIDDEN FROM UI)
// ============================================
// export function useGetAllAnnouncements() {
//   const { actor, isFetching } = useActor();
//
//   return useQuery<Announcement[]>({
//     queryKey: ['announcements'],
//     queryFn: async () => {
//       if (!actor) throw new Error('Actor not available');
//       return actor.getAllAnnouncements();
//     },
//     enabled: !!actor && !isFetching,
//   });
// }

// export function useGetAnnouncement(id: string) {
//   const { actor, isFetching } = useActor();
//
//   return useQuery<Announcement | null>({
//     queryKey: ['announcement', id],
//     queryFn: async () => {
//       if (!actor) throw new Error('Actor not available');
//       return actor.getAnnouncement(id);
//     },
//     enabled: !!actor && !isFetching && !!id,
//   });
// }

// export function useCreateAnnouncement() {
//   const { actor } = useActor();
//   const queryClient = useQueryClient();
//
//   return useMutation<string, Error, { title: string; content: string }>({
//     mutationFn: async ({ title, content }) => {
//       if (!actor) throw new Error('Actor not available');
//       return await actor.createAnnouncement(title, content);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['announcements'] });
//     },
//   });
// }

// export function useEditAnnouncement() {
//   const { actor } = useActor();
//   const queryClient = useQueryClient();
//
//   return useMutation<void, Error, { id: string; newTitle: string; newContent: string }>({
//     mutationFn: async ({ id, newTitle, newContent }) => {
//       if (!actor) throw new Error('Actor not available');
//       await actor.editAnnouncement(id, newTitle, newContent);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['announcements'] });
//     },
//   });
// }

// Blog Queries
export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBlogPost(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<string, Error, { title: string; content: string }>({
    mutationFn: async ({ title, content }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.createBlogPost(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useEditBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: string; newTitle: string; newContent: string }>({
    mutationFn: async ({ id, newTitle, newContent }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.editBlogPost(id, newTitle, newContent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteBlogPost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    },
  });
}

export function useGetBlogComments(postId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['blogComments', postId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBlogCommentsByPost(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useCreateBlogComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<string, Error, { postId: string; content: string }>({
    mutationFn: async ({ postId, content }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.createBlogComment(postId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogComments', variables.postId] });
    },
  });
}

export function useAddBlogReaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addBlogReaction(postId);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['blogReactionCount', postId] });
      queryClient.invalidateQueries({ queryKey: ['hasUserReacted', postId] });
    },
  });
}

export function useGetBlogReactionCount(postId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['blogReactionCount', postId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBlogReactionCount(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useHasUserReactedToBlogPost(postId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasUserReacted', postId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.hasUserReactedToBlogPost(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useTipBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<string, Error, { postId: string; amount: bigint }>({
    mutationFn: async ({ postId, amount }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.tipBlogPost(postId, amount);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogTips', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['tokenBalance'] });
    },
  });
}

export function useGetBlogTips(postId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['blogTips', postId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTotalBlogTipsForPost(postId);
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

// Consensus Meeting Queries
export function useGetAllConsensusMeetings() {
  const { actor, isFetching } = useActor();

  return useQuery<ConsensusMeetingView[]>({
    queryKey: ['consensusMeetings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllConsensusMeetings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetConsensusMeeting(meetingId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ConsensusMeetingView | null>({
    queryKey: ['consensusMeeting', meetingId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getConsensusMeeting(meetingId);
    },
    enabled: !!actor && !isFetching && !!meetingId,
  });
}

export function useCreateConsensusMeeting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createConsensusMeeting(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consensusMeetings'] });
    },
  });
}

export function useSignUpForConsensusMeeting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (meetingId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.signUpForConsensusMeeting(meetingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consensusMeetings'] });
      queryClient.invalidateQueries({ queryKey: ['callerCategory'] });
    },
  });
}

export function useSubmitContribution() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { meetingId: string; text: string; files: ExternalBlob[] }>({
    mutationFn: async ({ meetingId, text, files }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitContribution(meetingId, text, files);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consensusMeetings'] });
    },
  });
}

export function useSubmitRanking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { meetingId: string; rankings: Ranking[] }>({
    mutationFn: async ({ meetingId, rankings }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitRanking(meetingId, rankings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consensusMeetings'] });
    },
  });
}

export function useAdvanceConsensusMeetingPhase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (meetingId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.advanceConsensusMeetingPhase(meetingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consensusMeetings'] });
    },
  });
}

export function useForceAdvanceConsensusMeetingPhase() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (meetingId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.forceAdvanceConsensusMeetingPhase(meetingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consensusMeetings'] });
    },
  });
}

export function useFinalizeConsensusMeeting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (meetingId: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.finalizeConsensusMeeting(meetingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consensusMeetings'] });
      queryClient.invalidateQueries({ queryKey: ['tokenBalance'] });
    },
  });
}

// Admin Queries
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, Principal>({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteUser(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allMembers'] });
      queryClient.invalidateQueries({ queryKey: ['allJoinRequests'] });
    },
  });
}

export function usePromoteToAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, Principal>({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.promoteToAdmin(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allMembers'] });
    },
  });
}
