import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_PRICE_LIST, type PriceItem } from "./services";

/** Editable catalogue row in the `services` table. */
export interface ServiceRow {
  id: string;
  category: string;
  name: string;
  detail: string;
  eta: string;
  price: string;
  sort: number;
}
export type ServiceDraft = Omit<ServiceRow, "id">;

// The table isn't in generated types yet, so use an untyped handle.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const table = () => (supabase as any).from("services");

async function fetchServices(): Promise<ServiceRow[]> {
  const { data, error } = await table().select("*").order("sort");
  if (error) throw error;
  return (data ?? []) as ServiceRow[];
}

export function useServices() {
  return useQuery({ queryKey: ["services"], queryFn: fetchServices, retry: 1 });
}

/** Saved rows, or the built-in price list when nothing is saved or the database can't be reached. */
export function usePriceList(): PriceItem[] {
  const { data } = useServices();
  return data && data.length > 0 ? data : DEFAULT_PRICE_LIST;
}

export const defaultDrafts = (): ServiceDraft[] => DEFAULT_PRICE_LIST.map((i, n) => ({ ...i, sort: n }));

export const serviceActions = {
  async add(d: ServiceDraft) { const { error } = await table().insert(d); if (error) throw error; },
  async addMany(d: ServiceDraft[]) { const { error } = await table().insert(d); if (error) throw error; },
  async update(id: string, d: Partial<ServiceDraft>) { const { error } = await table().update({ ...d, updated_at: new Date().toISOString() }).eq("id", id); if (error) throw error; },
  async remove(id: string) { const { error } = await table().delete().eq("id", id); if (error) throw error; },
};
