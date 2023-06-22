"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
export default Providers;



// USED TO BE THIS.. I THINK THIS WILL RE-INSTANTIATE  EVERY TIME THE PROVIDER COMPOENENT IS RE-RENDERED.
// const Providers = ({ children }: { children: React.ReactNode }) => {
//   const queryClient = new QueryClient();

//   return (
//     <QueryClientProvider client={queryClient}>
//       <SessionProvider>{children}</SessionProvider>
//     </QueryClientProvider>
//   );
// };