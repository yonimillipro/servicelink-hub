import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <Layout>
      <section className="border-b bg-card py-12 md:py-16">
        <div className="container-padded text-center">
          <h1 className="text-foreground">Contact Us</h1>
          <p className="mt-2 text-muted-foreground">Have questions? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-padded">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="py-12 text-center">
                      <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
                      <p className="mt-4 font-semibold text-foreground">Thank you!</p>
                      <p className="text-muted-foreground">We'll get back to you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div><Label htmlFor="name">Name</Label><Input id="name" required /></div>
                        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" required /></div>
                      </div>
                      <div><Label htmlFor="subject">Subject</Label><Input id="subject" required /></div>
                      <div><Label htmlFor="message">Message</Label><Textarea id="message" rows={5} required /></div>
                      <Button type="submit">Send Message</Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "support@servicelink.com" },
                { icon: Phone, label: "Phone", value: "+251 123 456 789" },
                { icon: MapPin, label: "Address", value: "Addis Ababa, Ethiopia" },
              ].map((item) => (
                <Card key={item.label}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-medium text-foreground">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
