"use client"
import dynamic from 'next/dynamic'
import React, { FC } from 'react'
import Image from 'next/image'

interface EditorOutputProps{
    content: any
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <iframe
      src={content}
      height="100%"
      width="100%"
      frameBorder="0"
      scrolling="no"
      allowFullScreen={true}
    ></iframe>
  );
}

export default EditorOutput