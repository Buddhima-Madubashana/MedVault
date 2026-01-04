import { useState } from "react";

import TypewriterView from "../components/landing page/AnimationText";
import GradientView from "../components/landing page/gradient";
import Login2 from "../components/landing page/Log in";
import Signin1 from "../components/landing page/Sign up";

function LandingPage() {
  const [activeView, setActiveView] = useState("login");

  return (
    <>
      {/* Background / static UI */}
      <GradientView />
      <TypewriterView />

      {/* Auth components */}
      {activeView === "login" && (
        <Login2 onSwitchToSignup={() => setActiveView("signup")} />
      )}

      {activeView === "signup" && (
        <Signin1 onSwitchToLogin={() => setActiveView("login")} />
      )}
    </>
  );
}

export default LandingPage;
