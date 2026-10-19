import Link from "next/link";

export default function Header() {
  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Link href="/" className="brand">
          <span className="brandMark">R</span>
          <span>RASER</span>
        </Link>

        <nav className="mainNav" aria-label="Main navigation">
          <Link href="/rubrics">Published Rubrics</Link>
          <Link href="/designer">Designer</Link>
          <Link href="/editor">Editor</Link>
          <Link href="/reviewer">Reviewer</Link>
        </nav>
      </div>
    </header>
  );
}
