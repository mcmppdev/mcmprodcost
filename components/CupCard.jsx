import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CupCard({ cup }) {
  return (
    <Link className="cup-card" href={`/${cup.slug}`}>
      <span className="model-pill">Model {cup.modelType}</span>
      <strong>{cup.name}</strong>
      <span>{cup.description}</span>
      <span className="card-footer">
        {cup.volumeMl} ml
        <ArrowRight size={18} aria-hidden="true" />
      </span>
    </Link>
  );
}
