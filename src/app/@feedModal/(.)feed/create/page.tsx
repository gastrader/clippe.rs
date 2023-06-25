import CloseModal from "@/components/CloseModal";
import FeedCreate from "@/components/FeedCreate";
import FeedCreateModal from "@/components/FeedCreateModal";
import SignIn from "@/components/SignIn";
import { FC } from "react";

const page: FC = () => {
  return (
    <div className="fixed inset-0 bg-zinc-900/20 z-10 flex items-center justify-center">
      <div className="container max-w-lg mx-auto">
        <div className="relative bg-white w-full py-20 px-2 rounded-lg">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>

          <FeedCreateModal />
        </div>
      </div>
    </div>
  );
};

export default page;
