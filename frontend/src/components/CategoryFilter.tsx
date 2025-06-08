import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  currentCategory?: string;
}

export function CategoryFilter({
  currentCategory = "All",
}: CategoryFilterProps) {
  const categories = [
    "All",
    "Development",
    "Design",
    "Technology",
    "Business",
    "Lifestyle",
  ];

  const basePath = "/posts";

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link
          key={category}
          href={
            category === "All"
              ? basePath
              : `${basePath}?category=${encodeURIComponent(category)}`
          }
        >
          <Button
            variant={currentCategory === category ? "default" : "outline"}
            size="sm"
          >
            {category}
          </Button>
        </Link>
      ))}
    </div>
  );
}
