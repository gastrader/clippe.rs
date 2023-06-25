"use client";

import { Prisma, Community } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Users } from "lucide-react";
import { Badge } from "./ui/Badge";
import { toast } from "@/hooks/use-toast";

interface SearchBarProps {
  setSelectedCommunities: Function;
  selectedCommunities: Array<{ name: string; id: string }>;
}

const SearchBar: FC<SearchBarProps> = ({selectedCommunities, setSelectedCommunities}) => {
  const [input, setInput] = useState<string>("");

  const commandRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
const [selectedCommunity, setSelectedCommunity] = useState<Array<Community>>(
  []
);
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

  const {
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Community)[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  useEffect(() => {
    setInput("");
  }, []);

  return (
    <>
      <Command
        ref={commandRef}
        className="relative rounded-lg border max-w-lg  overflow-visible"
      >
        <CommandInput
          onValueChange={(text) => {
            setInput(text);
            debounceRequest();
          }}
          value={input}
          className="outline-none border-none focus:border-none focus:outline-none ring-0"
          placeholder="Search communities..."
        />

        {input.length > 0 && (
          <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
            {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
            {(queryResults?.length ?? 0) > 0 ? (
              <CommandGroup heading="Communities">
                {queryResults?.map((community) => (
                  <CommandItem
                    onSelect={(e) => {
                      const selected = queryResults?.find(
                        (community) => community.name === e
                      );

                      if (selected) {
                        if (
                          selectedCommunities.find(
                            (community) => community.id === selected.id
                          )
                        ) {
                          // Community already selected, show error toast
                          toast({
                            title:
                              "That community is already part of your list..",
                            description: "Please select a new community.",
                            variant: "destructive",
                          });
                        } else {
                          // Add the community to the list
                          setSelectedCommunities((prev: any) => [...prev, selected]);
                        }
                        setInput("");
                      }
                    }}
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
        {selectedCommunities.length > 0 && (
          <div className="flex gap-2 w-fit flex-row flex-wrap">
            {selectedCommunities.map((community) => (
              <div key={community.id}>
                <Badge>{community.name}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
