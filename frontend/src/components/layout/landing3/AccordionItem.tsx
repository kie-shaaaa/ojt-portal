"use client";

import React, { useState } from "react";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  usePlusMinus?: boolean;
}
export function AccordionItem({
  title,
  children,
  icon,
  usePlusMinus = false,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-xl mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-white"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-slate-400">{icon}</div>}
          <span className="font-semibold text-slate-800">{title}</span>
        </div>
        <div className="text-slate-400">
          {usePlusMinus ? (
            isOpen ? (
              <Minus className="w-5 h-5" />
            ) : (
              <Plus className="w-5 h-5" />
            )
          ) : isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
