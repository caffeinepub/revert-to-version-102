import AccessControl "authorization/access-control";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Set "mo:core/Set";
import Int "mo:core/Int";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Announcements "announcements";
import UserApproval "user-approval/approval";
import OutCall "http-outcalls/outcall";
import Blog "blog";
import VarArray "mo:core/VarArray";
import Notifications "notifications";
import Stripe "stripe/stripe";

actor {
  include MixinStorage();

  type UserProfile = {
    username : Text;
    email : Text;
    profilePicture : ?Storage.ExternalBlob;
    principal : Principal;
    bio : Text;
  };

  module UserProfile {
    public func compare(profile1 : UserProfile, profile2 : UserProfile) : Order.Order {
      Text.compare(profile1.username, profile2.username);
    };
  };

  type WeeklyREPEntry = {
    weekId : Text;
    balance : Nat;
    timestamp : Time.Time;
  };

  public type WeeklyREPLog = {
    principal : Principal;
    entries : [WeeklyREPEntry];
  };

  type UCATimestamp = {
    accepted : Bool;
    timestamp : Time.Time;
    principal : Principal;
  };

  type TokenBalance = {
    rep : Nat;
    phil : Nat;
  };

  type Candidate = {
    name : Text;
    profile : UserProfile;
    votes : Nat;
  };

  type Election = {
    id : Text;
    candidates : [Candidate];
    isActive : Bool;
  };

  type ConsensusPhase = {
    #signup;
    #contribution;
    #ranking;
    #finalize;
  };

  type Contribution = {
    text : Text;
    files : [Storage.ExternalBlob];
  };

  type Ranking = {
    participant : Principal;
    rank : Nat;
  };

  type Group = {
    members : [Principal];
    contributions : Map.Map<Principal, Contribution>;
    rankings : Map.Map<Principal, [Ranking]>;
    consensusReached : Bool;
  };

  type ConsensusMeeting = {
    id : Text;
    phase : ConsensusPhase;
    participants : [Principal];
    groups : Map.Map<Nat, Group>;
    startTime : Time.Time;
    phaseStartTime : Time.Time;
    phaseEndTime : Time.Time;
    repDistribution : Map.Map<Principal, Nat>;
    philDistribution : Map.Map<Principal, Nat>;
  };

  type TokenomicsConfig = {
    launchDate : Time.Time;
    maxSupply : Nat;
    halvingInterval : Time.Time;
    inflationRate : Nat;
    rewardsTreasuryAddress : Text;
    marketingTreasuryAddress : Text;
    councilTreasuryAddress : Text;
    initialRewardAmount : Nat;
    rewardDecreaseFactor : Nat;
    minReward : Nat;
    lastHalvingTime : Time.Time;
  };

  type TreasuryBalance = {
    rewards : Nat;
    marketing : Nat;
    council : Nat;
  };

  public type JoinRequestPublic = {
    principal : Principal;
    timestamp : Time.Time;
    status : JoinRequestStatus;
  };

  type JoinRequest = {
    principal : Principal;
    timestamp : Time.Time;
    status : JoinRequestStatus;
    memberApprovals : Set.Set<Principal>;
  };

  type JoinRequestStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type JoinRequestStatusPublic = JoinRequestStatus;
  public type JoinRequestView = {
    principal : Principal;
    timestamp : Time.Time;
    status : JoinRequestStatus;
    approvals : [Principal];
  };

  public type GroupView = {
    members : [Principal];
    contributions : [(Principal, Contribution)];
    rankings : [(Principal, [Ranking])];
    consensusReached : Bool;
  };

  public type ConsensusMeetingView = {
    id : Text;
    phase : ConsensusPhase;
    participants : [Principal];
    groups : [GroupView];
    startTime : Time.Time;
    phaseStartTime : Time.Time;
    phaseEndTime : Time.Time;
    repDistribution : [(Principal, Nat)];
    philDistribution : [(Principal, Nat)];
  };

  public type MembershipStatus = {
    isMember : Bool;
    hasPendingRequest : Bool;
  };

  public type MembershipStatusResponse = {
    isMember : Bool;
    hasPendingRequest : Bool;
  };

  type CouncilDashboard = {
    responsibilities : [Text];
    panels : [Text];
    lastCouncilUpdate : Time.Time;
  };

  type CouncilMultiSigAction = {
    actionId : Text;
    details : Text;
    approvals : [Principal];
    isExecuted : Bool;
    timestamp : Time.Time;
    completionTimestamp : ?Time.Time;
  };

  type UserCategory = {
    #nonMember;
    #member;
    #activeMember;
  };

  type ParticipationRecord = {
    timestamps : List.List<Time.Time>;
  };

  type RewardAmount = {
    nonMember : Nat;
    member : Nat;
    activeMember : Nat;
  };

  type DailyRewardConfig = {
    nonMember : Nat;
    member : Nat;
    activeMember : Nat;
    allocationPercentage : Nat;
  };

  type DailyRewardResponse = {
    amount : Nat;
    canClaim : Bool;
    cooldown : Nat;
    allocationPercentage : Nat;
  };

  let DEFAULT_REWARD_CONFIG = {
    nonMember = 5;
    member = 15;
    activeMember = 30;
  };

  let REWARD_INTERVAL : Time.Time = 86_400_000_000_000;

  public type TreasuryTarget = {
    #rewards;
    #marketing;
    #council;
  };

  public type DonationTarget = {
    #user : Principal;
    #treasury : TreasuryTarget;
  };

  // Proposal System Types
  public type ProposalStatus = {
    #pending;
    #accepted;
    #rejected;
  };

  public type Proposal = {
    id : Text;
    title : Text;
    description : Text;
    author : Principal;
    timestamp : Time.Time;
    status : ProposalStatus;
    approvals : [Principal];
    rejections : [Principal];
    completionTimestamp : ?Time.Time;
  };

  // NEW: Wallet System Types
  public type TokenType = {
    #ICP;
    #ICRC1 : { canisterId : Principal; symbol : Text };
  };

  public type TransactionStatus = {
    #pending;
    #completed;
    #failed;
  };

  public type WalletTransaction = {
    id : Text;
    sender : Principal;
    recipient : Principal;
    amount : Nat;
    tokenType : TokenType;
    timestamp : Time.Time;
    status : TransactionStatus;
    fee : Nat;
  };

  public type WalletBalances = {
    icp : Nat;
    icrc1Tokens : [(Text, Nat)]; // (symbol, balance)
  };

  public type SupportedToken = {
    canisterId : Principal;
    symbol : Text;
    name : Text;
  };

  // Persistent State
  let accessControlState = AccessControl.initState();
  let announcementsState = Announcements.initState();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let ucaTimestamps = Map.empty<Principal, UCATimestamp>();
  var activeUCA = "Default UCA text";
  let tokenBalances = Map.empty<Principal, TokenBalance>();
  let elections = Map.empty<Text, Election>();
  let consensusMeetings = Map.empty<Text, ConsensusMeeting>();
  let joinRequests = Map.empty<Principal, JoinRequest>();
  var approvalState = UserApproval.initState(accessControlState);

  var tokenomicsConfig : TokenomicsConfig = {
    launchDate = 1704067200000000000;
    maxSupply = 21000000;
    halvingInterval = 777600000000000;
    inflationRate = 2;
    rewardsTreasuryAddress = "rewards";
    marketingTreasuryAddress = "marketing";
    councilTreasuryAddress = "council";
    initialRewardAmount = 50;
    rewardDecreaseFactor = 2;
    minReward = 1;
    lastHalvingTime = 1704067200000000000;
  };

  var treasuryBalance : TreasuryBalance = {
    rewards = 0;
    marketing = 0;
    council = 0;
  };
  var currentSupply = 0;
  var lastMintTime : Time.Time = 0;
  var currentEraReward = 50;
  var weeklyRewardsClaimed = Map.empty<Principal, Time.Time>();
  let councilMembers = Map.empty<Nat, Principal>();
  var lastCouncilUpdate : Time.Time = 0;
  let councilMultiSigActions = Map.empty<Text, CouncilMultiSigAction>();
  let participationRecords = Map.empty<Principal, ParticipationRecord>();

  let lastClaimTimestamps = Map.empty<Principal, Time.Time>();
  var dailyRewardConfig : DailyRewardConfig = {
    DEFAULT_REWARD_CONFIG with
    allocationPercentage = 30 : Nat;
  };

  var consensusDistributionAllocation : Nat = 70;

  let blogState = Blog.initState();

  let notificationsState = Notifications.initState();

  let weeklyREPLogs = Map.empty<Principal, List.List<WeeklyREPEntry>>();

  let proposals = Map.empty<Text, Proposal>();

  // NEW: Wallet System State
  let walletTransactions = Map.empty<Text, WalletTransaction>();
  let walletBalances = Map.empty<Principal, WalletBalances>();
  let supportedTokens = Map.empty<Principal, SupportedToken>();

  ////////////////////////////////////////////////////////////
  // Consistent Helper Functions
  ////////////////////////////////////////////////////////////
  func isParticipant(meeting : ConsensusMeeting, caller : Principal) : Bool {
    meeting.participants.find(func(p) { p == caller }) != null;
  };

  func findGroupForParticipant(meeting : ConsensusMeeting, caller : Principal) : ?Nat {
    for ((groupId, group) in meeting.groups.entries()) {
      if (group.members.find(func(p) { p == caller }) != null) {
        return ?groupId;
      };
    };
    null;
  };

  func shuffleArray(arr : [Principal], seed : Nat) : [Principal] {
    let mutable = VarArray.fromArray(arr);
    let size = mutable.size();
    var i = size;
    var randomValue = seed;

    while (i > 1) {
      i -= 1;
      randomValue := (randomValue * 1103515245 + 12345) % 2147483648;
      let j = randomValue % (i + 1);
      let temp = mutable.get(i);
      mutable.put(i, mutable.get(j));
      mutable.put(j, temp);
    };

    mutable.toArray();
  };

  func createGroups(participants : [Principal]) : Map.Map<Nat, Group> {
    let groups = Map.empty<Nat, Group>();
    let shuffled = shuffleArray(participants, Int.abs(Time.now()));
    let totalParticipants = shuffled.size();

    if (totalParticipants < 3) {
      return groups;
    };

    var groupId = 0;
    var i = 0;

    while (i < totalParticipants) {
      let remaining = Int.abs(totalParticipants - i);
      let groupSize = if (remaining >= 6) {
        6;
      } else if (remaining >= 3) {
        remaining;
      } else {
        if (groupId > 0) {
          switch (groups.get(Int.abs(groupId - 1))) {
            case (?lastGroup) {
              let endIndex = if (i + remaining > totalParticipants) {
                totalParticipants;
              } else {
                i + remaining;
              };
              let mergedMembers = lastGroup.members.concat(shuffled.sliceToArray(i, endIndex));
              let updatedGroup : Group = {
                members = mergedMembers;
                contributions = lastGroup.contributions;
                rankings = lastGroup.rankings;
                consensusReached = lastGroup.consensusReached;
              };
              groups.add(Int.abs(groupId - 1), updatedGroup);
            };
            case null {};
          };
        };
        0;
      };

      if (groupSize > 0) {
        let endIndex = if (i + groupSize > totalParticipants) {
          totalParticipants;
        } else {
          i + groupSize;
        };
        let groupMembers = shuffled.sliceToArray(i, endIndex);
        let newGroup : Group = {
          members = groupMembers;
          contributions = Map.empty<Principal, Contribution>();
          rankings = Map.empty<Principal, [Ranking]>();
          consensusReached = false;
        };
        groups.add(groupId, newGroup);
        groupId += 1;
        i += groupSize;
      } else {
        i := totalParticipants;
      };
    };

    groups;
  };

  func toConsensusMeetingView(meeting : ConsensusMeeting) : ConsensusMeetingView {
    let groupsArray = meeting.groups.toArray().map(
      func((_, group)) {
        {
          members = group.members;
          contributions = group.contributions.toArray();
          rankings = group.rankings.toArray();
          consensusReached = group.consensusReached;
        };
      }
    );

    {
      id = meeting.id;
      phase = meeting.phase;
      participants = meeting.participants;
      groups = groupsArray;
      startTime = meeting.startTime;
      phaseStartTime = meeting.phaseStartTime;
      phaseEndTime = meeting.phaseEndTime;
      repDistribution = meeting.repDistribution.toArray();
      philDistribution = meeting.philDistribution.toArray();
    };
  };

  func areRankingsIdentical(rankings1 : [Ranking], rankings2 : [Ranking]) : Bool {
    if (rankings1.size() != rankings2.size()) {
      return false;
    };

    for (i in Nat.range(0, rankings1.size())) {
      if (rankings1[i].participant != rankings2[i].participant or rankings1[i].rank != rankings2[i].rank) {
        return false;
      };
    };

    true;
  };

  func isApprovedMember(caller : Principal) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    switch (joinRequests.get(caller)) {
      case (null) { false };
      case (?request) { request.status == #approved };
    };
  };

  func checkIfCouncilMember(principal : Principal) : Bool {
    for ((_, member) in councilMembers.entries()) {
      if (member == principal) {
        return true;
      };
    };
    false;
  };

  func countApprovedMembers() : Nat {
    var count = 0;
    for ((_, request) in joinRequests.entries()) {
      if (request.status == #approved) {
        count += 1;
      };
    };
    count;
  };

  func isInFirstFiveApproved() : Bool {
    countApprovedMembers() < 5;
  };

  func addToCouncilIfFirst(user : Principal) : () {
    if (councilMembers.size() < 5) {
      councilMembers.add(councilMembers.size(), user);
      lastCouncilUpdate := Time.now();
    };
  };

  func calculateCallerCategory(caller : Principal) : UserCategory {
    if (not isApprovedMember(caller)) {
      #nonMember;
    } else {
      switch (participationRecords.get(caller)) {
        case (null) {
          #member;
        };
        case (?event) {
          let now = Time.now();
          let oneMonth = 30 * 24 * 60 * 60 * 1000000000;
          let recentParticipation = event.timestamps.find(
            func(ts) { now - ts <= oneMonth }
          );
          switch (recentParticipation) {
            case (null) { #member };
            case (_) { #activeMember };
          };
        };
      };
    };
  };

  func recordParticipation(caller : Principal) : () {
    let now = Time.now();
    let newTimestamps = List.empty<Time.Time>();
    newTimestamps.add(now);

    let rollingTimestamps = switch (participationRecords.get(caller)) {
      case (null) { newTimestamps };
      case (?existingEvent) {
        let nonDuplicate = existingEvent.timestamps.toVarArray();
        newTimestamps.addAll(nonDuplicate.values());
        existingEvent.timestamps;
      };
    };

    let record : ParticipationRecord = {
      timestamps = rollingTimestamps;
    };
    participationRecords.add(caller, record);
  };

  ///////////////////////////////////////////////////////////////////////
  // Weekly REP Tracking Logic
  ///////////////////////////////////////////////////////////////////////
  public query ({ caller }) func getWeeklyREPLog(member : Principal) : async ?WeeklyREPLog {
    // Authorization: Only authenticated users can view weekly REP logs
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view weekly REP logs");
    };

    switch (weeklyREPLogs.get(member)) {
      case (null) { null };
      case (?entries) {
        ?{
          principal = member;
          entries = entries.toArray();
        };
      };
    };
  };

  public query ({ caller }) func getAllWeeklyREPLogs() : async [WeeklyREPLog] {
    // Authorization: Only admins can view all weekly REP logs
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all weekly REP logs");
    };

    weeklyREPLogs.entries().toArray().map(
      func((principal, entries)) {
        {
          principal;
          entries = entries.toArray();
        };
      }
    );
  };

  public query ({ caller }) func get12WeekREPHistory(member : Principal) : async [WeeklyREPEntry] {
    // Authorization: Only authenticated users can view weekly REP history
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view weekly REP history");
    };

    switch (weeklyREPLogs.get(member)) {
      case (null) { [] };
      case (?entries) {
        entries.toArray();
      };
    };
  };

  public query ({ caller }) func getWeeklyREPHistoryForAllMembers() : async [(Principal, [WeeklyREPEntry])] {
    // Authorization: Only admins can view all weekly REP history
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all weekly REP history");
    };

    weeklyREPLogs.entries().toArray().map(
      func((principal, entries)) {
        (principal, entries.toArray());
      }
    );
  };

  func getWeekId(timestamp : Time.Time) : Text {
    let seconds = timestamp / 1000000000;
    let weekNumber = seconds / (7 * 24 * 60 * 60);
    weekNumber.toText();
  };

  func logWeeklyREP(principal : Principal, weekId : Text, balance : Nat, timestamp : Time.Time) : () {
    let entry : WeeklyREPEntry = {
      weekId;
      balance;
      timestamp;
    };

    let existingEntriesOpt = weeklyREPLogs.get(principal);
    let existingEntries = switch (existingEntriesOpt) {
      case (null) { List.empty<WeeklyREPEntry>() };
      case (?entries) { entries };
    };

    let filteredEntries = existingEntries.filter(
      func(e) {
        let currentTimestamp = Time.now();
        currentTimestamp - e.timestamp < 12 * 7 * 24 * 60 * 60 * 1000000000
      }
    );

    filteredEntries.add(entry);

    let trimmedEntries = filteredEntries.filter(
      func(_e) { true }
    );

    weeklyREPLogs.add(principal, trimmedEntries);
  };

  func updateWeeklyREPLog(member : Principal, balance : Nat) : () {
    let weekId = getWeekId(Time.now());
    logWeeklyREP(member, weekId, balance, Time.now());
  };

  ///////////////////////////////////////////////////////////////////////
  // Average REP Calculation and Council Update Logic
  ///////////////////////////////////////////////////////////////////////
  public query ({ caller }) func calculateAverageREP(principal : Principal) : async Nat {
    // Authorization: Only authenticated users can calculate average REP
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can calculate average REP");
    };

    switch (weeklyREPLogs.get(principal)) {
      case (null) { 0 };
      case (?entries) {
        let entriesArray = entries.toArray();
        let entryCount = entriesArray.size();
        if (entryCount == 0) { return 0 };

        var sum = 0;
        for (entry in entriesArray.values()) {
          sum += entry.balance;
        };
        if (sum == 0) { return 0 };
        sum / entryCount;
      };
    };
  };

  public query ({ caller }) func getAverageREPForAllMembers() : async [(Principal, Nat)] {
    // Authorization: Only authenticated users can view average REP
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view average REP");
    };

    let averages = List.empty<(Principal, Nat)>();

    for ((principal, entries) in weeklyREPLogs.entries()) {
      let entriesArray = entries.toArray();
      let entryCount = entriesArray.size();
      if (entryCount > 0) {
        var sum = 0;
        for (entry in entriesArray.values()) {
          sum += entry.balance;
        };
        if (sum > 0) {
          let average = sum / entryCount;
          averages.add((principal, average));
        };
      };
    };

    averages.toArray();
  };

  public shared ({ caller }) func recalculateCouncilByAverageREP() : async () {
    // Authorization: Only admins or council members can recalculate council
    if (not AccessControl.hasPermission(accessControlState, caller, #admin) and not checkIfCouncilMember(caller)) {
      Runtime.trap(
        "Only admins or current council members can recalculate council using average REP"
      );
    };

    let averages = List.empty<(Principal, Nat)>();

    for ((principal, entries) in weeklyREPLogs.entries()) {
      let entriesArray = entries.toArray();
      let entryCount = entriesArray.size();
      if (entryCount > 0) {
        var sum = 0;
        for (entry in entriesArray.values()) {
          sum += entry.balance;
        };
        if (sum > 0) {
          let average = sum / entryCount;
          averages.add((principal, average));
        };
      };
    };

    let averagesArray = averages.toArray();

    switch (averagesArray.size()) {
      case (0) {
        Runtime.trap("No average REP data available, council not recalculated");
      };
      case (s) {
        if (s > 0 and s <= 5) {
          Runtime.trap("Not enough members for a council, council not recalculated");
        };
      };
      case (_) {
        let sorted = averagesArray.sort(
          func(a, b) {
            Nat.compare(b.1, a.1);
          }
        );

        if (sorted.size() < 5) {
          Runtime.trap("Not enough entries to select 5 members");
        };

        councilMembers.clear();

        let count = if (sorted.size() > 5) { 5 } else { sorted.size() };
        for (i in Nat.range(0, count)) {
          let (principal, _) = sorted[i];
          councilMembers.add(i, principal);
        };

        lastCouncilUpdate := Time.now();
      };
    };
  };

  ///////////////////////////////////////////////////////////////////////
  // Tokenomics Logic
  ///////////////////////////////////////////////////////////////////////
  public query ({ caller }) func getTokenomicsConfig() : async TokenomicsConfig {
    // Authorization: Only authenticated users can check config
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check config");
    };
    tokenomicsConfig;
  };

  public query ({ caller }) func getTreasuryBalances() : async TreasuryBalance {
    // Authorization: Only authenticated users can check balances
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check balances");
    };
    treasuryBalance;
  };

  public query ({ caller }) func getCurrentSupply() : async Nat {
    // Authorization: Only authenticated users can check supply
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check supply");
    };
    currentSupply;
  };

  public query ({ caller }) func getMintCycleStatus() : async Nat {
    // Authorization: Only authenticated users can check cycle status
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check cycle status");
    };
    let timeRemaining = if (lastMintTime > 0) {
      600000000000 - (Time.now() - lastMintTime);
    } else {
      0;
    };
    if (timeRemaining >= 0) { timeRemaining.toNat() } else { 0 };
  };

  public shared ({ caller }) func updateTokenomicsConfig(newConfig : TokenomicsConfig) : async () {
    // Authorization: Only authenticated users can update config
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update config");
    };

    // Authorization: Only admins or council members can update tokenomics config
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isCouncilMember = checkIfCouncilMember(caller);

    if (not (isAdmin or isCouncilMember)) {
      Runtime.trap("Unauthorized: Only admins or council members can update tokenomics config");
    };

    if (newConfig.maxSupply < 21000000) {
      Runtime.trap("Maximum supply must be at least 21,000,000");
    };
    if (newConfig.halvingInterval < 777600000000000) {
      Runtime.trap("Halving interval must be at least 3 months");
    };
    if (newConfig.inflationRate > 100) {
      Runtime.trap("Inflation rate must be between 0 and 100");
    };
    if (newConfig.initialRewardAmount < 50) {
      Runtime.trap("Initial reward amount must be at least 50");
    };
    if (newConfig.rewardDecreaseFactor < 2) {
      Runtime.trap("Reward decrease factor must be at least 2");
    };
    if (newConfig.minReward == 0) {
      Runtime.trap("Minimum reward cannot be 0");
    };
    tokenomicsConfig := newConfig;
  };

  public shared ({ caller }) func mintRewards() : async () {
    // Authorization: Only admin can trigger rewards mint
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admin can trigger rewards mint");
    };

    // Fixed minting amount: 50,400 PHIL per invocation (weekly rate: 50 PHIL per 10 minutes × 6 × 24 × 7)
    let mintAmount = 50400;

    if (currentSupply + mintAmount > tokenomicsConfig.maxSupply) {
      Runtime.trap("Cannot mint above max supply");
    };

    let rewardsAmount = (mintAmount * 70) / 100;
    let marketingAmount = (mintAmount * 20) / 100;
    let councilAmount = (mintAmount * 10) / 100;

    treasuryBalance := {
      rewards = treasuryBalance.rewards + rewardsAmount;
      marketing = treasuryBalance.marketing + marketingAmount;
      council = treasuryBalance.council + councilAmount;
    };

    currentSupply += mintAmount;

    if (currentSupply > 0 and currentSupply % 2100000 == 0) {
      currentEraReward /= 2;
    };

    lastMintTime := Time.now();
  };

  ///////////////////////////////////////////////////////////////////////
  // Category Check and Daily Rewards
  ///////////////////////////////////////////////////////////////////////
  public query ({ caller }) func getCallerCategory() : async UserCategory {
    // Authorization: Only authenticated users can check category
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check category");
    };
    calculateCallerCategory(caller);
  };

  public query ({ caller }) func getDailyRewardConfig() : async DailyRewardConfig {
    // Authorization: Only authenticated users can check rewards
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to check rewards");
    };
    dailyRewardConfig;
  };

  public shared ({ caller }) func updateDailyRewardConfig(newConfig : DailyRewardConfig) : async () {
    // Authorization: Only authenticated users can update reward config
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update reward config");
    };

    // Authorization: Only admins or council members can update daily reward config
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isCouncilMember = checkIfCouncilMember(caller);

    if (not (isAdmin or isCouncilMember)) {
      Runtime.trap("Unauthorized: Only admins or council members can update daily reward config");
    };

    if (newConfig.allocationPercentage > 100) {
      Runtime.trap("Allocation percentage must be between 0 and 100");
    };
    dailyRewardConfig := newConfig;
  };

  public query ({ caller }) func getRewardAmountForCategory(category : UserCategory) : async Nat {
    // Authorization: Only authenticated users can check reward amounts
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to check reward amounts");
    };
    switch (category) {
      case (#nonMember) { dailyRewardConfig.nonMember };
      case (#member) { dailyRewardConfig.member };
      case (#activeMember) { dailyRewardConfig.activeMember };
    };
  };

  public query ({ caller }) func getDailyRewardEligibility() : async DailyRewardResponse {
    // Authorization: Only authenticated users can check eligibility
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to check eligibility");
    };

    let category = calculateCallerCategory(caller);
    let rewardAmount = switch (category) {
      case (#nonMember) { dailyRewardConfig.nonMember };
      case (#member) { dailyRewardConfig.member };
      case (#activeMember) { dailyRewardConfig.activeMember };
    };

    let now = Time.now();
    let lastClaim = switch (lastClaimTimestamps.get(caller)) {
      case (null) { 0 };
      case (?time) { time };
    };

    if (now - lastClaim >= REWARD_INTERVAL) {
      {
        amount = rewardAmount;
        canClaim = true;
        cooldown = 0;
        allocationPercentage = dailyRewardConfig.allocationPercentage;
      };
    } else {
      let remainingTime = if (lastClaim > 0) {
        REWARD_INTERVAL - (now - lastClaim);
      } else {
        0;
      };
      {
        amount = rewardAmount;
        canClaim = false;
        cooldown = if (remainingTime >= 0) { remainingTime.toNat() } else { 0 };
        allocationPercentage = dailyRewardConfig.allocationPercentage;
      };
    };
  };

  public query ({ caller }) func getAvailableDailyRewardsPool() : async Nat {
    // Authorization: Only authenticated users can check rewards pool
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to check rewards pool");
    };
    (treasuryBalance.marketing * dailyRewardConfig.allocationPercentage) / 100;
  };

  public shared ({ caller }) func claimDailyReward() : async Nat {
    // Authorization: Only authenticated users can claim rewards
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to claim rewards");
    };

    let category = calculateCallerCategory(caller);
    let rewardAmount = switch (category) {
      case (#nonMember) { dailyRewardConfig.nonMember };
      case (#member) { dailyRewardConfig.member };
      case (#activeMember) { dailyRewardConfig.activeMember };
    };

    if (rewardAmount == 0) {
      Runtime.trap("No reward amount configured for your category");
    };

    let now = Time.now();
    let lastClaim = switch (lastClaimTimestamps.get(caller)) {
      case (null) { 0 };
      case (?time) { time };
    };

    if (now - lastClaim < REWARD_INTERVAL) {
      Runtime.trap("Daily reward already claimed, wait for cooldown");
    };

    let availablePool = (treasuryBalance.marketing * dailyRewardConfig.allocationPercentage) / 100;

    if (rewardAmount > availablePool) {
      Runtime.trap("Daily reward currently unavailable - insufficient funds in allocated pool");
    };

    let updatedBalance : TreasuryBalance = {
      rewards = treasuryBalance.rewards;
      marketing = treasuryBalance.marketing - rewardAmount;
      council = treasuryBalance.council;
    };
    treasuryBalance := updatedBalance;

    lastClaimTimestamps.add(caller, now);

    let currentBalance = switch (tokenBalances.get(caller)) {
      case (null) { { rep = 0; phil = 0 } };
      case (?balance) { balance };
    };

    let updatedTokenBalance : TokenBalance = {
      rep = currentBalance.rep;
      phil = currentBalance.phil + rewardAmount;
    };

    tokenBalances.add(caller, updatedTokenBalance);

    rewardAmount;
  };

  public query ({ caller }) func getLastClaimTime() : async Time.Time {
    // Authorization: Only authenticated users can check last daily claim
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to check last daily claim");
    };
    switch (lastClaimTimestamps.get(caller)) {
      case (null) { 0 };
      case (?t) { t };
    };
  };

  ///////////////////////////////////////////////////////////////////////
  // Notifications Helper Functions
  ///////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func markNotificationAsRead(notificationId : Text) : async () {
    // Authorization: Only authenticated users can mark notifications as read
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to mark notifications as read");
    };
    Notifications.markAsRead(notificationsState, caller, notificationId);
  };

  public query ({ caller }) func getUnreadNotifications() : async [Notifications.Notification] {
    // Authorization: Only authenticated users can retrieve notifications
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to retrieve notifications");
    };
    Notifications.getUnreadNotifications(notificationsState, caller);
  };

  public query ({ caller }) func getAllNotificationsForUser() : async [Notifications.Notification] {
    // Authorization: Only authenticated users can retrieve notifications
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to retrieve notifications");
    };
    Notifications.getAllNotificationsForUser(notificationsState, caller);
  };

  ///////////////////////////////////////////////////////////////////////
  // Weekly Consensus Distribution Allocation System
  ///////////////////////////////////////////////////////////////////////
  public query ({ caller }) func getConsensusDistributionAllocation() : async Nat {
    // Authorization: Only authenticated users can check allocation
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check allocation");
    };

    consensusDistributionAllocation;
  };

  public shared ({ caller }) func updateConsensusDistributionAllocation(newAllocation : Nat) : async () {
    // Authorization: Only authenticated users can update allocation
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update allocation");
    };

    // Authorization: Only admins or council members can update allocation
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isCouncilMember = checkIfCouncilMember(caller);

    if (not (isAdmin or isCouncilMember)) {
      Runtime.trap("Unauthorized: Only admins or council members can update allocation");
    };

    if (newAllocation > 100) {
      Runtime.trap("Allocation percentage must be between 0 and 100");
    };
    consensusDistributionAllocation := newAllocation;
  };

  public query ({ caller }) func getAvailableConsensusDistributionPool() : async Nat {
    // Authorization: Only authenticated users can check available pool
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to check available pool");
    };
    (treasuryBalance.rewards * consensusDistributionAllocation) / 100;
  };

  ///////////////////////////////////////////////////////////////////////
  // PHIL Donation System
  ///////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func donatePHIL(target : DonationTarget, amount : Nat) : async () {
    // Authorization: Only authenticated users can donate PHIL
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can donate PHIL");
    };

    // Authorization: Only approved members can donate PHIL
    if (not isApprovedMember(caller)) {
      Runtime.trap("Unauthorized: Only approved members can donate PHIL");
    };

    if (amount == 0) {
      Runtime.trap("Donation amount must be greater than 0");
    };

    let currentBalance = switch (tokenBalances.get(caller)) {
      case (null) { 
        Runtime.trap("Insufficient PHIL balance");
      };
      case (?balance) {
        if (balance.phil < amount) {
          Runtime.trap("Insufficient PHIL balance");
        };
        balance;
      };
    };

    switch (target) {
      case (#user(recipient)) {
        if (recipient == caller) {
          Runtime.trap("Cannot donate to yourself");
        };

        let recipientExists = switch (userProfiles.get(recipient)) {
          case (null) {
            switch (joinRequests.get(recipient)) {
              case (null) { false };
              case (?_) { true };
            };
          };
          case (?_) { true };
        };

        if (not recipientExists) {
          Runtime.trap("Recipient user does not exist in the system");
        };

        let updatedSenderBalance : TokenBalance = {
          rep = currentBalance.rep;
          phil = currentBalance.phil - amount;
        };
        tokenBalances.add(caller, updatedSenderBalance);

        let recipientBalance = switch (tokenBalances.get(recipient)) {
          case (null) { { rep = 0; phil = 0 } };
          case (?balance) { balance };
        };

        let updatedRecipientBalance : TokenBalance = {
          rep = recipientBalance.rep;
          phil = recipientBalance.phil + amount;
        };
        tokenBalances.add(recipient, updatedRecipientBalance);
      };
      case (#treasury(treasuryType)) {
        let updatedSenderBalance : TokenBalance = {
          rep = currentBalance.rep;
          phil = currentBalance.phil - amount;
        };
        tokenBalances.add(caller, updatedSenderBalance);

        switch (treasuryType) {
          case (#rewards) {
            treasuryBalance := {
              rewards = treasuryBalance.rewards + amount;
              marketing = treasuryBalance.marketing;
              council = treasuryBalance.council;
            };
          };
          case (#marketing) {
            treasuryBalance := {
              rewards = treasuryBalance.rewards;
              marketing = treasuryBalance.marketing + amount;
              council = treasuryBalance.council;
            };
          };
          case (#council) {
            treasuryBalance := {
              rewards = treasuryBalance.rewards;
              marketing = treasuryBalance.marketing;
              council = treasuryBalance.council + amount;
            };
          };
        };
      };
    };
  };

  ///////////////////////////////////////////////////////////////////////
  // Proposal System Implementation
  ///////////////////////////////////////////////////////////////////////

  public shared ({ caller }) func createProposal(title : Text, description : Text) : async Text {
    // Authorization: Only authenticated users can create proposals
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create proposals");
    };

    // Authorization: Only Active Members can create proposals
    let category = calculateCallerCategory(caller);
    if (category != #activeMember) {
      Runtime.trap("Unauthorized: Only Active Members can create proposals");
    };

    if (title.isEmpty()) {
      Runtime.trap("Proposal title cannot be empty");
    };

    if (description.isEmpty()) {
      Runtime.trap("Proposal description cannot be empty");
    };

    let proposalId = title # (Time.now().toText());
    let proposal : Proposal = {
      id = proposalId;
      title;
      description;
      author = caller;
      timestamp = Time.now();
      status = #pending;
      approvals = [];
      rejections = [];
      completionTimestamp = null;
    };

    proposals.add(proposalId, proposal);

    let notificationTitle = "New Proposal";
    let notificationMessage = "New proposal submitted: " # title;

    for ((_, councilMember) in councilMembers.entries()) {
      Notifications.createNotification(notificationsState, councilMember, notificationTitle, notificationMessage);
    };

    for ((principal, _) in userProfiles.entries()) {
      if (AccessControl.isAdmin(accessControlState, principal)) {
        Notifications.createNotification(notificationsState, principal, notificationTitle, notificationMessage);
      };
    };

    proposalId;
  };

  public shared ({ caller }) func approveProposal(id : Text) : async () {
    // Authorization: Only authenticated users can approve proposals
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can approve proposals");
    };

    // Authorization: Only Council Members or Admins can approve proposals
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isCouncilMember = checkIfCouncilMember(caller);

    if (not (isAdmin or isCouncilMember)) {
      Runtime.trap("Unauthorized: Only Council Members or Admins can approve proposals");
    };

    let proposal = switch (proposals.get(id)) {
      case (null) {
        Runtime.trap("Proposal not found");
      };
      case (?p) { p };
    };

    if (proposal.status != #pending) {
      Runtime.trap("Proposal is not pending");
    };

    let alreadyApproved = proposal.approvals.find(func(p) { p == caller }) != null;
    if (alreadyApproved) {
      Runtime.trap("You have already approved this proposal");
    };

    let updatedApprovals = proposal.approvals.concat([caller]);

    let isAccepted = updatedApprovals.size() >= 3;

    let updatedProposal : Proposal = {
      id = proposal.id;
      title = proposal.title;
      description = proposal.description;
      author = proposal.author;
      timestamp = proposal.timestamp;
      status = if (isAccepted) { #accepted } else { #pending };
      approvals = updatedApprovals;
      rejections = proposal.rejections;
      completionTimestamp = if (isAccepted) { ?Time.now() } else { null };
    };

    proposals.add(id, updatedProposal);

    if (isAccepted) {
      let notificationTitle = "Proposal Accepted";
      let notificationMessage = "Your proposal has been accepted";
      Notifications.createNotification(notificationsState, proposal.author, notificationTitle, notificationMessage);
    };
  };

  public shared ({ caller }) func rejectProposal(id : Text) : async () {
    // Authorization: Only authenticated users can reject proposals
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can reject proposals");
    };

    // Authorization: Only Council Members or Admins can reject proposals
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isCouncilMember = checkIfCouncilMember(caller);

    if (not (isAdmin or isCouncilMember)) {
      Runtime.trap("Unauthorized: Only Council Members or Admins can reject proposals");
    };

    let proposal = switch (proposals.get(id)) {
      case (null) {
        Runtime.trap("Proposal not found");
      };
      case (?p) { p };
    };

    if (proposal.status != #pending) {
      Runtime.trap("Proposal is not pending");
    };

    let alreadyRejected = proposal.rejections.find(func(p) { p == caller }) != null;
    if (alreadyRejected) {
      Runtime.trap("You have already rejected this proposal");
    };

    let updatedRejections = proposal.rejections.concat([caller]);

    let isRejected = updatedRejections.size() >= 3;

    let updatedProposal : Proposal = {
      id = proposal.id;
      title = proposal.title;
      description = proposal.description;
      author = proposal.author;
      timestamp = proposal.timestamp;
      status = if (isRejected) { #rejected } else { #pending };
      approvals = proposal.approvals;
      rejections = updatedRejections;
      completionTimestamp = if (isRejected) { ?Time.now() } else { null };
    };

    proposals.add(id, updatedProposal);

    if (isRejected) {
      let notificationTitle = "Proposal Rejected";
      let notificationMessage = "Your proposal has been rejected";
      Notifications.createNotification(notificationsState, proposal.author, notificationTitle, notificationMessage);
    };
  };

  public query ({ caller }) func getAllProposals() : async [Proposal] {
    // Authorization: Only authenticated users can view proposals
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view proposals");
    };

    // Authorization: Only Active Members, Council Members, or Admins can view proposals
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isCouncilMember = checkIfCouncilMember(caller);
    let category = calculateCallerCategory(caller);
    let isActiveMember = category == #activeMember;

    if (not (isAdmin or isCouncilMember or isActiveMember)) {
      Runtime.trap("Unauthorized: Only Active Members, Council Members, or Admins can view proposals");
    };

    proposals.toArray().map(func((_, proposal)) : Proposal { proposal });
  };

  public query ({ caller }) func getProposal(id : Text) : async ?Proposal {
    // Authorization: Only authenticated users can view proposals
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view proposals");
    };

    // Authorization: Only Active Members, Council Members, or Admins can view proposals
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isCouncilMember = checkIfCouncilMember(caller);
    let category = calculateCallerCategory(caller);
    let isActiveMember = category == #activeMember;

    if (not (isAdmin or isCouncilMember or isActiveMember)) {
      Runtime.trap("Unauthorized: Only Active Members, Council Members, or Admins can view proposals");
    };

    proposals.get(id);
  };

  ///////////////////////////////////////////////////////////////////////
  // IN-APP WALLET SYSTEM
  ///////////////////////////////////////////////////////////////////////

  // Authorization: Only authenticated users can view their wallet balances
  public query ({ caller }) func getWalletBalances() : async WalletBalances {
    // Authorization: Only authenticated users can view wallet balances
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view wallet balances");
    };

    switch (walletBalances.get(caller)) {
      case (null) {
        {
          icp = 0;
          icrc1Tokens = [];
        };
      };
      case (?balances) { balances };
    };
  };

  // Authorization: Only authenticated users can send ICP
  public shared ({ caller }) func sendICP(recipient : Principal, amount : Nat) : async Text {
    // Authorization: Only authenticated users can send ICP
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send ICP");
    };

    // Validation: Amount must be greater than 0
    if (amount == 0) {
      Runtime.trap("Transfer amount must be greater than 0");
    };

    // Validation: Cannot send to yourself
    if (recipient == caller) {
      Runtime.trap("Cannot send ICP to yourself");
    };

    // Validation: Check sufficient balance
    let currentBalances = switch (walletBalances.get(caller)) {
      case (null) {
        Runtime.trap("Insufficient ICP balance");
      };
      case (?balances) {
        if (balances.icp < amount) {
          Runtime.trap("Insufficient ICP balance");
        };
        balances;
      };
    };

    // Fixed transaction fee for ICP (0.0001 ICP = 10000 e8s)
    let fee = 10000;
    let totalAmount = amount + fee;

    if (currentBalances.icp < totalAmount) {
      Runtime.trap("Insufficient ICP balance to cover amount and fee");
    };

    // Update sender balance
    let updatedSenderBalances : WalletBalances = {
      icp = currentBalances.icp - totalAmount;
      icrc1Tokens = currentBalances.icrc1Tokens;
    };
    walletBalances.add(caller, updatedSenderBalances);

    // Update recipient balance
    let recipientBalances = switch (walletBalances.get(recipient)) {
      case (null) {
        {
          icp = 0;
          icrc1Tokens = [];
        };
      };
      case (?balances) { balances };
    };

    let updatedRecipientBalances : WalletBalances = {
      icp = recipientBalances.icp + amount;
      icrc1Tokens = recipientBalances.icrc1Tokens;
    };
    walletBalances.add(recipient, updatedRecipientBalances);

    // Record transaction
    let transactionId = caller.toText() # recipient.toText() # (Time.now().toText());
    let transaction : WalletTransaction = {
      id = transactionId;
      sender = caller;
      recipient;
      amount;
      tokenType = #ICP;
      timestamp = Time.now();
      status = #completed;
      fee;
    };
    walletTransactions.add(transactionId, transaction);

    transactionId;
  };

  // Authorization: Only authenticated users can send ICRC-1 tokens
  public shared ({ caller }) func sendICRC1Token(tokenCanisterId : Principal, recipient : Principal, amount : Nat) : async Text {
    // Authorization: Only authenticated users can send ICRC-1 tokens
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send ICRC-1 tokens");
    };

    // Validation: Amount must be greater than 0
    if (amount == 0) {
      Runtime.trap("Transfer amount must be greater than 0");
    };

    // Validation: Cannot send to yourself
    if (recipient == caller) {
      Runtime.trap("Cannot send tokens to yourself");
    };

    // Validation: Token must be supported
    let tokenInfo = switch (supportedTokens.get(tokenCanisterId)) {
      case (null) {
        Runtime.trap("Token not supported");
      };
      case (?info) { info };
    };

    // Validation: Check sufficient balance
    let currentBalances = switch (walletBalances.get(caller)) {
      case (null) {
        Runtime.trap("Insufficient token balance");
      };
      case (?balances) {
        let tokenBalance = balances.icrc1Tokens.find(
          func((symbol, _)) { symbol == tokenInfo.symbol }
        );
        switch (tokenBalance) {
          case (null) {
            Runtime.trap("Insufficient token balance");
          };
          case (?(_, balance)) {
            if (balance < amount) {
              Runtime.trap("Insufficient token balance");
            };
          };
        };
        balances;
      };
    };

    // Fixed transaction fee for ICRC-1 tokens (10000 units)
    let fee = 10000;
    let totalAmount = amount + fee;

    // Update sender balance
    let updatedSenderTokens = currentBalances.icrc1Tokens.map(
      func((symbol, balance)) {
        if (symbol == tokenInfo.symbol) {
          (symbol, balance - totalAmount);
        } else {
          (symbol, balance);
        };
      }
    );

    let updatedSenderBalances : WalletBalances = {
      icp = currentBalances.icp;
      icrc1Tokens = updatedSenderTokens;
    };
    walletBalances.add(caller, updatedSenderBalances);

    // Update recipient balance
    let recipientBalances = switch (walletBalances.get(recipient)) {
      case (null) {
        {
          icp = 0;
          icrc1Tokens = [(tokenInfo.symbol, amount)];
        };
      };
      case (?balances) {
        let existingToken = balances.icrc1Tokens.find(
          func((symbol, _)) { symbol == tokenInfo.symbol }
        );
        switch (existingToken) {
          case (null) {
            {
              icp = balances.icp;
              icrc1Tokens = balances.icrc1Tokens.concat([(tokenInfo.symbol, amount)]);
            };
          };
          case (?(_, existingBalance)) {
            let updatedTokens = balances.icrc1Tokens.map(
              func((symbol, balance)) {
                if (symbol == tokenInfo.symbol) {
                  (symbol, balance + amount);
                } else {
                  (symbol, balance);
                };
              }
            );
            {
              icp = balances.icp;
              icrc1Tokens = updatedTokens;
            };
          };
        };
      };
    };
    walletBalances.add(recipient, recipientBalances);

    // Record transaction
    let transactionId = caller.toText() # recipient.toText() # (Time.now().toText());
    let transaction : WalletTransaction = {
      id = transactionId;
      sender = caller;
      recipient;
      amount;
      tokenType = #ICRC1 { canisterId = tokenCanisterId; symbol = tokenInfo.symbol };
      timestamp = Time.now();
      status = #completed;
      fee;
    };
    walletTransactions.add(transactionId, transaction);

    transactionId;
  };

  // Authorization: Only authenticated users can view their transaction history
  public query ({ caller }) func getTransactionHistory() : async [WalletTransaction] {
    // Authorization: Only authenticated users can view transaction history
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view transaction history");
    };

    // Return transactions where caller is sender or recipient
    walletTransactions.toArray().filter(
      func((_, transaction)) {
        transaction.sender == caller or transaction.recipient == caller;
      }
    ).map(func((_, transaction)) : WalletTransaction { transaction });
  };

  // Authorization: Only authenticated users can view supported tokens
  public query ({ caller }) func getSupportedTokens() : async [SupportedToken] {
    // Authorization: Only authenticated users can view supported tokens
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view supported tokens");
    };

    supportedTokens.toArray().map(func((_, token)) : SupportedToken { token });
  };

  // Authorization: Only admins can add supported tokens
  public shared ({ caller }) func addSupportedToken(canisterId : Principal, symbol : Text, name : Text) : async () {
    // Authorization: Only admins can add supported tokens
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add supported tokens");
    };

    if (symbol.isEmpty()) {
      Runtime.trap("Token symbol cannot be empty");
    };

    if (name.isEmpty()) {
      Runtime.trap("Token name cannot be empty");
    };

    let token : SupportedToken = {
      canisterId;
      symbol;
      name;
    };

    supportedTokens.add(canisterId, token);
  };

  // Authorization: Only admins can remove supported tokens
  public shared ({ caller }) func removeSupportedToken(canisterId : Principal) : async () {
    // Authorization: Only admins can remove supported tokens
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove supported tokens");
    };

    supportedTokens.remove(canisterId);
  };

  ///////////////////////////////////////////////////////////////////////
  // Approval-based User Management Functions
  ///////////////////////////////////////////////////////////////////////
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    // Authorization: Only authenticated users can request approval
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can request approval");
    };
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    // Authorization: Only admins can set approval
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    // Authorization: Only admins can list approvals
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  ///////////////////////////////////////////////////////////////////////
  // User and Profile Management
  ///////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    // Authorization: Only authenticated users can view profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Authorization: Only authenticated users can view profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    // Authorization: Can only view your own profile unless you are an admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless you are an admin");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    // Authorization: Only authenticated users can save profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateCallerUserProfile(username : Text, bio : Text, profilePicture : ?Storage.ExternalBlob) : async () {
    // Authorization: Only authenticated users can update profiles
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not found");
      };
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          username = username;
          bio = bio;
          email = existingProfile.email;
          profilePicture = profilePicture;
          principal = existingProfile.principal;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getActiveUCA() : async Text {
    activeUCA;
  };

  public shared ({ caller }) func updateUCA(newUCA : Text) : async () {
    // Authorization: Only admins can update UCA
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update UCA");
    };
    activeUCA := newUCA;
  };

  public shared ({ caller }) func acceptUCA() : async () {
    // Authorization: Only authenticated users can accept UCA
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept UCA");
    };
    let timestamp : UCATimestamp = {
      accepted = true;
      timestamp = Time.now();
      principal = caller;
    };
    ucaTimestamps.add(caller, timestamp);
  };

  public query ({ caller }) func hasAcceptedUCA() : async Bool {
    switch (ucaTimestamps.get(caller)) {
      case (null) { false };
      case (?timestamp) { timestamp.accepted };
    };
  };

  public shared ({ caller }) func submitJoinRequest() : async () {
    // Authorization: Only authenticated users can submit join requests
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit join requests");
    };

    switch (joinRequests.get(caller)) {
      case (?_) {
        Runtime.trap("Join request already exists");
      };
      case (null) {
        let request : JoinRequest = {
          principal = caller;
          timestamp = Time.now();
          status = #pending;
          memberApprovals = Set.empty<Principal>();
        };
        joinRequests.add(caller, request);

        let notificationTitle = "New Join Request";
        let notificationMessage = "A new membership request has been submitted";

        for ((principal, _) in userProfiles.entries()) {
          if (AccessControl.isAdmin(accessControlState, principal)) {
            Notifications.createNotification(notificationsState, principal, notificationTitle, notificationMessage);
          };
        };

        for ((_, councilMember) in councilMembers.entries()) {
          Notifications.createNotification(notificationsState, councilMember, notificationTitle, notificationMessage);
        };
      };
    };
  };

  public query ({ caller }) func getMembershipStatus() : async MembershipStatusResponse {
    // Authorization: Only authenticated users can check membership status
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check membership status");
    };

    let isMember = isApprovedMember(caller);
    let hasPendingRequest = switch (joinRequests.get(caller)) {
      case (null) { false };
      case (?request) { request.status == #pending };
    };

    { isMember; hasPendingRequest };
  };

  public query ({ caller }) func getAllJoinRequests() : async [JoinRequestView] {
    // Authorization: Only admins can view all join requests
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all join requests");
    };

    joinRequests.toArray().map(
      func((principal, request)) : JoinRequestView {
        {
          principal = request.principal;
          timestamp = request.timestamp;
          status = request.status;
          approvals = request.memberApprovals.toArray();
        };
      }
    );
  };

  public query ({ caller }) func getPendingJoinRequests() : async [JoinRequestView] {
    // Authorization: Only authenticated users can view pending join requests
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view pending join requests");
    };

    // Authorization: Only approved members can view pending join requests
    if (not isApprovedMember(caller)) {
      Runtime.trap("Unauthorized: Only approved members can view pending join requests");
    };

    joinRequests.toArray().filter(
      func((_, request)) : Bool {
        request.status == #pending;
      }
    ).map(
      func((principal, request)) : JoinRequestView {
        {
          principal = request.principal;
          timestamp = request.timestamp;
          status = request.status;
          approvals = request.memberApprovals.toArray();
        };
      }
    );
  };

  public shared ({ caller }) func updateJoinRequestStatus(user : Principal, status : JoinRequestStatus) : async Text {
    // Authorization: Only admins can update join request status
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update join request status");
    };

    switch (joinRequests.get(user)) {
      case (null) {
        Runtime.trap("Join request not found");
      };
      case (?request) {
        let updatedRequest : JoinRequest = {
          principal = request.principal;
          timestamp = request.timestamp;
          status = status;
          memberApprovals = request.memberApprovals;
        };
        joinRequests.add(user, updatedRequest);

        if (status == #approved) {
          addToCouncilIfFirst(user);

          let notificationTitle = "Membership Approved";
          let notificationMessage = "Your membership request has been approved!";
          Notifications.createNotification(notificationsState, user, notificationTitle, notificationMessage);
        };

        "Join request status updated successfully";
      };
    };
  };

  public shared ({ caller }) func approveMemberJoinRequest(user : Principal) : async () {
    // Authorization: Only authenticated users can approve join requests
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can approve join requests");
    };

    // Authorization: Only approved members can approve join requests
    if (not isApprovedMember(caller)) {
      Runtime.trap("Unauthorized: Only approved members can approve join requests");
    };

    switch (joinRequests.get(user)) {
      case (null) {
        Runtime.trap("Join request not found");
      };
      case (?request) {
        if (request.status != #pending) {
          Runtime.trap("Join request is not pending");
        };

        if (request.memberApprovals.size() + 1 >= 2 and not isInFirstFiveApproved()) {
          let updatedRequest : JoinRequest = {
            principal = request.principal;
            timestamp = request.timestamp;
            status = #approved;
            memberApprovals = request.memberApprovals;
          };
          joinRequests.add(user, updatedRequest);
          addToCouncilIfFirst(user);

          let notificationTitle = "Membership Approved";
          let notificationMessage = "Your membership request has been approved!";
          Notifications.createNotification(notificationsState, user, notificationTitle, notificationMessage);
        } else {
          let updatedRequest : JoinRequest = {
            principal = request.principal;
            timestamp = request.timestamp;
            status = request.status;
            memberApprovals = request.memberApprovals;
          };
          joinRequests.add(user, updatedRequest);
        };
      };
    };
  };

  public shared ({ caller }) func leaveCommunity() : async () {
    // Authorization: Only authenticated users can leave community
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can leave community");
    };

    if (not isApprovedMember(caller)) {
      Runtime.trap("You are not a member of the community");
    };

    joinRequests.remove(caller);
  };

  public shared ({ caller }) func promoteToAdmin(user : Principal) : async () {
    // Authorization: Only admins can promote users to admin
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can promote users to admin");
    };

    if (caller == user) {
      Runtime.trap("Cannot promote yourself");
    };

    AccessControl.assignRole(accessControlState, caller, user, #admin);
  };

  public shared ({ caller }) func deleteUser(user : Principal) : async () {
    // Authorization: Only admins can delete users
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete users");
    };

    if (caller == user) {
      Runtime.trap("Cannot delete yourself");
    };

    userProfiles.remove(user);
    tokenBalances.remove(user);
    joinRequests.remove(user);
    ucaTimestamps.remove(user);
  };

  public query ({ caller }) func getAllMembers() : async [UserProfile] {
    // Authorization: Only authenticated users can view members
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view members");
    };

    // Authorization: Only admins or active members can view the members list
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let category = calculateCallerCategory(caller);
    let isActiveMember = switch (category) {
      case (#activeMember) { true };
      case (_) { false };
    };

    if (not (isAdmin or isActiveMember)) {
      Runtime.trap("Unauthorized: Only admins or active members can view the members list");
    };

    userProfiles.toArray().map(func((_, profile)) : UserProfile { profile });
  };

  public query ({ caller }) func getCouncilDashboard() : async ?CouncilDashboard {
    // Authorization: Only authenticated users can view the Council Dashboard
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view the Council Dashboard");
    };

    // Authorization: Only council members or admins can view the Council Dashboard
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isCouncilMember = checkIfCouncilMember(caller);

    if (not (isAdmin or isCouncilMember)) {
      Runtime.trap("Unauthorized: Only council members or admins can view the Council Dashboard");
    };

    let dashboard : CouncilDashboard = {
      responsibilities = [
        "Membership Oversight",
        "Treasury Management",
        "Token Distribution",
        "Proposal Voting",
      ];
      panels = [
        "Membership Oversight Panel",
        "Treasury Management Panel",
        "Token Distribution Panel",
        "Proposal Voting Panel",
      ];
      lastCouncilUpdate;
    };

    ?dashboard;
  };

  public query ({ caller }) func getLastCouncilUpdate() : async Time.Time {
    // Authorization: Only authenticated users can check council updates
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check council updates");
    };

    // Authorization: Only council members or admins can view council updates
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isCouncilMember = checkIfCouncilMember(caller);

    if (not (isAdmin or isCouncilMember)) {
      Runtime.trap("Unauthorized: Only council members or admins can view council updates");
    };

    lastCouncilUpdate;
  };

  public query ({ caller }) func isCouncilMember() : async Bool {
    // Authorization: Only authenticated users can check council membership
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check council membership");
    };
    checkIfCouncilMember(caller);
  };

  public query ({ caller }) func getCouncilMembers() : async [Principal] {
    // Authorization: Only authenticated users can view council members
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view council members");
    };
    councilMembers.toArray().map(func((_, member)) : Principal { member });
  };

  public query ({ caller }) func getTokenBalance(user : Principal) : async TokenBalance {
    // Authorization: Only authenticated users can view token balances
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view token balances");
    };

    // Authorization: Can only view your own token balance unless you are an admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own token balance unless you are an admin");
    };

    switch (tokenBalances.get(user)) {
      case (null) { { rep = 0; phil = 0 } };
      case (?balance) { balance };
    };
  };

  ///////////////////////////////////////////////////////////////////////
  // Council Multi-Signature System
  ///////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func proposeCouncilAction(actionId : Text, details : Text) : async () {
    // Authorization: Only authenticated users can propose actions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can propose actions");
    };

    // Authorization: Only council members can propose actions
    let isCouncilMember = checkIfCouncilMember(caller);
    if (not isCouncilMember) {
      Runtime.trap("Unauthorized: Only council members can propose actions");
    };

    switch (councilMultiSigActions.get(actionId)) {
      case (?_) {
        Runtime.trap("Action ID already exists");
      };
      case (null) {
        let action : CouncilMultiSigAction = {
          actionId;
          details;
          approvals = [];
          isExecuted = false;
          timestamp = Time.now();
          completionTimestamp = null;
        };
        councilMultiSigActions.add(actionId, action);
      };
    };
  };

  public shared ({ caller }) func approveCouncilAction(actionId : Text) : async () {
    // Authorization: Only authenticated users can approve actions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can approve actions");
    };

    // Authorization: Only council members can approve actions
    let isCouncilMember = checkIfCouncilMember(caller);
    if (not isCouncilMember) {
      Runtime.trap("Unauthorized: Only council members can approve actions");
    };

    switch (councilMultiSigActions.get(actionId)) {
      case (null) {
        Runtime.trap("Action not found");
      };
      case (?action) {
        if (action.isExecuted) {
          Runtime.trap("Action already executed");
        };

        let alreadyApproved = action.approvals.find(func(p) { p == caller }) != null;
        if (alreadyApproved) {
          Runtime.trap("You have already approved this action");
        };

        let updatedApprovals = action.approvals.concat([caller]);
        let isExecuted = updatedApprovals.size() >= 3;

        let updatedAction : CouncilMultiSigAction = {
          actionId = action.actionId;
          details = action.details;
          approvals = updatedApprovals;
          isExecuted;
          timestamp = action.timestamp;
          completionTimestamp = if (isExecuted) { ?Time.now() } else { null };
        };

        councilMultiSigActions.add(actionId, updatedAction);
      };
    };
  };

  public query ({ caller }) func getPendingCouncilActions() : async [CouncilMultiSigAction] {
    // Authorization: Only authenticated users can view council actions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view council actions");
    };

    // Authorization: Only admins or council members can view council actions
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let isCouncilMember = checkIfCouncilMember(caller);

    if (not (isAdmin or isCouncilMember)) {
      Runtime.trap("Unauthorized: Only admins or council members can view council actions");
    };

    councilMultiSigActions.toArray().map(func((_, action)) : CouncilMultiSigAction { action });
  };

  ///////////////////////////////////////////////////////////////////////
  // Announcements System
  ///////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func createAnnouncement(title : Text, content : Text) : async Text {
    // Authorization: Only authenticated users can create announcements
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create announcements");
    };

    let announcementId = Announcements.createAnnouncement(announcementsState, caller, accessControlState, title, content);

    let notificationTitle = "New Announcement";
    let notificationMessage = "New announcement posted: " # title;

    for ((principal, _) in userProfiles.entries()) {
      let role = AccessControl.getUserRole(accessControlState, principal);
      switch (role) {
        case (#user) { 
          Notifications.createNotification(notificationsState, principal, notificationTitle, notificationMessage);
        };
        case (#admin) { 
          Notifications.createNotification(notificationsState, principal, notificationTitle, notificationMessage);
        };
        case (#guest) {};
      };
    };

    announcementId;
  };

  public shared ({ caller }) func editAnnouncement(id : Text, newTitle : Text, newContent : Text) : async () {
    // Authorization: Only authenticated users can edit announcements
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can edit announcements");
    };

    Announcements.editAnnouncement(announcementsState, caller, accessControlState, id, newTitle, newContent);
  };

  public query ({ caller }) func getAnnouncement(id : Text) : async ?Announcements.Announcement {
    // Authorization: Only authenticated users can view announcements
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view announcements");
    };
    Announcements.getAnnouncement(announcementsState, id);
  };

  public query ({ caller }) func getAllAnnouncements() : async [Announcements.Announcement] {
    // Authorization: Only authenticated users can view announcements
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view announcements");
    };
    Announcements.getAllAnnouncements(announcementsState);
  };

  ///////////////////////////////////////////////////////////////////////
  // Blog System
  ///////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func createBlogPost(title : Text, content : Text) : async Text {
    // Authorization: Only authenticated users can create blog posts
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create blog posts");
    };

    // Authorization: Only admins or active members can create blog posts
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let category = calculateCallerCategory(caller);
    let isActiveMember = switch (category) {
      case (#activeMember) { true };
      case (_) { false };
    };

    if (not (isAdmin or isActiveMember)) {
      Runtime.trap("Unauthorized: Only admins or active members can create blog posts");
    };

    let postId = Blog.createPost(blogState, caller, title, content);

    let notificationTitle = "New Blog Post";
    let notificationMessage = "New blog post published: " # title;

    for ((principal, request) in joinRequests.entries()) {
      if (request.status == #approved) {
        Notifications.createNotification(notificationsState, principal, notificationTitle, notificationMessage);
      };
    };

    postId;
  };

  public shared ({ caller }) func editBlogPost(id : Text, newTitle : Text, newContent : Text) : async () {
    // Authorization: Only authenticated users can edit blog posts
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can edit blog posts");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    Blog.editPost(blogState, caller, isAdmin, id, newTitle, newContent);
  };

  public shared ({ caller }) func deleteBlogPost(id : Text) : async () {
    // Authorization: Only authenticated users can delete blog posts
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete blog posts");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    Blog.deletePost(blogState, caller, isAdmin, id);
  };

  public query ({ caller }) func getBlogPost(id : Text) : async ?Blog.BlogPost {
    // Authorization: Only authenticated users can view blog posts
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view blog posts");
    };
    Blog.getPost(blogState, id);
  };

  public query ({ caller }) func getAllBlogPosts() : async [Blog.BlogPost] {
    // Authorization: Only authenticated users can view blog posts
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view blog posts");
    };
    Blog.getAllPosts(blogState);
  };

  public shared ({ caller }) func createBlogComment(postId : Text, content : Text) : async Text {
    // Authorization: Only authenticated users can create comments
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create comments");
    };

    Blog.createComment(blogState, caller, postId, content);
  };

  public query ({ caller }) func getBlogCommentsByPost(postId : Text) : async [Blog.Comment] {
    // Authorization: Only authenticated users can view comments
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view comments");
    };
    Blog.getCommentsByPost(blogState, postId);
  };

  public shared ({ caller }) func addBlogReaction(postId : Text) : async () {
    // Authorization: Only authenticated users can react to posts
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can react to posts");
    };

    Blog.addReaction(blogState, caller, postId);
  };

  public query ({ caller }) func getBlogReactionCount(postId : Text) : async Nat {
    // Authorization: Only authenticated users can view reactions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view reactions");
    };
    Blog.getReactionCount(blogState, postId);
  };

  public query ({ caller }) func hasUserReactedToBlogPost(postId : Text) : async Bool {
    // Authorization: Only authenticated users can check reactions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check reactions");
    };
    Blog.hasUserReacted(blogState, postId, caller);
  };

  public shared ({ caller }) func tipBlogPost(postId : Text, amount : Nat) : async Text {
    // Authorization: Only authenticated users can tip posts
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can tip posts");
    };

    if (amount == 0) {
      Runtime.trap("Tip amount must be greater than 0");
    };

    let currentBalance = switch (tokenBalances.get(caller)) {
      case (null) { Runtime.trap("Insufficient PHIL balance") };
      case (?balance) {
        if (balance.phil < amount) {
          Runtime.trap("Insufficient PHIL balance");
        };
        balance;
      };
    };

    let authorOpt = Blog.getPostAuthor(blogState, postId);
    let author = switch (authorOpt) {
      case (null) { Runtime.trap("Post not found") };
      case (?a) { a };
    };

    if (author == caller) {
      Runtime.trap("Cannot tip your own post");
    };

    let updatedSenderBalance : TokenBalance = {
      rep = currentBalance.rep;
      phil = currentBalance.phil - amount;
    };
    tokenBalances.add(caller, updatedSenderBalance);

    let recipientBalance = switch (tokenBalances.get(author)) {
      case (null) { { rep = 0; phil = 0 } };
      case (?balance) { balance };
    };

    let updatedRecipientBalance : TokenBalance = {
      rep = recipientBalance.rep;
      phil = recipientBalance.phil + amount;
    };
    tokenBalances.add(author, updatedRecipientBalance);

    Blog.recordTip(blogState, postId, caller, author, amount);
  };

  public query ({ caller }) func getBlogTipsByPost(postId : Text) : async [Blog.Tip] {
    // Authorization: Only authenticated users can view tips
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view tips");
    };
    Blog.getTipsByPost(blogState, postId);
  };

  public query ({ caller }) func getTotalBlogTipsForPost(postId : Text) : async Nat {
    // Authorization: Only authenticated users can view tips
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view tips");
    };
    Blog.getTotalTipsForPost(blogState, postId);
  };

  ///////////////////////////////////////////////////////////////////////
  // Consensus Meetings System
  ///////////////////////////////////////////////////////////////////////
  public shared ({ caller }) func createConsensusMeeting(id : Text) : async () {
    // Authorization: Only admins can create consensus meetings
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create consensus meetings");
    };

    switch (consensusMeetings.get(id)) {
      case (?_) {
        Runtime.trap("Meeting with this ID already exists");
      };
      case (null) {
        let meeting : ConsensusMeeting = {
          id;
          phase = #signup;
          participants = [];
          groups = Map.empty<Nat, Group>();
          startTime = Time.now();
          phaseStartTime = Time.now();
          phaseEndTime = Time.now() + 86400000000000;
          repDistribution = Map.empty<Principal, Nat>();
          philDistribution = Map.empty<Principal, Nat>();
        };
        consensusMeetings.add(id, meeting);
      };
    };
  };

  public shared ({ caller }) func signUpForConsensusMeeting(meetingId : Text) : async () {
    // Authorization: Only authenticated users can sign up for meetings
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can sign up for meetings");
    };

    // Authorization: Only approved members can sign up for consensus meetings
    if (not isApprovedMember(caller)) {
      Runtime.trap("Unauthorized: Only approved members can sign up for consensus meetings");
    };

    switch (consensusMeetings.get(meetingId)) {
      case (null) {
        Runtime.trap("Meeting not found");
      };
      case (?meeting) {
        if (meeting.phase != #signup) {
          Runtime.trap("Meeting is not in signup phase");
        };

        if (isParticipant(meeting, caller)) {
          Runtime.trap("Already signed up for this meeting");
        };

        let updatedParticipants = meeting.participants.concat([caller]);
        let updatedMeeting : ConsensusMeeting = {
          id = meeting.id;
          phase = meeting.phase;
          participants = updatedParticipants;
          groups = meeting.groups;
          startTime = meeting.startTime;
          phaseStartTime = meeting.phaseStartTime;
          phaseEndTime = meeting.phaseEndTime;
          repDistribution = meeting.repDistribution;
          philDistribution = meeting.philDistribution;
        };
        consensusMeetings.add(meetingId, updatedMeeting);

        recordParticipation(caller);
      };
    };
  };

  public shared ({ caller }) func submitContribution(meetingId : Text, text : Text, files : [Storage.ExternalBlob]) : async () {
    // Authorization: Only authenticated users can submit contributions
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit contributions");
    };

    switch (consensusMeetings.get(meetingId)) {
      case (null) {
        Runtime.trap("Meeting not found");
      };
      case (?meeting) {
        if (meeting.phase != #contribution) {
          Runtime.trap("Meeting is not in contribution phase");
        };

        if (not isParticipant(meeting, caller)) {
          Runtime.trap("Not a participant in this meeting");
        };

        let groupIdOpt = findGroupForParticipant(meeting, caller);
        switch (groupIdOpt) {
          case (null) {
            Runtime.trap("Group not found for participant");
          };
          case (?groupId) {
            switch (meeting.groups.get(groupId)) {
              case (null) {
                Runtime.trap("Group not found");
              };
              case (?group) {
                let contribution : Contribution = { text; files };
                group.contributions.add(caller, contribution);
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func submitRanking(meetingId : Text, rankings : [Ranking]) : async () {
    // Authorization: Only authenticated users can submit rankings
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit rankings");
    };

    switch (consensusMeetings.get(meetingId)) {
      case (null) {
        Runtime.trap("Meeting not found");
      };
      case (?meeting) {
        if (meeting.phase != #ranking) {
          Runtime.trap("Meeting is not in ranking phase");
        };

        if (not isParticipant(meeting, caller)) {
          Runtime.trap("Not a participant in this meeting");
        };

        let groupIdOpt = findGroupForParticipant(meeting, caller);
        switch (groupIdOpt) {
          case (null) {
            Runtime.trap("Group not found for participant");
          };
          case (?groupId) {
            switch (meeting.groups.get(groupId)) {
              case (null) {
                Runtime.trap("Group not found");
              };
              case (?group) {
                group.rankings.add(caller, rankings);
              };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func advanceConsensusMeetingPhase(meetingId : Text) : async () {
    // Authorization: Only authenticated users can advance meeting phases
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can advance meeting phases");
    };

    switch (consensusMeetings.get(meetingId)) {
      case (null) {
        Runtime.trap("Meeting not found");
      };
      case (?meeting) {
        if (not isParticipant(meeting, caller)) {
          Runtime.trap("Not a participant in this meeting");
        };

        let now = Time.now();
        if (now < meeting.phaseEndTime) {
          Runtime.trap("Phase time limit has not expired yet");
        };

        let newPhase = switch (meeting.phase) {
          case (#signup) {
            if (meeting.participants.size() < 3) {
              Runtime.trap("Minimum 3 participants required");
            };
            #contribution;
          };
          case (#contribution) { #ranking };
          case (#ranking) { #finalize };
          case (#finalize) {
            Runtime.trap("Meeting already finalized");
          };
        };

        let newGroups = if (newPhase == #contribution) {
          createGroups(meeting.participants);
        } else {
          meeting.groups;
        };

        let phaseEndTime = switch (newPhase) {
          case (#contribution) { now + 432000000000000 };
          case (#ranking) { now + 86400000000000 };
          case (#finalize) { now };
          case (_) { now };
        };

        let updatedMeeting : ConsensusMeeting = {
          id = meeting.id;
          phase = newPhase;
          participants = meeting.participants;
          groups = newGroups;
          startTime = meeting.startTime;
          phaseStartTime = now;
          phaseEndTime;
          repDistribution = meeting.repDistribution;
          philDistribution = meeting.philDistribution;
        };
        consensusMeetings.add(meetingId, updatedMeeting);
      };
    };
  };

  public shared ({ caller }) func forceAdvanceConsensusMeetingPhase(meetingId : Text) : async () {
    // Authorization: Only admins can force advance meeting phases
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can force advance meeting phases");
    };

    switch (consensusMeetings.get(meetingId)) {
      case (null) {
        Runtime.trap("Meeting not found");
      };
      case (?meeting) {
        let newPhase = switch (meeting.phase) {
          case (#signup) {
            if (meeting.participants.size() < 3) {
              Runtime.trap("Minimum 3 participants required");
            };
            #contribution;
          };
          case (#contribution) { #ranking };
          case (#ranking) { #finalize };
          case (#finalize) {
            Runtime.trap("Meeting already finalized");
          };
        };

        let now = Time.now();
        let newGroups = if (newPhase == #contribution) {
          createGroups(meeting.participants);
        } else {
          meeting.groups;
        };

        let phaseEndTime = switch (newPhase) {
          case (#contribution) { now + 432000000000000 };
          case (#ranking) { now + 86400000000000 };
          case (#finalize) { now };
          case (_) { now };
        };

        let updatedMeeting : ConsensusMeeting = {
          id = meeting.id;
          phase = newPhase;
          participants = meeting.participants;
          groups = newGroups;
          startTime = meeting.startTime;
          phaseStartTime = now;
          phaseEndTime;
          repDistribution = meeting.repDistribution;
          philDistribution = meeting.philDistribution;
        };
        consensusMeetings.add(meetingId, updatedMeeting);
      };
    };
  };

  public shared ({ caller }) func finalizeConsensusMeeting(meetingId : Text) : async () {
    // Authorization: Only authenticated users can finalize meetings
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can finalize meetings");
    };

    switch (consensusMeetings.get(meetingId)) {
      case (null) {
        Runtime.trap("Meeting not found");
      };
      case (?meeting) {
        if (meeting.phase != #ranking and meeting.phase != #finalize) {
          Runtime.trap("Meeting must be in ranking or finalize phase");
        };

        // Authorization: Only participants can finalize meetings
        if (not isParticipant(meeting, caller)) {
          Runtime.trap("Not a participant in this meeting");
        };

        let updatedMeeting : ConsensusMeeting = {
          id = meeting.id;
          phase = #finalize;
          participants = meeting.participants;
          groups = meeting.groups;
          startTime = meeting.startTime;
          phaseStartTime = meeting.phaseStartTime;
          phaseEndTime = meeting.phaseEndTime;
          repDistribution = meeting.repDistribution;
          philDistribution = meeting.philDistribution;
        };
        consensusMeetings.add(meetingId, updatedMeeting);
      };
    };
  };

  public query ({ caller }) func getConsensusMeeting(meetingId : Text) : async ?ConsensusMeetingView {
    // Authorization: Only authenticated users can view meetings
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view meetings");
    };

    switch (consensusMeetings.get(meetingId)) {
      case (null) { null };
      case (?meeting) { ?toConsensusMeetingView(meeting) };
    };
  };

  public query ({ caller }) func getAllConsensusMeetings() : async [ConsensusMeetingView] {
    // Authorization: Only authenticated users can view meetings
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view meetings");
    };

    consensusMeetings.toArray().map(
      func((_, meeting)) : ConsensusMeetingView {
        toConsensusMeetingView(meeting);
      }
    );
  };

  // Stripe integration
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    // Authorization: Only admins can set Stripe configuration
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
