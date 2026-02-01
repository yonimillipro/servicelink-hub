import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/category/CategoryCard";
import { mockCategories } from "@/data/mockData";

const Categories = () => {
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Categories;
