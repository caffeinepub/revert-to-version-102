import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";

module {
  public type Announcement = {
    id : Text;
    title : Text;
    content : Text;
    author : Principal;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  public type AnnouncementState = {
    announcements : Map.Map<Text, Announcement>;
  };

  public func initState() : AnnouncementState {
    { announcements = Map.empty<Text, Announcement>() };
  };

  public func createAnnouncement(
    state : AnnouncementState,
    caller : Principal,
    accessControlState : AccessControl.AccessControlState,
    title : Text,
    content : Text,
  ) : Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create announcements");
    };

    let id = title # (Time.now().toText());
    let announcement : Announcement = {
      id;
      title;
      content;
      author = caller;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    state.announcements.add(id, announcement);
    id;
  };

  public func editAnnouncement(
    state : AnnouncementState,
    caller : Principal,
    accessControlState : AccessControl.AccessControlState,
    id : Text,
    newTitle : Text,
    newContent : Text,
  ) {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can edit announcements");
    };

    switch (state.announcements.get(id)) {
      case (null) { Runtime.trap("Announcement not found") };
      case (?existing) {
        let updatedAnnouncement : Announcement = {
          id;
          title = newTitle;
          content = newContent;
          author = existing.author;
          createdAt = existing.createdAt;
          updatedAt = Time.now();
        };
        state.announcements.add(id, updatedAnnouncement);
      };
    };
  };

  public func getAnnouncement(state : AnnouncementState, id : Text) : ?Announcement {
    state.announcements.get(id);
  };

  public func getAllAnnouncements(state : AnnouncementState) : [Announcement] {
    state.announcements.values().toArray();
  };
};
