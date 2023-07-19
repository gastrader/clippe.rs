/* eslint-disable no-console */
"use client";
import { Input } from "@/components/ui/Input";
import { FeedCreateSearchBar } from "./FeedCreateSearchBar";
import { Button } from "./ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FeedValidatorPayload } from "@/lib/validators/feed";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { useState } from "react";
import CloseModal from "./CloseModal";

type FeedCreateForm = {
  feedName: string;
  communities: { name: string; id: string }[];
};

const FeedCreate = () => {
  const router = useRouter();
  const form = useForm<FeedCreateForm>({
    defaultValues: {
      feedName: "",
      communities: [],
    },
  });

  const { loginToast } = useCustomToast();
  const [isModalOpen, setIsModalOpen] = useState(true);
const queryClient = useQueryClient();
  const { mutateAsync: createFeed, isLoading } = useMutation({
    mutationFn: async (formData: FeedCreateForm) => {
      const payload: FeedValidatorPayload = {
        feedName: formData.feedName,
        communities: formData.communities,
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
      queryClient.invalidateQueries();
       setIsModalOpen(false); // Close the modal
       router.push(`/f/${data}`);
      
      toast({
        title: "Success!",
        description: "Your feed has been created",
        variant: "default",
      })
    },
  });

  const onSubmit = async (data: FeedCreateForm) => {
    console.log(data);
    await createFeed(data);
    // event.preventDefault();
    // console.log("Feed name:", feedName);
    // console.log("Selected communities:", selectedCommunities);
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-900/20 z-10 flex items-center justify-center">
          <div className="container max-w-lg mx-auto">
            <div className="relative bg-white w-full py-20 px-2 rounded-lg">
              <div className="absolute top-4 right-4">
                <CloseModal />
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <FormField
                    control={form.control}
                    name="feedName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feed name</FormLabel>
                        <FormControl>
                          <Input placeholder="My favourites" {...field} />
                        </FormControl>
                        <FormDescription>
                          Something that describes the included communities.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FeedCreateSearchBar />
                  <Button type="submit" isLoading={isLoading}>
                    Create feed
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default FeedCreate;
