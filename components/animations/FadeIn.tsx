"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  amount?: number | "some" | "all";
  direction?: "up" | "down" | "left" | "right" | "none";
  scaleOffset?: number;
}

/**
 * Reusable bidirectional scroll animation wrapper utilizing `once: false`.
 * As the user scrolls UP or DOWN past section boundaries, elements gracefully
 * fade out/scale down and replay their spring transition when entering view!
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.65,
  className = "",
  amount = 0.2,
  direction = "up",
  scaleOffset = 0.95,
}: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getDirectionalOffset = () => {
    switch (direction) {
      case "up":
        return { y: 48, x: 0 };
      case "down":
        return { y: -48, x: 0 };
      case "left":
        return { x: 48, y: 0 };
      case "right":
        return { x: -48, y: 0 };
      case "none":
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getDirectionalOffset();

  const variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      scale: scaleOffset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 26,
        delay,
        duration,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
