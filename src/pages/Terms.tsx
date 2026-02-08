import { Layout } from "@/components/layout/Layout";

export default function Terms() {
  return (
    <Layout>
      <section className="border-b bg-card py-12">
        <div className="container-padded">
          <h1 className="text-foreground">Terms of Service</h1>
          <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container-padded prose prose-neutral dark:prose-invert max-w-3xl">
          <h2 className="text-foreground">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">By using ServiceLink, you agree to these terms. If you do not agree, please do not use the platform.</p>

          <h2 className="mt-8 text-foreground">2. User Accounts</h2>
          <p className="text-muted-foreground">You are responsible for maintaining the confidentiality of your account. You must provide accurate information during registration.</p>

          <h2 className="mt-8 text-foreground">3. Service Listings</h2>
          <p className="text-muted-foreground">All service listings are subject to review and approval by our moderation team. We reserve the right to remove any listing that violates our guidelines.</p>

          <h2 className="mt-8 text-foreground">4. Prohibited Conduct</h2>
          <p className="text-muted-foreground">Users may not post fraudulent, misleading, or illegal content. Harassment of other users or service providers is strictly prohibited.</p>

          <h2 className="mt-8 text-foreground">5. Limitation of Liability</h2>
          <p className="text-muted-foreground">ServiceLink acts as a marketplace platform. We are not responsible for the quality of services provided by third-party providers.</p>

          <h2 className="mt-8 text-foreground">6. Changes to Terms</h2>
          <p className="text-muted-foreground">We may update these terms at any time. Continued use of the platform constitutes acceptance of the updated terms.</p>
        </div>
      </section>
    </Layout>
  );
}
