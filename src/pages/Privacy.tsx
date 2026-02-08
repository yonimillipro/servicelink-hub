import { Layout } from "@/components/layout/Layout";

export default function Privacy() {
  return (
    <Layout>
      <section className="border-b bg-card py-12">
        <div className="container-padded">
          <h1 className="text-foreground">Privacy Policy</h1>
          <p className="mt-2 text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container-padded prose prose-neutral dark:prose-invert max-w-3xl">
          <h2 className="text-foreground">1. Information We Collect</h2>
          <p className="text-muted-foreground">We collect information you provide directly, such as your name, email address, phone number, and company details when you register or use our services.</p>

          <h2 className="mt-8 text-foreground">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">We use the information to provide and improve our marketplace services, facilitate communication between service seekers and providers, and ensure platform security.</p>

          <h2 className="mt-8 text-foreground">3. Information Sharing</h2>
          <p className="text-muted-foreground">We do not sell your personal information. Service provider contact details are shared only when a user submits an inquiry through the platform.</p>

          <h2 className="mt-8 text-foreground">4. Data Security</h2>
          <p className="text-muted-foreground">We implement industry-standard security measures to protect your data, including encryption and secure authentication.</p>

          <h2 className="mt-8 text-foreground">5. Your Rights</h2>
          <p className="text-muted-foreground">You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us.</p>

          <h2 className="mt-8 text-foreground">6. Contact</h2>
          <p className="text-muted-foreground">For privacy-related questions, contact us at support@servicelink.com.</p>
        </div>
      </section>
    </Layout>
  );
}
