"use client";
import { Switch } from "@/components/ui/Switch"; // Import a Checkbox or Switch component
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { User } from "next-auth";
import { boolean } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface ExtendedUser extends User {
  notifs?: boolean;
}

interface EmailNotificationFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<ExtendedUser, "id" | "notifs">; // Assuming this field exists in your User model
}

export function EmailNotificationForm({
  user,
  emailNotif,
  className,
  ...props
}: EmailNotificationFormProps & { emailNotif: boolean }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      notifs: emailNotif || true,
    },
  });
  const router = useRouter();
  const { mutate: updateEmailNotificationPreference, isLoading } = useMutation({
    mutationFn: async ({
      emailNotificationsEnabled,
    }: {
      emailNotificationsEnabled: boolean;
    }) => {
      const payload = { emailNotificationsEnabled };

      const { data } = await axios.patch(
        `/api/profile/emailNotifications`,
        payload
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username already taken.",
            description: "Please choose another username.",
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
    <form
      className={cn(className)}
      onSubmit={handleSubmit((e) =>
        updateEmailNotificationPreference({
          emailNotificationsEnabled: e.notifs,
        })
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle> Notifications</CardTitle>
          <CardDescription>
            Toggle whether you want to receive email notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-x-6">
          <Label htmlFor="notifs">Email Notifications</Label>
          <Switch id="notifs" {...register("notifs")} />
          {errors?.notifs && (
            <p className="px-1 text-xs text-red-600">
              {errors?.notifs?.message}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>Save Preferences</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
