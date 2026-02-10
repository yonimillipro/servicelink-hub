import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="flex min-h-[60vh] items-center justify-center py-16">
        <div className="container-padded text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <span className="text-4xl font-bold text-primary">404</span>
          </div>
          <h1 className="text-foreground">Page Not Found</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/">
              <Button size="lg" className="gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Browse Services
              </Button>
            </Link>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back to previous page
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
