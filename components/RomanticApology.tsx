"use client";

import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Music2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { apology } from "@/data/apology";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

const softTransition = { duration: 0.75, ease: [0.22, 1, 0.36, 1] };
const petalTransition = { duration: 8, repeat: Infinity, ease: "easeInOut" };

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function subscribeToReducedMotion(onStoreChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function useStableReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, getServerReducedMotionSnapshot);
}

function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-rose">{eyebrow}</p>
      ) : null}
      <h2 className="font-serif text-4xl font-semibold leading-tight text-burgundy md:text-6xl">{title}</h2>
    </div>
  );
}

function PhotoImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 620px"
        className="scale-105 object-cover opacity-[0.22] blur-md saturate-90"
        aria-hidden="true"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ivory/18" />
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 620px"
        className="object-contain p-1"
      />
    </>
  );
}

function FloralOpening({ onEnter }: { onEnter: () => void }) {
  const reducedMotion = useStableReducedMotion();

  return (
    <motion.section
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-paper-grain text-cocoa"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(14px)" }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#f4dba8]/45 to-transparent" />
        <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-moss/10 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-rose/10 blur-3xl" />
        {Array.from({ length: 8 }, (_, index) => (
          <motion.span
            key={index}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#e5b83d]/30"
            style={{ left: `${12 + ((index * 23) % 76)}%`, top: `${18 + ((index * 31) % 58)}%` }}
            animate={reducedMotion ? undefined : { y: [0, -16, 0], opacity: [0.08, 0.38, 0.08] }}
            transition={{ duration: 6 + (index % 3), repeat: Infinity, delay: index * 0.24 }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-xl px-5 text-center sm:px-6">
        <p className="font-script text-5xl leading-none text-burgundy sm:text-7xl">
          <span className="block">Hey,</span>
          <span className="block">{apology.herName}</span>
        </p>
        <h1 className="mx-auto mt-5 max-w-md text-balance font-serif text-[1.55rem] font-semibold leading-tight text-cocoa sm:text-4xl md:text-5xl">
          {apology.opening.line}
        </h1>
        <button
          type="button"
          onClick={onEnter}
          className="focus-ring mt-10 rounded-full bg-[#f5c84b] px-7 py-4 text-xs font-bold uppercase tracking-[0.14em] text-cocoa shadow-soft transition hover:-translate-y-0.5 hover:bg-[#ffd762] sm:px-9 sm:text-sm"
        >
          {apology.opening.button}
        </button>
      </div>
    </motion.section>
  );
}

function AmbientMusic() {
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const youtubeSrc = `https://www.youtube.com/embed/${apology.youtubeMusicId}?autoplay=1&loop=1&playlist=${apology.youtubeMusicId}&playsinline=1&controls=0&disablekb=1&modestbranding=1&rel=0&enablejsapi=1`;

  const sendCommand = (func: "playVideo" | "pauseVideo" | "mute" | "unMute") => {
    playerRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args: [] }),
      "https://www.youtube.com"
    );
  };

  const togglePlay = () => {
    sendCommand(playing ? "pauseVideo" : "playVideo");
    setPlaying((value) => !value);
  };

  const toggleMute = () => {
    sendCommand(muted ? "unMute" : "mute");
    setMuted((value) => !value);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-white/55 bg-ivory/85 px-2 py-2 shadow-soft backdrop-blur-md">
      <iframe
        ref={playerRef}
        title="Background music"
        src={youtubeSrc}
        allow="autoplay; encrypted-media"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />
      <Music2 aria-hidden="true" className="ml-1 h-4 w-4 text-burgundy" />
      <button
        type="button"
        className="focus-ring rounded-full bg-burgundy p-2 text-white"
        onClick={togglePlay}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <button
        type="button"
        className="focus-ring rounded-full border border-burgundy/15 p-2 text-burgundy"
        onClick={toggleMute}
        aria-label={muted ? "Unmute music" : "Mute music"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

function MemoryLightbox({
  index,
  setIndex
}: {
  index: number | null;
  setIndex: Dispatch<SetStateAction<number | null>>;
}) {
  const active = index === null ? null : apology.memories[index];

  useEffect(() => {
    if (index === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowRight") setIndex((index + 1) % apology.memories.length);
      if (event.key === "ArrowLeft") setIndex((index - 1 + apology.memories.length) % apology.memories.length);
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, setIndex]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Memory photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close photo viewer"
            onClick={() => setIndex(null)}
            className="focus-ring absolute right-4 top-4 rounded-full bg-ivory p-3 text-burgundy shadow-soft"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => setIndex((index! - 1 + apology.memories.length) % apology.memories.length)}
            className="focus-ring absolute left-3 top-1/2 rounded-full bg-ivory/90 p-3 text-burgundy shadow-soft md:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <motion.figure
            key={active.src}
            className="w-full max-w-5xl"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={softTransition}
          >
            <div className="relative mx-auto aspect-[4/5] max-h-[78vh] overflow-hidden rounded-[2rem] bg-parchment shadow-photo md:aspect-[16/10]">
              <PhotoImage src={active.src} alt={active.alt} />
            </div>
            <figcaption className="mt-4 text-center font-script text-4xl text-ivory">{active.caption}</figcaption>
          </motion.figure>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => setIndex((index! + 1) % apology.memories.length)}
            className="focus-ring absolute right-3 top-1/2 rounded-full bg-ivory/90 p-3 text-burgundy shadow-soft md:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FinalMemoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="One more memory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-ivory p-4 shadow-photo md:p-5"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={softTransition}
          >
            <button
              type="button"
              aria-label="Close memory"
              onClick={onClose}
              className="focus-ring absolute right-6 top-6 z-10 rounded-full bg-ivory/90 p-2 text-burgundy shadow-soft"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-parchment md:aspect-[5/3]">
              <PhotoImage src={apology.finalImage} alt="One more meaningful memory" />
            </div>
            <p className="px-2 py-6 text-center font-serif text-3xl leading-tight text-burgundy md:text-4xl">
              {apology.final.favoriteMemoryCaption}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FallingPetals({ active = true }: { active?: boolean }) {
  const reducedMotion = useStableReducedMotion();
  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute h-3 w-5 rounded-[100%_0_100%_0] bg-[#e8a4a7]/55"
          style={{ left: `${(index * 13) % 96}%`, top: "-8%" }}
          animate={
            reducedMotion
              ? undefined
              : {
                  y: ["0vh", "115vh"],
                  x: [0, index % 2 ? 28 : -24, index % 3 ? -14 : 18],
                  rotate: [0, 160, 310],
                  opacity: [0, 0.75, 0]
                }
          }
          transition={{ ...petalTransition, delay: index * 0.28, duration: 7 + (index % 5) }}
        />
      ))}
    </div>
  );
}

function SunflowerBloom({ show }: { show: boolean }) {
  const reducedMotion = useStableReducedMotion();
  if (!show) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(246,195,67,0.34),transparent_34%),radial-gradient(circle_at_50%_70%,rgba(182,106,116,0.18),transparent_42%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 1.2 }}
      />
      <FallingPetals />
      {Array.from({ length: 16 }, (_, index) => (
        <motion.span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#f6c343]/65"
          style={{ left: `${10 + ((index * 17) % 78)}%`, top: `${22 + ((index * 19) % 55)}%` }}
          animate={reducedMotion ? undefined : { scale: [0.5, 1.5, 0.5], opacity: [0.25, 0.9, 0.25] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.14 }}
        />
      ))}
    </div>
  );
}

function FinalQuestionSection({
  onOpenMemory
}: {
  onOpenMemory: () => void;
}) {
  const reducedMotion = useStableReducedMotion();
  const [choice, setChoice] = useState<"yes" | null>(null);
  const [notYetMoves, setNotYetMoves] = useState(0);
  const [notYetOffset, setNotYetOffset] = useState({ x: 0, y: 0 });
  const disabled = choice === "yes";

  const moveNotYet = () => {
    if (reducedMotion || choice) return;
    const offsets = [
      { x: 18, y: -8 },
      { x: -18, y: 14 },
      { x: 22, y: 18 },
      { x: -24, y: -12 },
      { x: 10, y: 24 },
      { x: 0, y: -18 }
    ];
    setNotYetOffset(offsets[notYetMoves % offsets.length]);
    setNotYetMoves((count) => count + 1);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-ivory via-[#f7dfbf] to-[#c97857] px-5 py-24 text-cocoa md:px-10 md:py-32">
      <FallingPetals active={!disabled} />
      <SunflowerBloom show={choice === "yes"} />
      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-5xl flex-col items-center justify-center text-center">
        <motion.div
          className="relative mb-8 h-64 w-64 overflow-hidden rounded-[45%_55%_50%_50%/55%_45%_55%_45%] border-[10px] border-ivory/75 bg-parchment shadow-photo md:h-80 md:w-80"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={softTransition}
        >
          <PhotoImage src={apology.finalImage} alt="A meaningful photograph together" />
        </motion.div>

        <AnimatePresence mode="wait">
          {choice === "yes" ? (
            <motion.div
              key="yes"
              className="max-w-3xl rounded-[1.5rem] bg-ivory/78 p-7 shadow-soft backdrop-blur-md md:p-10"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softTransition, delay: reducedMotion ? 0 : 1.7 }}
            >
              <h2 className="font-serif text-4xl font-semibold text-burgundy md:text-6xl">{apology.final.acceptanceTitle}</h2>
              <p className="mt-5 text-lg leading-8 text-cocoa/82 md:text-xl">{apology.final.acceptanceText}</p>
              <p className="mt-5 text-lg leading-8 text-cocoa/82 md:text-xl">{apology.final.acceptanceClosing}</p>
              <p className="mt-8 text-cocoa/70">With love,</p>
              <p className="font-script text-6xl text-burgundy">{apology.myName}</p>
              <button
                type="button"
                onClick={onOpenMemory}
                className="focus-ring mt-8 rounded-full bg-[#f5c84b] px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-cocoa shadow-soft transition hover:-translate-y-0.5"
              >
                See our favourite memory
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              className="max-w-3xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={softTransition}
            >
              <p className="font-serif text-3xl leading-tight text-cocoa/82 md:text-5xl">{apology.final.questionIntro}</p>
              <h2 className="mt-5 font-serif text-5xl font-semibold leading-none text-burgundy md:text-8xl">
                {apology.final.question}
              </h2>
              <div aria-hidden="true" className="mx-auto mt-7 h-px w-48 bg-gradient-to-r from-transparent via-rose/70 to-transparent" />
              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-cocoa/78 md:text-xl">{apology.final.reassurance}</p>
              <div className="relative mx-auto mt-10 flex min-h-32 max-w-2xl flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-white/45 bg-ivory/35 p-5 backdrop-blur sm:flex-row sm:gap-5">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setChoice("yes")}
                  className="focus-ring w-full rounded-full bg-[#f5c84b] px-7 py-4 text-sm font-bold uppercase tracking-[0.13em] text-cocoa shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed sm:w-auto"
                >
                  Yes
                </button>
                <motion.button
                  type="button"
                  disabled={disabled}
                  onMouseEnter={moveNotYet}
                  onClick={moveNotYet}
                  animate={notYetOffset}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="focus-ring w-full rounded-full border border-cocoa/35 bg-transparent px-7 py-4 text-sm font-bold uppercase tracking-[0.13em] text-cocoa transition hover:bg-white/20 disabled:cursor-not-allowed sm:w-auto"
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function RomanticApology() {
  const [opened, setOpened] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [finalModalOpen, setFinalModalOpen] = useState(false);
  const reducedMotion = useStableReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 900], reducedMotion ? [0, 0] : [0, 120]);

  useEffect(() => {
    const updateVisibility = () => {
      document.documentElement.classList.toggle("motion-paused", document.hidden);
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") !== "main") return;

    window.setTimeout(() => {
      setOpened(true);
      const target = window.location.hash.replace("#", "");
      window.setTimeout(() => {
        if (target) scrollToId(target);
      }, 220);
    }, 0);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        left: `${8 + ((index * 19) % 86)}%`,
        top: `${10 + ((index * 23) % 78)}%`,
        delay: index * 0.45
      })),
    []
  );

  const enter = () => {
    setOpened(true);
    window.setTimeout(() => scrollToId("hero"), 180);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-paper-grain">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.span
            key={`${particle.left}-${particle.top}`}
            className="absolute h-2 w-2 rounded-full bg-rose/25"
            style={{ left: particle.left, top: particle.top }}
            animate={reducedMotion ? undefined : { y: [0, -18, 0], opacity: [0.2, 0.55, 0.2] }}
            transition={{ duration: 7, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      <AnimatePresence>
        {!opened ? <FloralOpening onEnter={enter} /> : null}
      </AnimatePresence>

      {opened ? <AmbientMusic /> : null}

      <section id="hero" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-ivory via-[#fff3df] to-[#f3d4ad] text-cocoa">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{ y: heroY }}
        >
          <div className="absolute left-[10%] top-[14%] h-64 w-64 rounded-full bg-rose/10 blur-3xl" />
          <div className="absolute right-[8%] top-[18%] h-80 w-80 rounded-full bg-[#f5c84b]/20 blur-3xl" />
        </motion.div>
        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-24 md:grid-cols-[0.92fr_1.08fr] md:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={softTransition}
            variants={fadeUp}
            className="max-w-2xl"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.26em] text-rose">A quiet apology</p>
            <h1 className="font-serif text-5xl font-semibold leading-[0.95] text-burgundy md:text-7xl">
              {apology.hero.title}
            </h1>
            <p className="mt-6 text-lg font-medium leading-8 text-cocoa/78 md:text-2xl">
              {apology.hero.text}
            </p>
          </motion.div>
          <motion.div
            className="relative mx-auto aspect-[3/4] w-full max-w-[500px] overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/45 p-3 shadow-photo backdrop-blur-sm md:max-w-[560px]"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...softTransition, delay: 0.12 }}
          >
            <div className="relative h-full overflow-hidden rounded-[1.35rem] bg-parchment">
              <PhotoImage src={apology.heroImage} alt="A favourite photograph together" priority />
            </div>
          </motion.div>
        </div>
        <motion.div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 h-12 w-px bg-burgundy/35"
          animate={reducedMotion ? undefined : { scaleY: [0.35, 1, 0.35], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </section>

      <section className="relative px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          <SectionTitle title={apology.acknowledgement.title} />
          <div className="mt-12 space-y-7 text-lg leading-9 text-cocoa/82 md:text-2xl md:leading-10">
            {apology.acknowledgement.paragraphs.map((paragraph) => (
              <motion.p key={paragraph} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }} variants={fadeUp} transition={softTransition}>
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-ivory px-5 py-24 md:px-10 md:py-32">
        <SectionTitle eyebrow="What I understand now" title="The part I needed to sit with." />
        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
          {apology.understandings.map((item, index) => (
            <motion.article
              key={item.title}
              className="rounded-lg border border-burgundy/10 bg-white/58 p-7 shadow-soft backdrop-blur"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
              transition={{ ...softTransition, delay: index * 0.08 }}
            >
              <div className="mb-8 h-px w-16 bg-rose" />
              <h3 className="font-serif text-3xl font-semibold text-burgundy">{item.title}</h3>
              <p className="mt-4 leading-7 text-cocoa/76">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="memories" className="relative overflow-hidden px-5 py-24 md:px-10 md:py-32">
        <SectionTitle title="What we have means more than one difficult moment." />
        <div className="mx-auto mt-14 grid max-w-6xl auto-rows-[260px] grid-cols-1 gap-6 md:grid-cols-4 md:auto-rows-[230px]">
          {apology.memories.map((memory, index) => {
            const wide = memory.variant === "wide";
            const tall = memory.variant === "tall";
            return (
              <motion.button
                type="button"
                key={memory.src}
                onClick={() => setLightboxIndex(index)}
                aria-label={`Open photo: ${memory.caption}`}
                className={`focus-ring group relative overflow-hidden rounded-[1.1rem] border border-burgundy/10 bg-white p-3 text-left shadow-photo transition duration-500 hover:-translate-y-1 ${
                  wide ? "md:col-span-2" : ""
                } ${tall ? "md:row-span-2" : ""}`}
                initial={{ opacity: 0, y: 34, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ ...softTransition, delay: index * 0.06 }}
              >
                <div className="relative h-full overflow-hidden rounded-xl bg-parchment transition duration-500 group-hover:scale-[1.015]">
                  <PhotoImage src={memory.src} alt={memory.alt} />
                  <div className="absolute inset-0 bg-gradient-to-t from-cocoa/38 via-transparent to-transparent opacity-80" />
                </div>
                <p className="absolute bottom-5 left-6 right-6 font-script text-3xl leading-tight text-ivory drop-shadow sm:text-4xl">
                  {memory.caption}
                </p>
              </motion.button>
            );
          })}
        </div>
        <motion.div
          aria-hidden="true"
          className="mx-auto mt-16 h-px max-w-3xl origin-left bg-gradient-to-r from-transparent via-rose to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </section>

      <section className="relative bg-parchment/70 px-5 py-24 md:px-10 md:py-32">
        <SectionTitle title="Things I should say more often" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
          {apology.appreciations.map((message, index) => (
            <motion.div
              key={message}
              className="rounded-lg border border-white/70 bg-ivory/72 p-6 shadow-soft"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              transition={{ ...softTransition, delay: index * 0.04 }}
            >
              <p className="font-serif text-3xl leading-snug text-burgundy">{message}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="letter" className="relative px-5 py-24 md:px-10 md:py-32">
        <div className="paper-texture mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] border border-burgundy/10 bg-[#fffaf1] p-7 shadow-photo md:p-14">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.22 }} transition={{ staggerChildren: 0.08 }}>
            <motion.p variants={fadeUp} className="font-script text-6xl text-rose md:text-7xl">
              {apology.letter.greeting}
            </motion.p>
            <div className="mt-8 space-y-6 text-lg leading-9 text-cocoa/82 md:text-xl md:leading-9">
              {apology.letter.paragraphs.map((paragraph) => (
                <motion.p key={paragraph} variants={fadeUp}>
                  {paragraph}
                </motion.p>
              ))}
            </div>
            <motion.div variants={fadeUp} className="mt-10">
              <p className="text-cocoa/75">{apology.letter.closing}</p>
              <p className="mt-1 font-script text-5xl text-burgundy sm:text-6xl">{apology.myName}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-ivory px-5 py-24 md:px-10 md:py-32">
        <SectionTitle title="Not just promises, changes." />
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          {apology.promises.map((promise, index) => (
            <motion.div
              key={promise}
              className="flex gap-4 rounded-lg border border-burgundy/10 bg-white/62 p-6 shadow-soft"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
              transition={{ ...softTransition, delay: index * 0.05 }}
            >
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-burgundy text-ivory">
                {index + 1}
              </span>
              <p className="text-lg leading-8 text-cocoa/80">{promise}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <FinalQuestionSection onOpenMemory={() => setFinalModalOpen(true)} />

      <MemoryLightbox index={lightboxIndex} setIndex={setLightboxIndex} />
      <FinalMemoryModal open={finalModalOpen} onClose={() => setFinalModalOpen(false)} />
    </main>
  );
}
