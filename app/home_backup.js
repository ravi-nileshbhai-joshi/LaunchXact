import Hero from '../components/Hero';
import ToolGrid from '../components/ToolGrid';
import FounderCTA from '../components/FounderCTA';
import { getFeaturedTools, getNewLaunches } from '../lib/data';

export default function Home() {
  const featuredTools = getFeaturedTools();
  const newLaunches = getNewLaunches();

  return (
    <>
      <Hero />
      <ToolGrid title="Featured tools" tools={featuredTools} />
      <ToolGrid title="New launches" tools={newLaunches} />
      <FounderCTA />
    </>
  );
}
