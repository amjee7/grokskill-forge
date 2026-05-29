import { AuthForm } from "@/components/AuthForm";

export const metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
      <AuthForm mode="signup" />
    </div>
  );
}
