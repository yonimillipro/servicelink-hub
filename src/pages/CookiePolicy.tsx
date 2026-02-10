import { Layout } from "@/components/layout/Layout";

export default function CookiePolicy() {
  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container-padded">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-foreground">Cookie Policy</h1>
            <p className="mt-4 text-muted-foreground">Last updated: February 10, 2026</p>

            <div className="mt-8 space-y-6 text-foreground">
              <section>
                <h2 className="text-xl font-semibold">What Are Cookies</h2>
                <p className="mt-2 text-muted-foreground">
                  Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and improve your experience.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">How We Use Cookies</h2>
                <p className="mt-2 text-muted-foreground">
                  ServiceLink uses cookies for essential functionality including authentication, session management, and remembering your theme preferences. We do not use tracking or advertising cookies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">Essential Cookies</h2>
                <p className="mt-2 text-muted-foreground">
                  These cookies are necessary for the platform to function. They enable core features like secure login, session persistence, and navigation. Disabling these cookies may affect site functionality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">Managing Cookies</h2>
                <p className="mt-2 text-muted-foreground">
                  You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. However, doing so may impact your ability to use certain features of ServiceLink.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">Contact Us</h2>
                <p className="mt-2 text-muted-foreground">
                  If you have questions about our cookie policy, please contact us at support@servicelink.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
