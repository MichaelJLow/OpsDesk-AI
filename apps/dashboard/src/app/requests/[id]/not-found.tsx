import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Request not found</h1>
      <p className="muted">No request with that id in Supabase.</p>
      <Link href="/">Back to Operations Inbox</Link>
    </main>
  );
}
