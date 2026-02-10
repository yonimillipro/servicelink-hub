import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const posts = [
  {
    title: "How to Choose the Right Service Provider",
    excerpt: "Tips and best practices for finding trusted professionals in your area.",
    date: "2026-02-05",
    category: "Tips",
  },
  {
    title: "Growing Your Business on ServiceLink",
    excerpt: "A guide for service providers looking to expand their reach and attract more customers.",
    date: "2026-01-28",
    category: "For Providers",
  },
  {
    title: "ServiceLink Platform Update — January 2026",
    excerpt: "New features, improvements, and what's coming next for our marketplace.",
    date: "2026-01-15",
    category: "Updates",
  },
];

export default function Blog() {
  return (
    <Layout>
      <section className="hero-gradient py-16 md:py-24">
        <div className="container-padded text-center">
          <h1 className="text-white">ServiceLink Blog</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Insights, tips, and updates from the ServiceLink team.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-padded">
          <div className="mx-auto max-w-3xl space-y-6">
            {posts.map((post) => (
              <Card key={post.title} className="card-hover cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
