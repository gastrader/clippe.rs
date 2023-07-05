"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "@/hooks/use-toast";
import { Combobox } from "./ComboBox";
import { PostCreationRequest } from "@/lib/validators/post";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";

const urlValidator = (url: string) => {
  const regex =
    /^(https?:\/\/)?((www\.)?(youtube\.com\/clip|youtube\.com|youtu\.?be|clips\.twitch\.tv|kick\.com))\/.+$/;
  return regex.test(url);
};

const profileFormSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Username must be at least 2 characters.",
    })
    .max(128, {
      message: "Username must not be longer than 128 characters.",
    }),

  url: z
    .string()
    .url({ message: "Please enter a valid Twitch, YouTube or Kick clip URL." })
    .refine(urlValidator, {
      message: "URL must be a valid YouTube or Twitch Link.",
    }),
  tags: z.string(),
  community: z.string()

});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
interface Editor2Props {
  communityId: string;
}

export const Editor2: React.FC<Editor2Props> = ({ communityId }) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      url: "",
      tags: "",
      community: communityId,
    },
  });
  
  const router = useRouter();
  const pathname = usePathname();
  function onSubmit(data: ProfileFormValues) {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 3)}</code>
    //     </pre>
    //   ),
    // });
    
    const payload: PostCreationRequest = {
        communityId,
        title: data.title,
        url: data.url,
        tag: data.tags,
    }
    createPost(payload)
  }
  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      url,
      tag,
      communityId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, url, tag, communityId };
      const { data } = await axios.post("/api/community/post/create", payload);
      return data;
    },
    onError: (error) => {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 469) {
        return toast({
          title: "Error",
          description: "You must be subscribed to the community to make a post",
          variant: "destructive",
        });
      } else {
        return toast({
          
          title: "Something went wrong {error}",
          description: "Your post was not published. Please try again.",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      // turn pathname /c/mycommunity/submit into /c/mycommunity
      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);

      router.refresh();

      return toast({
        description: "Your post has been published.",
      });
    },
  });
  const clipUrl = form.watch("url");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-[500px]"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please insert a title for your post."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the Public title for the clip.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clip URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please insert a link to the clip."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter a valid link to a Twitch or Youtube clip.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <div className="space-x-4">
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Combobox {...field} />
                </FormControl>
              </div>
              <FormDescription className="flex-shrink">
                Select a framework tag for the post.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!clipUrl || clipUrl.trim().length === 0}
        >
          Post
        </Button>
      </form>
    </Form>
  );
};
