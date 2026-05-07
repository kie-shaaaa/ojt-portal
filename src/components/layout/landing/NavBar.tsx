
import { UserRound } from "lucide-react";
import { JSX } from "react";
<UserRound />

const navLinks = [
  { label: "FAQs", href: "#faqs" },
  { label: "Contact", href: "#contact" },
];

export const NavBar = (): JSX.Element => {
  return (
    <header className="flex flex-1 max-h-[68px] relative w-[1280px] items-center justify-between px-12 py-3 bg-[#002b7f]">
      <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
        <div
          className="w-10 h-10 border border-solid border-white bg-[url(/image.png)] relative rounded-full bg-cover bg-[50%_50%]"
          role="img"
          aria-label="NTC OJT Application logo"
        />
        <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
          <div className="flex items-start self-stretch w-full flex-col relative flex-[0_0_auto]">
            <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Bold',Helvetica] font-bold text-white text-lg tracking-[0] leading-7 whitespace-nowrap relative w-fit">
              NTC OJT APPLICATION
            </div>
          </div>
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-center mt-[-1.00px] [font-family:'Inter-Regular',Helvetica] font-normal text-slate-300 text-xs tracking-[0] leading-4 whitespace-nowrap relative w-fit">
              HR Department
            </div>
          </div>
        </div>
      </div>
      <nav
        aria-label="Primary navigation"
        className="inline-flex items-center gap-6 relative flex-[0_0_auto]"
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="inline-flex flex-col items-start relative flex-[0_0_auto] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm"
          >
            <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm tracking-[0] leading-5 whitespace-nowrap">
              {link.label}
            </div>
          </a>
        ))}

        <button
          type="button"
          aria-label="Login"
          className="all-[unset] box-border inline-flex gap-2 px-4 py-2 bg-[#2a52be] rounded border border-solid border-[#60a5fa4c] items-center relative flex-[0_0_auto] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
            <UserRound className="relative w-[18px] h-[18px] text-white" aria-hidden="true" />
          </div>
          <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
            <div className="flex items-center justify-center mt-[-1.00px] [font-family:'Inter-Medium',Helvetica] font-medium text-white text-sm text-center tracking-[0] leading-5 whitespace-nowrap relative w-fit">
              Login
            </div>
          </div>
        </button>
      </nav>
    </header>
  );
};