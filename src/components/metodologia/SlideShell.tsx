import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SlideShellProps {
  id: string;
  children: ReactNode;
  className?: string;
  variant?: "dark" | "light" | "gradient" | "accent";
}

const variantStyles: Record<string, string> = {
  dark: "bg-[hsl(210_25%_8%)] text-[hsl(210_20%_95%)]",
  light: "bg-background text-foreground",
  gradient: "gradient-hero text-[hsl(210_20%_95%)]",
  accent: "bg-[hsl(174_72%_22%)] text-[hsl(210_20%_95%)]",
};

export default function SlideShell({ id, children, className, variant = "dark" }: SlideShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "deck-slide w-screen h-screen flex-shrink-0 snap-start snap-always overflow-hidden relative flex items-center justify-center",
        variantStyles[variant],
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-16 flex flex-col justify-center"
      >
        {children}
      </motion.div>
    </section>
  );
}
