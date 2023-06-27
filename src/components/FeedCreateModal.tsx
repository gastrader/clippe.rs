import { Icons } from "@/components/Icons";
import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";
import FeedCreate from "./FeedCreate";

const FeedCreateModal = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">

      <FeedCreate />

    </div>
  );
};

export default FeedCreateModal;