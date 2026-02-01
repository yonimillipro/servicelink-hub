import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useCategories";

const Categories = () => {
  const { data: categories, isLoading } = useCategories();

  return (
    <Layout>
      {/* Header */}
      <section className="border-b bg-card py-8 md:py-12">
        <div className="container-padded">
          <h1 className="text-foreground">All Categories</h1>
          <p className="mt-2 text-muted-foreground">
            Browse services by category to find exactly what you need
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-8 md:py-12">
        <div className="container-padded">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-secondary/50 py-12 text-center">
              <p className="text-muted-foreground">No categories available.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Categories;
