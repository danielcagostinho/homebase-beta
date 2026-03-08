import Link from "next/link";
import { paths } from "@/config/paths";

export default function LoginPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Log in to your account to continue.
      </p>

      {/* LoginForm component will be added in Phase 1 */}
      <div className="mt-6 rounded-lg border border-border bg-muted/50 p-8 text-center text-sm text-muted-foreground">
        Login form coming in Phase 1
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={paths.auth.register.getHref()} className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
