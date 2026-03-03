import { Separator } from "@/components/ui/separator";

export default function SocialProof() {
  const companies = [
    "ACME Corp",
    "Globex",
    "Soylent",
    "Initech",
    "Umbrella",
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest mb-8">
          Trusted by teams worldwide
        </p>

        <div className="flex flex-wrap justify-center items-center gap-10 opacity-60">
          {companies.map((company) => (
            <div
              key={company}
              className="text-xl font-semibold text-muted-foreground"
            >
              {company}
            </div>
          ))}
        </div>

        <Separator className="mt-16" />
      </div>
    </section>
  );
}