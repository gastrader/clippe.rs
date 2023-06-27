"use client";

import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs";
import { Rocket, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/Skeleton";
import { FC, forwardRef, useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/Navigation-Menu"
import { cn } from "@/lib/utils";


export const FeedSelector = () => {
  const { slug, filter = "new" } = useParams();
  const router = useRouter();
  const handleTabClick = (route: string) => {
    router.replace(route);
  };

  const { data: feeds = [], isLoading } = useQuery({
    queryFn: async () => {
      const res = await axios.get("/api/feed/query");
      return res.data;
    },
  });

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="w-[180px]">Your Feeds</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 md:grid-cols-2 ">
              {feeds?.map((feedName: string, index:number) => (
                <ListItem
                  key={index}
                  title={feedName}
                  href={`/feed/${feedName}`}
                >
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>)
};

export default FeedSelector;

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"