import { cups } from "@/data/cups.config";
import CupCard from "@/components/CupCard";

export default function HomePage() {
  return (
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">Production costing</p>
        <h1>MCM cup calculators</h1>
        <p>
          Pick a cup size, tune the operating numbers, and compare margin from
          the floor. Adding a size only means adding one object to config.
        </p>
      </header>

      <section className="cup-grid" aria-label="Cup sizes">
        {cups.map((cup) => (
          <CupCard key={cup.slug} cup={cup} />
        ))}
      </section>
    </main>
  );
}
