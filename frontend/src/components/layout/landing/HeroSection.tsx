"use client";

import Link from "next/link";
import { Send, ArrowRightIcon, SignalIcon, ShieldCheckIcon, GraduationCapIcon, BuildingIcon } from "lucide-react";
import { JSX, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion'
import { ApplicationPortalClosedModal } from "@/components/modals/ApplicationPortalClosedModal";
import { apiCall } from "@/lib/api";

export const HeroSection = (): JSX.Element => {
  const router = useRouter();
  const [isPortalOpen, setIsPortalOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const MotionDiv = motion.div as any
  const MotionH1 = motion.h1 as any
  const MotionP = motion.p as any

  useEffect(() => {
    const loadPortalStatus = async () => {
      try {
        const response = await apiCall("/applications/settings", {
          method: "GET",
        });
        const settings = response.data ?? response;

        if (typeof settings.portal_status === "boolean") {
          setIsPortalOpen(settings.portal_status);
        }
      } catch (error) {
        const saved = localStorage.getItem("portalSettings");

        if (saved) {
          try {
            const { isOpen } = JSON.parse(saved);
            setIsPortalOpen(Boolean(isOpen));
          } catch (parseError) {
            console.error("Failed to load portal settings:", parseError);
          }
        } else {
          console.error("Failed to fetch portal status:", error);
        }
      }
    };

    void loadPortalStatus();
  }, []);

  const handleSubmitApplication = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!isPortalOpen) {
      setIsModalOpen(true);
    } else {
      router.push("/apply");
    }
  };

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section
      id="home"
      className="relative pt-20 pb-18 lg:pt-28 lg:pb-24 overflow-hidden min-h-screen flex items-center bg-[#1d4ed8]"
      aria-labelledby="hero-banner-title"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#1d4ed8] via-[#1e40af] to-[#172554]" />

      <div className="absolute inset-0">
        <img
          src="/landing/portal-bg.png"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d4ed8]/55 via-[#1e40af]/65 to-[#172554]/80" />
      </div>

      {/* Animated glows */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[#3b82f6]/30 rounded-full blur-[80px] transform-gpu" />
      <div className="absolute bottom-0 -right-20 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[100px] transform-gpu" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {!isPortalOpen && (
          <div className="mb-1.5 rounded-2xl border border-red-200 bg-white/95 px-4 py-2 text-red-700 shadow-lg shadow-red-950/10 backdrop-blur-md">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-red-600">
                  Applications temporarily closed
                </p>
                <p className="text-sm text-red-700/90">
                  The NTC is not accepting applicants right now. Please check back when the portal reopens.
                </p>
              </div>
              <span className="inline-flex w-fit items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                Closed
              </span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <MotionDiv
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <MotionDiv
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#bfdbfe]"></span>
              </span>
              OJT & Internship Portal · HR Department
            </MotionDiv>

            <MotionH1
              variants={itemVariants}
              id="hero-banner-title"
              className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
            >
              Start Your Internship Journey in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bfdbfe] to-sky-200">
                Public Service
              </span>
            </MotionH1>

            <MotionP
              variants={itemVariants}
              className="text-lg lg:text-xl text-[#dbeafe] mb-10 leading-relaxed max-w-xl"
            >
              Discover meaningful opportunities at the National
              Telecommunications Commission. Inquire first about our programs,
              requirements, and processes — no pressure to apply right away.
            </MotionP>

            <MotionDiv
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={handleSubmitApplication}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1d4ed8] px-8 py-4 rounded-xl font-semibold hover:bg-[#eff6ff] hover:shadow-2xl hover:shadow-white/20 transition-all active:scale-95 text-lg"
                aria-label={isPortalOpen ? "Submit Application" : "Portal closed"}
              >
                <Send className="w-5 h-5"/>
                {isPortalOpen ? "Submit Application" : "Portal Closed"}
              </button>
              <Link
                href="/track"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 backdrop-blur-md px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all active:scale-95 text-lg"
                aria-label="Track Application"
              >
                Track Application
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </MotionDiv>

            {!isPortalOpen && (
              <p className="mt-4 inline-flex w-fit rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm">
                NTC is not accepting applicants at the moment.
              </p>
            )}
          </MotionDiv>

          <div className="relative hidden lg:block h-[560px]">
            <MotionDiv
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.3,
              }}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl shadow-ntc-950/60 border border-white/15"
            >
              <img
                src="/landing_2/Hero_2.png"
                alt="Professionals collaborating in a modern government office"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172554]/60 via-transparent to-transparent" />
            </MotionDiv>

            <div className="absolute top-[8%] -right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 z-30 shadow-2xl shadow-ntc-950/40 border border-white/40 transform-gpu">
              <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                <SignalIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-800">
                Telecom Tech
              </span>
            </div>

            <div className="absolute bottom-[12%] -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 z-30 shadow-2xl shadow-ntc-950/40 border border-white/40 transform-gpu">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                <GraduationCapIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-800">
                Student Learning
              </span>
            </div>

            <div className="absolute top-[42%] -left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 z-30 shadow-2xl shadow-ntc-950/40 border border-white/40 transform-gpu">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-800">
                Public Service
              </span>
            </div>

            <div className="absolute bottom-[40%] -right-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 z-30 shadow-2xl shadow-ntc-950/40 border border-white/40 transform-gpu">
              <div className="bg-[#dbeafe] p-2 rounded-lg text-[#1d4ed8]">
                <BuildingIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-800">
                Gov Agency
              </span>
            </div>
          </div>
        </div>
      </div>

      <ApplicationPortalClosedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};
