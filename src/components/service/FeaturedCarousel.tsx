import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FeaturedCard } from "./FeaturedCard";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ServiceWithRelations } from "@/hooks/useServices";

interface FeaturedCarouselProps {
  services: ServiceWithRelations[];
}

const AUTO_SCROLL_SPEED = 0.6; // px per frame (desktop/tablet)
const RESUME_DELAY = 3000; // ms

export function FeaturedCarousel({ services }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const isPaused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>();
  const rafId = useRef<number>();
  const isMobile = useIsMobile();

  // Mobile: index-based single-card auto-scroll
  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileTimer = useRef<ReturnType<typeof setTimeout>>();

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  // Desktop/tablet: continuous auto-scroll
  useEffect(() => {
    if (isMobile) return;
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
  }, [services.length, checkScroll, isMobile]);

  // Mobile: timed single-card auto-scroll
  useEffect(() => {
    if (!isMobile || services.length < 2) return;

    const startTimer = () => {
      mobileTimer.current = setTimeout(() => {
        if (!isPaused.current) {
          setMobileIndex((prev) => (prev + 1) % services.length);
        }
        startTimer();
      }, 3500);
    };

    startTimer();
    return () => {
      if (mobileTimer.current) clearTimeout(mobileTimer.current);
    };
  }, [isMobile, services.length]);

  // Mobile: scroll to active index
  useEffect(() => {
    if (!isMobile) return;
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[mobileIndex] as HTMLElement | undefined;
    if (card) {
      el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
    }
  }, [mobileIndex, isMobile]);

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
      if (isMobile) {
        setMobileIndex((prev) =>
          dir === "left"
            ? (prev - 1 + services.length) % services.length
            : (prev + 1) % services.length
        );
      } else {
        const cardWidth = el.querySelector("[data-card]")?.clientWidth ?? 260;
        el.scrollBy({ left: dir === "left" ? -cardWidth - 16 : cardWidth + 16, behavior: "smooth" });
        setTimeout(checkScroll, 350);
      }
      scheduleResume();
    },
    [pause, scheduleResume, checkScroll, isMobile, services.length]
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
          "absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-card/80 shadow-md backdrop-blur-sm border border-border transition-all hover:bg-card hover:scale-110",
          "sm:h-9 sm:w-9 md:h-10 md:w-10",
          !isMobile && !canScrollLeft && "pointer-events-none opacity-0"
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-3.5 w-3.5 text-foreground sm:h-4 sm:w-4 md:h-5 md:w-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-card/80 shadow-md backdrop-blur-sm border border-border transition-all hover:bg-card hover:scale-110",
          "sm:h-9 sm:w-9 md:h-10 md:w-10",
          !isMobile && !canScrollRight && "pointer-events-none opacity-0"
        )}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-3.5 w-3.5 text-foreground sm:h-4 sm:w-4 md:h-5 md:w-5" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-3 overflow-x-auto py-2 scrollbar-hide sm:gap-4",
          isMobile ? "snap-x snap-mandatory px-8" : "px-1"
        )}
        style={{ scrollBehavior: "auto" }}
      >
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            data-card
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.04 }}
            className={cn(
              "flex-shrink-0",
              isMobile
                ? "w-[calc(100vw-6rem)] max-w-[300px] snap-center"
                : "w-[180px] sm:w-[220px] lg:w-[260px]"
            )}
          >
            <FeaturedCard service={service} />
          </motion.div>
        ))}
      </div>

      {/* Mobile dot indicators */}
      {isMobile && services.length > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => { pause(); setMobileIndex(i); scheduleResume(); }}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === mobileIndex ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
