"use client";

import Image from "next/image";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore
} from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Music2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import { apology } from "@/data/apology";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

const softTransition = { duration: 0.75, ease: [0.22, 1, 0.36, 1] };
const petalTransition = { duration: 8, repeat: Infinity, ease: "easeInOut" };

type SunflowerConfig = {
  id: string;
  side: "left" | "right";
  offset: string;
  width: number;
  height: number;
  delay: number;
  tilt: number;
  sway: number;
  duration: number;
  className?: string;
};

const sunflowerPetals = Array.from({ length: 18 }, (_, index) => index * 20);

const desktopSunflowers: SunflowerConfig[] = [
  { id: "left-edge-tall", side: "left", offset: "-2.5rem", width: 210, height: 360, delay: 0, tilt: -8, sway: 2.2, duration: 7.8 },
  { id: "left-mid", side: "left", offset: "7%", width: 150, height: 285, delay: 0.28, tilt: 5, sway: -1.8, duration: 8.6 },
  { id: "left-low", side: "left", offset: "17%", width: 118, height: 225, delay: 0.62, tilt: -2, sway: 1.5, duration: 7.2 },
  { id: "right-edge-tall", side: "right", offset: "-3.5rem", width: 230, height: 390, delay: 0.16, tilt: 8, sway: -2.3, duration: 8.2 },
  { id: "right-mid", side: "right", offset: "8%", width: 165, height: 305, delay: 0.46, tilt: -4, sway: 1.7, duration: 7.6 },
  { id: "right-low", side: "right", offset: "20%", width: 120, height: 235, delay: 0.88, tilt: 3, sway: -1.4, duration: 8.9 },
  { id: "far-left-depth", side: "left", offset: "-5.5rem", width: 150, height: 260, delay: 0.78, tilt: 11, sway: 1.2, duration: 9.1 }
];

const mobileSunflowers: SunflowerConfig[] = [
  { id: "mobile-left", side: "left", offset: "1.25rem", width: 106, height: 198, delay: 0.05, tilt: -3, sway: 1.1, duration: 8.4 },
  { id: "mobile-left-small", side: "left", offset: "18%", width: 78, height: 148, delay: 0.48, tilt: 5, sway: -1, duration: 7.6 },
  { id: "mobile-right", side: "right", offset: "2rem", width: 110, height: 204, delay: 0.24, tilt: 3, sway: -1.1, duration: 8 },
  { id: "mobile-right-small", side: "right", offset: "26%", width: 72, height: 140, delay: 0.76, tilt: -3, sway: 0.85, duration: 8.8 }
];

function getMotionSeed(value: string) {
  return Array.from(value).reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
}

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
  const reducedMotion = useStableReducedMotion();
  const seed = useMemo(() => getMotionSeed(src), [src]);
  const drift = 3 + (seed % 4);
  const rotation = 0.28 + (seed % 3) * 0.12;
  const duration = 8 + (seed % 5);
  const delay = (seed % 7) * 0.18;

  return (
    <>
      <motion.div
        className="absolute inset-0 scale-105"
        aria-hidden="true"
        animate={
          reducedMotion
            ? undefined
            : {
                scale: [1.05, 1.08, 1.05],
                x: [-drift, drift, -drift],
                y: [drift, -drift, drift]
              }
        }
        transition={{ duration: duration + 2, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 620px"
          className="object-cover opacity-[0.22] blur-md saturate-90"
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-ivory/18" />
      <motion.div
        className="absolute inset-0"
        animate={
          reducedMotion
            ? undefined
            : {
                scale: [1, 1.018, 1],
                rotate: [-rotation, rotation, -rotation],
                y: [0, -drift, 0]
              }
        }
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 620px"
          className="object-contain p-1"
        />
      </motion.div>
    </>
  );
}

function Sunflower({ flower, reducedMotion }: { flower: SunflowerConfig; reducedMotion: boolean }) {
  const sideStyle = flower.side === "left" ? { left: flower.offset } : { right: flower.offset };
  const settledRotation = reducedMotion ? flower.tilt : [flower.tilt, flower.tilt + flower.sway, flower.tilt - flower.sway * 0.7, flower.tilt];
  const stemTransition = reducedMotion ? { duration: 0 } : { duration: 1, delay: flower.delay, ease: [0.22, 1, 0.36, 1] };
  const leafTransition = reducedMotion ? { duration: 0 } : { duration: 0.55, delay: flower.delay + 0.9, ease: [0.22, 1, 0.36, 1] };
  const headTransition = reducedMotion ? { duration: 0 } : { duration: 0.45, delay: flower.delay + 1.34, ease: [0.22, 1, 0.36, 1] };

  return (
    <motion.div
      className={`absolute bottom-[-0.5rem] origin-bottom ${flower.className ?? ""}`}
      style={{ ...sideStyle, width: flower.width, height: flower.height, transformOrigin: "50% 100%" }}
      initial={{ rotate: flower.tilt }}
      animate={{ rotate: settledRotation }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: flower.duration, repeat: Infinity, ease: "easeInOut", delay: flower.delay + 2.7 }
      }
    >
      <svg className="h-full w-full overflow-visible" viewBox="0 -56 160 336" fill="none" aria-hidden="true">
        <motion.path
          d="M80 276 C76 224 86 176 80 128 C75 92 82 66 84 46"
          stroke="#6f7461"
          strokeWidth="7"
          strokeLinecap="round"
          pathLength={1}
          initial={{ pathLength: reducedMotion ? 1 : 0, opacity: reducedMotion ? 1 : 0.82 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={stemTransition}
        />
        <motion.path
          d="M77 186 C46 171 33 144 34 118 C61 124 80 144 82 174"
          fill="#7b8068"
          opacity="0.82"
          initial={{ scale: reducedMotion ? 1 : 0, rotate: -18, opacity: reducedMotion ? 0.82 : 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 0.82 }}
          transition={leafTransition}
          style={{ transformBox: "fill-box", transformOrigin: "85% 75%" }}
        />
        <motion.path
          d="M84 148 C113 136 130 112 128 88 C102 94 84 113 80 140"
          fill="#70765f"
          opacity="0.76"
          initial={{ scale: reducedMotion ? 1 : 0, rotate: 18, opacity: reducedMotion ? 0.76 : 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 0.76 }}
          transition={{ ...leafTransition, delay: reducedMotion ? 0 : flower.delay + 1.08 }}
          style={{ transformBox: "fill-box", transformOrigin: "15% 75%" }}
        />
        <motion.g
          initial={{ scale: reducedMotion ? 1 : 0.68, opacity: reducedMotion ? 1 : 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={headTransition}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <g transform="translate(84 46)">
            {sunflowerPetals.map((angle, index) => (
              <g key={angle} transform={`rotate(${angle})`}>
                <motion.ellipse
                  cx="0"
                  cy="-28"
                  rx="8.5"
                  ry="21"
                  fill={index % 2 ? "#f5c84b" : "#e5b83d"}
                  initial={{ scale: reducedMotion ? 1 : 0, opacity: reducedMotion ? 0.96 : 0 }}
                  animate={{ scale: 1, opacity: 0.96 }}
                  transition={{
                    duration: reducedMotion ? 0 : 0.42,
                    delay: reducedMotion ? 0 : flower.delay + 1.55 + index * 0.035,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
                />
              </g>
            ))}
            <circle r="21" fill="#6f1d2f" opacity="0.94" />
            <circle r="14" fill="#3b2420" opacity="0.86" />
            <circle cx="-5" cy="-5" r="3" fill="#8d5b4c" opacity="0.75" />
            <circle cx="5" cy="4" r="2.5" fill="#8d5b4c" opacity="0.65" />
          </g>
        </motion.g>
      </svg>
    </motion.div>
  );
}

function SunflowerGarden() {
  const reducedMotion = useStableReducedMotion();
  const pollen = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        left: `${7 + ((index * 17) % 86)}%`,
        bottom: `${11 + ((index * 23) % 55)}%`,
        delay: index * 0.2,
        size: 3 + (index % 3)
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-x-0 bottom-0 h-[42vh] bg-gradient-to-t from-[#f4dba8]/30 to-transparent" />
      <div className="hidden sm:block">
        {desktopSunflowers.map((flower) => (
          <Sunflower key={flower.id} flower={flower} reducedMotion={reducedMotion} />
        ))}
      </div>
      <div className="sm:hidden">
        {mobileSunflowers.map((flower) => (
          <Sunflower key={flower.id} flower={flower} reducedMotion={reducedMotion} />
        ))}
      </div>
      {pollen.map((particle, index) => (
        <motion.span
          key={`${particle.left}-${particle.bottom}`}
          className="absolute rounded-full bg-[#f5c84b]/35 blur-[0.4px]"
          style={{ left: particle.left, bottom: particle.bottom, width: particle.size, height: particle.size }}
          initial={{ opacity: reducedMotion ? 0.26 : 0, scale: reducedMotion ? 1 : 0.7 }}
          animate={
            reducedMotion
              ? { opacity: 0.26, scale: 1 }
              : { y: [0, -18, 0], x: [0, index % 2 ? 10 : -8, 0], opacity: [0.08, 0.34, 0.08], scale: [0.75, 1, 0.75] }
          }
          transition={{ duration: 7 + (index % 4), repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut", delay: particle.delay }}
        />
      ))}
    </div>
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
        <SunflowerGarden />
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
        <h1 className="mx-auto mt-5 w-full max-w-[20rem] text-balance font-serif text-[1.55rem] font-semibold leading-tight text-cocoa sm:max-w-md sm:text-4xl md:text-5xl">
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

function AmbientMusic({
  visible,
  startRef
}: {
  visible: boolean;
  startRef: MutableRefObject<() => void>;
}) {
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const youtubeSrc = `https://www.youtube.com/embed/${apology.youtubeMusicId}?autoplay=0&loop=1&playlist=${apology.youtubeMusicId}&playsinline=1&controls=0&disablekb=1&modestbranding=1&rel=0&enablejsapi=1`;

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

  useEffect(() => {
    startRef.current = () => {
      sendCommand("unMute");
      sendCommand("playVideo");
      setMuted(false);
      setPlaying(true);
    };

    return () => {
      startRef.current = () => {};
    };
  }, [startRef]);

  return (
    <div
      className={`glass-surface fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full px-2 py-2 transition duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
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
            className="focus-ring glass-surface absolute right-4 top-4 rounded-full p-3 text-burgundy"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => setIndex((index! - 1 + apology.memories.length) % apology.memories.length)}
            className="focus-ring glass-surface absolute left-3 top-1/2 rounded-full p-3 text-burgundy md:left-8"
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
            <div className="glass-panel image-float image-float-slow relative mx-auto aspect-[4/5] max-h-[78vh] overflow-hidden rounded-[2rem] p-2 md:aspect-[16/10]">
              <PhotoImage src={active.src} alt={active.alt} />
            </div>
            <figcaption className="mt-4 text-center font-script text-4xl text-ivory">{active.caption}</figcaption>
          </motion.figure>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => setIndex((index! + 1) % apology.memories.length)}
            className="focus-ring glass-surface absolute right-3 top-1/2 rounded-full p-3 text-burgundy md:right-8"
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
            className="glass-surface relative w-full max-w-2xl overflow-hidden rounded-[2rem] p-4 md:p-5"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={softTransition}
          >
            <button
              type="button"
              aria-label="Close memory"
              onClick={onClose}
              className="focus-ring glass-surface absolute right-6 top-6 z-10 rounded-full p-2 text-burgundy"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="glass-panel image-float image-float-delay relative aspect-[4/5] overflow-hidden rounded-[1.5rem] md:aspect-[5/3]">
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
          className="relative mb-8 h-64 w-64 md:h-80 md:w-80"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={softTransition}
        >
          <div className="glass-panel image-float image-float-reverse relative h-full w-full overflow-hidden rounded-[45%_55%_50%_50%/55%_45%_55%_45%] p-3">
            <PhotoImage src={apology.finalImage} alt="A meaningful photograph together" />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {choice === "yes" ? (
            <motion.div
              key="yes"
              className="glass-surface max-w-3xl rounded-[1.5rem] p-7 md:p-10"
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
              <div className="glass-surface relative mx-auto mt-10 flex min-h-32 max-w-2xl flex-col items-center justify-center gap-4 rounded-[1.5rem] p-5 sm:flex-row sm:gap-5">
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
  const startMusicRef = useRef<() => void>(() => {});
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
    startMusicRef.current();
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
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.22),transparent_28%,rgba(255,255,255,0.12)_52%,transparent_72%),radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.24),transparent_24%)]"
      />

      <AnimatePresence>
        {!opened ? <FloralOpening onEnter={enter} /> : null}
      </AnimatePresence>

      <AmbientMusic visible={opened} startRef={startMusicRef} />

      <section id="hero" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-ivory/70 via-[#fff3df]/60 to-[#f3d4ad]/60 text-cocoa">
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
            className="relative mx-auto aspect-[3/4] w-full max-w-[500px] md:max-w-[560px]"
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...softTransition, delay: 0.12 }}
          >
            <div className="glass-panel image-float relative h-full overflow-hidden rounded-[1.75rem] p-3">
              <div className="relative h-full overflow-hidden rounded-[1.35rem] bg-white/20">
                <PhotoImage src={apology.heroImage} alt="A favourite photograph together" priority />
              </div>
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

      <section className="relative bg-white/24 px-5 py-24 backdrop-blur-sm md:px-10 md:py-32">
        <SectionTitle eyebrow="What I understand now" title="The part I needed to sit with." />
        <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
          {apology.understandings.map((item, index) => (
            <motion.article
              key={item.title}
              className="glass-surface rounded-lg p-7"
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
              <motion.div
                key={memory.src}
                className={`${wide ? "md:col-span-2" : ""} ${tall ? "md:row-span-2" : ""}`}
                initial={{ opacity: 0, y: 34, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ ...softTransition, delay: index * 0.06 }}
              >
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Open photo: ${memory.caption}`}
                  className={`focus-ring glass-panel image-float relative h-full w-full overflow-hidden rounded-[1.1rem] p-3 text-left transition duration-500 ${
                    index % 2 ? "image-float-delay image-float-reverse" : "image-float-slow"
                  }`}
                >
                  <div className="relative h-full overflow-hidden rounded-xl bg-white/20">
                    <PhotoImage src={memory.src} alt={memory.alt} />
                    <div className="absolute inset-0 bg-gradient-to-t from-cocoa/38 via-transparent to-transparent opacity-80" />
                  </div>
                  <p className="absolute bottom-5 left-6 right-6 font-script text-3xl leading-tight text-ivory drop-shadow sm:text-4xl">
                    {memory.caption}
                  </p>
                </button>
              </motion.div>
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

      <section className="relative bg-white/20 px-5 py-24 backdrop-blur-sm md:px-10 md:py-32">
        <SectionTitle title="Things I should say more often" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
          {apology.appreciations.map((message, index) => (
            <motion.div
              key={message}
              className="glass-surface rounded-lg p-6"
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
        <div className="paper-texture glass-surface mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] p-7 md:p-14">
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

      <section className="relative bg-white/24 px-5 py-24 backdrop-blur-sm md:px-10 md:py-32">
        <SectionTitle title="Not just promises, changes." />
        <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-2">
          {apology.promises.map((promise, index) => (
            <motion.div
              key={promise}
              className="glass-surface flex gap-4 rounded-lg p-6"
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
