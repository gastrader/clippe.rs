import { ListStart } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/Button";
import {SmallPost} from "./SmallPost";

const RecommendedPosts = async () => {

    return (
      <div className="overflow-hidden h-fit rounded-lg border border-gray-200">
        <div className="bg-rose-100 px-6 py-4">
          <p className="font-semibold py-3 flex items-center gap-1.5">
            <ListStart className="w-4 h-4"></ListStart> Recommended
          </p>
        </div>
        <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
          <div className="flex justify-between gap-x-4 py-3">
            <p className="text-zinc-500">
              Here are some of the top clips we recommend for you!
            </p>
          </div>
          <div className="space-y-3 pb-4">
            <SmallPost />

          </div>
          
        </div>
      </div>
    );
}
export default RecommendedPosts
