"use client"
import { FC } from "react";
import { Trash } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { useSession } from "next-auth/react";

interface DeleteButtonProps {
  postId: string;
  postAuthor: string
}

const DeleteButton: FC<DeleteButtonProps> = ({ postId, postAuthor }) => {

  const router = useRouter()
  const { data: session } = useSession();
  const { mutate: deletePost } = useMutation({
    mutationFn: async () => {
      
      const res = await axios.delete(`/api/posts/delete/${postId}`);
    },
    onError: () => {
      toast({
        title: "There was an error.",
        description: "Could not delete post.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.back()
      toast({
        title: "POST DELETED",
        description: "This post was deleted.",
        variant: "default",
      });
    },
  });
const author = session?.user.id
  return (
    <div>
      {author === postAuthor && (
        <div>
          <button onClick={() => deletePost()} className="ml-2">
            <Trash className="w-4 h-4 text-red-500" />{" "}
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteButton;
