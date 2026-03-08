export default function DashboardPage() {
  return (
    <div>
      <h2 className="font-display text-2xl text-foreground">
        Here&apos;s the Rundown
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Your daily overview at a glance.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border p-5">
          <p className="text-sm font-medium text-muted-foreground">Overdue</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">0</p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <p className="text-sm font-medium text-muted-foreground">Due Today</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">0</p>
        </div>
        <div className="rounded-lg border border-border p-5">
          <p className="text-sm font-medium text-muted-foreground">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-foreground">0</p>
        </div>
      </div>
    </div>
  );
}
