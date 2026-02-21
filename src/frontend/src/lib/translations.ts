// Translation strings for Phil3 application
// Organized by feature/component for maintainability

import { Locale } from './i18n';

export interface Translations {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    edit: string;
    delete: string;
    back: string;
    next: string;
    submit: string;
    close: string;
    search: string;
    viewDetails: string;
    noResults: string;
    clearSearch: string;
    addressCopied: string;
  };
  
  // Header
  header: {
    title: string;
    subtitle: string;
    toggleTheme: string;
    profile: string;
    adminDashboard: string;
    profileSettings: string;
    logout: string;
  };
  
  // Footer
  footer: {
    builtWith: string;
    love: string;
  };

  // Homepage
  homepage: {
    headline: string;
    tagline: string;
    description: string;
    valueProposition: {
      title: string;
      subtitle: string;
      onboarding: string;
      onboardingDesc: string;
      consensus: string;
      consensusDesc: string;
      governance: string;
      governanceDesc: string;
      tokenomics: string;
      tokenomicsDesc: string;
      rewards: string;
      rewardsDesc: string;
      multilang: string;
      multilangDesc: string;
    };
    features: {
      title: string;
      subtitle: string;
      consensus: string;
      consensusDesc: string;
      governance: string;
      governanceDesc: string;
      tokenomics: string;
      tokenomicsDesc: string;
      council: string;
      councilDesc: string;
      blog: string;
      blogDesc: string;
      community: string;
      communityDesc: string;
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
  
  // Login Page
  login: {
    welcome: string;
    subtitle: string;
    membershipTitle: string;
    membershipDesc: string;
    electionsTitle: string;
    electionsDesc: string;
    tokenSystemTitle: string;
    tokenSystemDesc: string;
    secureTitle: string;
    secureDesc: string;
    getStarted: string;
    getStartedDesc: string;
    loginButton: string;
    connecting: string;
    missionIntro: string;
    missionStatement: string;
    missionGoal1: string;
    missionGoal2: string;
    missionGoal3: string;
    communityDescription: string;
  };
  
  // Profile Setup
  profileSetup: {
    title: string;
    subtitle: string;
    username: string;
    usernamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    profilePicture: string;
    uploadImage: string;
    changeImage: string;
    createProfile: string;
    creating: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    overview: string;
    members: string;
    elections: string;
    consensus: string;
    council: string;
    admin: string;
    blog: string;
    documentation: string;
  };
  
  // Overview Tab
  overview: {
    joinCommunity: string;
    joinCommunityDesc: string;
    requestToJoin: string;
    submitting: string;
    requestSent: string;
    requestSentDesc: string;
    editProfile: string;
    repToken: string;
    repDesc: string;
    repEarned: string;
    philToken: string;
    philDesc: string;
    philReward: string;
    leaveCommunity: string;
    leaveCommunityDesc: string;
    leaving: string;
    leaveConfirmTitle: string;
    leaveConfirmDesc: string;
    dailyRewards: string;
    dailyRewardsDesc: string;
    sendToken: string;
    sendTokenDesc: string;
  };
  
  // User Categories
  categories: {
    nonMember: string;
    member: string;
    activeMember: string;
  };
  
  // Members Tab
  members: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    noMembers: string;
    noMembersSearch: string;
    accessRestricted: string;
    accessRestrictedDesc: string;
    pendingRequests: string;
    pendingRequestsDesc: string;
    username: string;
    email: string;
    approvals: string;
    actions: string;
    approve: string;
    ready: string;
    council: string;
  };
  
  // Elections Tab
  elections: {
    title: string;
    subtitle: string;
    activeElections: string;
    closedElections: string;
    noElections: string;
    candidates: string;
    votes: string;
    registerCandidate: string;
    candidateName: string;
    candidateNamePlaceholder: string;
    register: string;
    registering: string;
  };
  
  // Consensus Meetings
  consensus: {
    title: string;
    subtitle: string;
    activeMeeting: string;
    currentPhase: string;
    participants: string;
    groups: string;
    phase: string;
    signUp: string;
    contribution: string;
    ranking: string;
    finalized: string;
    membershipRequired: string;
    membershipRequiredDesc: string;
    joinMeeting: string;
    joinMeetingDesc: string;
    signUpButton: string;
    signingUp: string;
    signedUp: string;
    signedUpDesc: string;
    notParticipating: string;
    notParticipatingDesc: string;
    adminView: string;
    adminViewDesc: string;
    pastMeetings: string;
    pastMeetingsDesc: string;
    viewResults: string;
    noMeetings: string;
    noMeetingsDesc: string;
    nextPhase: string;
    forceNextPhase: string;
    submitContribution: string;
    submitting: string;
    contributionText: string;
    contributionPlaceholder: string;
    uploadFiles: string;
    yourGroup: string;
    groupContributions: string;
    submitRanking: string;
    rankMembers: string;
    rankMembersDesc: string;
    results: string;
    consensusReached: string;
    consensusNotReached: string;
    repDistribution: string;
    philDistribution: string;
    yourRewards: string;
    phaseExpired: string;
    phaseAdvanced: string;
    phaseForced: string;
    advanceToContribution: string;
    advanceToRanking: string;
    finalizeMeeting: string;
    progress: string;
    timeRemaining: string;
    status: string;
    enrolled: string;
    notEnrolled: string;
    signUpForMeeting: string;
    advancing: string;
    forcing: string;
    contributionRequired: string;
    unknownUser: string;
    noGroupAssigned: string;
    membersInGroup: string;
    shareContribution: string;
    attachments: string;
    contributionSubmitted: string;
    viewGroupContributions: string;
    of: string;
    membersSubmitted: string;
    you: string;
    attachment: string;
    consensusReachedDesc: string;
    finalizationComplete: string;
    awaitingRankings: string;
    totalREPDistributed: string;
    totalPHILDistributed: string;
    tokensAdded: string;
    repEarned: string;
    philEarned: string;
    currentBalance: string;
    noConsensusMessage: string;
    consensusAchieved: string;
    consensusSuccessMessage: string;
    group: string;
    members: string;
    rankingsSubmitted: string;
    allParticipated: string;
    noConsensus: string;
    consensusRequirement3: string;
    consensusRequirement45: string;
    consensusRequirement6: string;
    consensusRequirementAll: string;
    groupConsensusSuccess: string;
    membersAndRewards: string;
    noRanking: string;
    noRewards: string;
    membersSubmittedRankings: string;
    allRankedNoConsensus: string;
    reviewContributions: string;
    rankingOrder: string;
    rankingsSubmittedSuccess: string;
    waitingForRankings: string;
  };
  
  // Council Tab
  council: {
    title: string;
    subtitle: string;
    lastUpdate: string;
    notYetUpdated: string;
    recalculateButton: string;
    recalculateSuccess: string;
    recalculateError: string;
    currentMembers: string;
    currentMembersDesc: string;
    councilMember: string;
    weekAverage: string;
    multiSigActions: string;
    multiSigDesc: string;
    proposeAction: string;
    proposeNewAction: string;
    proposeNewActionDesc: string;
    actionId: string;
    actionIdPlaceholder: string;
    actionDetails: string;
    actionDetailsPlaceholder: string;
    submitProposal: string;
    actionIdAndDetailsRequired: string;
    actionCreatedSuccess: string;
    actionCreatedError: string;
    actionApprovedSuccess: string;
    actionApprovedError: string;
    pendingActions: string;
    pendingActionsDesc: string;
    noPendingActions: string;
    pending: string;
    proposed: string;
    approvals: string;
    approve: string;
    youApproved: string;
    approvedActions: string;
    approvedActionsDesc: string;
    noApprovedActions: string;
    approved: string;
    completed: string;
    membershipOversight: string;
    membershipOversightDesc: string;
    treasuryManagement: string;
    treasuryManagementDesc: string;
    tokenDistribution: string;
    tokenDistributionDesc: string;
    proposalVoting: string;
    proposalVotingDesc: string;
    status: string;
    comingSoon: string;
    placeholder: string;
    privilegesTitle: string;
    privilegeMultisig: string;
    privilegeVoting: string;
    privilegeMembership: string;
    privilegeRecalculate: string;
    errorLoading: string;
    notAvailable: string;
  };
  
  // Admin Tab
  admin: {
    title: string;
    general: string;
    tokenomics: string;
    ucaManagement: string;
    ucaDesc: string;
    updateUCA: string;
    updating: string;
    membersManagement: string;
    membersDesc: string;
    promoteToAdmin: string;
    deleteUser: string;
    membershipRequests: string;
    membershipRequestsDesc: string;
    requester: string;
    accept: string;
    reject: string;
    accepting: string;
    rejecting: string;
    electionsManagement: string;
    electionsDesc: string;
    createElection: string;
    electionId: string;
    electionIdPlaceholder: string;
    consensusManagement: string;
    consensusDesc: string;
    createMeeting: string;
    meetingId: string;
    meetingIdPlaceholder: string;
    tokenomicsConfig: string;
    currentSupply: string;
    maxSupply: string;
    treasuryBalances: string;
    rewardsTreasury: string;
    marketingTreasury: string;
    councilTreasury: string;
    manualMint: string;
    minting: string;
    mintTokens: string;
    mintTokensSuccess: string;
    mintTokensError: string;
  };
  
  // Announcements
  announcements: {
    title: string;
    subtitle: string;
    createButton: string;
    createTitle: string;
    createDesc: string;
    editTitle: string;
    editDesc: string;
    titleLabel: string;
    titlePlaceholder: string;
    contentLabel: string;
    contentPlaceholder: string;
    updateButton: string;
    noAnnouncements: string;
    noAnnouncementsDesc: string;
    updated: string;
    titleRequired: string;
    contentRequired: string;
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    errorLoading: string;
  };

  // Blog
  blog: {
    title: string;
    subtitle: string;
    createButton: string;
    createTitle: string;
    createDesc: string;
    editTitle: string;
    editDesc: string;
    titleLabel: string;
    titlePlaceholder: string;
    contentLabel: string;
    contentPlaceholder: string;
    updateButton: string;
    noPosts: string;
    noPostsDesc: string;
    updated: string;
    published: string;
    titleRequired: string;
    contentRequired: string;
    createSuccess: string;
    createError: string;
    updateSuccess: string;
    updateError: string;
    errorLoading: string;
    comments: string;
    noComments: string;
    addComment: string;
    commentPlaceholder: string;
    postComment: string;
    posting: string;
    reactions: string;
    like: string;
    share: string;
    tip: string;
    sharePost: string;
    sharePostDesc: string;
    linkCopied: string;
    linkCopyError: string;
    tipAuthor: string;
    tipAuthorDesc: string;
    tipAmount: string;
    yourBalance: string;
    sendTip: string;
    tipping: string;
    tipSuccess: string;
    tipError: string;
    tipAmountInvalid: string;
    insufficientBalance: string;
    cannotTipOwnPost: string;
  };

  // Documentation
  documentation: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    noResultsTitle: string;
    noResultsDesc: string;
    knowledgeBase: string;
    knowledgeBaseDesc: string;
    needHelp: string;
    needHelpDesc: string;
  };
  
  // Notifications
  notifications: {
    title: string;
    noNotifications: string;
    markAllRead: string;
    newBlogPost: string;
    newAnnouncement: string;
    joinRequestSubmitted: string;
    membershipApproved: string;
    newProposal: string;
    proposalAccepted: string;
    proposalRejected: string;
  };

  // Proposals
  proposals: {
    title: string;
    subtitle: string;
    createButton: string;
    createTitle: string;
    createDesc: string;
    titleLabel: string;
    titlePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    submitButton: string;
    noProposals: string;
    noProposalsDesc: string;
    statusPending: string;
    statusAccepted: string;
    statusRejected: string;
    author: string;
    submitted: string;
    completed: string;
    approvals: string;
    approveButton: string;
    rejectButton: string;
    youApproved: string;
    youRejected: string;
    activeMemberRequired: string;
    accessDenied: string;
    titleAndDescriptionRequired: string;
    createSuccess: string;
    createError: string;
    approveSuccess: string;
    approveError: string;
    rejectSuccess: string;
    rejectError: string;
    errorLoading: string;
    infoTitle: string;
    infoCreate: string;
    infoApprove: string;
    infoMultisig: string;
    infoNotifications: string;
  };

  // Wallet
  wallet: {
    title: string;
    subtitle: string;
    balanceOverview: string;
    balanceDesc: string;
    send: string;
    receive: string;
    transactionHistory: string;
    transactionHistoryDesc: string;
    noTransactions: string;
    type: string;
    token: string;
    amount: string;
    status: string;
    time: string;
    sent: string;
    received: string;
    statusCompleted: string;
    statusPending: string;
    statusFailed: string;
    sendTokens: string;
    sendTokensDesc: string;
    selectToken: string;
    recipientAddress: string;
    recipientPlaceholder: string;
    balance: string;
    continue: string;
    confirmTransaction: string;
    confirmTransactionDesc: string;
    recipient: string;
    fee: string;
    confirmSend: string;
    receiveTokens: string;
    receiveTokensDesc: string;
    yourAddress: string;
    shareAddress: string;
    addressCopied: string;
    addressCopyError: string;
    fillAllFields: string;
    invalidAmount: string;
    sendSuccess: string;
    sendError: string;
  };

  // Tokenomics
  tokenomics: {
    nextMintTitle: string;
    nextMintDesc: string;
    dateAndTime: string;
    mintingStartsOn: string;
  };

  // UCA Dialog
  uca: {
    title: string;
    description: string;
    loadingAgreement: string;
    acceptCheckbox: string;
    acceptCheckboxDesc: string;
    acceptButton: string;
    accepting: string;
    pleaseConfirm: string;
    acceptSuccess: string;
    acceptError: string;
  };
  
  // Edit Profile Dialog
  editProfile: {
    title: string;
    username: string;
    profilePicture: string;
    uploadNew: string;
    saveChanges: string;
    saving: string;
  };
  
  // Toast Messages
  toast: {
    joinRequestSuccess: string;
    joinRequestError: string;
    leaveCommunitySuccess: string;
    leaveCommunityError: string;
    profileUpdateSuccess: string;
    profileUpdateError: string;
    signUpSuccess: string;
    signUpError: string;
    approveSuccess: string;
    approveError: string;
    contributionSuccess: string;
    contributionError: string;
    rankingSuccess: string;
    rankingError: string;
    actionCreated: string;
    actionApproved: string;
    genericError: string;
    commentSuccess: string;
    commentError: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      close: 'Close',
      search: 'Search',
      viewDetails: 'View Details',
      noResults: 'No results found',
      clearSearch: 'Clear search',
      addressCopied: 'Address copied!',
    },
    header: {
      title: 'Phil3',
      subtitle: 'Reimagining philanthropy',
      toggleTheme: 'Toggle theme',
      profile: 'Profile',
      adminDashboard: 'Admin Dashboard',
      profileSettings: 'Profile Settings',
      logout: 'Log out',
    },
    footer: {
      builtWith: 'Built with',
      love: 'love',
    },
    homepage: {
      headline: 'Welcome to Phil3',
      tagline: 'Reimagining philanthropy in the age of web3.',
      description: 'Phil3 is an innovative platform designed for a new generation of philanthropists, who want to contribute in achieving shared missions.\n\nJoin a decentralized community where members participate in democratic governance, earn rewards through consensus meetings, and shape the future of philanthropic initiatives on the Internet Computer.',
      valueProposition: {
        title: 'Why Join Phil3?',
        subtitle: 'Experience a new way of collaborative philanthropy',
        onboarding: 'Structured Onboarding',
        onboardingDesc: 'Join a welcoming community with clear membership tiers and approval processes',
        consensus: 'Weekly Consensus Meetings',
        consensusDesc: 'Participate in collaborative decision-making and earn reputation through consensus',
        governance: 'Governance Activities',
        governanceDesc: 'Shape the future of Phil3 through democratic proposals and voting',
        tokenomics: 'Bitcoin-type Tokenomics',
        tokenomicsDesc: 'Benefit from a deflationary token model with halving cycles and capped supply',
        rewards: 'Daily Rewards',
        rewardsDesc: 'Claim daily PHIL tokens based on your membership tier and activity level',
        multilang: 'Multilanguage Support',
        multilangDesc: 'Access the platform in English or French with full translation support',
      },
      features: {
        title: 'Platform Features',
        subtitle: 'Everything you need for decentralized philanthropy',
        consensus: 'Consensus Meetings',
        consensusDesc: 'Participate in structured meetings with contribution, ranking, and reward phases',
        governance: 'Democratic Governance',
        governanceDesc: 'Vote on proposals and participate in community decision-making',
        tokenomics: 'Token Economics',
        tokenomicsDesc: 'Earn REP and PHIL tokens through participation and contributions',
        council: 'Council System',
        councilDesc: 'Top contributors form the council with special governance privileges',
        blog: 'Community Blog',
        blogDesc: 'Share ideas, engage with content, and tip authors with PHIL tokens',
        community: 'Member Directory',
        communityDesc: 'Connect with fellow philanthropists and track community growth',
      },
      cta: {
        title: 'Join Phil3 Today',
        subtitle: 'Start your journey in decentralized philanthropy and make a difference',
        button: 'Get Started',
      },
    },
    login: {
      welcome: 'Welcome to Phil3',
      subtitle: 'Reimagining philanthropy in the age of web3',
      membershipTitle: 'Community Membership',
      membershipDesc: 'Join a structured community with clear membership tiers and approval processes',
      electionsTitle: 'Democratic Elections',
      electionsDesc: 'Participate in council elections and shape the future of Phil3',
      tokenSystemTitle: 'Dual Token System',
      tokenSystemDesc: 'Earn REP (reputation) and PHIL tokens through participation and contributions',
      secureTitle: 'Secure & Decentralized',
      secureDesc: 'Built on the Internet Computer with Internet Identity authentication',
      getStarted: 'Get Started',
      getStartedDesc: 'Connect with Internet Identity to begin your journey',
      loginButton: 'Login with Internet Identity',
      connecting: 'Connecting...',
      missionIntro: 'Phil3 is an innovative platform designed for a new generation of philanthropists, who want to contribute in achieving shared missions.',
      missionStatement: "Phil3's mission is to democratize Philanthropy in the era of web3. How do we do that?",
      missionGoal1: 'By building a functional platform',
      missionGoal2: 'By growing our membership base',
      missionGoal3: 'By helping our members realize their first philanthropy goal.',
      communityDescription: 'Join a decentralized community where members participate in democratic governance, earn rewards through consensus meetings, and shape the future of philanthropic initiatives on the Internet Computer',
    },
    profileSetup: {
      title: 'Create Your Profile',
      subtitle: 'Tell us about yourself to get started',
      username: 'Username',
      usernamePlaceholder: 'Enter your username',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      profilePicture: 'Profile Picture',
      uploadImage: 'Upload Image',
      changeImage: 'Change Image',
      createProfile: 'Create Profile',
      creating: 'Creating...',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Welcome to your Phil3 dashboard',
      overview: 'Overview',
      members: 'Members',
      elections: 'Elections',
      consensus: 'Consensus',
      council: 'Council',
      admin: 'Admin',
      blog: 'Blog',
      documentation: 'Documentation',
    },
    overview: {
      joinCommunity: 'Join the Phil3 Community',
      joinCommunityDesc: 'Submit a request to become a member and participate in governance',
      requestToJoin: 'Request to Join',
      submitting: 'Submitting...',
      requestSent: 'Request Sent',
      requestSentDesc: 'Your membership request is pending approval',
      editProfile: 'Edit Profile',
      repToken: 'REP Token',
      repDesc: 'Reputation earned through consensus meetings',
      repEarned: 'REP Earned',
      philToken: 'PHIL Token',
      philDesc: 'Governance token for voting and rewards',
      philReward: 'PHIL Reward',
      leaveCommunity: 'Leave Community',
      leaveCommunityDesc: 'Remove your membership from Phil3',
      leaving: 'Leaving...',
      leaveConfirmTitle: 'Leave Community?',
      leaveConfirmDesc: 'Are you sure you want to leave the Phil3 community? This action cannot be undone.',
      dailyRewards: 'Daily Rewards',
      dailyRewardsDesc: 'Claim your daily PHIL token rewards',
      sendToken: 'Send Token',
      sendTokenDesc: 'Transfer PHIL tokens to other members',
    },
    categories: {
      nonMember: 'Non-Member',
      member: 'Member',
      activeMember: 'Active Member',
    },
    members: {
      title: 'Community Members',
      subtitle: 'Browse and connect with Phil3 members',
      searchPlaceholder: 'Search members...',
      noMembers: 'No members found',
      noMembersSearch: 'No members match your search',
      accessRestricted: 'Access Restricted',
      accessRestrictedDesc: 'Only admins and active members can view the members list',
      pendingRequests: 'Pending Membership Requests',
      pendingRequestsDesc: 'Review and approve new member applications',
      username: 'Username',
      email: 'Email',
      approvals: 'Approvals',
      actions: 'Actions',
      approve: 'Approve',
      ready: 'Ready',
      council: 'Council',
    },
    elections: {
      title: 'Council Elections',
      subtitle: 'Participate in democratic elections',
      activeElections: 'Active Elections',
      closedElections: 'Closed Elections',
      noElections: 'No elections available',
      candidates: 'Candidates',
      votes: 'Votes',
      registerCandidate: 'Register as Candidate',
      candidateName: 'Candidate Name',
      candidateNamePlaceholder: 'Enter your candidate name',
      register: 'Register',
      registering: 'Registering...',
    },
    consensus: {
      title: 'Consensus Meetings',
      subtitle: 'Participate in collaborative decision-making',
      activeMeeting: 'Active Meeting',
      currentPhase: 'Current Phase',
      participants: 'Participants',
      groups: 'Groups',
      phase: 'Phase',
      signUp: 'Sign-up',
      contribution: 'Contribution',
      ranking: 'Ranking',
      finalized: 'Finalized',
      membershipRequired: 'Membership Required',
      membershipRequiredDesc: 'You must be an approved member to participate in consensus meetings',
      joinMeeting: 'Join Meeting',
      joinMeetingDesc: 'Sign up to participate in this consensus meeting',
      signUpButton: 'Sign Up',
      signingUp: 'Signing Up...',
      signedUp: 'Signed Up',
      signedUpDesc: 'You are enrolled in this meeting',
      notParticipating: 'Not Participating',
      notParticipatingDesc: 'You are not enrolled in this meeting',
      adminView: 'Admin View',
      adminViewDesc: 'Manage meeting phases and participants',
      pastMeetings: 'Past Meetings',
      pastMeetingsDesc: 'View results from previous consensus meetings',
      viewResults: 'View Results',
      noMeetings: 'No Meetings',
      noMeetingsDesc: 'No consensus meetings have been created yet',
      nextPhase: 'Advance to Next Phase',
      forceNextPhase: 'Force Next Phase',
      submitContribution: 'Submit Contribution',
      submitting: 'Submitting...',
      contributionText: 'Contribution Text',
      contributionPlaceholder: 'Describe your contribution...',
      uploadFiles: 'Upload Files',
      yourGroup: 'Your Group',
      groupContributions: 'Group Contributions',
      submitRanking: 'Submit Ranking',
      rankMembers: 'Rank Members',
      rankMembersDesc: 'Drag to reorder members by contribution',
      results: 'Results',
      consensusReached: 'Consensus Reached',
      consensusNotReached: 'No Consensus',
      repDistribution: 'REP Distribution',
      philDistribution: 'PHIL Distribution',
      yourRewards: 'Your Rewards',
      phaseExpired: 'Phase time limit has expired',
      phaseAdvanced: 'Phase advanced successfully',
      phaseForced: 'Phase forced successfully',
      advanceToContribution: 'Advance to Contribution Phase',
      advanceToRanking: 'Advance to Ranking Phase',
      finalizeMeeting: 'Finalize Meeting',
      progress: 'Progress',
      timeRemaining: 'Time Remaining',
      status: 'Status',
      enrolled: 'Enrolled',
      notEnrolled: 'Not Enrolled',
      signUpForMeeting: 'Sign up for this meeting',
      advancing: 'Advancing...',
      forcing: 'Forcing...',
      contributionRequired: 'Contribution required',
      unknownUser: 'Unknown User',
      noGroupAssigned: 'No group assigned',
      membersInGroup: 'members in your group',
      shareContribution: 'Share your contribution with your group',
      attachments: 'Attachments',
      contributionSubmitted: 'Contribution submitted successfully',
      viewGroupContributions: 'View Group Contributions',
      of: 'of',
      membersSubmitted: 'members submitted',
      you: 'You',
      attachment: 'Attachment',
      consensusReachedDesc: 'Group reached consensus on rankings',
      finalizationComplete: 'Meeting finalized',
      awaitingRankings: 'Awaiting rankings from all participants',
      totalREPDistributed: 'Total REP Distributed',
      totalPHILDistributed: 'Total PHIL Distributed',
      tokensAdded: 'Tokens have been added to your balance',
      repEarned: 'REP Earned',
      philEarned: 'PHIL Earned',
      currentBalance: 'Current Balance',
      noConsensusMessage: 'No consensus was reached in this group',
      consensusAchieved: 'Consensus Achieved',
      consensusSuccessMessage: 'Your group reached consensus!',
      group: 'Group',
      members: 'Members',
      rankingsSubmitted: 'Rankings Submitted',
      allParticipated: 'All members participated',
      noConsensus: 'No consensus reached',
      consensusRequirement3: '2 out of 3 must agree',
      consensusRequirement45: '3 out of 4-5 must agree',
      consensusRequirement6: '4 out of 6 must agree',
      consensusRequirementAll: 'All members must agree',
      groupConsensusSuccess: 'Consensus reached',
      membersAndRewards: 'Members & Rewards',
      noRanking: 'No ranking submitted',
      noRewards: 'No rewards (no consensus)',
      membersSubmittedRankings: 'members submitted rankings',
      allRankedNoConsensus: 'All members ranked, but no consensus was reached',
      reviewContributions: 'Review contributions from your group members before ranking',
      rankingOrder: 'Ranking Order',
      rankingsSubmittedSuccess: 'Rankings submitted successfully',
      waitingForRankings: 'Waiting for other members to submit rankings',
    },
    council: {
      title: 'Council Dashboard',
      subtitle: 'Governance and oversight',
      lastUpdate: 'Last Update',
      notYetUpdated: 'Not yet updated',
      recalculateButton: 'Recalculate Council',
      recalculateSuccess: 'Council recalculated successfully',
      recalculateError: 'Failed to recalculate council',
      currentMembers: 'Current Council Members',
      currentMembersDesc: 'Top 5 members by 12-week average REP',
      councilMember: 'Council Member',
      weekAverage: '12-Week Average',
      multiSigActions: 'Multi-Signature Actions',
      multiSigDesc: 'Propose and approve council actions',
      proposeAction: 'Propose Action',
      proposeNewAction: 'Propose New Action',
      proposeNewActionDesc: 'Create a new multi-signature action for council approval',
      actionId: 'Action ID',
      actionIdPlaceholder: 'Enter action ID',
      actionDetails: 'Action Details',
      actionDetailsPlaceholder: 'Describe the action...',
      submitProposal: 'Submit Proposal',
      actionIdAndDetailsRequired: 'Action ID and details are required',
      actionCreatedSuccess: 'Action created successfully',
      actionCreatedError: 'Failed to create action',
      actionApprovedSuccess: 'Action approved successfully',
      actionApprovedError: 'Failed to approve action',
      pendingActions: 'Pending Actions',
      pendingActionsDesc: 'Actions awaiting council approval',
      noPendingActions: 'No pending actions',
      pending: 'Pending',
      proposed: 'Proposed',
      approvals: 'Approvals',
      approve: 'Approve',
      youApproved: 'You approved',
      approvedActions: 'Approved Actions',
      approvedActionsDesc: 'Actions that have been executed',
      noApprovedActions: 'No approved actions',
      approved: 'Approved',
      completed: 'Completed',
      membershipOversight: 'Membership Oversight',
      membershipOversightDesc: 'Review and approve membership applications',
      treasuryManagement: 'Treasury Management',
      treasuryManagementDesc: 'Manage community funds and allocations',
      tokenDistribution: 'Token Distribution',
      tokenDistributionDesc: 'Oversee REP and PHIL token distribution',
      proposalVoting: 'Proposal Voting',
      proposalVotingDesc: 'Vote on community proposals and initiatives',
      status: 'Status',
      comingSoon: 'Coming Soon',
      placeholder: 'This feature is under development',
      privilegesTitle: 'Council Privileges',
      privilegeMultisig: 'Propose and approve multi-signature actions',
      privilegeVoting: 'Vote on community proposals',
      privilegeMembership: 'Approve membership requests',
      privilegeRecalculate: 'Recalculate council membership',
      errorLoading: 'Error loading council data',
      notAvailable: 'Council data not available',
    },
    admin: {
      title: 'Admin Dashboard',
      general: 'General',
      tokenomics: 'Tokenomics',
      ucaManagement: 'UCA Management',
      ucaDesc: 'Update the User Contributor Agreement',
      updateUCA: 'Update UCA',
      updating: 'Updating...',
      membersManagement: 'Members Management',
      membersDesc: 'Manage user roles and permissions',
      promoteToAdmin: 'Promote to Admin',
      deleteUser: 'Delete User',
      membershipRequests: 'Membership Requests',
      membershipRequestsDesc: 'Review and approve membership applications',
      requester: 'Requester',
      accept: 'Accept',
      reject: 'Reject',
      accepting: 'Accepting...',
      rejecting: 'Rejecting...',
      electionsManagement: 'Elections Management',
      electionsDesc: 'Create and manage council elections',
      createElection: 'Create Election',
      electionId: 'Election ID',
      electionIdPlaceholder: 'Enter election ID',
      consensusManagement: 'Consensus Management',
      consensusDesc: 'Create and manage consensus meetings',
      createMeeting: 'Create Meeting',
      meetingId: 'Meeting ID',
      meetingIdPlaceholder: 'Enter meeting ID',
      tokenomicsConfig: 'Tokenomics Configuration',
      currentSupply: 'Current Supply',
      maxSupply: 'Max Supply',
      treasuryBalances: 'Treasury Balances',
      rewardsTreasury: 'Rewards Treasury',
      marketingTreasury: 'Marketing Treasury',
      councilTreasury: 'Council Treasury',
      manualMint: 'Manual Mint',
      minting: 'Minting...',
      mintTokens: 'Mint Tokens',
      mintTokensSuccess: 'Tokens minted successfully',
      mintTokensError: 'Failed to mint tokens',
    },
    announcements: {
      title: 'Announcements',
      subtitle: 'Important updates and news',
      createButton: 'Create Announcement',
      createTitle: 'Create Announcement',
      createDesc: 'Share important updates with the community',
      editTitle: 'Edit Announcement',
      editDesc: 'Update announcement content',
      titleLabel: 'Title',
      titlePlaceholder: 'Enter announcement title',
      contentLabel: 'Content',
      contentPlaceholder: 'Enter announcement content',
      updateButton: 'Update',
      noAnnouncements: 'No Announcements',
      noAnnouncementsDesc: 'No announcements have been posted yet',
      updated: 'Updated',
      titleRequired: 'Title is required',
      contentRequired: 'Content is required',
      createSuccess: 'Announcement created successfully',
      createError: 'Failed to create announcement',
      updateSuccess: 'Announcement updated successfully',
      updateError: 'Failed to update announcement',
      errorLoading: 'Error loading announcements',
    },
    blog: {
      title: 'Community Blog',
      subtitle: 'Share ideas and engage with the community',
      createButton: 'Create Post',
      createTitle: 'Create Blog Post',
      createDesc: 'Share your thoughts with the community',
      editTitle: 'Edit Blog Post',
      editDesc: 'Update your blog post',
      titleLabel: 'Title',
      titlePlaceholder: 'Enter post title',
      contentLabel: 'Content',
      contentPlaceholder: 'Write your post...',
      updateButton: 'Update',
      noPosts: 'No Posts',
      noPostsDesc: 'No blog posts have been published yet',
      updated: 'Updated',
      published: 'Published',
      titleRequired: 'Title is required',
      contentRequired: 'Content is required',
      createSuccess: 'Post created successfully',
      createError: 'Failed to create post',
      updateSuccess: 'Post updated successfully',
      updateError: 'Failed to update post',
      errorLoading: 'Error loading posts',
      comments: 'Comments',
      noComments: 'No comments yet',
      addComment: 'Add Comment',
      commentPlaceholder: 'Write a comment...',
      postComment: 'Post Comment',
      posting: 'Posting...',
      reactions: 'Reactions',
      like: 'Like',
      share: 'Share',
      tip: 'Tip',
      sharePost: 'Share Post',
      sharePostDesc: 'Copy link to share this post',
      linkCopied: 'Link copied to clipboard',
      linkCopyError: 'Failed to copy link',
      tipAuthor: 'Tip Author',
      tipAuthorDesc: 'Send PHIL tokens to the author',
      tipAmount: 'Tip Amount',
      yourBalance: 'Your Balance',
      sendTip: 'Send Tip',
      tipping: 'Sending...',
      tipSuccess: 'Tip sent successfully',
      tipError: 'Failed to send tip',
      tipAmountInvalid: 'Please enter a valid amount',
      insufficientBalance: 'Insufficient balance',
      cannotTipOwnPost: 'Cannot tip your own post',
    },
    documentation: {
      title: 'Documentation',
      subtitle: 'Learn about Phil3 features and how to use them',
      searchPlaceholder: 'Search documentation...',
      noResultsTitle: 'No results found',
      noResultsDesc: 'Try different keywords or browse the sections below',
      knowledgeBase: 'Knowledge Base',
      knowledgeBaseDesc: 'Comprehensive guides and documentation',
      needHelp: 'Need Help?',
      needHelpDesc: 'Contact support or visit our community forum',
    },
    notifications: {
      title: 'Notifications',
      noNotifications: 'No notifications',
      markAllRead: 'Mark all as read',
      newBlogPost: 'New blog post',
      newAnnouncement: 'New announcement',
      joinRequestSubmitted: 'Join request submitted',
      membershipApproved: 'Membership approved',
      newProposal: 'New proposal',
      proposalAccepted: 'Proposal accepted',
      proposalRejected: 'Proposal rejected',
    },
    proposals: {
      title: 'Proposals',
      subtitle: 'Community proposals and voting',
      createButton: 'Create Proposal',
      createTitle: 'Create Proposal',
      createDesc: 'Submit a proposal for community consideration',
      titleLabel: 'Title',
      titlePlaceholder: 'Enter proposal title',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Describe your proposal...',
      submitButton: 'Submit Proposal',
      noProposals: 'No Proposals',
      noProposalsDesc: 'No proposals have been submitted yet',
      statusPending: 'Pending',
      statusAccepted: 'Accepted',
      statusRejected: 'Rejected',
      author: 'Author',
      submitted: 'Submitted',
      completed: 'Completed',
      approvals: 'Approvals',
      approveButton: 'Approve',
      rejectButton: 'Reject',
      youApproved: 'You approved',
      youRejected: 'You rejected',
      activeMemberRequired: 'Active Member Required',
      accessDenied: 'Only Active Members can view and create proposals',
      titleAndDescriptionRequired: 'Title and description are required',
      createSuccess: 'Proposal created successfully',
      createError: 'Failed to create proposal',
      approveSuccess: 'Proposal approved',
      approveError: 'Failed to approve proposal',
      rejectSuccess: 'Proposal rejected',
      rejectError: 'Failed to reject proposal',
      errorLoading: 'Error loading proposals',
      infoTitle: 'How Proposals Work',
      infoCreate: 'Active Members can create proposals',
      infoApprove: 'Council Members and Admins can vote',
      infoMultisig: '3 approvals or rejections needed',
      infoNotifications: 'Authors receive notifications on decisions',
    },
    wallet: {
      title: 'Wallet',
      subtitle: 'Manage your tokens and transactions',
      balanceOverview: 'Balance Overview',
      balanceDesc: 'Your current token balances',
      send: 'Send',
      receive: 'Receive',
      transactionHistory: 'Transaction History',
      transactionHistoryDesc: 'View your recent transactions',
      noTransactions: 'No transactions yet',
      type: 'Type',
      token: 'Token',
      amount: 'Amount',
      status: 'Status',
      time: 'Time',
      sent: 'Sent',
      received: 'Received',
      statusCompleted: 'Completed',
      statusPending: 'Pending',
      statusFailed: 'Failed',
      sendTokens: 'Send Tokens',
      sendTokensDesc: 'Transfer tokens to another address',
      selectToken: 'Select Token',
      recipientAddress: 'Recipient Address',
      recipientPlaceholder: 'Enter recipient address',
      balance: 'Balance',
      continue: 'Continue',
      confirmTransaction: 'Confirm Transaction',
      confirmTransactionDesc: 'Review and confirm your transaction',
      recipient: 'Recipient',
      fee: 'Fee',
      confirmSend: 'Confirm Send',
      receiveTokens: 'Receive Tokens',
      receiveTokensDesc: 'Share your address to receive tokens',
      yourAddress: 'Your Address',
      shareAddress: 'Share Address',
      addressCopied: 'Address copied to clipboard',
      addressCopyError: 'Failed to copy address',
      fillAllFields: 'Please fill in all fields',
      invalidAmount: 'Please enter a valid amount',
      sendSuccess: 'Transaction sent successfully',
      sendError: 'Failed to send transaction',
    },
    tokenomics: {
      nextMintTitle: 'Next Token Mint',
      nextMintDesc: 'The next minting cycle will begin on',
      dateAndTime: 'Date & Time',
      mintingStartsOn: 'Minting starts on',
    },
    uca: {
      title: 'User Contributor Agreement',
      description: 'Please read and accept the User Contributor Agreement to continue',
      loadingAgreement: 'Loading agreement...',
      acceptCheckbox: 'I have read and accept the User Contributor Agreement',
      acceptCheckboxDesc: 'You must accept the agreement to continue',
      acceptButton: 'Accept Agreement',
      accepting: 'Accepting...',
      pleaseConfirm: 'Please confirm that you have read and accept the agreement',
      acceptSuccess: 'Agreement accepted successfully',
      acceptError: 'Failed to accept agreement',
    },
    editProfile: {
      title: 'Edit Profile',
      username: 'Username',
      profilePicture: 'Profile Picture',
      uploadNew: 'Upload New',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
    },
    toast: {
      joinRequestSuccess: 'Join request submitted successfully',
      joinRequestError: 'Failed to submit join request',
      leaveCommunitySuccess: 'You have left the community',
      leaveCommunityError: 'Failed to leave community',
      profileUpdateSuccess: 'Profile updated successfully',
      profileUpdateError: 'Failed to update profile',
      signUpSuccess: 'Signed up for meeting successfully',
      signUpError: 'Failed to sign up for meeting',
      approveSuccess: 'Approved successfully',
      approveError: 'Failed to approve',
      contributionSuccess: 'Contribution submitted successfully',
      contributionError: 'Failed to submit contribution',
      rankingSuccess: 'Ranking submitted successfully',
      rankingError: 'Failed to submit ranking',
      actionCreated: 'Action created successfully',
      actionApproved: 'Action approved successfully',
      genericError: 'An error occurred',
      commentSuccess: 'Comment posted successfully',
      commentError: 'Failed to post comment',
    },
  },
  fr: {
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      edit: 'Modifier',
      delete: 'Supprimer',
      back: 'Retour',
      next: 'Suivant',
      submit: 'Soumettre',
      close: 'Fermer',
      search: 'Rechercher',
      viewDetails: 'Voir les détails',
      noResults: 'Aucun résultat trouvé',
      clearSearch: 'Effacer la recherche',
      addressCopied: 'Adresse copiée !',
    },
    header: {
      title: 'Phil3',
      subtitle: 'Réinventer la philanthropie',
      toggleTheme: 'Changer le thème',
      profile: 'Profil',
      adminDashboard: 'Tableau de bord admin',
      profileSettings: 'Paramètres du profil',
      logout: 'Se déconnecter',
    },
    footer: {
      builtWith: 'Construit avec',
      love: 'amour',
    },
    homepage: {
      headline: 'Bienvenue sur Phil3',
      tagline: 'Réinventer la philanthropie à l\'ère du web3.',
      description: 'Phil3 est une plateforme innovante conçue pour une nouvelle génération de philanthropes qui souhaitent contribuer à la réalisation de missions partagées.\n\nRejoignez une communauté décentralisée où les membres participent à la gouvernance démocratique, gagnent des récompenses grâce à des réunions de consensus et façonnent l\'avenir des initiatives philanthropiques sur l\'Internet Computer.',
      valueProposition: {
        title: 'Pourquoi rejoindre Phil3 ?',
        subtitle: 'Découvrez une nouvelle façon de philanthropie collaborative',
        onboarding: 'Intégration structurée',
        onboardingDesc: 'Rejoignez une communauté accueillante avec des niveaux d\'adhésion clairs et des processus d\'approbation',
        consensus: 'Réunions de consensus hebdomadaires',
        consensusDesc: 'Participez à la prise de décision collaborative et gagnez de la réputation grâce au consensus',
        governance: 'Activités de gouvernance',
        governanceDesc: 'Façonnez l\'avenir de Phil3 grâce à des propositions et des votes démocratiques',
        tokenomics: 'Tokenomics de type Bitcoin',
        tokenomicsDesc: 'Bénéficiez d\'un modèle de jeton déflationniste avec des cycles de réduction de moitié et une offre plafonnée',
        rewards: 'Récompenses quotidiennes',
        rewardsDesc: 'Réclamez des jetons PHIL quotidiens en fonction de votre niveau d\'adhésion et de votre niveau d\'activité',
        multilang: 'Support multilingue',
        multilangDesc: 'Accédez à la plateforme en anglais ou en français avec une traduction complète',
      },
      features: {
        title: 'Fonctionnalités de la plateforme',
        subtitle: 'Tout ce dont vous avez besoin pour la philanthropie décentralisée',
        consensus: 'Réunions de consensus',
        consensusDesc: 'Participez à des réunions structurées avec des phases de contribution, de classement et de récompense',
        governance: 'Gouvernance démocratique',
        governanceDesc: 'Votez sur les propositions et participez à la prise de décision communautaire',
        tokenomics: 'Économie des jetons',
        tokenomicsDesc: 'Gagnez des jetons REP et PHIL grâce à la participation et aux contributions',
        council: 'Système de conseil',
        councilDesc: 'Les meilleurs contributeurs forment le conseil avec des privilèges de gouvernance spéciaux',
        blog: 'Blog communautaire',
        blogDesc: 'Partagez des idées, interagissez avec le contenu et donnez des pourboires aux auteurs avec des jetons PHIL',
        community: 'Annuaire des membres',
        communityDesc: 'Connectez-vous avec d\'autres philanthropes et suivez la croissance de la communauté',
      },
      cta: {
        title: 'Rejoignez Phil3 aujourd\'hui',
        subtitle: 'Commencez votre voyage dans la philanthropie décentralisée et faites la différence',
        button: 'Commencer',
      },
    },
    login: {
      welcome: 'Bienvenue sur Phil3',
      subtitle: 'Réinventer la philanthropie à l\'ère du web3',
      membershipTitle: 'Adhésion communautaire',
      membershipDesc: 'Rejoignez une communauté structurée avec des niveaux d\'adhésion clairs et des processus d\'approbation',
      electionsTitle: 'Élections démocratiques',
      electionsDesc: 'Participez aux élections du conseil et façonnez l\'avenir de Phil3',
      tokenSystemTitle: 'Système à double jeton',
      tokenSystemDesc: 'Gagnez des jetons REP (réputation) et PHIL grâce à la participation et aux contributions',
      secureTitle: 'Sécurisé et décentralisé',
      secureDesc: 'Construit sur l\'Internet Computer avec authentification Internet Identity',
      getStarted: 'Commencer',
      getStartedDesc: 'Connectez-vous avec Internet Identity pour commencer votre voyage',
      loginButton: 'Se connecter avec Internet Identity',
      connecting: 'Connexion...',
      missionIntro: 'Phil3 est une plateforme innovante conçue pour une nouvelle génération de philanthropes qui souhaitent contribuer à la réalisation de missions partagées.',
      missionStatement: 'La mission de Phil3 est de démocratiser la philanthropie à l\'ère du web3. Comment faisons-nous cela ?',
      missionGoal1: 'En construisant une plateforme fonctionnelle',
      missionGoal2: 'En augmentant notre base de membres',
      missionGoal3: 'En aidant nos membres à réaliser leur premier objectif philanthropique.',
      communityDescription: 'Rejoignez une communauté décentralisée où les membres participent à la gouvernance démocratique, gagnent des récompenses grâce à des réunions de consensus et façonnent l\'avenir des initiatives philanthropiques sur l\'Internet Computer',
    },
    profileSetup: {
      title: 'Créez votre profil',
      subtitle: 'Parlez-nous de vous pour commencer',
      username: 'Nom d\'utilisateur',
      usernamePlaceholder: 'Entrez votre nom d\'utilisateur',
      email: 'Email',
      emailPlaceholder: 'Entrez votre email',
      profilePicture: 'Photo de profil',
      uploadImage: 'Télécharger une image',
      changeImage: 'Changer l\'image',
      createProfile: 'Créer le profil',
      creating: 'Création...',
    },
    dashboard: {
      title: 'Tableau de bord',
      subtitle: 'Bienvenue sur votre tableau de bord Phil3',
      overview: 'Aperçu',
      members: 'Membres',
      elections: 'Élections',
      consensus: 'Consensus',
      council: 'Conseil',
      admin: 'Admin',
      blog: 'Blog',
      documentation: 'Documentation',
    },
    overview: {
      joinCommunity: 'Rejoindre la communauté Phil3',
      joinCommunityDesc: 'Soumettez une demande pour devenir membre et participer à la gouvernance',
      requestToJoin: 'Demander à rejoindre',
      submitting: 'Soumission...',
      requestSent: 'Demande envoyée',
      requestSentDesc: 'Votre demande d\'adhésion est en attente d\'approbation',
      editProfile: 'Modifier le profil',
      repToken: 'Jeton REP',
      repDesc: 'Réputation gagnée grâce aux réunions de consensus',
      repEarned: 'REP gagné',
      philToken: 'Jeton PHIL',
      philDesc: 'Jeton de gouvernance pour le vote et les récompenses',
      philReward: 'Récompense PHIL',
      leaveCommunity: 'Quitter la communauté',
      leaveCommunityDesc: 'Retirer votre adhésion de Phil3',
      leaving: 'Départ...',
      leaveConfirmTitle: 'Quitter la communauté ?',
      leaveConfirmDesc: 'Êtes-vous sûr de vouloir quitter la communauté Phil3 ? Cette action ne peut pas être annulée.',
      dailyRewards: 'Récompenses quotidiennes',
      dailyRewardsDesc: 'Réclamez vos récompenses quotidiennes en jetons PHIL',
      sendToken: 'Envoyer des jetons',
      sendTokenDesc: 'Transférer des jetons PHIL à d\'autres membres',
    },
    categories: {
      nonMember: 'Non-membre',
      member: 'Membre',
      activeMember: 'Membre actif',
    },
    members: {
      title: 'Membres de la communauté',
      subtitle: 'Parcourir et se connecter avec les membres de Phil3',
      searchPlaceholder: 'Rechercher des membres...',
      noMembers: 'Aucun membre trouvé',
      noMembersSearch: 'Aucun membre ne correspond à votre recherche',
      accessRestricted: 'Accès restreint',
      accessRestrictedDesc: 'Seuls les administrateurs et les membres actifs peuvent voir la liste des membres',
      pendingRequests: 'Demandes d\'adhésion en attente',
      pendingRequestsDesc: 'Examiner et approuver les nouvelles demandes de membres',
      username: 'Nom d\'utilisateur',
      email: 'Email',
      approvals: 'Approbations',
      actions: 'Actions',
      approve: 'Approuver',
      ready: 'Prêt',
      council: 'Conseil',
    },
    elections: {
      title: 'Élections du conseil',
      subtitle: 'Participer aux élections démocratiques',
      activeElections: 'Élections actives',
      closedElections: 'Élections fermées',
      noElections: 'Aucune élection disponible',
      candidates: 'Candidats',
      votes: 'Votes',
      registerCandidate: 'S\'inscrire comme candidat',
      candidateName: 'Nom du candidat',
      candidateNamePlaceholder: 'Entrez votre nom de candidat',
      register: 'S\'inscrire',
      registering: 'Inscription...',
    },
    consensus: {
      title: 'Réunions de consensus',
      subtitle: 'Participer à la prise de décision collaborative',
      activeMeeting: 'Réunion active',
      currentPhase: 'Phase actuelle',
      participants: 'Participants',
      groups: 'Groupes',
      phase: 'Phase',
      signUp: 'Inscription',
      contribution: 'Contribution',
      ranking: 'Classement',
      finalized: 'Finalisé',
      membershipRequired: 'Adhésion requise',
      membershipRequiredDesc: 'Vous devez être un membre approuvé pour participer aux réunions de consensus',
      joinMeeting: 'Rejoindre la réunion',
      joinMeetingDesc: 'Inscrivez-vous pour participer à cette réunion de consensus',
      signUpButton: 'S\'inscrire',
      signingUp: 'Inscription...',
      signedUp: 'Inscrit',
      signedUpDesc: 'Vous êtes inscrit à cette réunion',
      notParticipating: 'Ne participe pas',
      notParticipatingDesc: 'Vous n\'êtes pas inscrit à cette réunion',
      adminView: 'Vue administrateur',
      adminViewDesc: 'Gérer les phases de réunion et les participants',
      pastMeetings: 'Réunions passées',
      pastMeetingsDesc: 'Voir les résultats des réunions de consensus précédentes',
      viewResults: 'Voir les résultats',
      noMeetings: 'Aucune réunion',
      noMeetingsDesc: 'Aucune réunion de consensus n\'a encore été créée',
      nextPhase: 'Passer à la phase suivante',
      forceNextPhase: 'Forcer la phase suivante',
      submitContribution: 'Soumettre une contribution',
      submitting: 'Soumission...',
      contributionText: 'Texte de contribution',
      contributionPlaceholder: 'Décrivez votre contribution...',
      uploadFiles: 'Télécharger des fichiers',
      yourGroup: 'Votre groupe',
      groupContributions: 'Contributions du groupe',
      submitRanking: 'Soumettre le classement',
      rankMembers: 'Classer les membres',
      rankMembersDesc: 'Faites glisser pour réorganiser les membres par contribution',
      results: 'Résultats',
      consensusReached: 'Consensus atteint',
      consensusNotReached: 'Pas de consensus',
      repDistribution: 'Distribution REP',
      philDistribution: 'Distribution PHIL',
      yourRewards: 'Vos récompenses',
      phaseExpired: 'La limite de temps de la phase a expiré',
      phaseAdvanced: 'Phase avancée avec succès',
      phaseForced: 'Phase forcée avec succès',
      advanceToContribution: 'Passer à la phase de contribution',
      advanceToRanking: 'Passer à la phase de classement',
      finalizeMeeting: 'Finaliser la réunion',
      progress: 'Progrès',
      timeRemaining: 'Temps restant',
      status: 'Statut',
      enrolled: 'Inscrit',
      notEnrolled: 'Non inscrit',
      signUpForMeeting: 'S\'inscrire à cette réunion',
      advancing: 'Avancement...',
      forcing: 'Forçage...',
      contributionRequired: 'Contribution requise',
      unknownUser: 'Utilisateur inconnu',
      noGroupAssigned: 'Aucun groupe assigné',
      membersInGroup: 'membres dans votre groupe',
      shareContribution: 'Partagez votre contribution avec votre groupe',
      attachments: 'Pièces jointes',
      contributionSubmitted: 'Contribution soumise avec succès',
      viewGroupContributions: 'Voir les contributions du groupe',
      of: 'de',
      membersSubmitted: 'membres ont soumis',
      you: 'Vous',
      attachment: 'Pièce jointe',
      consensusReachedDesc: 'Le groupe a atteint un consensus sur les classements',
      finalizationComplete: 'Réunion finalisée',
      awaitingRankings: 'En attente des classements de tous les participants',
      totalREPDistributed: 'Total REP distribué',
      totalPHILDistributed: 'Total PHIL distribué',
      tokensAdded: 'Les jetons ont été ajoutés à votre solde',
      repEarned: 'REP gagné',
      philEarned: 'PHIL gagné',
      currentBalance: 'Solde actuel',
      noConsensusMessage: 'Aucun consensus n\'a été atteint dans ce groupe',
      consensusAchieved: 'Consensus atteint',
      consensusSuccessMessage: 'Votre groupe a atteint un consensus !',
      group: 'Groupe',
      members: 'Membres',
      rankingsSubmitted: 'Classements soumis',
      allParticipated: 'Tous les membres ont participé',
      noConsensus: 'Aucun consensus atteint',
      consensusRequirement3: '2 sur 3 doivent être d\'accord',
      consensusRequirement45: '3 sur 4-5 doivent être d\'accord',
      consensusRequirement6: '4 sur 6 doivent être d\'accord',
      consensusRequirementAll: 'Tous les membres doivent être d\'accord',
      groupConsensusSuccess: 'Consensus atteint',
      membersAndRewards: 'Membres et récompenses',
      noRanking: 'Aucun classement soumis',
      noRewards: 'Aucune récompense (pas de consensus)',
      membersSubmittedRankings: 'membres ont soumis des classements',
      allRankedNoConsensus: 'Tous les membres ont classé, mais aucun consensus n\'a été atteint',
      reviewContributions: 'Examinez les contributions des membres de votre groupe avant de classer',
      rankingOrder: 'Ordre de classement',
      rankingsSubmittedSuccess: 'Classements soumis avec succès',
      waitingForRankings: 'En attente que d\'autres membres soumettent leurs classements',
    },
    council: {
      title: 'Tableau de bord du conseil',
      subtitle: 'Gouvernance et surveillance',
      lastUpdate: 'Dernière mise à jour',
      notYetUpdated: 'Pas encore mis à jour',
      recalculateButton: 'Recalculer le conseil',
      recalculateSuccess: 'Conseil recalculé avec succès',
      recalculateError: 'Échec du recalcul du conseil',
      currentMembers: 'Membres actuels du conseil',
      currentMembersDesc: 'Top 5 des membres par moyenne REP sur 12 semaines',
      councilMember: 'Membre du conseil',
      weekAverage: 'Moyenne sur 12 semaines',
      multiSigActions: 'Actions multi-signatures',
      multiSigDesc: 'Proposer et approuver les actions du conseil',
      proposeAction: 'Proposer une action',
      proposeNewAction: 'Proposer une nouvelle action',
      proposeNewActionDesc: 'Créer une nouvelle action multi-signature pour l\'approbation du conseil',
      actionId: 'ID d\'action',
      actionIdPlaceholder: 'Entrez l\'ID d\'action',
      actionDetails: 'Détails de l\'action',
      actionDetailsPlaceholder: 'Décrivez l\'action...',
      submitProposal: 'Soumettre la proposition',
      actionIdAndDetailsRequired: 'L\'ID d\'action et les détails sont requis',
      actionCreatedSuccess: 'Action créée avec succès',
      actionCreatedError: 'Échec de la création de l\'action',
      actionApprovedSuccess: 'Action approuvée avec succès',
      actionApprovedError: 'Échec de l\'approbation de l\'action',
      pendingActions: 'Actions en attente',
      pendingActionsDesc: 'Actions en attente d\'approbation du conseil',
      noPendingActions: 'Aucune action en attente',
      pending: 'En attente',
      proposed: 'Proposé',
      approvals: 'Approbations',
      approve: 'Approuver',
      youApproved: 'Vous avez approuvé',
      approvedActions: 'Actions approuvées',
      approvedActionsDesc: 'Actions qui ont été exécutées',
      noApprovedActions: 'Aucune action approuvée',
      approved: 'Approuvé',
      completed: 'Terminé',
      membershipOversight: 'Surveillance des adhésions',
      membershipOversightDesc: 'Examiner et approuver les demandes d\'adhésion',
      treasuryManagement: 'Gestion de la trésorerie',
      treasuryManagementDesc: 'Gérer les fonds et les allocations de la communauté',
      tokenDistribution: 'Distribution des jetons',
      tokenDistributionDesc: 'Superviser la distribution des jetons REP et PHIL',
      proposalVoting: 'Vote sur les propositions',
      proposalVotingDesc: 'Voter sur les propositions et initiatives de la communauté',
      status: 'Statut',
      comingSoon: 'Bientôt disponible',
      placeholder: 'Cette fonctionnalité est en cours de développement',
      privilegesTitle: 'Privilèges du conseil',
      privilegeMultisig: 'Proposer et approuver des actions multi-signatures',
      privilegeVoting: 'Voter sur les propositions de la communauté',
      privilegeMembership: 'Approuver les demandes d\'adhésion',
      privilegeRecalculate: 'Recalculer l\'adhésion au conseil',
      errorLoading: 'Erreur lors du chargement des données du conseil',
      notAvailable: 'Données du conseil non disponibles',
    },
    admin: {
      title: 'Tableau de bord administrateur',
      general: 'Général',
      tokenomics: 'Tokenomics',
      ucaManagement: 'Gestion UCA',
      ucaDesc: 'Mettre à jour l\'accord de contributeur utilisateur',
      updateUCA: 'Mettre à jour l\'UCA',
      updating: 'Mise à jour...',
      membersManagement: 'Gestion des membres',
      membersDesc: 'Gérer les rôles et les autorisations des utilisateurs',
      promoteToAdmin: 'Promouvoir en administrateur',
      deleteUser: 'Supprimer l\'utilisateur',
      membershipRequests: 'Demandes d\'adhésion',
      membershipRequestsDesc: 'Examiner et approuver les demandes d\'adhésion',
      requester: 'Demandeur',
      accept: 'Accepter',
      reject: 'Rejeter',
      accepting: 'Acceptation...',
      rejecting: 'Rejet...',
      electionsManagement: 'Gestion des élections',
      electionsDesc: 'Créer et gérer les élections du conseil',
      createElection: 'Créer une élection',
      electionId: 'ID d\'élection',
      electionIdPlaceholder: 'Entrez l\'ID d\'élection',
      consensusManagement: 'Gestion du consensus',
      consensusDesc: 'Créer et gérer les réunions de consensus',
      createMeeting: 'Créer une réunion',
      meetingId: 'ID de réunion',
      meetingIdPlaceholder: 'Entrez l\'ID de réunion',
      tokenomicsConfig: 'Configuration des tokenomics',
      currentSupply: 'Offre actuelle',
      maxSupply: 'Offre maximale',
      treasuryBalances: 'Soldes de la trésorerie',
      rewardsTreasury: 'Trésorerie des récompenses',
      marketingTreasury: 'Trésorerie marketing',
      councilTreasury: 'Trésorerie du conseil',
      manualMint: 'Frappe manuelle',
      minting: 'Frappe...',
      mintTokens: 'Frapper des jetons',
      mintTokensSuccess: 'Jetons frappés avec succès',
      mintTokensError: 'Échec de la frappe des jetons',
    },
    announcements: {
      title: 'Annonces',
      subtitle: 'Mises à jour et nouvelles importantes',
      createButton: 'Créer une annonce',
      createTitle: 'Créer une annonce',
      createDesc: 'Partagez des mises à jour importantes avec la communauté',
      editTitle: 'Modifier l\'annonce',
      editDesc: 'Mettre à jour le contenu de l\'annonce',
      titleLabel: 'Titre',
      titlePlaceholder: 'Entrez le titre de l\'annonce',
      contentLabel: 'Contenu',
      contentPlaceholder: 'Entrez le contenu de l\'annonce',
      updateButton: 'Mettre à jour',
      noAnnouncements: 'Aucune annonce',
      noAnnouncementsDesc: 'Aucune annonce n\'a encore été publiée',
      updated: 'Mis à jour',
      titleRequired: 'Le titre est requis',
      contentRequired: 'Le contenu est requis',
      createSuccess: 'Annonce créée avec succès',
      createError: 'Échec de la création de l\'annonce',
      updateSuccess: 'Annonce mise à jour avec succès',
      updateError: 'Échec de la mise à jour de l\'annonce',
      errorLoading: 'Erreur lors du chargement des annonces',
    },
    blog: {
      title: 'Blog communautaire',
      subtitle: 'Partagez des idées et interagissez avec la communauté',
      createButton: 'Créer un article',
      createTitle: 'Créer un article de blog',
      createDesc: 'Partagez vos pensées avec la communauté',
      editTitle: 'Modifier l\'article de blog',
      editDesc: 'Mettre à jour votre article de blog',
      titleLabel: 'Titre',
      titlePlaceholder: 'Entrez le titre de l\'article',
      contentLabel: 'Contenu',
      contentPlaceholder: 'Écrivez votre article...',
      updateButton: 'Mettre à jour',
      noPosts: 'Aucun article',
      noPostsDesc: 'Aucun article de blog n\'a encore été publié',
      updated: 'Mis à jour',
      published: 'Publié',
      titleRequired: 'Le titre est requis',
      contentRequired: 'Le contenu est requis',
      createSuccess: 'Article créé avec succès',
      createError: 'Échec de la création de l\'article',
      updateSuccess: 'Article mis à jour avec succès',
      updateError: 'Échec de la mise à jour de l\'article',
      errorLoading: 'Erreur lors du chargement des articles',
      comments: 'Commentaires',
      noComments: 'Aucun commentaire pour le moment',
      addComment: 'Ajouter un commentaire',
      commentPlaceholder: 'Écrire un commentaire...',
      postComment: 'Publier le commentaire',
      posting: 'Publication...',
      reactions: 'Réactions',
      like: 'J\'aime',
      share: 'Partager',
      tip: 'Pourboire',
      sharePost: 'Partager l\'article',
      sharePostDesc: 'Copier le lien pour partager cet article',
      linkCopied: 'Lien copié dans le presse-papiers',
      linkCopyError: 'Échec de la copie du lien',
      tipAuthor: 'Donner un pourboire à l\'auteur',
      tipAuthorDesc: 'Envoyer des jetons PHIL à l\'auteur',
      tipAmount: 'Montant du pourboire',
      yourBalance: 'Votre solde',
      sendTip: 'Envoyer le pourboire',
      tipping: 'Envoi...',
      tipSuccess: 'Pourboire envoyé avec succès',
      tipError: 'Échec de l\'envoi du pourboire',
      tipAmountInvalid: 'Veuillez entrer un montant valide',
      insufficientBalance: 'Solde insuffisant',
      cannotTipOwnPost: 'Impossible de donner un pourboire à votre propre article',
    },
    documentation: {
      title: 'Documentation',
      subtitle: 'Découvrez les fonctionnalités de Phil3 et comment les utiliser',
      searchPlaceholder: 'Rechercher dans la documentation...',
      noResultsTitle: 'Aucun résultat trouvé',
      noResultsDesc: 'Essayez différents mots-clés ou parcourez les sections ci-dessous',
      knowledgeBase: 'Base de connaissances',
      knowledgeBaseDesc: 'Guides et documentation complets',
      needHelp: 'Besoin d\'aide ?',
      needHelpDesc: 'Contactez le support ou visitez notre forum communautaire',
    },
    notifications: {
      title: 'Notifications',
      noNotifications: 'Aucune notification',
      markAllRead: 'Tout marquer comme lu',
      newBlogPost: 'Nouvel article de blog',
      newAnnouncement: 'Nouvelle annonce',
      joinRequestSubmitted: 'Demande d\'adhésion soumise',
      membershipApproved: 'Adhésion approuvée',
      newProposal: 'Nouvelle proposition',
      proposalAccepted: 'Proposition acceptée',
      proposalRejected: 'Proposition rejetée',
    },
    proposals: {
      title: 'Propositions',
      subtitle: 'Propositions et votes de la communauté',
      createButton: 'Créer une proposition',
      createTitle: 'Créer une proposition',
      createDesc: 'Soumettre une proposition pour examen par la communauté',
      titleLabel: 'Titre',
      titlePlaceholder: 'Entrez le titre de la proposition',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Décrivez votre proposition...',
      submitButton: 'Soumettre la proposition',
      noProposals: 'Aucune proposition',
      noProposalsDesc: 'Aucune proposition n\'a encore été soumise',
      statusPending: 'En attente',
      statusAccepted: 'Accepté',
      statusRejected: 'Rejeté',
      author: 'Auteur',
      submitted: 'Soumis',
      completed: 'Terminé',
      approvals: 'Approbations',
      approveButton: 'Approuver',
      rejectButton: 'Rejeter',
      youApproved: 'Vous avez approuvé',
      youRejected: 'Vous avez rejeté',
      activeMemberRequired: 'Membre actif requis',
      accessDenied: 'Seuls les membres actifs peuvent voir et créer des propositions',
      titleAndDescriptionRequired: 'Le titre et la description sont requis',
      createSuccess: 'Proposition créée avec succès',
      createError: 'Échec de la création de la proposition',
      approveSuccess: 'Proposition approuvée',
      approveError: 'Échec de l\'approbation de la proposition',
      rejectSuccess: 'Proposition rejetée',
      rejectError: 'Échec du rejet de la proposition',
      errorLoading: 'Erreur lors du chargement des propositions',
      infoTitle: 'Comment fonctionnent les propositions',
      infoCreate: 'Les membres actifs peuvent créer des propositions',
      infoApprove: 'Les membres du conseil et les administrateurs peuvent voter',
      infoMultisig: '3 approbations ou rejets nécessaires',
      infoNotifications: 'Les auteurs reçoivent des notifications sur les décisions',
    },
    wallet: {
      title: 'Portefeuille',
      subtitle: 'Gérez vos jetons et transactions',
      balanceOverview: 'Aperçu du solde',
      balanceDesc: 'Vos soldes de jetons actuels',
      send: 'Envoyer',
      receive: 'Recevoir',
      transactionHistory: 'Historique des transactions',
      transactionHistoryDesc: 'Voir vos transactions récentes',
      noTransactions: 'Aucune transaction pour le moment',
      type: 'Type',
      token: 'Jeton',
      amount: 'Montant',
      status: 'Statut',
      time: 'Heure',
      sent: 'Envoyé',
      received: 'Reçu',
      statusCompleted: 'Terminé',
      statusPending: 'En attente',
      statusFailed: 'Échoué',
      sendTokens: 'Envoyer des jetons',
      sendTokensDesc: 'Transférer des jetons à une autre adresse',
      selectToken: 'Sélectionner un jeton',
      recipientAddress: 'Adresse du destinataire',
      recipientPlaceholder: 'Entrez l\'adresse du destinataire',
      balance: 'Solde',
      continue: 'Continuer',
      confirmTransaction: 'Confirmer la transaction',
      confirmTransactionDesc: 'Examiner et confirmer votre transaction',
      recipient: 'Destinataire',
      fee: 'Frais',
      confirmSend: 'Confirmer l\'envoi',
      receiveTokens: 'Recevoir des jetons',
      receiveTokensDesc: 'Partagez votre adresse pour recevoir des jetons',
      yourAddress: 'Votre adresse',
      shareAddress: 'Partager l\'adresse',
      addressCopied: 'Adresse copiée dans le presse-papiers',
      addressCopyError: 'Échec de la copie de l\'adresse',
      fillAllFields: 'Veuillez remplir tous les champs',
      invalidAmount: 'Veuillez entrer un montant valide',
      sendSuccess: 'Transaction envoyée avec succès',
      sendError: 'Échec de l\'envoi de la transaction',
    },
    tokenomics: {
      nextMintTitle: 'Prochaine frappe de jetons',
      nextMintDesc: 'Le prochain cycle de frappe commencera le',
      dateAndTime: 'Date et heure',
      mintingStartsOn: 'La frappe commence le',
    },
    uca: {
      title: 'Accord de contributeur utilisateur',
      description: 'Veuillez lire et accepter l\'accord de contributeur utilisateur pour continuer',
      loadingAgreement: 'Chargement de l\'accord...',
      acceptCheckbox: 'J\'ai lu et j\'accepte l\'accord de contributeur utilisateur',
      acceptCheckboxDesc: 'Vous devez accepter l\'accord pour continuer',
      acceptButton: 'Accepter l\'accord',
      accepting: 'Acceptation...',
      pleaseConfirm: 'Veuillez confirmer que vous avez lu et acceptez l\'accord',
      acceptSuccess: 'Accord accepté avec succès',
      acceptError: 'Échec de l\'acceptation de l\'accord',
    },
    editProfile: {
      title: 'Modifier le profil',
      username: 'Nom d\'utilisateur',
      profilePicture: 'Photo de profil',
      uploadNew: 'Télécharger une nouvelle',
      saveChanges: 'Enregistrer les modifications',
      saving: 'Enregistrement...',
    },
    toast: {
      joinRequestSuccess: 'Demande d\'adhésion soumise avec succès',
      joinRequestError: 'Échec de la soumission de la demande d\'adhésion',
      leaveCommunitySuccess: 'Vous avez quitté la communauté',
      leaveCommunityError: 'Échec de la sortie de la communauté',
      profileUpdateSuccess: 'Profil mis à jour avec succès',
      profileUpdateError: 'Échec de la mise à jour du profil',
      signUpSuccess: 'Inscription à la réunion réussie',
      signUpError: 'Échec de l\'inscription à la réunion',
      approveSuccess: 'Approuvé avec succès',
      approveError: 'Échec de l\'approbation',
      contributionSuccess: 'Contribution soumise avec succès',
      contributionError: 'Échec de la soumission de la contribution',
      rankingSuccess: 'Classement soumis avec succès',
      rankingError: 'Échec de la soumission du classement',
      actionCreated: 'Action créée avec succès',
      actionApproved: 'Action approuvée avec succès',
      genericError: 'Une erreur s\'est produite',
      commentSuccess: 'Commentaire publié avec succès',
      commentError: 'Échec de la publication du commentaire',
    },
  },
};
