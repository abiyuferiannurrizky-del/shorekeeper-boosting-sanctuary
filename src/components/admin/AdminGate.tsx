import type { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Butterfly";
import { Atmosphere } from "@/components/brand/Atmosphere";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type Access = "loading" | "signed-out" | "no-access" | "admin";

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <Atmosphere butterflies={false} />
      <div className="glass relative w-full max-w-sm space-y-6 rounded-md p-8">
        <div className="text-center"><Logo /><p className="mt-2 text-[11px] uppercase tracking-[0.35em] text-muted-foreground">Admin console</p></div>
        {children}
      </div>
    </div>
  );
}

function SignIn() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const res = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (res.error) return setMsg(res.error.message);
    if (mode === "up" && !res.data.session) setMsg("Check your email to confirm your account, then sign in.");
  };
  return (
    <Frame>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{mode === "in" ? "Sign in" : "Create account"}</Button>
      </form>
      <button type="button" className="w-full text-center text-xs text-muted-foreground hover:text-silver" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "No account yet? Create one" : "Already have an account? Sign in"}
      </button>
    </Frame>
  );
}

function NoAccess({ session, onClaimed }: { session: Session; onClaimed: () => void }) {
  const [canClaim, setCanClaim] = useState(false);
  useEffect(() => {
    void supabase.rpc("admin_exists").then(({ data }) => setCanClaim(data === false));
  }, []);
  const claim = async () => {
    const { data, error } = await supabase.rpc("claim_first_admin");
    if (error || !data) { toast.error("An administrator already exists."); return; }
    toast.success("You are now the administrator");
    onClaimed();
  };
  return (
    <Frame>
      <p className="text-center text-sm text-muted-foreground">Signed in as <span className="text-silver">{session.user.email}</span></p>
      {canClaim ? (
        <>
          <p className="text-center text-sm">No administrator has been set up yet. Claim the admin role for this account?</p>
          <Button className="w-full" onClick={() => void claim()}>Become administrator</Button>
        </>
      ) : (
        <p className="text-center text-sm">This account doesn't have admin access. Ask the BONGJOKI owner to grant it.</p>
      )}
      <Button variant="outline" className="w-full" onClick={() => void supabase.auth.signOut()}>Sign out</Button>
    </Frame>
  );
}

export function AdminGate({ children }: { children: (signOut: () => void, email: string) => ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [access, setAccess] = useState<Access>("loading");
  const [tick, setTick] = useState(0);
  const qc = useQueryClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    void supabase.auth.getSession().then(({ data: d }) => { setSession(d.session); if (!d.session) setAccess("signed-out"); });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setAccess((a) => (a === "loading" ? a : "signed-out")); return; }
    let live = true;
    void supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle()
      .then(({ data }) => {
        if (!live) return;
        setAccess(data ? "admin" : "no-access");
        void qc.invalidateQueries({ queryKey: ["queue", "admin"] });
      });
    return () => { live = false; };
  }, [session, tick, qc]);

  if (access === "loading") return <Frame><p className="text-center text-sm text-muted-foreground">Checking access…</p></Frame>;
  if (access === "signed-out" || !session) return <SignIn />;
  if (access === "no-access") return <NoAccess session={session} onClaimed={() => setTick((t) => t + 1)} />;
  return <>{children(() => void supabase.auth.signOut(), session.user.email ?? "")}</>;
}
