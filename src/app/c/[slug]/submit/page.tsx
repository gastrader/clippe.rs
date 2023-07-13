import { Editor2 } from "@/components/Editor2";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: pageProps) => {
  const community = await db.community.findFirst({
    where: {
      name: params.slug,
    },
  });

  if (!community) return notFound();

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* heading */}
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h1 className="ml-2 mt-2 text-2xl font-semibold leading-6 text-gray-900">
            POST A CLIP
          </h1>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in c/{params.slug}
          </p>
        </div>
      </div>

      {/* form */}
      <Editor2 communityId={community.id} />

      <div className="w-full flex justify-end">
      </div>
    </div>
  );
};

export default page;
