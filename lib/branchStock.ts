import { fetchResilient } from "@/lib/fetchResilient";

export const getBranchStock = async (): Promise<any[]> => {
  return await fetchResilient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branchStock`);
};
