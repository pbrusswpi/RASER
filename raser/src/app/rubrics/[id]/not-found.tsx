//not-found page for an invalid/nonexistent rubric.

import Link from "next/link";

export default function RubricNotFound() {
  return (
    <main style={{ padding: "80px 20px", textAlign: "center" }}>
      <h1>Rubric not found</h1>
      <p>The requested published rubric could not be found.</p>
      <Link href="/rubrics">Return to Published Rubrics</Link>
    </main>
  );
}
