import Link from "next/link";
import { paths } from "@/config/paths";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-display text-4xl text-foreground">HomeBase</h1>
        <p className="mt-3 text-muted-foreground">
          Your personal command center for home and family life.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href={paths.auth.login.getHref()}
            className="rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Log in
          </Link>
          <Link
            href={paths.auth.register.getHref()}
            className="rounded-md border border-border px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
