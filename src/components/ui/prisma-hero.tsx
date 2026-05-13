import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp = ({
  text,
  className = "",
  showAsterisk = false,
  style,
}: WordsPullUpProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={word}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-block"
            style={{ marginRight: isLast ? 0 : "0.25em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

interface Segment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle = ({
  segments,
  className = "",
  style,
}: WordsPullUpMultiStyleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((word) => {
      if (word) words.push({ word, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={`${word.word}-${i}`}
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${word.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {word.word}
        </motion.span>
      ))}
    </div>
  );
};

const navItems = [
  { label: "Projects", href: "#samples" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Shop", href: "#shop", action: "shop" },
  { label: "Domains", href: "#formats" },
  { label: "Contact", href: "#contact" },
];

const heroWords = ["CSE", "AI/ML", "Cybersecurity", "Data Science", "CN", "CSBS", "Software"];

const RotatingHeroWord = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % heroWords.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, []);

  const currentWord = heroWords[wordIndex];

  return (
    <span className="inline-block max-w-full">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentWord}
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative inline-block max-w-full"
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

interface CollageHeroProps {
  onShopClick?: () => void;
}

export const heroMediaSrc =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4";

const CollageHero = ({ onShopClick }: CollageHeroProps) => {
  return (
    <section className="h-[100svh] w-full p-2 sm:p-3">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src={heroMediaSrc}
        />

        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <nav className="absolute left-1/2 top-0 z-20 w-[calc(100%-1rem)] max-w-fit -translate-x-1/2">
          <div className="flex items-center justify-center gap-3 rounded-b-2xl bg-black px-3 py-2 sm:gap-5 sm:px-4 md:gap-8 md:rounded-b-3xl md:px-7 lg:gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(event) => {
                  if (item.action === "shop" && onShopClick) {
                    event.preventDefault();
                    onShopClick();
                  }
                }}
                className="whitespace-nowrap text-[10px] transition-colors sm:text-xs md:text-sm"
                style={{ color: "rgba(225, 224, 204, 0.8)" }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.color = "#E1E0CC";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.color = "rgba(225, 224, 204, 0.8)";
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-end gap-x-8 gap-y-5">
            <div className="col-span-12 min-w-0 lg:col-span-7 xl:col-span-8">
              <h1
                className="max-w-full overflow-hidden text-[clamp(2.75rem,13.5vw,6rem)] font-medium leading-[0.9] tracking-normal sm:text-[clamp(4.5rem,12vw,9rem)] md:text-[clamp(5.5rem,10vw,10rem)] lg:text-[clamp(6.25rem,8.2vw,10rem)] xl:text-[clamp(7rem,8vw,11rem)]"
                style={{ color: "#E1E0CC" }}
              >
                <RotatingHeroWord />
              </h1>
            </div>

            <div className="col-span-12 flex min-w-0 flex-col gap-5 pb-3 lg:col-span-5 lg:pb-10 xl:col-span-4">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl text-xs text-white/90 sm:text-sm md:text-base"
                style={{ lineHeight: 1.2 }}
              >
                Projects for BTech, CSE, AI/ML, Cybersecurity, Data Science, CN, CSBS, IT and
                software engineering branches. Share your topic, deadline and preferred stack; we
                build working software with code, report, PPT and demo flow.
              </motion.p>

              <motion.a
                href="#contact"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center gap-2 self-start rounded-full bg-primary py-1 pl-5 pr-1 text-sm font-medium text-black transition-all hover:gap-3 sm:text-base"
              >
                Start project
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4" style={{ color: "#E1E0CC" }} />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CollageHero };
