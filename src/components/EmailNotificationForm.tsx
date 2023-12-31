"use client";
import { Switch } from "@/components/ui/Switch"; // Import a Checkbox or Switch component
import {
  Card,
} from "./ui/Card";

import { Button } from "./ui/Button";

import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "next-auth";
import {  z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "./ui/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

interface ExtendedUser extends User {
  notifs?: boolean;
}

interface EmailNotificationFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<ExtendedUser, "id" | "notifs">; // Assuming this field exists in your User model
}

const FormSchema = z.object({
  notification_emails: z.boolean().default(true).optional(),
  security_emails: z.boolean(),
});

export function EmailNotificationForm() {
  const { data, status } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const res = await axios.get("/api/profile/emailNotifications/query");
      
      return res.data;
    },
  });

  let defaultEmailValue = true;
  if (status === "success") {
    defaultEmailValue = data;
  }
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      notification_emails: false,
      security_emails: true,
    },
  });

  useEffect(() => {
    if (status === "success") {
      form.reset({
        notification_emails: data,
        security_emails: true,
      });
    }
  }, [status, data, form]);

  const router = useRouter();
  const { mutate: updateNotifs } = useMutation({
    mutationFn: async ({
      notification_emails,
    }: {
      notification_emails?: boolean;
    }) => {
      const payload = { notification_emails };
      const { data } = await axios.patch(
        "/api/profile/emailNotifications",
        payload
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400) {
          return toast({
            title: "Preferences Error.",
            description: "Please try again.",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your preferences were not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        description: "Your preferences have been updated.",
      });
      router.refresh();
    },
  });

  return (
    <Card>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(({ notification_emails }) =>
            updateNotifs({ notification_emails: notification_emails })
          )}
          className="w-full space-y-6"
        >
          <div>
            <h3 className="mb-4 text-lg p-6 font-semibold"> Notifications</h3>

            <div className="space-y-4 px-6">
              <FormField
                control={form.control}
                name="notification_emails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Email Notifications</FormLabel>
                      <FormDescription>
                        Receive emails about new products, features, and more.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="security_emails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Security emails</FormLabel>
                      <FormDescription>
                        Receive emails about your account security.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div>
            <Button className="p-6 ml-6 mb-6 text-sm" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
