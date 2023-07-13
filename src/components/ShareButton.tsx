"use client";
import { Link } from "lucide-react";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";

interface ShareButtonProps {
  post_id: string;
  community_name: string;
}

const ShareButton : React.FC<ShareButtonProps>= ({post_id, community_name}) => {
  const [copySuccess, setCopySuccess] = useState("");


  const handleCopy = async () => {
    try {
      const url = `clippe.rs/c/${community_name}/post/${post_id}`
      await navigator.clipboard.writeText(url);
      setCopySuccess("Copied!"); // Display 'Copied!' on successful copy

      // Revert back to initial state after 3 seconds
      setTimeout(() => {
        setCopySuccess("");
      }, 3000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };
  return (
    <button
      className="flex gap-2 hover:bg-gray-200 p-2 rounded-lg"
      onClick={() => handleCopy()}
    >
      <Link className="h-4 w-4" />
      {copySuccess || "Share"}
    </button>
  );
};

export default ShareButton;
