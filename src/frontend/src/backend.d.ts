import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface SupportedToken {
    name: string;
    symbol: string;
    canisterId: Principal;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface GroupView {
    rankings: Array<[Principal, Array<Ranking>]>;
    members: Array<Principal>;
    contributions: Array<[Principal, Contribution]>;
    consensusReached: boolean;
}
export interface DailyRewardResponse {
    allocationPercentage: bigint;
    canClaim: boolean;
    amount: bigint;
    cooldown: bigint;
}
export interface WalletTransaction {
    id: string;
    fee: bigint;
    status: TransactionStatus;
    recipient: Principal;
    sender: Principal;
    timestamp: Time;
    tokenType: TokenType;
    amount: bigint;
}
export interface ConsensusMeetingView {
    id: string;
    startTime: Time;
    participants: Array<Principal>;
    groups: Array<GroupView>;
    phaseEndTime: Time;
    repDistribution: Array<[Principal, bigint]>;
    philDistribution: Array<[Principal, bigint]>;
    phase: ConsensusPhase;
    phaseStartTime: Time;
}
export interface JoinRequestView {
    status: JoinRequestStatus;
    principal: Principal;
    timestamp: Time;
    approvals: Array<Principal>;
}
export interface Tip {
    id: string;
    tipper: Principal;
    createdAt: Time;
    recipient: Principal;
    amount: bigint;
    postId: string;
}
export interface CouncilDashboard {
    responsibilities: Array<string>;
    lastCouncilUpdate: Time;
    panels: Array<string>;
}
export interface DailyRewardConfig {
    member: bigint;
    activeMember: bigint;
    nonMember: bigint;
    allocationPercentage: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Contribution {
    files: Array<ExternalBlob>;
    text: string;
}
export interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: Time;
    author: Principal;
    updatedAt: Time;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export type TokenType = {
    __kind__: "ICP";
    ICP: null;
} | {
    __kind__: "ICRC1";
    ICRC1: {
        symbol: string;
        canisterId: Principal;
    };
};
export interface BlogPost {
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: Time;
    author: Principal;
    updatedAt: Time;
}
export interface WalletBalances {
    icp: bigint;
    icrc1Tokens: Array<[string, bigint]>;
}
export interface Comment {
    id: string;
    content: string;
    createdAt: Time;
    author: Principal;
    postId: string;
}
export interface CouncilMultiSigAction {
    isExecuted: boolean;
    timestamp: Time;
    details: string;
    completionTimestamp?: Time;
    actionId: string;
    approvals: Array<Principal>;
}
export interface MembershipStatusResponse {
    hasPendingRequest: boolean;
    isMember: boolean;
}
export type DonationTarget = {
    __kind__: "user";
    user: Principal;
} | {
    __kind__: "treasury";
    treasury: TreasuryTarget;
};
export interface WeeklyREPEntry {
    balance: bigint;
    timestamp: Time;
    weekId: string;
}
export interface Ranking {
    rank: bigint;
    participant: Principal;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TreasuryBalance {
    council: bigint;
    marketing: bigint;
    rewards: bigint;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export interface Proposal {
    id: string;
    status: ProposalStatus;
    title: string;
    description: string;
    author: Principal;
    rejections: Array<Principal>;
    timestamp: Time;
    completionTimestamp?: Time;
    approvals: Array<Principal>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface Notification {
    id: string;
    title: string;
    read: boolean;
    recipient: Principal;
    message: string;
    timestamp: Time;
}
export interface WeeklyREPLog {
    principal: Principal;
    entries: Array<WeeklyREPEntry>;
}
export interface TokenomicsConfig {
    inflationRate: bigint;
    initialRewardAmount: bigint;
    halvingInterval: Time;
    minReward: bigint;
    rewardsTreasuryAddress: string;
    rewardDecreaseFactor: bigint;
    launchDate: Time;
    lastHalvingTime: Time;
    maxSupply: bigint;
    marketingTreasuryAddress: string;
    councilTreasuryAddress: string;
}
export interface TokenBalance {
    rep: bigint;
    phil: bigint;
}
export interface UserProfile {
    bio: string;
    principal: Principal;
    username: string;
    email: string;
    profilePicture?: ExternalBlob;
}
export enum ConsensusPhase {
    signup = "signup",
    contribution = "contribution",
    ranking = "ranking",
    finalize = "finalize"
}
export enum JoinRequestStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum ProposalStatus {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum TransactionStatus {
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum TreasuryTarget {
    council = "council",
    marketing = "marketing",
    rewards = "rewards"
}
export enum UserCategory {
    member = "member",
    activeMember = "activeMember",
    nonMember = "nonMember"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    acceptUCA(): Promise<void>;
    addBlogReaction(postId: string): Promise<void>;
    addSupportedToken(canisterId: Principal, symbol: string, name: string): Promise<void>;
    advanceConsensusMeetingPhase(meetingId: string): Promise<void>;
    approveCouncilAction(actionId: string): Promise<void>;
    approveMemberJoinRequest(user: Principal): Promise<void>;
    approveProposal(id: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateAverageREP(principal: Principal): Promise<bigint>;
    claimDailyReward(): Promise<bigint>;
    createAnnouncement(title: string, content: string): Promise<string>;
    createBlogComment(postId: string, content: string): Promise<string>;
    createBlogPost(title: string, content: string): Promise<string>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createConsensusMeeting(id: string): Promise<void>;
    createProposal(title: string, description: string): Promise<string>;
    deleteBlogPost(id: string): Promise<void>;
    deleteUser(user: Principal): Promise<void>;
    donatePHIL(target: DonationTarget, amount: bigint): Promise<void>;
    editAnnouncement(id: string, newTitle: string, newContent: string): Promise<void>;
    editBlogPost(id: string, newTitle: string, newContent: string): Promise<void>;
    finalizeConsensusMeeting(meetingId: string): Promise<void>;
    forceAdvanceConsensusMeetingPhase(meetingId: string): Promise<void>;
    get12WeekREPHistory(member: Principal): Promise<Array<WeeklyREPEntry>>;
    getActiveUCA(): Promise<string>;
    getAllAnnouncements(): Promise<Array<Announcement>>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllConsensusMeetings(): Promise<Array<ConsensusMeetingView>>;
    getAllJoinRequests(): Promise<Array<JoinRequestView>>;
    getAllMembers(): Promise<Array<UserProfile>>;
    getAllNotificationsForUser(): Promise<Array<Notification>>;
    getAllProposals(): Promise<Array<Proposal>>;
    getAllWeeklyREPLogs(): Promise<Array<WeeklyREPLog>>;
    getAnnouncement(id: string): Promise<Announcement | null>;
    getAvailableConsensusDistributionPool(): Promise<bigint>;
    getAvailableDailyRewardsPool(): Promise<bigint>;
    getAverageREPForAllMembers(): Promise<Array<[Principal, bigint]>>;
    getBlogCommentsByPost(postId: string): Promise<Array<Comment>>;
    getBlogPost(id: string): Promise<BlogPost | null>;
    getBlogReactionCount(postId: string): Promise<bigint>;
    getBlogTipsByPost(postId: string): Promise<Array<Tip>>;
    getCallerCategory(): Promise<UserCategory>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConsensusDistributionAllocation(): Promise<bigint>;
    getConsensusMeeting(meetingId: string): Promise<ConsensusMeetingView | null>;
    getCouncilDashboard(): Promise<CouncilDashboard | null>;
    getCouncilMembers(): Promise<Array<Principal>>;
    getCurrentSupply(): Promise<bigint>;
    getDailyRewardConfig(): Promise<DailyRewardConfig>;
    getDailyRewardEligibility(): Promise<DailyRewardResponse>;
    getLastClaimTime(): Promise<Time>;
    getLastCouncilUpdate(): Promise<Time>;
    getMembershipStatus(): Promise<MembershipStatusResponse>;
    getMintCycleStatus(): Promise<bigint>;
    getPendingCouncilActions(): Promise<Array<CouncilMultiSigAction>>;
    getPendingJoinRequests(): Promise<Array<JoinRequestView>>;
    getProposal(id: string): Promise<Proposal | null>;
    getRewardAmountForCategory(category: UserCategory): Promise<bigint>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSupportedTokens(): Promise<Array<SupportedToken>>;
    getTokenBalance(user: Principal): Promise<TokenBalance>;
    getTokenomicsConfig(): Promise<TokenomicsConfig>;
    getTotalBlogTipsForPost(postId: string): Promise<bigint>;
    getTransactionHistory(): Promise<Array<WalletTransaction>>;
    getTreasuryBalances(): Promise<TreasuryBalance>;
    getUnreadNotifications(): Promise<Array<Notification>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWalletBalances(): Promise<WalletBalances>;
    getWeeklyREPHistoryForAllMembers(): Promise<Array<[Principal, Array<WeeklyREPEntry>]>>;
    getWeeklyREPLog(member: Principal): Promise<WeeklyREPLog | null>;
    hasAcceptedUCA(): Promise<boolean>;
    hasUserReactedToBlogPost(postId: string): Promise<boolean>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    isCouncilMember(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    leaveCommunity(): Promise<void>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    markNotificationAsRead(notificationId: string): Promise<void>;
    mintRewards(): Promise<void>;
    promoteToAdmin(user: Principal): Promise<void>;
    proposeCouncilAction(actionId: string, details: string): Promise<void>;
    recalculateCouncilByAverageREP(): Promise<void>;
    rejectProposal(id: string): Promise<void>;
    removeSupportedToken(canisterId: Principal): Promise<void>;
    requestApproval(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendICP(recipient: Principal, amount: bigint): Promise<string>;
    sendICRC1Token(tokenCanisterId: Principal, recipient: Principal, amount: bigint): Promise<string>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    signUpForConsensusMeeting(meetingId: string): Promise<void>;
    submitContribution(meetingId: string, text: string, files: Array<ExternalBlob>): Promise<void>;
    submitJoinRequest(): Promise<void>;
    submitRanking(meetingId: string, rankings: Array<Ranking>): Promise<void>;
    tipBlogPost(postId: string, amount: bigint): Promise<string>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCallerUserProfile(username: string, bio: string, profilePicture: ExternalBlob | null): Promise<void>;
    updateConsensusDistributionAllocation(newAllocation: bigint): Promise<void>;
    updateDailyRewardConfig(newConfig: DailyRewardConfig): Promise<void>;
    updateJoinRequestStatus(user: Principal, status: JoinRequestStatus): Promise<string>;
    updateTokenomicsConfig(newConfig: TokenomicsConfig): Promise<void>;
    updateUCA(newUCA: string): Promise<void>;
}
