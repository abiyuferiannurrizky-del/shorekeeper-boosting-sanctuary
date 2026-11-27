import type { Session } from "@supabase/supabase-js";
import { LovableMark } from "@lovable.dev/cloud-auth-js/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Butterfly";
import { Atmosphere } from "@/components/brand/Atmosphere";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable/index";
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

const GoogleG = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
);

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
  const social = async (p: "google" | "lovable") => {
    const r = await lovable.auth.signInWithOAuth(p, { redirect_uri: window.location.origin + "/admin" });
    if (r.error) setMsg(r.error instanceof Error ? r.error.message : "Sign-in failed");
  };
  const gBtn = "w-full border-[#747775] bg-[#FFFFFF] text-[#1F1F1F] hover:bg-[#FFFFFF]/90 hover:text-[#1F1F1F]";
  return (
    <Frame>
      <div className="space-y-2">
        <Button type="button" variant="outline" className={gBtn} onClick={() => void social("google")}><GoogleG /> Continue with Google</Button>
        <Button type="button" variant="outline" className="w-full" onClick={() => void social("lovable")}><LovableMark /> Continue with Lovable</Button>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="ornament-line flex-1" />or<span className="ornament-line flex-1" /></div>
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
