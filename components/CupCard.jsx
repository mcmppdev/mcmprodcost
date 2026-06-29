import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CupCard({ cup }) {
  const volumeLabel =
    typeof cup.volumeMl === "number" ? `${cup.volumeMl} ml` : cup.volumeMl;

  return (
    <Link className="cup-card" href={`/${cup.slug}`}>
      <span className="model-pill">Model {cup.modelType}</span>
      <strong>{cup.name}</strong>
      <span>{cup.description}</span>
      <span className="card-footer">
        {volumeLabel}
        <ArrowRight size={18} aria-hidden="true" />
      </span>
    </Link>
  );
}
