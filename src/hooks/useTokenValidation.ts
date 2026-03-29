import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type TokenStatus = "loading" | "valid" | "used" | "expired" | "invalid";

export interface TokenData {
  token: string;
  email: string;
  nombre: string | null;
  payment_id: string | null;
}

export function useTokenValidation(token: string | undefined) {
  const [status, setStatus] = useState<TokenStatus>("loading");
  const [data, setData] = useState<TokenData | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    async function validate() {
      const { data: row, error } = await (supabase as any)
        .from("diagnostic_tokens")
        .select("*")
        .eq("token", token)
        .single();

      if (error || !row) {
        setStatus("invalid");
        return;
      }

      if (row.used) {
        setStatus("used");
        return;
      }

      if (row.expires_at && new Date(row.expires_at) < new Date()) {
        setStatus("expired");
        return;
      }

      setStatus("valid");
      setData({
        token: row.token,
        email: row.email,
        nombre: row.nombre,
        payment_id: row.payment_id,
      });
    }

    validate();
  }, [token]);

  return { status, data };
}

/** Mark a token as used and link it to a submission */
export async function markTokenUsed(token: string, submissionId: string) {
  const { error } = await supabase
    .from("diagnostic_tokens")
    .update({
      used: true,
      used_at: new Date().toISOString(),
      submission_id: submissionId,
    })
    .eq("token", token);

  return { error };
}
