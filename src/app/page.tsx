import Hero from "@/components/home/hero";
import Values, { ClosingCta } from "@/components/home/values";
import GrowthStack from "@/components/home/growth-stack";
import { elevatorPitch, coreValues, growthStack } from "@/data/company";

export default function Home() {
  return (
    <>
      <Hero hook={elevatorPitch.hook} body={elevatorPitch.body} />
      <Values quote={coreValues[0].description} items={coreValues.slice(1, 4)} />
      <GrowthStack pillars={growthStack} />
      <ClosingCta />
    </>
  );
}
