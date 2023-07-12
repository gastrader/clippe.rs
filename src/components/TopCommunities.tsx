'use client'
import { Separator } from '../components/ui/Separator';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Users2 } from 'lucide-react';
import React from 'react'
import { Skeleton } from './ui/Skeleton';
import Link from 'next/link';

type CommunitySubs = {
  id: string;
  name: string;
  subscribers: number;
};

const TopCommunities = () => {
  const { isLoading, data } = useQuery(["topCommunities"], async () => {
    const { data } = await axios.get("/api/community/size");
    
    return data;
  },
    {
        staleTime: 1000*60*60,
        refetchOnWindowFocus: false,
    }
  ) ;

  if (isLoading) return (
  <div className="overflow-hidden h-fit rounded-lg border border-gray-200 mt-4">
    <div className="bg-orange-100 px-6 py-4">
      <p className="font-semibold py-3 flex items-center gap-1.5">
        <Users2 className="w-4 h-4"></Users2> Top Communities
      </p>
    </div>
    <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
      <div className="flex justify-between gap-y-2 py-3 flex-col">
        <p className="text-zinc-500">
          Enjoy the largest communities we have to offer.
        </p>
        <Separator orientation="horizontal" className="my-2" />
        <Skeleton className="h-[20px] w-[150px] rounded-lg" />
        <Skeleton className="h-[24px] w-[150px] rounded-sm" />
        <Skeleton className="h-[24px] w-[150px] rounded-sm" />
      </div>
    </div>
  </div>)
  return (
    <div className="overflow-hidden h-fit rounded-lg border border-gray-200 ">
      <div className="bg-orange-100 px-6 py-4">
        <p className="font-semibold py-3 flex items-center gap-1.5">
          <Users2 className="w-4 h-4"></Users2> Top Communities
        </p>
      </div>
      <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3 flex-col">
          <p className="text-zinc-500">
            Enjoy the largest communities we have to offer.
          </p>
          <Separator orientation="horizontal" className="my-2" />
          {data.map((community: CommunitySubs, index: number) => (
            <Link key={index} href={`/c/${community.name}`}>
              <div
                key={index}
                className="flex items-center bg-gray-100 rounded-md w-fit px-2 my-1 shadow gap-1"
              >
                <span className="font-medium"> {index + 1} - </span>
                <span className="font-medium hover:underline">
                  c/{community.name}:{" "}
                </span>
                <span>{community.subscribers} members</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCommunities;