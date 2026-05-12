"use client";
import Image from "next/image";
import { type FormEvent, JSX, useId, useState } from "react";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export const LoginFormSection = (): JSX.Element => {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login failed:", err);
      setLocalError("Invalid email or password");
    }
  };

  return (
    <section className="relative flex items-center justify-center pt-16 pb-16 px-8 self-stretch w-full flex-[0_0_auto] bg-[url('/login/login-bg.png')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/35" />
      <div className="flex flex-col max-w-md w-[448px] items-center p-8 relative bg-white rounded-lg border border-solid border-[#c4c5d5]">
        <div
          aria-hidden="true"
          className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-lg shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a]"
        />
        <div className="inline-flex items-start pt-0 pb-8 px-0 flex-[0_0_auto] flex-col relative z-[1]">
          <div className="inline-flex items-center flex-[0_0_auto] flex-col relative">
            <div className="flex flex-col w-20 h-24 items-start pt-0 pb-4 px-0 relative">
              <div className="relative w-20 h-20 overflow-hidden rounded-full">
                <Image
                  src="/ntc-logo.png"
                  alt="National Telecommunications Commission seal"
                  fill
                  className="object-cover object-center"
                  sizes="80px"
                />
              </div>
            </div>
            <h1 className="relative flex items-center justify-center w-fit [font-family:'Public_Sans-Bold',Helvetica] font-bold text-[#002068] text-2xl text-center tracking-[0] leading-8 whitespace-nowrap">
              Login to Portal
            </h1>
            <div className="inline-flex flex-col items-start pt-2 pb-0 px-0 relative flex-[0_0_auto]">
              <div className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                <p className="flex items-center justify-center [font-family:'Public_Sans-Regular',Helvetica] font-normal text-[#444653] text-[13px] text-center tracking-[0] leading-[18px] whitespace-nowrap relative w-fit mt-[-1.00px]">
                  Enter your credentials to access your dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
        <form
          className="flex flex-col items-start pt-0 pb-4 px-0 relative self-stretch w-full flex-[0_0_auto] z-[1]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
            {localError && (
              <div className="w-full p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
                {localError}
              </div>
            )}
            <div className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
              <label
                className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Public_Sans-SemiBold',Helvetica] font-semibold text-[#444653] text-xs tracking-[0.24px] leading-4 whitespace-nowrap"
                htmlFor={emailId}
              >
                Email
              </label>
              <div className="flex items-center justify-center relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start pl-10 pr-4 py-3.5 relative flex-1 grow bg-[#eff4ff] rounded overflow-hidden border border-solid border-[#c4c5d5]">
                  <input
                    autoComplete="email"
                    className="relative self-stretch w-full border-[none] [background:none] mt-[-1.00px] [font-family:'Public_Sans-Regular',Helvetica] font-normal text-[#6b7280] placeholder:text-gray-500 text-sm tracking-[0] leading-[normal] p-0 focus:outline-none"
                    id={emailId}
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(event) => setemail(event.target.value)}
                  />
                </div>
                <User
                  className="absolute top-4 left-[15px] w-[13px] h-[13px] text-[#6b7280]"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="flex flex-col items-start gap-1.5 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
                <label
                  className="inline-flex flex-col items-start relative flex-[0_0_auto]"
                  htmlFor={passwordId}
                >
                  <span className="flex items-center [font-family:'Public_Sans-SemiBold',Helvetica] font-semibold text-[#444653] text-xs tracking-[0.24px] leading-4 whitespace-nowrap relative w-fit mt-[-1.00px]">
                    Password
                  </span>
                </label>
                <a
                  className="inline-flex flex-col items-start relative flex-[0_0_auto]"
                  href="#"
                >
                  <span className="flex items-center [font-family:'Public_Sans-Bold',Helvetica] font-bold text-[#002068] text-[11px] tracking-[0.55px] leading-[14px] whitespace-nowrap relative w-fit mt-[-1.00px]">
                    Forgot password?
                  </span>
                </a>
              </div>
              <div className="flex items-center justify-center relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex flex-col items-start pl-10 pr-4 py-3.5 relative flex-1 grow bg-[#eff4ff] rounded overflow-hidden border border-solid border-[#c4c5d5]">
                  <input
                    autoComplete="current-password"
                    className="relative self-stretch w-full border-[none] [background:none] mt-[-1.00px] [font-family:'Public_Sans-Regular',Helvetica] font-normal text-[#6b7280] placeholder:text-gray-500 text-sm tracking-[0] leading-[normal] p-0 focus:outline-none"
                    id={passwordId}
                    name="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <Lock
                  className="absolute top-3.5 left-[15px] w-[13px] h-[18px] text-[#6b7280]"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="flex items-center relative self-stretch w-full flex-[0_0_auto]">
              <input
                checked={rememberMe}
                className="peer sr-only"
                id={rememberId}
                name="rememberMe"
                type="checkbox"
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <label
                className="flex items-center cursor-pointer"
                htmlFor={rememberId}
              >
                <span className="relative w-4 h-4 bg-white rounded-sm border border-solid border-[#c4c5d5] flex items-center justify-center">
                  {rememberMe ? (
                    <span className="block w-2 h-2 rounded-[2px] bg-[#002068]" />
                  ) : null}
                </span>
                <span className="inline-flex flex-col items-start pl-2 pr-0 py-0 relative flex-[0_0_auto]">
                  <span className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Public_Sans-Regular',Helvetica] font-normal text-[#444653] text-[13px] tracking-[0] leading-[18px] whitespace-nowrap">
                    Remember me
                  </span>
                </span>
              </label>
            </div>
            <button
              className="all-[unset] box-border flex items-center justify-center gap-2 px-0 py-4 relative self-stretch w-full flex-[0_0_auto] bg-[#002068] rounded-xl cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoading}
              type="submit"
            >
              <div
                aria-hidden="true"
                className="absolute w-full h-full top-0 left-0 bg-[#ffffff01] rounded-xl shadow-[0px_2px_4px_-2px_#0000001a,0px_4px_6px_-1px_#0000001a]"
              />
              <span className="flex items-center justify-center [font-family:'Public_Sans-Bold',Helvetica] font-bold text-white text-xs text-center tracking-[0.24px] leading-4 whitespace-nowrap relative w-fit mt-[-1.00px]">
                {isLoading ? "Logging in..." : "Login"}
              </span>
              <span className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                {isLoading ? (
                  <Loader2 className="relative w-[13.33px] h-[13.33px] animate-spin text-white" />
                ) : (
                  <ArrowRight
                    className="relative w-[13.33px] h-[13.33px]"
                    aria-hidden="true"
                  />
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
