import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CupCalculator from "@/components/CupCalculator";
import { cups, getCupBySlug } from "@/data/cups.config";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return cups.map((cup) => ({ slug: cup.slug }));
}

export function generateMetadata({ params }) {
  const cup = getCupBySlug(params.slug);

  if (!cup) {
    return {
      title: "Cup calculator"
    };
  }

  return {
    title: `${cup.name} Cost Calculator | MCM`,
    description: `Production cost calculator for ${cup.name}.`
  };
}

export default function CupPage({ params }) {
  const cup = getCupBySlug(params.slug);

  if (!cup) {
    notFound();
  }

  return (
    <main className="shell calculator-shell">
      <Link className="back-link" href="/" aria-label="Back to cup sizes">
        <ArrowLeft size={18} aria-hidden="true" />
        Sizes
      </Link>
      <CupCalculator cup={cup} />
    </main>
  );
}
