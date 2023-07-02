"use client";

import { Community } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { useCallback, useRef, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Users, XIcon } from "lucide-react";
import { Badge } from "./ui/Badge";
import { toast } from "@/hooks/use-toast";
import { useFieldArray } from "react-hook-form";

export const FeedCreateSearchBar = () => {
  const { fields, append, remove } = useFieldArray<{
    communities: { name: string; id: string }[];
  }>({
    name: "communities",
  });

  const [input, setInput] = useState<string>("");

  const commandRef = useRef<HTMLDivElement>(null);

  const {
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as Community[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  useOnClickOutside(commandRef, () => {
    setInput("");
  });

  const request = debounce(async () => {
    refetch();
  }, 300);

  const debounceRequest = useCallback(() => {
    request();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCommunitySelect = (e: string) => {
    const selected = queryResults?.find((community) => community.name === e);

    if (selected) {
      if (fields.find((community) => community.id === selected.id)) {
        // Community already selected, show error toast
        toast({
          title: "That community is already part of your list..",
          description: "Please select a new community.",
          variant: "destructive",
        });
      } else {
        // Add the community to the list
        append(selected);
      }
      setInput("");
    }
  };

  const handleCommunityRemove = (idx: number) => {
    remove(idx);
  };

  return (
    <>
      <Command
        ref={commandRef}
        className="relative rounded-lg border max-w-lg overflow-visible"
      >
        <CommandInput
          onValueChange={(text) => {
            setInput(text);
            debounceRequest();
          }}
          value={input}
          className="outline-none border-none focus:border-none focus:outline-none ring-0"
          placeholder="Search communities to add..."
        />

        {input.length > 0 && (
          <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
            {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
            {(queryResults?.length ?? 0) > 0 ? (
              <CommandGroup heading="Communities">
                {queryResults?.map((community) => (
                  <CommandItem
                    onSelect={handleCommunitySelect}
                    key={community.id}
                    value={community.name}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    <a>c/{community.name}</a>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        )}
      </Command>
      <div>
        {fields.length > 0 && (
          <div className="flex gap-2 w-fit flex-row flex-wrap">
            {fields.map((field, idx) => (
              <Badge
                onClick={() => handleCommunityRemove(idx)}
                key={field.id}
                className="cursor-pointer flex gap-1 justify-center items-center"
              >
                <span className="text-sm">{field.name}</span>{" "}
                <XIcon size={16} />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
