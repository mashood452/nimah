import type { Metadata } from "next";
import { Catalog } from "@/components/catalog/Catalog";
import { getProducts, getProductTaxonomy } from "@/lib/catalog";
import { categoryHref } from "@/lib/product-taxonomy";

export const metadata: Metadata = {
  title: "Shop All Eyewear",
  description:
    "Shop the full Nimah Opticals collection: luxury sunglasses, blue-cut glasses and eyeglasses in classic and modern shapes.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, taxonomy] = await Promise.all([getProducts(), getProductTaxonomy()]);
  return (
    <Catalog
      title="Shop all eyewear"
      intro="The full Nimah collection in one place: sunglasses for bright days, blue-cut glasses for screen time and optical frames for every day."
      crumbs={[
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
      ]}
      chipGroups={[
        {
          label: "Shop by category",
          chips: [
            { label: "All eyewear", href: "/shop", active: true },
            ...taxonomy.categories.map((term) => ({ label: term.name, href: categoryHref(term.slug) })),
          ],
        },
      ]}
      products={products}
      filterTaxonomy={taxonomy}
      guideTitle="Shopping at Nimah"
      guide={[
        "Every frame in our collection is chosen for its shape, finish and comfort. Use the category filters to narrow the range, or sort by price to find the right fit for your budget.",
        "Not sure where to start? Our shop by style guide and eyewear FAQs explain lenses, UV protection and face shapes in plain language.",
      ]}
      guideLink={{ label: "Browse by style", href: "/sunglasses" }}
    />
  );
}
