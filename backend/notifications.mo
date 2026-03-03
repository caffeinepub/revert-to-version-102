import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

module {
  public type Notification = {
    id : Text;
    recipient : Principal;
    title : Text;
    message : Text;
    timestamp : Time.Time;
    read : Bool;
  };

  public type NotificationsState = {
    notifications : Map.Map<Text, Notification>;
  };

  public func initState() : NotificationsState {
    { notifications = Map.empty<Text, Notification>() };
  };

  // Internal function - should only be called by backend system functions
  public func createNotification(
    state : NotificationsState,
    recipient : Principal,
    title : Text,
    message : Text
  ) : () {
    if (title.isEmpty()) {
      Runtime.trap("Notification title cannot be empty");
    };
    if (message.isEmpty()) {
      Runtime.trap("Notification message cannot be empty");
    };

    let id = message # (Time.now().toText());
    let notification : Notification = {
      id;
      recipient;
      title;
      message;
      timestamp = Time.now();
      read = false;
    };
    state.notifications.add(id, notification);
  };

  public func markAsRead(state : NotificationsState, caller : Principal, notificationId : Text) : () {
    switch (state.notifications.get(notificationId)) {
      case (null) { Runtime.trap("Notification not found") };
      case (?notification) {
        if (notification.recipient != caller) {
          Runtime.trap("Unauthorized: Only the recipient can mark notifications as read");
        };
        let updatedNotification : Notification = {
          id = notification.id;
          recipient = notification.recipient;
          title = notification.title;
          message = notification.message;
          timestamp = notification.timestamp;
          read = true;
        };
        state.notifications.add(notificationId, updatedNotification);
      };
    };
  };

  public func getUnreadNotifications(state : NotificationsState, recipient : Principal) : [Notification] {
    state.notifications.toArray().filter(
      func((_, notification)) {
        notification.recipient == recipient and not notification.read
      }
    ).map(func((_, notification)) : Notification { notification });
  };

  public func getAllNotificationsForUser(state : NotificationsState, recipient : Principal) : [Notification] {
    state.notifications.toArray().filter(
      func((_, notification)) { notification.recipient == recipient }
    ).map(func((_, notification)) : Notification { notification });
  };
};
