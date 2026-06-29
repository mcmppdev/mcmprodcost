import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell hero">
      <p className="eyebrow">Not found</p>
      <h1>Cup size unavailable</h1>
      <p>This calculator is not in the current cup configuration.</p>
      <Link className="primary-link" href="/">
        Back to sizes
      </Link>
    </main>
  );
}
