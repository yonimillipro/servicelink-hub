import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Heart, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  { icon: Heart, title: "People First", description: "We build products that empower communities and create meaningful connections." },
  { icon: Zap, title: "Move Fast", description: "We ship quickly, iterate often, and learn from real-world feedback." },
  { icon: Globe, title: "Think Global", description: "Our platform connects providers and customers across diverse markets." },
  { icon: Briefcase, title: "Own It", description: "Every team member has autonomy and accountability for their work." },
];

export default function Careers() {
  return (
    <Layout>
      <section className="hero-gradient py-16 md:py-24">
        <div className="container-padded text-center">
          <h1 className="text-white">Join the ServiceLink Team</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Help us build the future of local service discovery. We're looking for passionate people who want to make a difference.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-padded">
          <h2 className="text-center text-foreground">Our Values</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <Card key={v.title} className="text-center">
                <CardHeader>
                  <v.icon className="mx-auto h-10 w-10 text-primary" />
                  <CardTitle className="text-lg">{v.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{v.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-12 md:py-16">
        <div className="container-padded text-center">
          <h2 className="text-foreground">Open Positions</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            We don't have any open positions right now, but we're always looking for talented individuals. Send us your resume and we'll keep you in mind.
          </p>
          <Link to="/contact">
            <Button size="lg" className="mt-8">Get in Touch</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
