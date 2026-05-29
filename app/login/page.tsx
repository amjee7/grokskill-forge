import { AuthForm } from "@/components/AuthForm";

export const metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
