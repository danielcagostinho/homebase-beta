import Link from "next/link";
import { paths } from "@/config/paths";

export default function RegisterPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">Create account</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started with your HomeBase.
      </p>

      {/* RegisterForm component will be added in Phase 1 */}
      <div className="mt-6 rounded-lg border border-border bg-muted/50 p-8 text-center text-sm text-muted-foreground">
        Registration form coming in Phase 1
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={paths.auth.login.getHref()} className="text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
