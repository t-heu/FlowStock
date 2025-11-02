import { fetchResilient } from "@/lib/fetchResilient";

export interface Branch {
  id: string
  name: string
  code: string
}

export const saveBranch = async (branch: Omit<Branch, "id">): Promise<Branch> => {
  return await fetchResilient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...branch, id: crypto.randomUUID() }),
  });
};

export async function getBranches(): Promise<Branch[]> {
  return await fetchResilient(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branches`);
}
