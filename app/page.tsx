import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { TrustStrip } from "@/components/site/trust-strip";
import { Problem } from "@/components/site/problem";
import { SolutionFlow } from "@/components/site/solution-flow";
import { DemoScenario } from "@/components/site/demo-scenario";
import { Features } from "@/components/site/features";
import { Mockups } from "@/components/site/mockups";
import { Benefits } from "@/components/site/benefits";
import { Pricing } from "@/components/site/pricing";
import { Faq } from "@/components/site/faq";
import { FinalCta } from "@/components/site/final-cta";
import { Footer } from "@/components/site/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Problem />
        <SolutionFlow />
        <DemoScenario />
        <Features />
        <Mockups />
        <Benefits />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
