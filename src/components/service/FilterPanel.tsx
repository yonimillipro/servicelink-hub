import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/review/StarRating";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: { id: string; name: string; slug: string }[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  verifiedOnly: boolean;
  onVerifiedChange: (value: boolean) => void;
  minRating: number;
  onMinRatingChange: (value: number) => void;
  onReset: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", damping: 30, stiffness: 300 } },
  exit: { x: "100%", transition: { duration: 0.2 } },
};

export function FilterPanel({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  verifiedOnly,
  onVerifiedChange,
  minRating,
  onMinRatingChange,
  onReset,
}: FilterPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 z-50 flex h-full w-[320px] max-w-[90vw] flex-col bg-card shadow-xl border-l border-border"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h3>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
              {/* Category */}
              <div>
                <Label className="text-sm font-medium text-foreground">Category</Label>
                <Select value={selectedCategory || "all"} onValueChange={onCategoryChange}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <Label className="text-sm font-medium text-foreground">Sort By</Label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Default</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low → High</SelectItem>
                    <SelectItem value="price-high">Price: High → Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Rating */}
              <div>
                <Label className="text-sm font-medium text-foreground">Minimum Rating</Label>
                <div className="mt-2 flex items-center gap-3">
                  <StarRating
                    value={minRating}
                    onChange={onMinRatingChange}
                    size="md"
                  />
                  <span className="text-sm text-muted-foreground">
                    {minRating > 0 ? `${minRating}+` : "Any"}
                  </span>
                </div>
              </div>

              {/* Verified Only */}
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Verified Providers Only
                </Label>
                <Switch checked={verifiedOnly} onCheckedChange={onVerifiedChange} />
              </div>
            </div>

            <div className="border-t border-border p-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onReset}>
                Reset All
              </Button>
              <Button className="flex-1" onClick={onClose}>
                Apply Filters
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
