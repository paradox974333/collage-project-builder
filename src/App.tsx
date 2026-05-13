import { FormEvent, ReactNode, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CollageHero, heroMediaSrc } from "@/components/ui/prisma-hero";

type Page = "home" | "shop";
type ProjectKey = "major" | "mini" | "web" | "ai" | "mobile" | "cyber";
type UrgencyKey = "standard" | "quick" | "rush";
type CategoryKey =
  | "All"
  | "AI/ML"
  | "Web"
  | "Cybersecurity"
  | "Data Science"
  | "CN"
  | "CSBS"
  | "Mobile/IoT"
  | "Cloud";

interface ProjectForm {
  topic: string;
  branch: string;
  projectType: ProjectKey;
  urgency: UrgencyKey;
  techStack: string;
  deadline: string;
  contact: string;
  requirements: string;
}

interface ServiceOption {
  key: ProjectKey;
  title: string;
  text: string;
  timeline: string;
  deliverables: string[];
}

interface ProjectItem {
  id: string;
  title: string;
  category: Exclude<CategoryKey, "All">;
  stack: string;
  level: string;
  timeline: string;
  blurb: string;
  includes: string[];
  projectType: ProjectKey;
}

interface ProjectVisual {
  image: string;
  alt: string;
}

const proofPoints = [
  { value: "CSE", label: "IT / CSBS / DS" },
  { value: "AI/ML", label: "models + dashboards" },
  { value: "Code", label: "working project" },
  { value: "Docs", label: "report + PPT" },
];

const whatsappContacts = [
  {
    label: "+91 93922 73983",
    href: "https://wa.me/919392273983?text=Hi%2C%20I%20need%20help%20with%20a%20BTech%20software%20project.",
  },
  {
    label: "+91 9743339652",
    href: "https://wa.me/919743339652?text=Hi%2C%20I%20need%20help%20with%20a%20BTech%20software%20project.",
  },
];

const showcase = [
  {
    title: "AI attendance system",
    subject: "Computer vision + dashboard",
    image:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1200&q=80",
    alt: "AI robotics visual on a screen",
    tags: ["Python", "OpenCV", "Admin"],
  },
  {
    title: "Campus management platform",
    subject: "Full-stack web application",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    alt: "Laptop showing software code",
    tags: ["React", "Node", "MySQL"],
  },
  {
    title: "Security monitoring dashboard",
    subject: "Cybersecurity + analytics",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    alt: "Software dashboard on laptop",
    tags: ["Auth", "Logs", "Reports"],
  },
];

const steps = [
  {
    title: "Choose",
    text: "Pick a topic from the shop or send your own idea.",
  },
  {
    title: "Scope",
    text: "We lock modules, stack, database, report and demo needs.",
  },
  {
    title: "Build",
    text: "Frontend, backend, data, ML, mobile or cyber flow gets built.",
  },
  {
    title: "Submit",
    text: "You get code, screenshots, report, PPT and explanation flow.",
  },
];

const services: ServiceOption[] = [
  {
    key: "major",
    title: "Final-year",
    text: "Complete software project with code, report, PPT and demo.",
    timeline: "7-21 days",
    deliverables: ["code", "report", "demo"],
  },
  {
    key: "mini",
    title: "Mini project",
    text: "Compact semester project for labs and internal review.",
    timeline: "2-7 days",
    deliverables: ["module", "screens", "notes"],
  },
  {
    key: "web",
    title: "Web / MERN",
    text: "Modern full-stack app with database and dashboard.",
    timeline: "5-14 days",
    deliverables: ["UI", "API", "DB"],
  },
  {
    key: "ai",
    title: "AI / ML",
    text: "Model, dataset workflow, charts and result screen.",
    timeline: "7-18 days",
    deliverables: ["model", "data", "charts"],
  },
  {
    key: "mobile",
    title: "Mobile / IoT",
    text: "App screens, sensors, tracking and live flow.",
    timeline: "7-20 days",
    deliverables: ["app", "API", "tests"],
  },
  {
    key: "cyber",
    title: "Cyber / cloud",
    text: "Secure login, logs, scanners, deployment and testing.",
    timeline: "6-16 days",
    deliverables: ["security", "deploy", "tests"],
  },
];

const domains = [
  { title: "CSE / IT", text: "MERN, DBMS, Java, Python, dashboards." },
  { title: "AI / ML", text: "Prediction, NLP, computer vision, recommendation." },
  { title: "Cybersecurity", text: "Auth, encryption, phishing, logs, scanners." },
  { title: "Data Science", text: "EDA, models, charts, notebooks, reports." },
  { title: "CN", text: "Sockets, routing, packet flow, network monitors." },
  { title: "CSBS", text: "ERP, CRM, analytics, business automation." },
];

const categories: CategoryKey[] = [
  "All",
  "AI/ML",
  "Web",
  "Cybersecurity",
  "Data Science",
  "CN",
  "CSBS",
  "Mobile/IoT",
  "Cloud",
];

const projectVisuals: Record<Exclude<CategoryKey, "All">, ProjectVisual> = {
  "AI/ML": {
    image:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1200&q=80",
    alt: "AI robotics visual on a screen",
  },
  Web: {
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    alt: "Laptop showing software code",
  },
  Cybersecurity: {
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    alt: "Security dashboard on a laptop",
  },
  "Data Science": {
    image:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=1200&q=80",
    alt: "Machine learning and analytics visual",
  },
  CN: {
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    alt: "Network monitoring dashboard",
  },
  CSBS: {
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    alt: "Business software workspace",
  },
  "Mobile/IoT": {
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    alt: "Mobile app development workspace",
  },
  Cloud: {
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    alt: "Cloud software dashboard",
  },
};

const projectCatalog: ProjectItem[] = [
  {
    id: "ai-attendance",
    title: "AI Face Attendance System",
    category: "AI/ML",
    stack: "Python, OpenCV, Flask, SQLite",
    level: "Final year",
    timeline: "10-15 days",
    blurb: "Face recognition attendance with admin dashboard, records and exports.",
    includes: ["recognition flow", "admin panel", "report + PPT"],
    projectType: "ai",
  },
  {
    id: "disease-prediction",
    title: "Disease Prediction Dashboard",
    category: "Data Science",
    stack: "Python, ML, Streamlit",
    level: "Mini / major",
    timeline: "6-12 days",
    blurb: "Prediction model with clean UI, charts, accuracy and dataset workflow.",
    includes: ["ML model", "charts", "documentation"],
    projectType: "ai",
  },
  {
    id: "campus-management",
    title: "Campus Management System",
    category: "Web",
    stack: "React, Node.js, MySQL",
    level: "Final year",
    timeline: "10-18 days",
    blurb: "Role-based admin, student and staff modules with reports.",
    includes: ["auth", "CRUD modules", "database"],
    projectType: "web",
  },
  {
    id: "hostel-management",
    title: "Hostel Management Portal",
    category: "Web",
    stack: "Django, PostgreSQL",
    level: "Mini project",
    timeline: "5-9 days",
    blurb: "Room allocation, student records, complaints and payment tracking.",
    includes: ["dashboard", "forms", "report"],
    projectType: "web",
  },
  {
    id: "phishing-detection",
    title: "Phishing URL Detector",
    category: "Cybersecurity",
    stack: "Python, Flask, ML",
    level: "Final year",
    timeline: "8-14 days",
    blurb: "Detect suspicious links with feature extraction and result explanation.",
    includes: ["detector", "result UI", "PPT"],
    projectType: "cyber",
  },
  {
    id: "secure-chat",
    title: "Encrypted Chat Application",
    category: "Cybersecurity",
    stack: "Node.js, Socket.io, AES",
    level: "Mini / major",
    timeline: "7-12 days",
    blurb: "Real-time chat with encryption flow and security explanation.",
    includes: ["chat UI", "encryption", "viva notes"],
    projectType: "cyber",
  },
  {
    id: "network-monitor",
    title: "Network Traffic Monitor",
    category: "CN",
    stack: "Python, Socket, Charts",
    level: "CN project",
    timeline: "6-10 days",
    blurb: "Monitor packets, usage, alerts and simple network statistics.",
    includes: ["monitor", "graphs", "report"],
    projectType: "cyber",
  },
  {
    id: "cloud-file-vault",
    title: "Cloud File Vault",
    category: "Cloud",
    stack: "React, Node.js, AWS/Firebase",
    level: "Final year",
    timeline: "9-16 days",
    blurb: "Secure upload, storage, access control and deployment notes.",
    includes: ["uploads", "roles", "deployment"],
    projectType: "web",
  },
  {
    id: "resume-screening",
    title: "AI Resume Screening Tool",
    category: "AI/ML",
    stack: "Python, NLP, Streamlit",
    level: "Final year",
    timeline: "7-13 days",
    blurb: "Rank resumes using keyword, skill and similarity scoring.",
    includes: ["NLP", "ranking", "dashboard"],
    projectType: "ai",
  },
  {
    id: "sales-analytics",
    title: "Business Sales Analytics",
    category: "CSBS",
    stack: "Python, Power BI/React",
    level: "CSBS project",
    timeline: "5-10 days",
    blurb: "Business dashboard with KPIs, filters, charts and insights.",
    includes: ["KPIs", "charts", "case study"],
    projectType: "mini",
  },
  {
    id: "smart-parking",
    title: "Smart Parking App",
    category: "Mobile/IoT",
    stack: "Flutter, Firebase",
    level: "Final year",
    timeline: "9-16 days",
    blurb: "Slot booking, live availability and admin tracking flow.",
    includes: ["mobile UI", "database", "demo"],
    projectType: "mobile",
  },
  {
    id: "e-learning",
    title: "E-Learning Platform",
    category: "Web",
    stack: "MERN, MongoDB",
    level: "Final year",
    timeline: "10-18 days",
    blurb: "Courses, quizzes, student progress and admin content management.",
    includes: ["course modules", "quiz", "admin"],
    projectType: "web",
  },
];

const urgencies: Record<UrgencyKey, { label: string; note: string }> = {
  standard: { label: "Standard", note: "Best for complete build and review" },
  quick: { label: "Quick", note: "Prioritized for near deadlines" },
  rush: { label: "Rush", note: "Fastest possible demo-ready scope" },
};

const initialForm: ProjectForm = {
  topic: "",
  branch: "",
  projectType: "major",
  urgency: "standard",
  techStack: "",
  deadline: "",
  contact: "",
  requirements: "",
};

const fieldClass =
  "h-14 w-full rounded-md border border-black/12 bg-white px-4 text-base text-ink outline-none transition focus:border-blueglass focus:ring-4 focus:ring-blueglass/10 sm:h-16 sm:px-5 sm:text-lg";

const textAreaClass =
  "min-h-36 w-full resize-none rounded-md border border-black/12 bg-white px-4 py-4 text-base text-ink outline-none transition focus:border-blueglass focus:ring-4 focus:ring-blueglass/10 sm:min-h-40 sm:px-5 sm:py-5 sm:text-lg";

const eyebrowClass = "text-sm font-semibold uppercase";
const displayClass =
  "break-words text-[clamp(3.35rem,15vw,6.5rem)] font-semibold leading-[0.93] sm:text-[clamp(5rem,11vw,8rem)] lg:text-[clamp(6rem,8vw,9rem)]";
const panelTitleClass =
  "break-words text-[clamp(2.55rem,10vw,4rem)] font-semibold leading-[0.96] sm:text-[clamp(3.5rem,7vw,5.25rem)]";
const cardTitleClass =
  "break-words text-[clamp(2rem,8vw,3.25rem)] font-semibold leading-[0.98] sm:text-[clamp(2.4rem,4vw,4rem)]";

const revealViewport = { once: true, margin: "-12%" };

const revealTransition = {
  duration: 0.7,
  ease: [0.16, 1, 0.3, 1] as const,
};

type RevealBlockVariant = "rise" | "soft" | "slide" | "scale";
type RevealTextVariant = "words" | "line" | "fade" | "lift" | "scroll";

const blockInitialByVariant: Record<RevealBlockVariant, { y?: number; x?: number; opacity: number; scale?: number; filter?: string }> = {
  rise: { y: 28, opacity: 0 },
  soft: { y: 12, opacity: 0, filter: "blur(8px)" },
  slide: { x: -22, opacity: 0 },
  scale: { y: 18, opacity: 0, scale: 0.98 },
};

const RevealBlock = ({
  children,
  className = "",
  variant = "rise",
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealBlockVariant;
}) => (
  <motion.div
    initial={blockInitialByVariant[variant]}
    whileInView={{ x: 0, y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
    viewport={revealViewport}
    transition={revealTransition}
    className={className}
  >
    {children}
  </motion.div>
);

const ScrollWord = ({ index, total, word }: { index: number; total: number; word: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 48%"],
  });
  const start = total <= 1 ? 0 : (index / total) * 0.55;
  const end = Math.min(start + 0.42, 1);
  const opacity = useTransform(scrollYProgress, [start, end], [0.18, 1]);
  const y = useTransform(scrollYProgress, [start, end], ["0.45em", "0em"]);
  const filter = useTransform(scrollYProgress, [start, end], ["blur(8px)", "blur(0px)"]);

  return (
    <motion.span ref={ref} className="mr-[0.22em] inline-block" style={{ opacity, y, filter }}>
      {word}
    </motion.span>
  );
};

const RevealText = ({
  as = "h2",
  className = "",
  text,
  variant = "words",
}: {
  as?: "h1" | "h2" | "h3";
  className?: string;
  text: string;
  variant?: RevealTextVariant;
}) => {
  const Tag = as;
  const words = text.split(" ");

  if (variant === "scroll") {
    return (
      <Tag className={className}>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true" className="inline-flex flex-wrap">
          {words.map((word, index) => (
            <ScrollWord key={`${word}-${index}`} index={index} total={words.length} word={word} />
          ))}
        </span>
      </Tag>
    );
  }

  if (variant === "line") {
    return (
      <Tag className={className}>
        <motion.span
          className="inline-block origin-left"
          initial={{ y: "0.45em", opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ y: 0, opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          viewport={revealViewport}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {text}
        </motion.span>
      </Tag>
    );
  }

  if (variant === "fade") {
    return (
      <Tag className={className}>
        <motion.span
          className="inline-block"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={revealViewport}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {text}
        </motion.span>
      </Tag>
    );
  }

  if (variant === "lift") {
    return (
      <Tag className={className}>
        <motion.span
          className="inline-block"
          initial={{ y: 34, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={revealViewport}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          {text}
        </motion.span>
      </Tag>
    );
  }

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="inline-flex flex-wrap"
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.045,
            },
          },
        }}
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="mr-[0.22em] inline-block"
            variants={{
              hidden: { y: "0.55em", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.72,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
};

const buildBrief = (form: ProjectForm) => {
  const selectedService = services.find((service) => service.key === form.projectType) ?? services[0];

  return [
    "BTech / software project request",
    "",
    `Project idea: ${form.topic || "Not provided"}`,
    `Branch / semester: ${form.branch || "Not provided"}`,
    `Project type: ${selectedService.title}`,
    `Preferred tech stack: ${form.techStack || "Not provided"}`,
    `Urgency: ${urgencies[form.urgency].label}`,
    `Deadline: ${form.deadline || "Not provided"}`,
    `Contact: ${form.contact || "Not provided"}`,
    "",
    "Requirements:",
    form.requirements || "Not provided",
  ].join("\n");
};

const buildWhatsAppHref = (phoneLabel: string, message: string) => {
  const phone = phoneLabel.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 360 362" aria-hidden="true">
    <path
      fill="#25D366"
      fillRule="evenodd"
      d="M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807v-.008Zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231-56.391 14.791 15.05-54.981-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286.035-82.14 66.867-148.973 149.051-148.973 39.793.017 77.198 15.53 105.328 43.695 28.131 28.157 43.61 65.596 43.593 105.398-.035 82.149-66.867 148.982-148.982 148.982v.008Zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568-4.108-1.496-7.09-2.243-10.073 2.243-2.982 4.487-11.568 14.577-14.181 17.559-2.613 2.991-5.226 3.361-9.704 1.117-4.477-2.243-18.908-6.97-36.02-22.226-13.313-11.878-22.304-26.54-24.916-31.027-2.613-4.486-.275-6.91 1.959-9.136 2.011-2.011 4.478-5.234 6.721-7.847 2.244-2.613 2.983-4.486 4.478-7.469 1.496-2.991.748-5.603-.369-7.847-1.118-2.243-10.073-24.289-13.812-33.253-3.636-8.732-7.331-7.546-10.073-7.692-2.613-.13-5.595-.155-8.586-.155-2.991 0-7.839 1.118-11.947 5.604-4.108 4.486-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335c2.243 2.991 31.585 48.225 76.51 67.632 10.684 4.615 19.029 7.374 25.535 9.437 10.727 3.412 20.49 2.931 28.208 1.779 8.604-1.289 26.498-10.838 30.228-21.298 3.73-10.46 3.73-19.433 2.613-21.298-1.117-1.865-4.108-2.991-8.586-5.234l.008-.017Z"
      clipRule="evenodd"
    />
  </svg>
);

const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <div className="grid gap-2 rounded-lg border border-black/10 bg-white/96 p-2 shadow-[0_18px_48px_rgba(8,8,6,0.22)] backdrop-blur">
          <p className="px-2.5 pt-1 text-xs font-semibold uppercase text-black/45">Contact</p>
          {whatsappContacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 items-center gap-2 rounded-md px-2.5 text-sm font-semibold text-ink transition hover:bg-[#25D366]/10"
            >
              <span className="h-5 w-5 shrink-0">
                <WhatsAppIcon />
              </span>
              <span className="whitespace-nowrap">{contact.label}</span>
            </a>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Hide WhatsApp contact numbers" : "Show WhatsApp contact numbers"}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_18px_48px_rgba(8,8,6,0.24)] ring-1 ring-black/10 transition hover:-translate-y-1"
      >
        <span className="h-8 w-8">
          <WhatsAppIcon />
        </span>
      </button>
    </div>
  );
};

interface BookingFormProps {
  form: ProjectForm;
  selectedService: ServiceOption;
  errors: Record<string, string>;
  copied: boolean;
  submitted: boolean;
  whatsappRequestLinks: { label: string; href: string }[];
  updateField: <Key extends keyof ProjectForm>(key: Key, value: ProjectForm[Key]) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleCopyBrief: () => void;
}

const BookingForm = ({
  form,
  selectedService,
  errors,
  copied,
  submitted,
  whatsappRequestLinks,
  updateField,
  handleSubmit,
  handleCopyBrief,
}: BookingFormProps) => (
  <form onSubmit={handleSubmit} className="rounded-lg border border-black/10 bg-white p-5 md:p-7 lg:p-8">
    <div className="grid gap-5 md:grid-cols-2">
      <label className="grid gap-2 text-xl font-semibold">
        Project idea
        <input
          className={fieldClass}
          value={form.topic}
          onChange={(event) => updateField("topic", event.target.value)}
          placeholder="AI attendance system"
        />
        {errors.topic && <span className="text-sm font-medium text-ember">{errors.topic}</span>}
      </label>

      <label className="grid gap-2 text-xl font-semibold">
        Branch / semester
        <input
          className={fieldClass}
          value={form.branch}
          onChange={(event) => updateField("branch", event.target.value)}
          placeholder="CSE final year"
        />
      </label>

      <label className="grid gap-2 text-xl font-semibold">
        Project type
        <select
          className={fieldClass}
          value={form.projectType}
          onChange={(event) => updateField("projectType", event.target.value as ProjectKey)}
        >
          {services.map((service) => (
            <option key={service.key} value={service.key}>
              {service.title}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-xl font-semibold">
        Tech stack
        <input
          className={fieldClass}
          value={form.techStack}
          onChange={(event) => updateField("techStack", event.target.value)}
          placeholder="MERN, Python ML, Java"
        />
      </label>

      <label className="grid gap-2 text-xl font-semibold">
        Deadline
        <input
          className={fieldClass}
          value={form.deadline}
          onChange={(event) => updateField("deadline", event.target.value)}
          placeholder="Tomorrow / Friday / date"
        />
        {errors.deadline && <span className="text-sm font-medium text-ember">{errors.deadline}</span>}
      </label>

      <label className="grid gap-2 text-xl font-semibold">
        Contact
        <input
          className={fieldClass}
          value={form.contact}
          onChange={(event) => updateField("contact", event.target.value)}
          placeholder="Phone or email"
        />
        {errors.contact && <span className="text-sm font-medium text-ember">{errors.contact}</span>}
      </label>

      <div className="grid gap-2 text-xl font-semibold md:col-span-2">
        Timeline
        <div className="grid gap-2 sm:grid-cols-3">
          {(Object.keys(urgencies) as UrgencyKey[]).map((urgency) => (
            <button
              key={urgency}
              type="button"
              onClick={() => updateField("urgency", urgency)}
              className={`rounded-md border px-4 py-4 text-left transition ${
                form.urgency === urgency
                  ? "border-ink bg-ink text-primary"
                  : "border-black/12 bg-paper text-ink hover:border-ink/40"
              }`}
            >
              <span className="block text-xl font-semibold">{urgencies[urgency].label}</span>
              <span className={`mt-1 block text-sm ${form.urgency === urgency ? "text-primary/70" : "text-black/55"}`}>
                {urgencies[urgency].note}
              </span>
            </button>
          ))}
        </div>
      </div>

      <label className="grid gap-2 text-xl font-semibold md:col-span-2">
        Requirements
        <textarea
          className={textAreaClass}
          value={form.requirements}
          onChange={(event) => updateField("requirements", event.target.value)}
          placeholder="Modules, login roles, database, report format, PPT, hosting..."
        />
      </label>
    </div>

    <div className="mt-6 flex flex-col gap-3 rounded-lg border border-black/10 bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xl font-semibold">Prepared brief</p>
        <p className="mt-1 text-base text-black/58">
          {selectedService.timeline} - {urgencies[form.urgency].label.toLowerCase()} slot
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopyBrief}
        className="inline-flex h-12 items-center justify-center rounded-md border border-black/12 bg-white px-5 text-lg font-semibold transition hover:border-ink/40"
      >
        {copied ? "Copied" : "Copy brief"}
      </button>
    </div>

    {submitted && (
      <div className="mt-4 flex flex-col gap-3 rounded-lg border border-blueglass/25 bg-blueglass/10 p-4 text-lg text-black/74 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold">Request is ready for WhatsApp.</span>
        <div className="flex flex-col gap-2 sm:flex-row">
          {whatsappRequestLinks.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-md bg-blueglass px-4 text-base font-semibold text-white transition hover:bg-[#246fbe]"
            >
              {contact.label}
            </a>
          ))}
        </div>
      </div>
    )}

    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        type="submit"
        className="inline-flex h-14 items-center justify-center rounded-md bg-ink px-6 text-lg font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-black"
      >
        Prepare request
      </button>
      {whatsappRequestLinks.map((contact) => (
        <a
          key={contact.label}
          href={contact.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-14 items-center justify-center rounded-md border border-black/12 bg-white px-6 text-lg font-semibold transition hover:border-ink/40"
        >
          WhatsApp {contact.label}
        </a>
      ))}
    </div>
  </form>
);

interface HomePageProps extends BookingFormProps {
  selectedProjectType: ProjectKey;
  setProjectType: (key: ProjectKey) => void;
  openShop: () => void;
}

const HomePage = ({
  selectedProjectType,
  setProjectType,
  openShop,
  ...bookingProps
}: HomePageProps) => {
  const selectedService = services.find((service) => service.key === selectedProjectType) ?? services[0];

  return (
    <>
      <CollageHero onShopClick={openShop} />

      <section id="samples" className="px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-5xl">
              <p className={`${eyebrowClass} text-ember`}>BTech project studio</p>
              <RevealText text="Code. Report. Demo." variant="scroll" className={`mt-5 ${displayClass}`} />
            </div>
            <RevealBlock variant="soft" className="flex max-w-xl flex-wrap gap-2 text-base font-semibold sm:text-xl">
              {["Final year", "Mini project", "AI/ML", "Cybersecurity"].map((item) => (
                <span key={item} className="rounded-md border border-black/10 bg-white px-5 py-3">
                  {item}
                </span>
              ))}
              <button
                type="button"
                onClick={openShop}
                className="rounded-md bg-ink px-5 py-3 text-primary transition hover:-translate-y-0.5"
              >
                Project shop
              </button>
            </RevealBlock>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {showcase.map((sample, index) => (
              <motion.article
                key={sample.title}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative min-h-[460px] overflow-hidden rounded-lg border border-black/10 bg-ink shadow-[0_18px_48px_rgba(8,8,6,0.1)] lg:min-h-[520px]"
              >
                <img
                  src={sample.image}
                  alt={sample.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-[0.82] transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/24 to-black/4" />
                <div className="relative flex h-full min-h-[460px] flex-col justify-between p-6 lg:min-h-[520px]">
                  <p className="w-fit rounded-md bg-white/12 px-4 py-2 text-sm font-semibold uppercase text-white backdrop-blur">
                    {sample.subject}
                  </p>
                  <div>
                    <RevealText as="h3" text={sample.title} variant="lift" className={`max-w-sm text-white ${cardTitleClass}`} />
                    <div className="mt-6 flex flex-wrap gap-2">
                      {sample.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/15 bg-white/14 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink px-4 py-12 text-primary sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {proofPoints.map((point) => (
            <div key={point.label} className="border-b border-primary/14 py-5">
              <p className="break-words text-[clamp(3rem,14vw,5rem)] font-semibold leading-none lg:text-[clamp(4.5rem,5vw,6rem)]">{point.value}</p>
              <p className="mt-3 text-xl font-semibold text-primary/58">{point.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-white px-4 py-20 sm:px-6 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className={`${eyebrowClass} text-blueglass`}>How it works</p>
              <RevealText text="From idea to demo." variant="scroll" className={`mt-5 ${displayClass}`} />
            </div>
            <button
              type="button"
              onClick={openShop}
              className="inline-flex h-14 items-center self-start rounded-md bg-ink px-5 text-lg font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-black"
            >
              Browse shop
            </button>
          </div>

          <div className="grid gap-3">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-12%" }}
                transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-6 rounded-lg border border-black/10 bg-paper p-6 md:grid-cols-[0.18fr_0.74fr_1fr] md:items-center md:p-8"
              >
                <span className="text-[clamp(3rem,13vw,4.75rem)] font-semibold leading-none text-black/18">0{index + 1}</span>
                <RevealText as="h3" text={step.title} variant={index % 2 === 0 ? "line" : "fade"} className={panelTitleClass} />
                <p className="text-2xl font-semibold leading-9 text-black/62">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="formats" className="px-4 py-20 sm:px-6 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <p className={`${eyebrowClass} text-ember`}>Project types</p>
              <RevealText text="Pick your build." variant="scroll" className={`mt-5 ${displayClass}`} />
            </div>
            <RevealBlock variant="slide" className="max-w-xl text-2xl font-semibold leading-9 text-black/62">
              Tap a card. The request form follows.
            </RevealBlock>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const isSelected = selectedService.key === service.key;

              return (
                <button
                  key={service.key}
                  type="button"
                  onClick={() => setProjectType(service.key)}
                  className={`min-h-[360px] rounded-lg border p-6 text-left transition hover:-translate-y-1 md:p-7 ${
                    isSelected
                      ? "border-ink bg-ink text-primary shadow-[0_20px_60px_rgba(8,8,6,0.2)]"
                      : "border-black/10 bg-white hover:border-ink/35"
                  }`}
                >
                  <div className="mb-10 flex items-start justify-between gap-4">
                    <span className="text-[clamp(2.75rem,11vw,4rem)] font-semibold leading-none">{service.timeline.split(" ")[0]}</span>
                    <span
                      className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                        isSelected ? "bg-primary/10 text-primary" : "bg-paper text-black/68"
                      }`}
                    >
                      {service.timeline}
                    </span>
                  </div>
                  <RevealText as="h3" text={service.title} variant="lift" className={cardTitleClass} />
                  <p className={`mt-5 text-xl font-medium leading-8 ${isSelected ? "text-primary/72" : "text-black/62"}`}>
                    {service.text}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {service.deliverables.map((item) => (
                      <span
                        key={item}
                        className={`rounded-md px-4 py-2 text-base font-semibold ${
                          isSelected ? "bg-primary/10 text-primary" : "bg-paper text-black/70"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-ink px-4 py-20 text-primary sm:px-6 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-5xl">
            <p className={`${eyebrowClass} text-signal`}>Branches and domains</p>
            <RevealText text="CSE, AI/ML, cyber, data, CN, CSBS." variant="scroll" className={`mt-5 ${displayClass}`} />
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {domains.map((domain) => (
              <article key={domain.title} className="min-h-[290px] rounded-lg border border-primary/12 bg-primary/[0.04] p-6 md:p-7">
                <RevealText as="h3" text={domain.title} variant="fade" className={cardTitleClass} />
                <p className="mt-6 text-2xl font-semibold leading-9 text-primary/62">{domain.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-4 py-20 sm:px-6 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.74fr_1.26fr]">
          <div className="flex flex-col justify-between rounded-lg bg-ink p-6 text-primary md:p-8 lg:p-10">
            <div>
              <p className={`${eyebrowClass} text-primary/58`}>Request builder</p>
              <RevealText text="Send the requirement." variant="lift" className={`mt-5 ${panelTitleClass}`} />
              <p className="mt-6 max-w-lg text-2xl font-semibold leading-9 text-primary/68">
                We reply with scope, timing and next steps.
              </p>
            </div>
            <div className="mt-12 grid gap-0">
              {["Report + PPT", urgencies[bookingProps.form.urgency].label, selectedService.title].map((item) => (
                <div key={item} className="border-t border-primary/12 py-6 text-3xl font-semibold text-primary/82">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <BookingForm {...bookingProps} />
        </div>
      </section>
    </>
  );
};

interface ShopPageProps extends BookingFormProps {
  activeCategory: CategoryKey;
  setActiveCategory: (category: CategoryKey) => void;
  selectedProject: ProjectItem | null;
  filteredProjects: ProjectItem[];
  goHome: () => void;
  bookProject: (project: ProjectItem) => void;
}

const ShopPage = ({
  activeCategory,
  setActiveCategory,
  selectedProject,
  filteredProjects,
  goHome,
  bookProject,
  ...bookingProps
}: ShopPageProps) => {
  return (
    <>
      <section className="px-4 py-8 sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={goHome}
            aria-label="Back to landing"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white text-2xl font-semibold transition hover:-translate-x-1 hover:border-ink/40"
          >
            &larr;
          </button>
          <a href="#shop-booking" className="rounded-md bg-ink px-5 py-3 text-lg font-semibold text-primary">
            Book selected
          </a>
        </div>
      </section>

      <section className="px-4 pb-16 pt-8 sm:px-6 md:px-10 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <p className={`${eyebrowClass} text-ember`}>Project shop</p>
          <RevealText
            as="h1"
            text="Choose a project. Book the build."
            variant="scroll"
            className={`mt-5 max-w-6xl ${displayClass}`}
          />

          <div className="relative mt-10 min-h-[320px] overflow-hidden rounded-lg bg-ink text-primary shadow-[0_22px_70px_rgba(8,8,6,0.16)] md:min-h-[420px]">
            <video
              autoPlay
              loop
              muted
              playsInline
              src={heroMediaSrc}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/30 to-black/10" />
            <div className="relative flex min-h-[320px] flex-col justify-end p-6 md:min-h-[420px] md:p-8 lg:p-10">
              <p className={`${eyebrowClass} text-primary/70`}>Catalog preview</p>
              <p className="mt-4 max-w-3xl text-[clamp(2.45rem,9vw,5rem)] font-semibold leading-[0.96]">
                AI, web, cyber, data and cloud builds.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-md border px-5 py-3 text-lg font-semibold transition ${
                  activeCategory === category
                    ? "border-ink bg-ink text-primary"
                    : "border-black/10 bg-white hover:border-ink/40"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const visual = projectVisuals[project.category];
              const isSelected = selectedProject?.id === project.id;

              return (
                <motion.article
                  key={project.id}
                  initial={{ y: 24, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.5, delay: (index % 6) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className={`group flex min-h-[560px] flex-col overflow-hidden rounded-lg border transition ${
                    isSelected
                      ? "border-ink bg-ink text-primary shadow-[0_20px_60px_rgba(8,8,6,0.2)]"
                      : "border-black/10 bg-white text-ink"
                  }`}
                >
                  <div className="relative h-52 overflow-hidden bg-ink sm:h-56">
                    <img
                      src={visual.image}
                      alt={visual.alt}
                      loading="lazy"
                      className={`absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                        isSelected ? "opacity-72" : "opacity-88"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-black/6" />
                    <div className="relative flex h-full items-start justify-between gap-4 p-5">
                      <span className="rounded-md bg-white/14 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
                        {project.category}
                      </span>
                      <span className="rounded-md bg-black/22 px-3 py-1.5 text-sm font-semibold text-white/82 backdrop-blur">
                        {project.timeline}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <RevealText
                        as="h2"
                        text={project.title}
                        variant={index % 2 === 0 ? "lift" : "fade"}
                        className={`${cardTitleClass}`}
                      />
                      <p className={`mt-5 text-xl font-semibold leading-8 ${isSelected ? "text-primary/64" : "text-black/60"}`}>
                        {project.blurb}
                      </p>
                    </div>

                    <div className="mt-8">
                      <p className="text-lg font-semibold opacity-70">{project.stack}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.includes.map((item) => (
                          <span
                            key={item}
                            className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                              isSelected ? "bg-primary/10" : "bg-paper"
                            }`}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => bookProject(project)}
                        className={`mt-7 h-14 w-full rounded-md text-lg font-semibold transition hover:-translate-y-0.5 ${
                          isSelected ? "bg-primary text-ink" : "bg-ink text-primary"
                        }`}
                      >
                        Book this project
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="shop-booking" className="bg-ink px-4 py-20 text-primary sm:px-6 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.68fr_1.32fr]">
          <div>
            <p className={`${eyebrowClass} text-signal`}>Booking</p>
            <RevealText text="Reserve your project." variant="scroll" className={`mt-5 ${panelTitleClass}`} />
            <RevealBlock variant="slide" className="mt-6 max-w-xl text-2xl font-semibold leading-9 text-primary/64">
              Choose a catalog idea or edit the form for a custom build.
            </RevealBlock>
            {selectedProject && (
              <div className="mt-10 overflow-hidden rounded-lg border border-primary/12 bg-primary/[0.04]">
                <img
                  src={projectVisuals[selectedProject.category].image}
                  alt={projectVisuals[selectedProject.category].alt}
                  loading="lazy"
                  className="h-44 w-full object-cover opacity-80"
                />
                <div className="p-6">
                  <p className="text-sm font-semibold uppercase text-primary/50">Selected</p>
                  <RevealText
                    as="h3"
                    text={selectedProject.title}
                    variant="lift"
                    className="mt-3 text-4xl font-semibold leading-[0.98]"
                  />
                  <p className="mt-4 text-xl font-semibold text-primary/62">{selectedProject.stack}</p>
                </div>
              </div>
            )}
          </div>
          <div className="text-ink">
            <BookingForm {...bookingProps} />
          </div>
        </div>
      </section>
    </>
  );
};

interface FooterSectionProps {
  openShop: () => void;
  goHomeSection: (sectionId?: string) => void;
}

const FooterSection = ({ openShop, goHomeSection }: FooterSectionProps) => (
  <footer className="bg-ink px-4 py-16 text-primary sm:px-6 md:px-10 md:py-24">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 border-b border-primary/12 pb-12 lg:grid-cols-[1.25fr_1fr] lg:items-end">
        <div>
          <p className={`${eyebrowClass} text-signal`}>Project build desk</p>
          <RevealText
            text="Build it. Submit it. Explain it."
            variant="scroll"
            className={`mt-5 max-w-5xl ${displayClass}`}
          />
        </div>
        <div className="grid gap-3 text-xl font-semibold text-primary/70 sm:grid-cols-2">
          {["CSE", "AI/ML", "Cybersecurity", "Data Science", "CN", "CSBS"].map((item) => (
            <span key={item} className="border-t border-primary/12 py-3">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-10 py-10 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold uppercase text-primary/45">Navigate</p>
          <div className="mt-5 grid gap-3 text-xl font-semibold">
            <button type="button" onClick={() => goHomeSection("samples")} className="w-fit text-left text-primary/78 transition hover:text-primary">
              Projects
            </button>
            <button type="button" onClick={() => goHomeSection("how-it-works")} className="w-fit text-left text-primary/78 transition hover:text-primary">
              How it works
            </button>
            <button type="button" onClick={openShop} className="w-fit text-left text-primary/78 transition hover:text-primary">
              Project shop
            </button>
            <button type="button" onClick={() => goHomeSection("contact")} className="w-fit text-left text-primary/78 transition hover:text-primary">
              Contact
            </button>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase text-primary/45">Project types</p>
          <div className="mt-5 grid gap-3 text-xl font-semibold text-primary/78">
            {services.slice(0, 6).map((service) => (
              <span key={service.key}>{service.title}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase text-primary/45">WhatsApp</p>
          <div className="mt-5 grid gap-3 text-xl font-semibold">
            {whatsappContacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noreferrer"
                className="text-primary/78 transition hover:text-primary"
              >
                {contact.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-primary/12 pt-6 text-sm font-semibold text-primary/45 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} BTech Project Studio</span>
        <span>Code, report, PPT and demo support</span>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [form, setForm] = useState<ProjectForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedService = services.find((service) => service.key === form.projectType) ?? services[0];
  const brief = useMemo(() => buildBrief(form), [form]);
  const whatsappRequestLinks = useMemo(
    () =>
      whatsappContacts.map((contact) => ({
        label: contact.label,
        href: buildWhatsAppHref(contact.label, brief),
      })),
    [brief],
  );

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projectCatalog;
    return projectCatalog.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  const updateField = <Key extends keyof ProjectForm>(key: Key, value: ProjectForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.topic.trim()) nextErrors.topic = "Add the project idea.";
    if (!form.deadline.trim()) nextErrors.deadline = "Add the deadline.";
    if (!form.contact.trim()) nextErrors.contact = "Add a phone or email.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);

    if (!validate()) return;

    setSubmitted(true);
    window.open(whatsappRequestLinks[0].href, "_blank", "noopener,noreferrer");
  };

  const handleCopyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const openShop = () => {
    setPage("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHomeSection = (sectionId?: string) => {
    setPage("home");
    window.setTimeout(() => {
      if (!sectionId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const setProjectType = (key: ProjectKey) => {
    updateField("projectType", key);
  };

  const bookProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setSubmitted(false);
    setErrors({});
    setForm((current) => ({
      ...current,
      topic: project.title,
      branch: current.branch || "BTech CSE / IT",
      projectType: project.projectType,
      techStack: project.stack,
      requirements: [
        `Selected from project shop: ${project.title}`,
        `Category: ${project.category}`,
        `Level: ${project.level}`,
        `Includes: ${project.includes.join(", ")}`,
      ].join("\n"),
    }));
    window.setTimeout(() => {
      document.getElementById("shop-booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const bookingProps = {
    form,
    selectedService,
    errors,
    copied,
    submitted,
    whatsappRequestLinks,
    updateField,
    handleSubmit,
    handleCopyBrief,
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-paper text-ink">
      {page === "home" ? (
        <HomePage
          {...bookingProps}
          selectedProjectType={form.projectType}
          setProjectType={setProjectType}
          openShop={openShop}
        />
      ) : (
        <ShopPage
          {...bookingProps}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          selectedProject={selectedProject}
          filteredProjects={filteredProjects}
          goHome={goHome}
          bookProject={bookProject}
        />
      )}

      <FooterSection openShop={openShop} goHomeSection={goHomeSection} />
      <WhatsAppFloat />
    </main>
  );
}
