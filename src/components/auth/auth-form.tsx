"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const signup = mode === "sign-up";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-9 flex items-center justify-center gap-2.5">
          <span className="flow-logo" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="text-2xl font-semibold tracking-tight">
            FlowNote<span className="text-primary">.</span>
          </span>
        </div>
        <section className="rounded-xl border border-soft bg-white p-7">
          <h1 className="text-xl font-semibold tracking-tight">
            {signup ? "Un espacio para tus ideas" : "Te damos la bienvenida"}
          </h1>
          <p className="mb-6 mt-2 text-sm leading-6 text-secondary">
            {signup
              ? "Crea tu espacio personal en FlowNote."
              : "Inicia sesión para continuar donde lo dejaste."}
          </p>
          <form
            className="space-y-4"
            aria-busy={pending}
            onSubmit={async (event) => {
              event.preventDefault();
              if (pending) return;
              const data = new FormData(event.currentTarget);
              const email = String(data.get("email") ?? "").trim();
              const password = String(data.get("password") ?? "");
              setPending(true);
              setError("");
              try {
                const result = signup
                  ? await authClient.signUp.email({
                      email,
                      password,
                      name: String(data.get("name") ?? "").trim(),
                    })
                  : await authClient.signIn.email({ email, password });
                if (result.error) {
                  setError(
                    signup
                      ? "No se pudo crear la cuenta. Revisa tus datos o intenta iniciar sesión."
                      : "No se pudo iniciar sesión. Revisa tu correo y contraseña e inténtalo de nuevo.",
                  );
                  setPending(false);
                } else {
                  router.replace("/");
                  router.refresh();
                }
              } catch {
                setError("No se pudo conectar. Inténtalo de nuevo.");
                setPending(false);
              }
            }}
          >
            <fieldset disabled={pending} className="space-y-4">
              {signup && (
                <div>
                  <label htmlFor="name" className="text-xs font-medium">
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    minLength={1}
                    maxLength={80}
                    className="auth-input"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="text-xs font-medium">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  className="auth-input"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-xs font-medium">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={signup ? "new-password" : "current-password"}
                  required
                  minLength={signup ? 8 : 1}
                  maxLength={128}
                  className="auth-input"
                />
                {signup && (
                  <p className="mt-2 text-[11px] text-secondary">
                    Usa al menos 8 caracteres.
                  </p>
                )}
              </div>
              {error && (
                <p role="alert" className="text-xs leading-5 text-red-600">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? <Loader2 className="animate-spin" /> : null}
                {pending
                  ? signup
                    ? "Creando cuenta…"
                    : "Iniciando sesión…"
                  : signup
                    ? "Crear cuenta"
                    : "Iniciar sesión"}
                {!pending && <ArrowRight />}
              </Button>
            </fieldset>
            <span role="status" className="sr-only">
              {pending ? "Validando tus datos…" : ""}
            </span>
          </form>
        </section>
        <p className="mt-6 text-center text-xs text-secondary">
          {signup
            ? "¿Ya tienes una cuenta?"
            : "¿Es tu primera vez en FlowNote?"}{" "}
          <Link
            className="font-medium text-primary hover:underline"
            href={signup ? "/sign-in" : "/sign-up"}
          >
            {signup ? "Iniciar sesión" : "Crear cuenta"}
          </Link>
        </p>
      </div>
    </main>
  );
}
