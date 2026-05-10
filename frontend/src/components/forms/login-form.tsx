"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const session = await login({ username: values.username, password: values.password });
      setSession(session);
      toast.success("Welcome back!");
      router.replace("/dashboard");
    } catch {
      toast.error("Invalid username or password. Please try again.");
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-emerald-950">Welcome back</h2>
        <p className="text-sm text-emerald-700/80">Enter your credentials to access your workspace</p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-8">
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-emerald-800/60">Username</Label>
            <Input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="e.g. neeraj"
              className="h-12 rounded-xl border-emerald-100 bg-emerald-50/30 px-4 transition-colors focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
              {...form.register("username")}
            />
            {form.formState.errors.username ? <p className="text-sm font-medium text-red-500">{form.formState.errors.username.message}</p> : null}
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-emerald-800/60">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-12 rounded-xl border-emerald-100 bg-emerald-50/30 px-4 transition-colors focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
              {...form.register("password")}
            />
            {form.formState.errors.password ? <p className="text-sm font-medium text-red-500">{form.formState.errors.password.message}</p> : null}
          </div>

          <Button
            className="h-12 w-full rounded-xl bg-emerald-600 font-medium text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98]"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Authenticating..." : "Sign in to Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
