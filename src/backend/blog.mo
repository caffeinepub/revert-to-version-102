import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

module {
  public type BlogPost = {
    id : Text;
    title : Text;
    content : Text; // Rich text with media links
    author : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    published : Bool;
  };

  public type Comment = {
    id : Text;
    postId : Text;
    author : Principal;
    content : Text;
    createdAt : Time.Time;
  };

  public type Reaction = {
    postId : Text;
    author : Principal;
    reactionType : {
      #like;
    };
    createdAt : Time.Time;
  };

  public type Tip = {
    id : Text;
    postId : Text;
    tipper : Principal;
    recipient : Principal;
    amount : Nat;
    createdAt : Time.Time;
  };

  public type BlogState = {
    posts : Map.Map<Text, BlogPost>;
    comments : Map.Map<Text, Comment>;
    reactions : Map.Map<Text, Reaction>;
    tips : Map.Map<Text, Tip>;
  };

  public func initState() : BlogState {
    {
      posts = Map.empty<Text, BlogPost>();
      comments = Map.empty<Text, Comment>();
      reactions = Map.empty<Text, Reaction>();
      tips = Map.empty<Text, Tip>();
    };
  };

  public func createPost(
    state : BlogState,
    author : Principal,
    title : Text,
    content : Text
  ) : Text {
    if (title.isEmpty()) { Runtime.trap("Title cannot be empty") };
    if (content.isEmpty()) {
      Runtime.trap("Content cannot be empty");
    };

    let id = title # (Time.now().toText());

    let post : BlogPost = {
      id;
      title;
      content;
      author;
      createdAt = Time.now();
      updatedAt = Time.now();
      published = true;
    };

    state.posts.add(id, post);

    id;
  };

  public func editPost(
    state : BlogState,
    caller : Principal,
    isAdmin : Bool,
    id : Text,
    newTitle : Text,
    newContent : Text
  ) {
    if (newTitle.isEmpty()) {
      Runtime.trap("Title cannot be empty");
    };
    if (newContent.isEmpty()) {
      Runtime.trap("Content cannot be empty");
    };

    let currentPost = switch (state.posts.get(id)) {
      case (null) {
        Runtime.trap("Post not found");
      };
      case (?post) { post };
    };

    // Authorization: Only the author or an admin can edit the post
    if (currentPost.author != caller and not isAdmin) {
      Runtime.trap("Unauthorized: Only the post author or admins can edit this post");
    };

    let updatedPost : BlogPost = {
      id;
      title = newTitle;
      content = newContent;
      author = currentPost.author;
      createdAt = currentPost.createdAt;
      updatedAt = Time.now();
      published = currentPost.published;
    };

    state.posts.add(id, updatedPost);
  };

  public func deletePost(
    state : BlogState,
    caller : Principal,
    isAdmin : Bool,
    id : Text
  ) {
    let currentPost = switch (state.posts.get(id)) {
      case (null) {
        Runtime.trap("Post not found");
      };
      case (?post) { post };
    };

    // Authorization: Only the author or an admin can delete the post
    if (currentPost.author != caller and not isAdmin) {
      Runtime.trap("Unauthorized: Only the post author or admins can delete this post");
    };

    // Remove the post
    state.posts.remove(id);

    // Remove all comments associated with this post
    let allComments = state.comments.entries().toArray();
    for ((commentId, comment) in allComments.values()) {
      if (comment.postId == id) {
        state.comments.remove(commentId);
      };
    };

    // Remove all reactions associated with this post
    let allReactions = state.reactions.entries().toArray();
    for ((reactionKey, reaction) in allReactions.values()) {
      if (reaction.postId == id) {
        state.reactions.remove(reactionKey);
      };
    };

    // Remove all tips associated with this post
    let allTips = state.tips.entries().toArray();
    for ((tipId, tip) in allTips.values()) {
      if (tip.postId == id) {
        state.tips.remove(tipId);
      };
    };
  };

  public func getPost(state : BlogState, id : Text) : ?BlogPost {
    switch (state.posts.get(id)) {
      case (null) { null };
      case (?post) { ?post };
    };
  };

  public func getAllPosts(state : BlogState) : [BlogPost] {
    state.posts.values().toArray();
  };

  public func createComment(
    state : BlogState,
    author : Principal,
    postId : Text,
    content : Text
  ) : Text {
    if (content.isEmpty()) {
      Runtime.trap("Cannot create empty comment");
    };

    // Verify post exists
    switch (state.posts.get(postId)) {
      case (null) {
        Runtime.trap("Post not found");
      };
      case (?_) {};
    };

    let blogComment : Comment = {
      id = postId # (content # (Time.now().toText()));
      postId;
      author;
      content;
      createdAt = Time.now();
    };
    state.comments.add(blogComment.id, blogComment);
    blogComment.id;
  };

  public func getCommentsByPost(state : BlogState, postId : Text) : [Comment] {
    let allComments = state.comments.values().toArray();
    allComments.filter(func(comment) { comment.postId == postId });
  };

  public func addReaction(
    state : BlogState,
    author : Principal,
    postId : Text
  ) {
    // Verify post exists
    switch (state.posts.get(postId)) {
      case (null) {
        Runtime.trap("Post not found");
      };
      case (?_) {};
    };

    let existingReaction = state.reactions.get(author.toText() # postId);
    switch (existingReaction) {
      case (null) {
        let blogReaction : Reaction = {
          postId;
          author;
          createdAt = Time.now();
          reactionType = #like;
        };
        state.reactions.add(author.toText() # postId, blogReaction);
      };
      case (?_) {
        // Remove reaction (toggle)
        state.reactions.remove(author.toText() # postId);
      };
    };
  };

  public func getReactionCount(state : BlogState, postId : Text) : Nat {
    let allReactions = state.reactions.values().toArray();
    let filteredReactions = allReactions.filter(
      func(reaction) { reaction.postId == postId }
    );
    filteredReactions.size();
  };

  public func hasUserReacted(state : BlogState, postId : Text, user : Principal) : Bool {
    switch (state.reactions.get(user.toText() # postId)) {
      case (null) { false };
      case (?_) { true };
    };
  };

  public func recordTip(
    state : BlogState,
    postId : Text,
    tipper : Principal,
    recipient : Principal,
    amount : Nat
  ) : Text {
    // Verify post exists
    switch (state.posts.get(postId)) {
      case (null) {
        Runtime.trap("Post not found");
      };
      case (?_) {};
    };

    let tipId = postId # tipper.toText() # (Time.now().toText());
    let tip : Tip = {
      id = tipId;
      postId;
      tipper;
      recipient;
      amount;
      createdAt = Time.now();
    };

    state.tips.add(tipId, tip);
    tipId;
  };

  public func getTipsByPost(state : BlogState, postId : Text) : [Tip] {
    let allTips = state.tips.values().toArray();
    allTips.filter(func(tip) { tip.postId == postId });
  };

  public func getTotalTipsForPost(state : BlogState, postId : Text) : Nat {
    let tips = getTipsByPost(state, postId);
    var total = 0;
    for (tip in tips.values()) {
      total += tip.amount;
    };
    total;
  };

  public func getPostAuthor(state : BlogState, postId : Text) : ?Principal {
    switch (state.posts.get(postId)) {
      case (null) { null };
      case (?post) { ?post.author };
    };
  };
};
