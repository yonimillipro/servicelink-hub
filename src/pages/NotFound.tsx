import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="flex min-h-[60vh] items-center justify-center py-16 sm:py-24">
        <div className="container-padded text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto mb-8"
          >
            {/* Large branded 404 badge */}
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary/20 bg-card sm:h-36 sm:w-36">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary sm:h-10 sm:w-10">
                  <span className="text-sm font-bold text-primary-foreground sm:text-lg">SL</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h1 className="text-6xl font-bold tracking-tight text-foreground sm:text-8xl">
              404
            </h1>
            <p className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">
              Page Not Found
            </p>
            <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
              Sorry, the page{" "}
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
                {location.pathname}
              </span>{" "}
              doesn't exist or has been moved. Let's get you back on track.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Search className="h-4 w-4" />
                Browse Services
              </Button>
            </Link>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
            onClick={() => window.history.back()}
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to previous page
          </motion.button>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
