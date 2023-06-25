/* eslint-disable no-console */
"use client";
import { Icons } from "@/components/Icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import FeedCreateSearchBar from "./FeedCreateSearchBar";
import { useState } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { FeedValidatorPayload } from "@/lib/validators/feed";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

const FeedCreate = () => {
  const router = useRouter();
  const [selectedCommunities, setSelectedCommunities] = useState<
    Array<{ name: string; id: string }>
  >([]);
  const [feedName, setFeedName] = useState("");
  const { loginToast } = useCustomToast();
  const { mutate: createFeed, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: FeedValidatorPayload = {
        feedName,
        communities: selectedCommunities,
      };
      const { data } = await axios.post("/api/feed/create", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Feed already exists.",
            description: "Please choose a different name.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 422) {
          return toast({
            title: "Invalid feed name.",
            description: "Please choose a different feed name.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "There was an error.",
        description: "Could not create feed.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      
      router.push("/");
    },
  });
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    
    console.log("Feed name:", feedName);
    console.log("Selected communities:", selectedCommunities);
  };

  return (
    <Card className="w-[350px]">
      <Icons.logo className="mx-auto h-6 w-6 mt-4" />
      <CardHeader className="mx-auto">
        <CardTitle>Create a custom feed.</CardTitle>
        <CardDescription>
          Add any communities you are subscribed with to your custom feed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="create-feed-form" onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Feed</Label>
              <Input
                id="name"
                placeholder="Name of your feed"
                value={feedName}
                onChange={(e) => setFeedName(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Find Communities</Label>
              {/* @ts-ignore */}
              <FeedCreateSearchBar
                setSelectedCommunities={setSelectedCommunities}
                selectedCommunities={selectedCommunities}
              />
            </div>
          </div>
        </form>
        <Button
          isLoading={isLoading}
          type="submit"
          className="w-full mt-6"
          form="create-feed-form"
          variant={"outline"}
          onClick={() => createFeed()}
        >
          Create a new feed
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeedCreate;
