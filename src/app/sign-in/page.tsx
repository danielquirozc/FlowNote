import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server/session";
import { AuthForm } from "@/components/auth/auth-form";
export default async function SignInPage() {
  if (await getCurrentUser()) redirect("/");
  return <AuthForm mode="sign-in" />;
}
