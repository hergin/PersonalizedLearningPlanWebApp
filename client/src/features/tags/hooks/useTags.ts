import { useQuery } from "@tanstack/react-query";
import { TagApi } from "../api/tagApi";

export default function useGoals(accountID: number) {
  const { FetchTags } = TagApi(accountID);
  console.log(FetchTags());
  return useQuery({
    queryFn: () => FetchTags(),
    queryKey: ["tags", accountID],
  });
    
    
}
