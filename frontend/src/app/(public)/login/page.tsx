import { LoginFormSection } from "../../../components/layout/login/LoginFormSection";
import { LoginScrollLock } from "../../../components/layout/login/LoginScrollLock";
import { NavBar } from "../../../components/layout/NavBar";
import { JSX } from "react";

export const LoginPage = (): JSX.Element => {
  return (
    <main className="bg-white w-full min-h-screen flex flex-col overflow-hidden">
      <LoginScrollLock />
      <NavBar />
      <LoginFormSection />
    </main>
  );
};

export default LoginPage;