import { Layout } from "@/components/layout/Layout";
import { Shield, Users, Star, Globe } from "lucide-react";

const values = [
  { icon: Shield, title: "Trust & Safety", description: "Every service provider is verified and reviewed to ensure quality and reliability." },
  { icon: Users, title: "Community First", description: "We connect local professionals with customers, building stronger communities." },
  { icon: Star, title: "Quality Services", description: "Our moderation team ensures only high-quality services are listed on the platform." },
  { icon: Globe, title: "Accessible to All", description: "Mobile-first design ensures everyone can find and offer services, anywhere." },
];

export default function About() {
  return (
    <Layout>
      <section className="border-b bg-card py-12 md:py-20">
        <div className="container-padded text-center">
          <h1 className="text-foreground">About ServiceLink</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            ServiceLink is a marketplace that connects local customers with trusted service providers. Whether you need home repairs, IT support, creative design, or any professional service — we make it easy to find the right expert.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-padded">
          <h2 className="text-center text-foreground">Our Values</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <v.icon className="h-7 w-7 text-primary" />
                </div>
                <h4 className="mt-4 text-foreground">{v.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16">
        <div className="container-padded text-center">
          <h2 className="text-primary-foreground">Join ServiceLink Today</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Whether you're looking for a service or offering one, ServiceLink is the platform for you.
          </p>
        </div>
      </section>
    </Layout>
  );
}
