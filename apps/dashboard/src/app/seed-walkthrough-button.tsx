"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { seedDemoWalkthrough } from "./seed-walkthrough-action";

export function SeedWalkthroughButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onSeed() {
    const confirmed = window.confirm(
      "Reset and seed walkthrough?\n\nThis DELETES all current requests, then loads the six portfolio demo cases (routine, urgent, chargeable, failure, grounding, evidence).\n\nKeeps companies, contacts, sites.\n\nThis cannot be undone.",
    );
    if (!confirmed) return;

    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await seedDemoWalkthrough();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(
        `Walkthrough ready: removed ${result.deletedRequests} old request(s), seeded ${result.seeded} cases.`,
      );
      router.refresh();
    });
  }

  return (
    <div className="reset-demo">
      <button
        type="button"
        className="btn btn-approve"
        disabled={pending}
        onClick={onSeed}
      >
        {pending ? "Seeding…" : "Reset & seed walkthrough"}
      </button>
      <p className="muted" style={{ margin: "0.35rem 0 0", fontSize: "0.85rem" }}>
        Clears test inbox noise and loads six desk cases for demos. Optional: send
        one live proof email afterward (see docs/demo).
      </p>
      {error ? (
        <p className="error-inline" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="ok-inline">{message}</p> : null}
    </div>
  );
}
