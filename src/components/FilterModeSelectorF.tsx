"use client";

import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "./ui/Tabs";
import { Rocket, Sparkles } from "lucide-react";

export const FilterModeSelectorF = () => {
  const { slug, filter = "new" } = useParams();
  const router = useRouter();
  const handleTabClick = (route: string) => {
    router.replace(route);
  };

  return (
    <Tabs defaultValue={filter} className="w-[200px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger onClick={() => handleTabClick(`/feed/new`)} value="new">
          <Sparkles className="w-4 h-4 mr-2" />
          New
        </TabsTrigger>
        <TabsTrigger onClick={() => handleTabClick(`/feed/old`)} value="old">
          <Rocket className="w-4 h-4 mr-2" />
          Old
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

// export default function YourComponent() {
//   const [filters, setFilters] = useState([]);
  
//   useEffect(() => {
//     // Fetch filters from your API when the component mounts
//     const fetchFilters = async () => {
//       const session = await getAuthSession();
//       if (!session) return;
      
//       const response = await fetch('/api/filters', { headers: { 'Authorization': `Bearer ${session.token}` } });
//       const data = await response.json();
      
//       setFilters(data);
//     }
    
//     fetchFilters();
//   }, []);

//   return (
//     <Tabs defaultValue={filter} className="w-[200px]">
//       <TabsList className="grid w-full grid-cols-2">
//         {filters.map(filter => (
//           <TabsTrigger
//             key={filter.name}
//             onClick={() => handleTabClick(`/feed/${filter.name}`)}
//             value={filter.name}
//           >
//             {filter.name}
//           </TabsTrigger>
//         ))}
//       </TabsList>
//     </Tabs>
//   );
// }







