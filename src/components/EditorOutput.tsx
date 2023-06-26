"use client";
import dynamic from "next/dynamic";
import React, { FC } from "react";
import Image from "next/image";
import { Link } from "lucide-react";

interface EditorOutputProps {
  content: any;
  sitename: string;
}

const EditorOutput: FC<EditorOutputProps> = ({ content, sitename }) => {
  if (sitename === "Kick") {
    return (
      <div className="mt-6">
        <a
          href={content}
          target="_blank"
          rel="noopener noreferrer"
          className="underline flex items-center text-sm text-blue-800"
        >
          {content} <Link className="ml-1 h-4 w-4" />
        </a>
      </div>
    );
  }
  return (
    <div className="h-fit">
      <iframe
        src={content}
        height="600"
        width="100%"
        frameBorder="0"
        scrolling="no"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
};

export default EditorOutput;
