import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/data";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Simple pricing
          </h2>
          <p className="text-muted-foreground">
            Choose what fits your team.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={
                plan.highlighted
                  ? "border-primary shadow-xl scale-105"
                  : ""
              }
            >
              <CardHeader>
                <h3 className="text-xl font-bold">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold">
                  {plan.price === "Custom"
                    ? plan.price
                    : `$${plan.price}/mo`}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {plan.features.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="h-4 w-4 text-primary" />
                    {f}
                  </div>
                ))}

                <Button className="w-full mt-6">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}