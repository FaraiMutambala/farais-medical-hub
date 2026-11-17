import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

export async function getResourceDownloadUrl(
  storagePath: string
) {
  const { data, error } = await supabase.storage
    .from("medical-resources")
    .createSignedUrl(storagePath, 60);

  if (error) {
    console.error("Download link error:", error.message);
    return null;
  }

  return data.signedUrl;
}