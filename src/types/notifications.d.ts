export type NotificationType = "COMMENT_REPLY";

export type Notification = {
  type: NotificationType;
  id: string;
  payload: {
    postId: string;
    communityName: string;
    commentReplyId: string;
  };
};
