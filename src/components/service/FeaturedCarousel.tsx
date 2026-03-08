import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FeaturedCard } from "./FeaturedCard";
import type { ServiceWithRelations } from "@/hooks/useServices";

interface FeaturedCarouselProps {
  services: ServiceWithRelations[];
}

const AUTO_SCROLL_SPEED = 0.6; // px per frame
const RESUME_DELAY = 3000; // ms

export function FeaturedCarousel({ services }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isPaused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();
  const rafId = useRef<number>();

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || services.length < 2) return;

    const tick = () => {
      if (!isPaused.current && el) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= maxScroll - 1) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += AUTO_SCROLL_SPEED;
        }
        checkScroll();
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [services.length, checkScroll]);

  const pause = useCallback(() => {
    isPaused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isPaused.current = false;
    }, RESUME_DELAY);
  }, []);

  const scroll = useCallback(
    (dir: "left" | "right") => {
      const el = scrollRef.current;
      if (!el) return;
      pause();
      const cardWidth = el.querySelector("[data-card]")?.clientWidth ?? 260;
      el.scrollBy({ left: dir === "left" ? -cardWidth - 16 : cardWidth + 16, behavior: "smooth" });
      setTimeout(checkScroll, 350);
      scheduleResume();
    },
    [pause, scheduleResume, checkScroll]
  );

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => checkScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [checkScroll]);

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={pause}
      onMouseLeave={scheduleResume}
      onTouchStart={pause}
      onTouchEnd={scheduleResume}
    >
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 shadow-md backdrop-blur-sm border border-border transition-all hover:bg-card hover:scale-110",
          "sm:h-10 sm:w-10",
          !canScrollLeft && "pointer-events-none opacity-0"
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-card/80 shadow-md backdrop-blur-sm border border-border transition-all hover:bg-card hover:scale-110",
          "sm:h-10 sm:w-10",
          !canScrollRight && "pointer-events-none opacity-0"
        )}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4 text-foreground sm:h-5 sm:w-5" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto px-1 py-2 scrollbar-hide sm:gap-4"
        style={{ scrollBehavior: "auto" }}
      >
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            data-card
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            className="w-[180px] flex-shrink-0 sm:w-[220px] lg:w-[260px]"
          >
            <FeaturedCard service={service} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
