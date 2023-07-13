// "use client";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/DropdownMenu";
// import { Bell } from "lucide-react";
// import { Button } from "../ui/Button";
// import { useMutation } from "@tanstack/react-query";
// import { useState } from "react";
// import axios from "axios";
// import { Notification } from "../../types/notifications";
// import Link from "next/link";

// type NotificationsPopoverProps = {
//   initialNotifications: Notification[];
// };

// export const NotificationsPopover = ({
//   initialNotifications,
// }: NotificationsPopoverProps) => {
//   const [notifications, setNotifications] = useState(initialNotifications);

//   const { isLoading, mutateAsync } = useMutation(async () => {
//     await axios.post("/api/notifications/clear");

//     setNotifications([]);
//   });

//   const notifs = notifications || initialNotifications || [];
//   const hasNotifs = notifs.length > 0;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger>
//         <div className="relative">
//           <Bell className="h-8 w-8" />
//           {hasNotifs && (
//             <div className="absolute top-[-10px] right-[-10px] bg-red-500 rounded px-1 text-white">
//               {notifs.length}
//             </div>
//           )}
//         </div>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent className="bg-white p-2" align="end">
//         {hasNotifs ? (
//           <>
//             <Button
//               variant="link"
//               isLoading={isLoading}
//               onClick={async () => await mutateAsync()}
//             >
//               Clear notifications
//             </Button>
//             <DropdownMenuSeparator />
//           </>
//         ) : (
//           <span>No notifications</span>
//         )}
//         <div className="flex flex-col items-center justify-start gap-2 p-2">
//           {notifs.map((notif) => (
//             <DropdownMenuItem asChild key={notif.id}>
//               {notif.type === "COMMENT_REPLY" && (
//                 <Link
//                   href={`/c/${notif.payload.communityName}/post/${notif.payload.postId}#${notif.payload.commentReplyId}`}
//                 >
//                   <div className="flex flex-col space-y-1 leading-none">
//                     New reply to your comment in {notif.payload.communityName}
//                   </div>
//                 </Link>
//               )}
//             </DropdownMenuItem>
//           ))}
//         </div>
//         {/* <DropdownMenuSeparator /> */}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };
