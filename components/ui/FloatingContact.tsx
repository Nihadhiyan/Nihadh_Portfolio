"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageSquare, X } from "lucide-react";
import { SiWhatsapp, SiGithub } from "react-icons/si";
import { RxLinkedinLogo } from "react-icons/rx";
import { siteConfig } from "@/config/site";

interface ContactChannel {
  label: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

const CHANNELS: ContactChannel[] = [
  {
    label: "GitHub",
    href: siteConfig.socials.github,
    icon: SiGithub,
    color: "#e2e8f0",
  },
  {
    label: "WhatsApp",
    href: siteConfig.contact.whatsappUrl,
    icon: SiWhatsapp,
    color: "#25d366",
  },
  {
    label: "LinkedIn",
    href: siteConfig.socials.linkedin,
    icon: RxLinkedinLogo,
    color: "#0077b5",
  },
];

/**
 * Persistent bottom-right expandable contact speed dial.
 * Displays a single main trigger button by default. When hovered or clicked,
 * it expands vertically to reveal individual contact channels (Email, WhatsApp, GitHub).
 */
export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Quick contact links"
    >
      {/* Expandable Channel Stack */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col items-end gap-3 mb-1"
          >
            {CHANNELS.map((channel, i) => (
              <ContactFab key={channel.label} channel={channel} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <div className="group flex items-center justify-end">
        <span className="surface-raised max-w-0 overflow-hidden whitespace-nowrap rounded-full text-sm font-medium text-[var(--foreground)] opacity-0 transition-all duration-300 ease-out group-hover:mr-3 group-hover:max-w-[10rem] group-hover:px-4 group-hover:py-2.5 group-hover:opacity-100 group-focus-visible:mr-3 group-focus-visible:max-w-[10rem] group-focus-visible:px-4 group-focus-visible:py-2.5 group-focus-visible:opacity-100">
          {isOpen ? "Close" : "Contact"}
        </span>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle contact menu"
          aria-expanded={isOpen}
          data-interactive
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="fab-pulse relative z-20 flex h-[56px] w-[56px] items-center justify-center rounded-full border border-cyan-400/50 backdrop-blur-md text-cyan-900 dark:text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all duration-300 hover:border-cyan-300 hover:text-cyan-950 dark:hover:text-white hover:shadow-[0_0_30px_rgba(34,211,238,0.7)] cursor-pointer"
          style={
            {
              background:
                "linear-gradient(135deg, rgba(34,211,238,0.22) 0%, rgba(59,130,246,0.22) 50%, rgba(99,102,241,0.22) 100%)",
              "--pulse-color": "#22d3ee73",
              boxShadow: isOpen ? "0 0 30px rgba(34,211,238,0.6)" : "0 0 20px rgba(34,211,238,0.3)",
            } as React.CSSProperties
          }
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <X className="h-6 w-6 text-cyan-900 dark:text-cyan-300" />
              </motion.div>
            ) : (
              <motion.div
                key="contact"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <MessageSquare className="h-6 w-6 text-cyan-900 dark:text-cyan-300" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

function ContactFab({ channel, index }: { channel: ContactChannel; index: number }) {
  const { label, href, icon: Icon, color } = channel;
  const isExternal = href.startsWith("http");

  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={label}
      data-interactive
      initial={{ opacity: 0, y: 15, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.8 }}
      transition={{ delay: (CHANNELS.length - 1 - index) * 0.05, duration: 0.2, ease: "easeOut" }}
      whileTap={{ scale: 0.92 }}
      className="group flex items-center justify-end"
    >
      <span
        className="surface-raised max-w-0 overflow-hidden whitespace-nowrap rounded-full text-sm font-medium text-[var(--foreground)] opacity-0 transition-all duration-300 ease-out group-hover:mr-3 group-hover:max-w-[10rem] group-hover:px-4 group-hover:py-2.5 group-hover:opacity-100 group-focus-visible:mr-3 group-focus-visible:max-w-[10rem] group-focus-visible:px-4 group-focus-visible:py-2.5 group-focus-visible:opacity-100"
      >
        {label}
      </span>
      <span
        className="fab-pulse surface-raised relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-white/10 text-[var(--foreground)] transition-transform duration-300 group-hover:scale-110"
        style={
          {
            "--pulse-color": `${color}73`,
            boxShadow: `0 0 18px 0 ${color}40`,
          } as React.CSSProperties
        }
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </span>
    </motion.a>
  );
}

