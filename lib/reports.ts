import { fetchResilient } from "@/lib/fetchResilient";

export const fetchReport = async (branchId: string, startDate?: string, endDate?: string) => {
  return await fetchResilient(`/api/reports?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`);
}
