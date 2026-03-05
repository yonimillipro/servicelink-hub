import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoriesWithCount } from "@/hooks/useCategories";

const Categories = () => {
  const { data: categories, isLoading } = useCategoriesWithCount();

  return (
    <Layout>
      <section className="border-b bg-card py-6 sm:py-8 md:py-12">
        <div className="container-padded">
          <h1 className="text-foreground">All Categories</h1>
          <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">
            Browse services by category to find exactly what you need
          </p>
        </div>
      </section>

      <section className="py-6 sm:py-8 md:py-12">
        <div className="container-padded">
          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl sm:h-24" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border py-12 text-center">
              <p className="text-muted-foreground">No categories with active services yet.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Categories;
