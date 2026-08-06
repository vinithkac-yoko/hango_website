import Hero from "@/components/home/hero";
import Values, { ClosingCta } from "@/components/home/values";
import GrowthStack from "@/components/home/growth-stack";
import StoryProgress from "@/components/home/story-progress";
import { elevatorPitch, coreValues, growthStack } from "@/data/company";

const STORY_LABELS = ["Hero", "Story", "Services", "Grow"] as const;

export default function Home() {
  return (
    <div id="story-root" className="relative">
      <StoryProgress targetId="story-root" labels={STORY_LABELS} />

      <div className="relative z-10">
        <Hero hook={elevatorPitch.hook} body={elevatorPitch.body} />
      </div>
      <div className="relative z-20">
        <Values quote={coreValues[0].description} items={coreValues.slice(1, 4)} />
      </div>
      <div className="relative z-30">
        <GrowthStack pillars={growthStack} />
      </div>
      <div className="relative z-40">
        <ClosingCta />
      </div>
    </div>
  );
}
