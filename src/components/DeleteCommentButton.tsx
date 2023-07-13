"use client"
import { FC } from "react";
import { Trash } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface DeleteCommentButtonProps {
  commentId: string;
  commentAuthorId: string,
}

const DeleteCommentButton: FC<DeleteCommentButtonProps> = ({ commentId, commentAuthorId }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const { mutate: deleteComment, isLoading } = useMutation({
    mutationFn: async () => {
      
      const res = await axios.delete(`/api/comments/delete/${commentId}`);
    },
    onError: () => {
      toast({
        title: "There was an error.",
        description: "Could not delete comment.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      router.refresh()
      toast({
        title: "COMMENT DELETED",
        description: "This comment was deleted.",
        variant: "default",
      });
    },
  });
  const commentAuthor = session?.user.id
  return (
    <div>
      {commentAuthor === commentAuthorId && (
        <div>
          <button onClick={() => deleteComment()} className="ml-2">
            <Trash className="w-4 h-4 text-red-500" />{" "}
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteCommentButton;
