import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { trpc, trpcClient } from "@/utils/trpc";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function TaskPanel() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const userId = session?.user.id;

  // The user id is part of the cache key, so a session change can never render
  // rows that were fetched for the previous account.
  const tasksQueryKey = ["tasks", "list", userId] as const;

  const tasks = useQuery({
    queryKey: tasksQueryKey,
    queryFn: () => trpcClient.tasks.list.query(),
    enabled: Boolean(userId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: tasksQueryKey });

  const create = useMutation({
    ...trpc.tasks.create.mutationOptions(),
    onSuccess: () => {
      setTitle("");
      return invalidate();
    },
  });
  const setCompleted = useMutation({
    ...trpc.tasks.setCompleted.mutationOptions(),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    ...trpc.tasks.remove.mutationOptions(),
    onSuccess: invalidate,
  });

  const mutationError = create.error ?? setCompleted.error ?? remove.error;

  if (sessionPending) {
    return <p className="text-sm text-muted-foreground">Checking your session...</p>;
  }

  if (!userId) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Tasks are stored per account. Sign in to create your first one.
        </p>
        <Link
          to="/login"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const next = title.trim();
          if (next) create.mutate({ title: next });
        }}
      >
        <input
          aria-label="Task title"
          className="h-9 flex-1 rounded-md border bg-background px-3 text-sm"
          maxLength={255}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Write your first task"
          value={title}
        />
        <button
          className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
          disabled={!title.trim() || create.isPending}
          type="submit"
        >
          Add
        </button>
      </form>

      {mutationError ? (
        <p className="text-sm text-destructive" role="alert">
          {mutationError.message}
        </p>
      ) : null}

      {tasks.isPending ? (
        <p className="text-sm text-muted-foreground">Loading tasks...</p>
      ) : tasks.isError ? (
        <p className="text-sm text-destructive" role="alert">
          Could not load tasks: {tasks.error.message}
        </p>
      ) : tasks.data && tasks.data.length > 0 ? (
        <ul className="divide-y rounded-md border">
          {tasks.data.map((item) => (
            <li className="flex items-center gap-3 px-3 py-2" key={item.id}>
              <input
                aria-label={`Mark ${item.title} complete`}
                checked={item.completed}
                onChange={(event) =>
                  setCompleted.mutate({ completed: event.target.checked, id: item.id })
                }
                type="checkbox"
              />
              <span
                className={
                  item.completed ? "flex-1 text-sm line-through opacity-60" : "flex-1 text-sm"
                }
              >
                {item.title}
              </span>
              <button
                aria-label={`Delete ${item.title}`}
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => remove.mutate({ id: item.id })}
                type="button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
          No tasks yet. Add one above, then reload the page. It is stored in your database.
        </p>
      )}
    </div>
  );
}

function HomeComponent() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">codebalt</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          TanStack Router and hono, postgres through drizzle, Better Auth.
        </p>
      </header>

      <section className="rounded-lg border p-4">
        <h2 className="mb-3 font-medium">Tasks</h2>
        <TaskPanel />
      </section>

      <footer className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <span
          className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
        />
        <span>
          {healthCheck.isLoading
            ? "Checking API..."
            : healthCheck.data
              ? "API connected"
              : "API disconnected"}
        </span>
      </footer>
    </div>
  );
}
