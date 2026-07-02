import { useState } from "react";

import TypewriterView from "../components/landing page/AnimationText";
import GradientView from "../components/landing page/gradient";
import Login2 from "../components/landing page/Log in";
import Signin1 from "../components/landing page/Sign up";

function LandingPage() {
  const [activeView, setActiveView] = useState("login");

  return (
    <div className="min-h-screen w-full flex flex-col justify-center bg-gradient-to-br from-primary-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* <div className="">
        <GradientView />
        <TypewriterView />
      </div> */}
      <div className="flex-grow flex items-center justify-center p-4">
        {/* Auth components */}
        {activeView === "login" && (
          <Login2 onSwitchToSignup={() => setActiveView("signup")} />
        )}

        {activeView === "signup" && (
          <Signin1 onSwitchToLogin={() => setActiveView("login")} />
        )}
      </div>
    </div>
  );
}

export default LandingPage;
