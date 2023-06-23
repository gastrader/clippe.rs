import { Icons } from "@/components/Icons";
import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import FeedCreateSearchBar from "./FeedCreateSearchBar";

const SignIn = () => {
  return (
    <Card className="w-[350px]">
      <Icons.logo className="mx-auto h-6 w-6 mt-4" />
      <CardHeader className="mx-auto">
        <CardTitle>Create a custom feed.</CardTitle>
        <CardDescription>Add any communities you are subscribed with to your custom feed.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Feed</Label>
              <Input id="name" placeholder="Name of your feed" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Find Communities</Label>
              <FeedCreateSearchBar />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignIn;
