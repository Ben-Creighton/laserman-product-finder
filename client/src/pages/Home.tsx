/**
 * Laserman official-store redesign — red-and-black trade counter UI.
 * Use the Laserman logo, commercial product imagery, compact technical labels,
 * red decision states, white evidence cards, and task-led product guidance.
 */
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Cable,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Compass,
  Crosshair,
  Droplets,
  Flame,
  Gauge,
  GitBranch,
  HomeIcon,
  Landmark,
  LocateFixed,
  Mail,
  MapPinned,
  MessageCircle,
  MoveUpRight,
  Phone,
  Pipette,
  Ruler,
  ScanLine,
  Search,
  ShieldCheck,
  Sparkles,
  Square,
  Thermometer,
  Triangle,
  Wrench,
  X,
  ZoomIn,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState, useEffect, useCallback } from "react";
import { getRecommendations, type FinderGoal, type KnowledgeProduct, type RecommendationSet, KNOWLEDGE_PRODUCTS, type Answers } from "@/data/productKnowledge";
import { PRODUCT_GALLERY } from "@/data/productImages";

type GoalId = FinderGoal;
type Option = {
  id: string;
  label: string;
  note: string;
  Icon: LucideIcon;
};

type Question = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  options: Option[];
  condition?: (answers: Answers) => boolean;
};

const ASSETS = {
  logo: "/assets/laserman-logo.png",
  cat4: "/assets/radiodetection-cat4-kit.jpg",
  cscope: "/assets/cscope-mxl4d-kit.jpg",
  cme5: "/assets/cme5.jpg",
  cmex5: "/assets/cmex5.jpg",
  b20s: "/assets/tramex-hikmicro-combo.png",
  topcon: "/assets/topcon-rl-h5b.png",
  senshin: "/assets/senshin-fk275.jpg",
  disto: "/assets/leica-disto-d2.webp",
  mt915: "/assets/major-tech-mt915.jpg",
  tramexLogo: "/assets/tramex-logo.png",
  flukeLogo: "/assets/fluke-industrial-logo.png",
};

const PRODUCT_IMAGES: Record<string, string> = {
  cat4: ASSETS.cat4,
  cscope: ASSETS.cscope,
  mt195: "/assets/major-tech-mt195.jpg",
  mt405ex: "/assets/major-tech-mt405ex.jpg",
  me5: "/assets/tramex-me5.jpg",
  mex5: "/assets/mex5.jpg",
  cme5: "/assets/cme5.jpg",
  cmex5: "/assets/cmex5.jpg",
  b20s: "/assets/b20s.jpg",
  topcon: ASSETS.topcon,
  geotape: "/assets/geotape.jpg",
  distox1: "/assets/distox1.jpg",
  distox3: "/assets/distox3.jpg",
  distod5: "/assets/distod5.jpg",
  distox6: "/assets/distox6.jpg",
  mt691: "/assets/MT691.jpg",
  rd7200: "/assets/RD7200.jpg",
  ts01: "/assets/ts01.jpg",
  prodirector7: "/assets/sl-laser-prodirector7.jpg",
  zlp2: "/assets/z-laser-zlp2.jpg",
  magicline: "/assets/magicline-laser-guide.jpg",
  "topcon-h5a": ASSETS.topcon,
  "topcon-h5b": ASSETS.topcon,
  "geofennel-fl105h": "/assets/FL_105H-Fr50.jpg",
  "geofennel-fl115h": "/assets/geo-115h.jpg",
  "spectra-ll500": "/assets/Spectra_Precision_LL500_Rotating_Laser_Level_with_HL_700_Receiver_Rotary_Laser-003.jpg",
  "geo1x": "/assets/geo1x.webp",
  "geo-axeo-3d": "/assets/axeo3d.webp",
  "imex-lx3dg": "/assets/imexlx3dg.webp",
  "geo-6x-sp": "/assets/geo6xsp.webp",
  "geo-6x-xr": "/assets/geo6xrsp.webp",
  "leica-lino-l6g-1": "/assets/lg912971.webp",
  "bear-servo-360g": "/assets/bear.webp",
  "geo-flg-70": "/assets/flg70.webp",
  "geo-fennel-fr-55": "/assets/fr55.webp",
  "geo-fennel-fr-75": "/assets/fr75.webp",
  "onyx-omni-60": "/assets/onyx.webp",
};

/**
 * Full ordered image gallery for a product. Falls back to the single
 * PRODUCT_IMAGES entry when no multi-image gallery was captured for that
 * product, so callers can always render at least one image.
 */
const getProductGallery = (productId: string): string[] => {
  const gallery = PRODUCT_GALLERY[productId];
  if (gallery && gallery.length > 0) return gallery;
  const single = PRODUCT_IMAGES[productId];
  return single ? [single] : [];
};

const searchUrl = (query: string) => `https://laserman.com.au/search?q=${encodeURIComponent(query)}`;

const GOALS: Array<Option & { id: GoalId }> = [
  { id: "find", label: "FIND", note: "Locate cables, pipes, electrical faults", Icon: LocateFixed },
  { id: "measure", label: "MEASURE", note: "Distance, moisture, temperature, thermal imaging", Icon: Gauge },
  { id: "position", label: "POSITION", note: "Project, layout, levels, survey", Icon: Compass },
];

const ROUTES: Record<GoalId, Question[]> = {
  find: [
    {
      id: "find-type",
      eyebrow: "Finding & locating",
      title: "WHAT ARE YOU LOOKING FOR?",
      description: "Choose the service or equipment you need to locate.",
      options: [
        { id: "cables", label: "Cables & power", note: "Electrical services, circuits", Icon: Zap },
        { id: "pipes", label: "Pipes & water", note: "Underground utilities", Icon: Pipette },
        { id: "electrical", label: "Electrical faults", note: "Voltage, continuity, diagnosis", Icon: ScanLine },
      ],
    },
    {
      id: "find-depth",
      eyebrow: "Finding & locating",
      title: "HOW DEEP DO YOU TYPICALLY NEED TO LOCATE?",
      description: "Depth determines whether a simple avoidance locator or active tracing kit is the better fit.",
      options: [
        { id: "shallow", label: "Under 1m", note: "General site work", Icon: Ruler },
        { id: "standard", label: "1–3m", note: "Typical utility depth", Icon: Landmark },
        { id: "deep", label: "3m+", note: "Complex or deep work", Icon: MoveUpRight },
        { id: "unsure", label: "Flexible / Other", note: "Show me a versatile option", Icon: CircleHelp },
      ],
      condition: (answers: Answers) => answers["find-type"] !== "electrical",
    },
    {
      id: "find-trace",
      eyebrow: "Finding & locating",
      title: "DO YOU NEED TO ACTIVELY TRACE THE LINE?",
      description: "Active tracing uses a transmitter to follow a known service more precisely. (Not available for electrical fault diagnosis.)",
      options: [
        { id: "yes", label: "Yes, actively trace it", note: "Follow a known line", Icon: Crosshair },
        { id: "no", label: "No, just locate / avoid", note: "Identify the service", Icon: ShieldCheck },
        { id: "unsure", label: "Flexible / Other", note: "Show flexible options", Icon: CircleHelp },
      ],
      condition: (answers: Answers) => answers["find-type"] !== "electrical",
    },
  ],
  measure: [
    {
      id: "measure-type",
      eyebrow: "Measuring & sensing",
      title: "WHAT DO YOU NEED TO MEASURE?",
      description: "Choose your primary measurement task.",
      options: [
        { id: "distance", label: "Distance", note: "Interior or site dimensions", Icon: Ruler },
        { id: "moisture", label: "Moisture", note: "Materials, buildings, concrete", Icon: Droplets },
        { id: "temperature", label: "Temperature", note: "Spot checks or thermal scans", Icon: Thermometer },
      ],
    },
    // DISTANCE branch: ask range only
    {
      id: "measure-range",
      eyebrow: "Measuring & sensing",
      title: "WHAT'S YOUR TYPICAL WORKING RANGE?",
      description: "Tells us which distance meter fits your job size.",
      options: [
        { id: "short", label: "Short / compact", note: "Up to 20m", Icon: Ruler },
        { id: "medium", label: "Medium", note: "20–100m", Icon: MoveUpRight },
        { id: "long", label: "Long / professional", note: "100m+ or outdoor survey work", Icon: Compass },
        { id: "unsure", label: "Flexible / Other", note: "Show me a versatile option", Icon: CircleHelp },
      ],
      condition: (answers: Answers) => answers["measure-type"] === "distance",
    },
    // MOISTURE branch: ask substrate only
    {
      id: "moisture-substrate",
      eyebrow: "Measuring & sensing",
      title: "WHAT MATERIAL ARE YOU TESTING?",
      description: "Concrete requires specialized tools; general buildings use broader-range meters.",
      options: [
        { id: "general", label: "General building", note: "Drywall, plaster, wood, finishes", Icon: HomeIcon },
        { id: "concrete", label: "Concrete / structural", note: "Pre-coating readiness, compliance testing", Icon: Building2 },
        { id: "unsure", label: "Flexible / Other", note: "General meter works for most jobs", Icon: CircleHelp },
      ],
      condition: (answers: Answers) => answers["measure-type"] === "moisture",
    },
    // TEMPERATURE branch: just use the measurement type (no extra questions needed)
  ],
  position: [
    {
      id: "position-type",
      eyebrow: "Positioning & layout",
      title: "WHAT'S YOUR PRIMARY POSITIONING TASK?",
      description: "Tell us what you're setting up or laying out.",
      options: [
        { id: "rotary-levels", label: "Rotary lasers", note: "360° rotating reference, large areas", Icon: Gauge },
        { id: "laser-levels", label: "Laser levels", note: "Cross-line & multi-line handheld lasers", Icon: Triangle },
        { id: "receivers", label: "Laser receivers", note: "Extend range & accuracy for existing lasers", Icon: Compass },
        { id: "layout", label: "Layout & projection", note: "Pattern, template, factory positioning", Icon: Triangle },
        { id: "survey", label: "Survey & mapping", note: "High-precision angle/distance measurement", Icon: Crosshair },
      ],
    },

    // LASER RECEIVERS branch: ask receiver type
    {
      id: "receiver-type",
      eyebrow: "Laser receivers",
      title: "WHAT TYPE OF RECEIVER DO YOU NEED?",
      description: "Receivers extend working range and improve detection accuracy for laser levels.",
      options: [
        { id: "singleline", label: "Single-line (cross-line) lasers", note: "Detects one line at a time, cost-effective", Icon: Zap },
        { id: "multiline", label: "Multi-line lasers", note: "Detects multiple simultaneous lines, professional grade", Icon: Compass },
        { id: "universal", label: "Universal (works with both)", note: "Compatible with any laser level type", Icon: GitBranch },
      ],
      condition: (answers: Answers) => answers["position-type"] === "receivers",
    },

    // ROTARY LEVELS branch: ask environment, then accuracy, then range
    {
      id: "position-environment",
      eyebrow: "Positioning & layout",
      title: "WHERE ARE YOU WORKING?",
      description: "Indoor and outdoor work often need different tools.",
      options: [
        { id: "outdoor", label: "Outdoor / site", note: "Construction, site reference", Icon: Landmark },
        { id: "indoor", label: "Indoor / factory", note: "Interior alignment, manufacturing", Icon: Crosshair },
        { id: "both", label: "Both", note: "Need versatility", Icon: GitBranch },
      ],
      condition: (answers: Answers) => answers["position-type"] === "rotary-levels",
    },

    // LASER LEVELS branch: ask trade first
    {
      id: "laser-trade",
      eyebrow: "Laser levels",
      title: "WHAT'S YOUR TRADE?",
      description: "We'll recommend the right laser level for your work.",
      options: [
        { id: "builders", label: "Builders", note: "General construction & site work", Icon: Building2 },
        { id: "cabinets", label: "Cabinet makers & joiners", note: "Precision cabinetry & woodwork", Icon: Wrench },
        { id: "tilers", label: "Tilers", note: "Floor & wall tiling", Icon: Square },
        { id: "electricians", label: "Electricians", note: "Conduit & fixture routing", Icon: Zap },
        { id: "plumbers", label: "Plumbers", note: "Drainage & fixture positioning", Icon: Pipette },
      ],
      condition: (answers: Answers) => answers["position-type"] === "laser-levels",
    },

    // LASER LEVELS: Indoor/Outdoor
    {
      id: "laser-environment",
      eyebrow: "Laser levels",
      title: "WHERE ARE YOU WORKING?",
      description: "Choose your primary work environment.",
      options: [
        { id: "indoor", label: "Indoor", note: "Interior spaces & workshops", Icon: HomeIcon },
        { id: "outdoor", label: "Outdoor", note: "Sites & open construction", Icon: Landmark },
        { id: "both", label: "Both", note: "Mix of indoor & outdoor", Icon: GitBranch },
      ],
      condition: (answers: Answers) => answers["position-type"] === "laser-levels",
    },

    // LASER LEVELS: Accuracy
    {
      id: "laser-accuracy",
      eyebrow: "Laser levels",
      title: "WHAT ACCURACY DO YOU NEED?",
      description: "Both options deliver professional results—choose based on your application.",
      options: [
        { id: "high", label: "±1mm tolerance", note: "Cabinetry, tiling, finishes where exact alignment matters", Icon: Check },
        { id: "rough", label: "±2-3mm tolerance", note: "General construction, rough positioning, layout work", Icon: Wrench },
      ],
      condition: (answers: Answers) => answers["position-type"] === "laser-levels",
    },

    // LASER LEVELS: Coverage (only for indoor/both)
    {
      id: "laser-coverage",
      eyebrow: "Laser levels",
      title: "HOW MANY AREAS DO YOU NEED TO MARK?",
      description: "Choose based on the scope of your typical job.",
      options: [
        { id: "360", label: "Multiple areas or full space", note: "Entire room/building - continuous marking saves repositioning time", Icon: Compass },
        { id: "reflines", label: "Single area or selective placement", note: "One wall or room at a time - position laser exactly where needed", Icon: Zap },
      ],
      condition: (answers: Answers) => answers["position-type"] === "laser-levels" && (answers["laser-environment"] === "indoor" || answers["laser-environment"] === "both"),
    },

    // LASER LEVELS: Wall mounting — informational unless "yes", in which case
    // the recommendation swaps to a wall-mountable pick (see laserPaths.ts).
    {
      id: "laser-wallmount",
      eyebrow: "Laser levels",
      title: "DO YOU NEED TO WALL MOUNT IT?",
      description: "Some laser levels include a wall bracket or mount for hands-free, fixed-position work.",
      options: [
        { id: "yes", label: "Yes", note: "Show me options with a wall mount included", Icon: Check },
        { id: "no", label: "No", note: "Tripod or handheld is fine", Icon: X },
        { id: "unsure", label: "Unsure", note: "Show me the best fit either way", Icon: CircleHelp },
      ],
      condition: (answers: Answers) => answers["position-type"] === "laser-levels",
    },
    {
      id: "position-accuracy",
      eyebrow: "Positioning & layout",
      title: "HOW PRECISE DOES IT NEED TO BE?",
      description: "Match your accuracy needs to the right tool.",
      options: [
        { id: "general", label: "Basic grading", note: "Concrete & excavation layout", Icon: Wrench },
        { id: "specified", label: "Precision layout", note: "Engineering tolerance work", Icon: Check },
        { id: "survey", label: "Mapping & survey", note: "Professional coordinate work", Icon: Crosshair },
        { id: "unsure", label: "Other", note: "Show me a well-rounded option", Icon: CircleHelp },
      ],
      condition: (answers: Answers) => answers["position-type"] === "rotary-levels",
    },
    {
      id: "position-range",
      eyebrow: "Positioning & layout",
      title: "WHAT'S YOUR TYPICAL WORKING RANGE?",
      description: "Larger sites need lasers with longer working range.",
      options: [
        { id: "short", label: "Short / compact", note: "Up to 300m range", Icon: Ruler },
        { id: "medium", label: "Medium range", note: "300–600m range", Icon: MoveUpRight },
        { id: "long", label: "Long range", note: "600m+ working distance", Icon: Compass },
        { id: "unsure", label: "Flexible / Other", note: "Show me a versatile option", Icon: CircleHelp },
      ],
      condition: (answers: Answers) => answers["position-type"] === "rotary-levels" && answers["position-environment"] !== "indoor",
    },

    // LAYOUT branch: ask environment only (range not applicable for factory projectors)
    {
      id: "layout-environment",
      eyebrow: "Positioning & layout",
      title: "WHAT'S YOUR PRIMARY USE CASE?",
      description: "Laser template projectors work in controlled factory and workshop environments.",
      options: [
        { id: "general", label: "Large components & assembly", note: "Prefab, precast, metal fabrication, big-area projection", Icon: Wrench },
        { id: "precision", label: "High-precision positioning", note: "Woodworking, automotive, medical devices, tight tolerances", Icon: Check },
      ],
      condition: (answers: Answers) => answers["position-type"] === "layout",
    },
  ],
};

const labelFor = (questionId: string, value: string) => Object.values(ROUTES).flat()
  .find((question) => question.id === questionId)?.options.find((option: Option) => option.id === value)?.label ?? value;

const roleSectionHeader = (role: "best" | "alternative" | "upgrade") => ({
  best: "START HERE — THE BEST FIT",
  alternative: "SOLID ALTERNATIVE",
  upgrade: "POWERFUL UPGRADE",
}[role]);

const getApplicableProducts = (goal: FinderGoal | null, answers: Answers): KnowledgeProduct[] => {
  // Home page: show 3 representative products (one from each category)
  if (!goal) {
    const findProduct = KNOWLEDGE_PRODUCTS.find((p) => p.goals.includes("find"));
    const measureProduct = KNOWLEDGE_PRODUCTS.find((p) => p.goals.includes("measure"));
    const positionProduct = KNOWLEDGE_PRODUCTS.find((p) => p.goals.includes("position"));
    return [findProduct, measureProduct, positionProduct].filter(Boolean) as KnowledgeProduct[];
  }

  // After selecting a category: show all products for that goal
  const hasAnswers = Object.keys(answers).length > 0;
  const products = KNOWLEDGE_PRODUCTS.filter((product) => product.goals.includes(goal));

  // Only filter by applicable if user has answered questions; otherwise show all category products
  const filtered = hasAnswers
    ? products.filter((product) => product.applicable(answers))
    : products;

  return filtered.sort((a, b) => b.score(answers) - a.score(answers));
};

function recommendationMessage(goal: GoalId, answers: Answers, product: KnowledgeProduct) {
  const baseMessage = product.whyThisFits;

  // Build dynamic third sentence based on their selections
  const selections = Object.entries(answers)
    .filter(([id]) => id !== "budget")
    .slice(-3)
    .map(([id, answer]) => labelFor(id, answer).toLowerCase())
    .filter(s => s.length > 0)
    .join(", ");

  if (!selections) {
    return baseMessage;
  }

  return `${baseMessage} Your selection: ${selections}.`;
}

function goalPreview(goal?: GoalId) {
  if (goal === "find") return { image: ASSETS.cat4, title: "SERVICE LOCATING", copy: "Locator systems, receivers and transmitters for safer digging and targeted tracing." };
  if (goal === "measure") return { image: ASSETS.b20s, title: "INSPECTION TOOLS", copy: "Thermal imaging and moisture measurement to scan, detect and verify." };
  if (goal === "position") return { image: ASSETS.topcon, title: "MEASURING & SETOUT", copy: "Laser equipment for distance, level, line and grade work." };
  return { image: ASSETS.cat4, title: "FIND THE RIGHT TOOL", copy: "Answer a few practical questions. We will narrow the equipment route." };
}

export default function Home() {
  const [goal, setGoal] = useState<GoalId | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(-1);
  const [expertOpen, setExpertOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [expandedRecommendation, setExpandedRecommendation] = useState<"best" | "alternative" | "upgrade" | null>("best");
  const [rating, setRating] = useState(4.8);
  const [reviews, setReviews] = useState(28);
  const [lightbox, setLightbox] = useState<{ images: string[]; name: string; index: number } | null>(null);

  const openLightbox = useCallback((images: string[], name: string, startIndex = 0) => {
    if (images.length === 0) return;
    setLightbox({ images, name, index: startIndex });
  }, []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const lightboxNext = useCallback(() => {
    setLightbox((current) => current ? { ...current, index: (current.index + 1) % current.images.length } : current);
  }, []);
  const lightboxPrev = useCallback(() => {
    setLightbox((current) => current ? { ...current, index: (current.index - 1 + current.images.length) % current.images.length } : current);
  }, []);

  // Keyboard navigation for the lightbox: Escape closes, arrow keys move between images.
  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") lightboxNext();
      else if (e.key === "ArrowLeft") lightboxPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, closeLightbox, lightboxNext, lightboxPrev]);

  // Fetch live Google rating on component mount
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch("/api/ratings");
        if (response.ok) {
          const data = await response.json();
          setRating(data.rating);
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Failed to fetch ratings:", error);
        // Keep defaults if fetch fails
      }
    };

    fetchRating();
  }, []);

  const allQuestions = goal ? ROUTES[goal] : [];
  // Filter questions based on conditions
  const questions = useMemo(() =>
    allQuestions.filter(q => !q.condition || q.condition(answers)),
    [allQuestions, answers]
  );
  // If a gating answer changes (e.g. flipping environment from outdoor to
  // indoor), `questions` can shrink or grow on the next render because a
  // later question's `condition` no longer holds. Clamp `index` so it can
  // never point past the end of the current (possibly-just-shrunk) list —
  // otherwise `questions[index - 1]` in goBack() can read undefined and
  // throw when "Adjust answers" is clicked from a dead-end state.
  useEffect(() => {
    setIndex((current) => (current > questions.length ? questions.length : current));
  }, [questions.length]);

  const question = index >= 0 ? questions[index] : null;
  const complete = Boolean(goal && index >= questions.length);
  const results = useMemo<RecommendationSet | null>(() => goal && complete ? getRecommendations(goal, answers) : null, [goal, complete, answers]);
  const preview = goalPreview(goal ?? undefined);

  // Get applicable products for carousel
  const applicableProducts = useMemo(() => getApplicableProducts(goal, answers), [goal, answers]);

  // Auto-rotate carousel every 8 seconds
  useEffect(() => {
    if (applicableProducts.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % applicableProducts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [applicableProducts.length]);

  // Reset carousel index when goal changes
  useEffect(() => {
    setCarouselIndex(0);
  }, [goal]);

  // Reset expanded recommendation to "best" when results change
  useEffect(() => {
    setExpandedRecommendation("best");
  }, [results]);

  const currentProduct = applicableProducts[carouselIndex];
  const currentProductImage = currentProduct ? PRODUCT_IMAGES[currentProduct.id] : preview.image;

  const chooseGoal = (nextGoal: GoalId) => {
    setGoal(nextGoal);
    setAnswers({});
    setIndex(0);
  };

  const chooseOption = (questionId: string, optionId: string) => {
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    setIndex((current) => current + 1);
  };

  const goBack = () => {
    if (index <= 0) {
      setGoal(null);
      setAnswers({});
      setIndex(-1);
      return;
    }
    // index can briefly outlive `questions` if a gating answer just changed
    // (see the clamp effect above) — guard rather than assume in range.
    const safeIndex = Math.min(index, questions.length) - 1;
    const previousQuestion = questions[safeIndex];
    if (!previousQuestion) {
      setIndex(Math.max(questions.length - 1, 0));
      return;
    }
    setAnswers((current) => {
      const next = { ...current };
      delete next[previousQuestion.id];
      return next;
    });
    setIndex(safeIndex);
  };

  const restart = () => {
    setGoal(null);
    setAnswers({});
    setIndex(-1);
    setExpertOpen(false);
  };

  const progress = goal ? Math.min(index + 1, questions.length + 1) : 1;
  const progressTotal = goal ? questions.length + 1 : 2;

  return (
    <div className="laserman-app">
      <div className="utility-bar">
        <p>MEASURING SOLUTIONS SINCE 1997</p>
        <div><span>FREE STANDARD SHIPPING OVER $250</span><i /> <span>BEST PRICE GUARANTEE</span><i /> <span>AUSTRALIAN TECHNICAL SUPPORT</span></div>
      </div>

      <header className="store-header">
        <button className="logo-link" onClick={restart} aria-label="Restart the Laserman product finder">
          <img src={ASSETS.logo} alt="Laserman" />
        </button>
        <button className="finder-title" onClick={restart} aria-label="Go back to home"><span>LASERMAN</span><strong>FIND THE RIGHT TOOL</strong></button>
        <nav className="store-nav" aria-label="Product finder navigation">
          <a href="https://laserman.com.au" target="_blank" rel="noreferrer">SHOP LASERMAN</a>
          <a href="tel:+61893351718"><Phone size={15} /> +61 8 9335 1718</a>
          <button onClick={() => setExpertOpen(true)}>TALK TO US</button>
        </nav>
      </header>

      <div className="red-rule" />

      <main className="finder-workspace">
        <aside className="journey-rail">
          <div className="journey-head">
            <p className="rail-kicker">PRODUCT SELECTOR</p>
            <h1>THE RIGHT<br /><em>TOOL.</em><br />THE RIGHT JOB.</h1>
            <p>Work through a few relevant questions. We will narrow the Laserman range to the equipment that best fits your job.</p>
            <a href="https://www.google.com/search?q=laserman&oq=laserman&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg8MhAIAhAuGK8BGMcBGIAEGI4FMgcIAxAuGIAEMgYIBBBFGDwyBggFEEUYPDIGCAYQRRg8MgYIBxBFGDzSAQgyNzkwajBqN6gCALACAA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x2a32a3d0d225ba01:0xd45e7c4967e86912,1,,,," target="_blank" rel="noreferrer" className="sidebar-rating-section" title="View all reviews on Google">
              <div className="rating-divider"></div>
              <div className="rating-content">
                <div className="rating-stars">
                  <span className="stars">★★★★★</span>
                  <span className="rating-number">{rating.toFixed(1)}<span className="rating-max">/5</span></span>
                </div>
                <div className="rating-meta">
                  <p className="rating-label">Trusted by professionals</p>
                  <p className="rating-source"><span className="google-text">Google</span>™ • {reviews} reviews</p>
                </div>
              </div>
            </a>
          </div>
          <div className="rail-steps">
            <span className={!goal ? "rail-step active" : "rail-step done"}><b>01</b> YOUR JOB</span>
            <span className={goal && !complete ? "rail-step active" : complete ? "rail-step done" : "rail-step"}><b>02</b> YOUR REQUIREMENTS</span>
            <span className={complete ? "rail-step active" : "rail-step"}><b>03</b> YOUR TOOL</span>
          </div>
          <button className="rail-help" onClick={() => setExpertOpen(true)}><MessageCircle size={17} /> NEED HELP CHOOSING?</button>
        </aside>

        <section className="question-stage" aria-live="polite">
          <div className="stage-meta">
            <div className="crumb"><button onClick={restart} className="crumb-home">PRODUCT FINDER</button>{goal && <><ChevronRight size={14} /><b>{GOALS.find((item) => item.id === goal)?.label}</b></>}</div>
            <div className="step-count"><b>STEP {String(progress).padStart(2, "0")}</b><div className="step-divider" /><span>OF {String(progressTotal).padStart(2, "0")}</span></div>
          </div>

          <AnimatePresence mode="wait">
            {!goal && (
              <motion.div className="screen-block" key="goals" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: .22 }}>
                <div className="question-intro">
                  <span className="section-kicker"><Sparkles size={14} /> START WITH THE JOB</span>
                  <h2>WHAT ARE YOU<br />TRYING TO DO?</h2>
                  <p>Choose the closest job. The next questions will adapt to the way you work.</p>
                </div>
                <div className="goal-grid">
                  {GOALS.map((item, itemIndex) => {
                    const Icon = item.Icon;
                    return <motion.button key={item.id} className="goal-card" onClick={() => chooseGoal(item.id)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: itemIndex * .035, duration: .2 }}>
                      <span className="goal-icon"><Icon size={20} /></span>
                      <span className="goal-copy"><b>{item.label}</b><small>{item.note}</small></span>
                      <ArrowRight size={18} />
                    </motion.button>;
                  })}
                </div>
              </motion.div>
            )}

            {goal && question && !complete && (
              <motion.div className="screen-block" key={question.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: .22 }}>
                <button className="back-link" onClick={goBack}><ArrowLeft size={15} /> CHANGE PREVIOUS ANSWER</button>
                <div className="question-intro">
                  <span className="section-kicker"><GitBranch size={14} /> {question.eyebrow}</span>
                  <h2>{question.title}</h2>
                  <p>{question.description}</p>
                </div>
                <div className="option-grid">
                  {question.options.map((option, optionIndex) => {
                    const Icon = option.Icon;
                    return <motion.button key={option.id} className="option-card" onClick={() => chooseOption(question.id, option.id)} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: optionIndex * .035, duration: .18 }}>
                      <span className="option-icon"><Icon size={20} /></span>
                      <span><b>{option.label}</b><small>{option.note}</small></span>
                      <ChevronRight size={19} />
                    </motion.button>;
                  })}
                </div>
              </motion.div>
            )}

            {goal && complete && (
              <motion.div className="screen-block result-block" key="result" initial={{ opacity: 0, y: 13 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .28 }}>
                <div className="result-topline"><span className="result-check"><Check size={14} /></span> YOUR RECOMMENDATION IS READY</div>
                <div className="question-intro result-intro">
                  <span className="section-kicker"><ShieldCheck size={14} /> SELECTED FOR YOUR JOB</span>
                  <h2>WE'D START<br />WITH THIS.</h2>
                  <p>{results?.message} Prices are current AUD guide prices only and can change with stock or promotion.</p>
                </div>

                <div className="result-summary">
                  <span>YOUR PATH</span>
                  <p>{Object.entries(answers).map(([id, answer]) => labelFor(id, answer)).join("  ·  ")}</p>
                  <button onClick={goBack}>ADJUST ANSWERS <ArrowLeft size={14} /></button>
                </div>


                {results?.recommendations.length > 0 && (
                  <div className="recommendation-tabs">
                    {results.recommendations.map((item) => (
                      <button
                        key={item.role}
                        className={`tab-button ${expandedRecommendation === item.role ? 'active' : ''}`}
                        onClick={() => setExpandedRecommendation(item.role)}
                      >
                        {roleSectionHeader(item.role)}
                      </button>
                    ))}
                  </div>
                )}

                <div className="recommendation-list">
                  {results?.recommendations
                    .filter((item) => expandedRecommendation === null || item.role === expandedRecommendation)
                    .map((item, productIndex) => {
                      const product = item.product;
                      const gallery = getProductGallery(product.id);
                      const mainImage = gallery[0];
                      return <div key={product.id}>
                        <article className="recommendation-card">
                          <div className="product-visual">
                            {mainImage ? (
                              <>
                                <button
                                  type="button"
                                  className="product-visual-zoom"
                                  onClick={() => openLightbox(gallery, product.name, 0)}
                                  aria-label={`Enlarge ${product.name} image`}
                                >
                                  <img src={mainImage} alt={product.name} />
                                  <span className="zoom-hint"><ZoomIn size={16} /> CLICK TO ENLARGE</span>
                                </button>
                                {gallery.length > 1 && (
                                  <div className="product-thumb-strip">
                                    {gallery.map((src, i) => (
                                      <button
                                        type="button"
                                        key={src}
                                        className="product-thumb"
                                        onClick={() => openLightbox(gallery, product.name, i)}
                                        aria-label={`View image ${i + 1} of ${gallery.length} for ${product.name}`}
                                      >
                                        <img src={src} alt="" />
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="fallback-product"><CircleHelp size={42} /><span>{product.brand}</span></div>
                            )}
                          </div>
                          <div className="product-evidence">
                            <div className="brand-line">
                              <span>{product.brand}</span>
                              <em>{product.category}</em>
                            </div>
                            <h3>{product.name}</h3>
                          <p className="price">
                            {product.priceText}
                            {product.id === "cmex5" && (
                              <>
                                <br />
                                <small>($1,615.00 individually)</small>
                              </>
                            )}
                          </p>
                          <p className="why"><b>WHY THIS FITS</b>{recommendationMessage(goal, answers, product)}</p>
                          <div className="technical-detail-grid">
                            <div><b>KEY SPECS</b><ul>{product.keySpecs.map((spec) => <li key={spec}><Check size={14} /> {spec}</li>)}</ul></div>
                            <div><b>WHAT'S INCLUDED</b><ul>{product.included.map((included) => <li key={included}><Check size={14} /> {included}</li>)}</ul></div>
                          </div>
                          {product.accessories.length > 0 && <p className="accessory-note"><b>RECOMMENDED ACCESSORIES</b>{product.accessories.join(" · ")}</p>}
                          <p className="limitation-note"><b>DESIGNED FOR</b>{product.designedFor}</p>
                          <div className="product-actions">
                            <a href={product.href} target="_blank" rel="noreferrer">VIEW PRODUCT & ADD TO CART <ArrowRight size={16} /></a>
                            <button onClick={() => setExpertOpen(true)}>ASK AN EXPERT</button>
                          </div>
                          <a className="evidence-link" href={product.sources[0]} target="_blank" rel="noreferrer">VIEW VERIFIED PRODUCT EVIDENCE <MoveUpRight size={13} /></a>
                        </div>
                      </article>
                      </div>;
                    })}
                </div>
                {results?.recommendations.length === 0 && <div className="no-match-card"><CircleHelp size={24} /><h3>WE NEED A LITTLE MORE DETAIL.</h3><p>The current verified product knowledge does not contain a safe automatic match for this set of requirements. Our team can help choose the correct system.</p><button onClick={() => setExpertOpen(true)}>TALK TO AN EXPERT</button></div>}
                <button className="restart-button" onClick={restart}>START A NEW SEARCH <ArrowRight size={15} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside className="equipment-preview">
          <div className="preview-section carousel">
            <div className="preview-image carousel-container">
              {applicableProducts.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`carousel-${carouselIndex}`}
                      src={currentProductImage}
                      alt={currentProduct?.name || "Laserman equipment"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </AnimatePresence>
                  {currentProduct && (
                    <motion.div
                      className="carousel-label"
                      key={`label-${carouselIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{currentProduct.name}</p>
                    </motion.div>
                  )}
                  {applicableProducts.length > 1 && (
                    <div className="carousel-indicators">
                      {applicableProducts.map((_, i) => (
                        <button
                          key={i}
                          className={`carousel-dot ${i === carouselIndex ? 'active' : ''}`}
                          onClick={() => setCarouselIndex(i)}
                          aria-label={`Go to product ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <img src={preview.image} alt="Laserman equipment" />
              )}
            </div>
          </div>
          {applicableProducts.length > 0 && (
            <div className="preview-copy">
              <span>LASERMAN RANGE</span>
              <h3>EQUIPMENT MATCHED TO YOUR JOB</h3>
              <p>{applicableProducts.length > 0 && `${applicableProducts.length} product${applicableProducts.length !== 1 ? 's' : ''} in this category.`}</p>
            </div>
          )}
          {applicableProducts.length === 0 && (
            <div className="preview-copy">
              <span>LASERMAN RANGE</span>
              <h3>{preview.title}</h3>
              <p>{preview.copy}</p>
            </div>
          )}
          <div className="preview-proof"><ShieldCheck size={17} /><p><b>Want more info?</b> Talk to our experts about our full range for a helpful solution tailored to improve your workflow.</p></div>
          <div className="preview-section brands-panel">
            <span className="brands-header">CHECK OUT OUR</span>
            <h3>TOP BRANDS</h3>
            <div className="brands-grid">
              <a href="https://laserman.com.au/collections/geo-fennel-laser-measuring-surveying-equipment-theodolites?srsltid=AfmBOoqEW3KmzTjypD--Nrg0n38Tb0oPut0GfARz_zxjzPHFQ5Tgd0u2" target="_blank" rel="noreferrer" className="brand-link">
                <span className="brand-name">GEO-FENNEL</span>
                <span className="brand-note">Laser measuring</span>
              </a>
              <a href="https://laserman.com.au/collections/brand-radiodetection-radio-detection-underground-service-locators-receivers-transmitters?srsltid=AfmBOophh7vYZ5-9rKCa7zv-tG1Nc0K759xvZvhqb1lUoDB6NOKzUvfh" target="_blank" rel="noreferrer" className="brand-link">
                <span className="brand-name">RADIODETECTION</span>
                <span className="brand-note">Precision locators</span>
              </a>
              <a href="https://laserman.com.au/search?q=tramex" target="_blank" rel="noreferrer" className="brand-link">
                <span className="brand-name">TRAMEX</span>
                <span className="brand-note">Moisture analysis</span>
              </a>
              <a href="https://laserman.com.au/collections/topcon-product-range-global-technology-laser-levels-laser-tools-survey-instruments?srsltid=AfmBOorDE1tOyyWTSYkPhEDmn2ML470QJzrO75Y1XE8CixiEdHQM1WFw" target="_blank" rel="noreferrer" className="brand-link">
                <span className="brand-name">TOPCON</span>
                <span className="brand-note">Positioning technology</span>
              </a>
              <a href="https://laserman.com.au/collections/z-laser-laser-systems-laser-projectors-line-lasers?srsltid=AfmBOoqqQ2SXdtynwaLk9EwIHiCZnZZXaKnq3TwQqIcqeKDLIgG9idxC" target="_blank" rel="noreferrer" className="brand-link">
                <span className="brand-name">Z-LASER</span>
                <span className="brand-note">Industrial positioning</span>
              </a>
              <a href="https://laserman.com.au/collections/sl-laser-2d3d-laser-projector-sl-positioning-lasers?srsltid=AfmBOopX4d4kmjPQs2penplWp8zaPiLOmyUKHSQrG7SEfYem6cVC_v34" target="_blank" rel="noreferrer" className="brand-link">
                <span className="brand-name">SL-LASER</span>
                <span className="brand-note">Industrial lasers</span>
              </a>
            </div>
          </div>
          <button className="preview-contact" onClick={() => setExpertOpen(true)}>TALK TO A LASERMAN EXPERT <ArrowRight size={16} /></button>
          <div className="preview-section spacer"></div>
        </aside>
      </main>

      <footer className="finder-footer"><span>LASERMAN TECHNOLOGIES — WESTERN AUSTRALIA</span><span>PRODUCT ADVICE · QUOTATIONS · STOCK · CALIBRATION</span></footer>

      <AnimatePresence>
        {expertOpen && <motion.div className="expert-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="expert-modal" initial={{ opacity: 0, y: 16, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} transition={{ duration: .2 }}>
            <button className="modal-close" onClick={() => setExpertOpen(false)} aria-label="Close expert contact dialog">×</button>
            <img src={ASSETS.logo} alt="Laserman" />
            <span className="section-kicker"><MessageCircle size={14} /> REAL TECHNICAL ADVICE</span>
            <h3>LET'S FIND THE RIGHT TOOL FOR THE JOB.</h3>
            <p>For a recommendation tailored to your site, material, required accuracy or safety procedure, contact Laserman's team directly.</p>
            <a className="call-expert" href="tel:+61893351718"><Phone size={17} /> CALL +61 8 9335 1718</a>
            <a className="email-expert" href="mailto:team@laserman.com.au"><Mail size={17} /> EMAIL THE EXPERTS</a>
          </motion.div>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close image viewer"><X size={22} /></button>

            <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
              {lightbox.images.length > 1 && (
                <button className="lightbox-nav lightbox-prev" onClick={lightboxPrev} aria-label="Previous image">
                  <ChevronLeft size={28} />
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={lightbox.index}
                  src={lightbox.images[lightbox.index]}
                  alt={`${lightbox.name} — image ${lightbox.index + 1} of ${lightbox.images.length}`}
                  className="lightbox-image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              </AnimatePresence>

              {lightbox.images.length > 1 && (
                <button className="lightbox-nav lightbox-next" onClick={lightboxNext} aria-label="Next image">
                  <ChevronRight size={28} />
                </button>
              )}
            </div>

            <div className="lightbox-footer" onClick={(e) => e.stopPropagation()}>
              <p className="lightbox-title">{lightbox.name}</p>
              {lightbox.images.length > 1 && (
                <>
                  <p className="lightbox-count">{lightbox.index + 1} / {lightbox.images.length}</p>
                  <div className="lightbox-thumbs">
                    {lightbox.images.map((src, i) => (
                      <button
                        type="button"
                        key={src}
                        className={`lightbox-thumb ${i === lightbox.index ? "active" : ""}`}
                        onClick={() => setLightbox((current) => current ? { ...current, index: i } : current)}
                        aria-label={`Go to image ${i + 1}`}
                      >
                        <img src={src} alt="" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
