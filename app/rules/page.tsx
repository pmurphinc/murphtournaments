import { prisma } from "@/lib/prisma";
export default async function RulesPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="mb-4">Murph Tournaments – Official Rules &amp; Fair Play Policy</h1>
      <p className="mb-6 text-lg">At Murph Tournaments, we are committed to creating a competitive environment that emphasizes <span className="text-cyan-300 font-semibold">fair play</span>, <span className="text-cyan-300 font-semibold">respect</span>, and <span className="text-cyan-300 font-semibold">integrity</span>. By participating in any Murph Tournament, you agree to abide by the rules outlined below.</p>

      <h2 className="mt-8 mb-2 text-yellow-300">1. General Conduct</h2>
      <ul className="mb-6">
        <li><span className="font-semibold">Respect:</span> All players must show respect toward staff, opponents, and the community.</li>
        <li><span className="font-semibold">No Toxicity:</span> Harassment, hate speech, threats, or personal attacks will not be tolerated.</li>
        <li><span className="font-semibold">Match Integrity:</span> All outcomes must be the result of skill and strategy, not cheating or exploitation.</li>
      </ul>

      <h2 className="mt-8 mb-2 text-yellow-300">2. Gameplay Rules (THE FINALS)</h2>
      <ul className="mb-6">
        <li><span className="font-semibold">Class Limits:</span> No triple-stacking classes (max two of the same class per team).</li>
        <li><span className="font-semibold">Cheating &amp; Exploits:</span> The use of cheats, macros, or in-game exploits is strictly prohibited.</li>
        <li><span className="font-semibold">Stream Sniping:</span> Watching or relaying information from live streams to gain an advantage is not allowed.</li>
        <li><span className="font-semibold">Disconnects/Crashes:</span> If a disconnect occurs mid-match, the match will continue unless deemed unplayable by staff.</li>
        <li><span className="font-semibold">Map &amp; Mode Rotation:</span> Matches follow official Murph Tournament formats (Cashout, Final Round, or custom event rules).</li>
      </ul>

      <h2 className="mt-8 mb-2 text-yellow-300">3. Tournament Structure</h2>
      <ul className="mb-6">
        <li><span className="font-semibold">Match Format:</span> Unless otherwise stated, tournaments are run in Double Elimination BO1 (Best of 1). Finals formats may vary.</li>
        <li><span className="font-semibold">Start Times:</span> Teams must be present in the Tournament Stage channel 15 minutes prior to start time for check-in and briefing.</li>
        <li><span className="font-semibold">No-Shows:</span> Teams not present at match time may forfeit their match.</li>
        <li><span className="font-semibold">Disputes:</span> Any issues must be reported to staff immediately after a match for review.</li>
      </ul>

      <h2 className="mt-8 mb-2 text-yellow-300">4. Technical Requirements</h2>
      <ul className="mb-6">
        <li><span className="font-semibold">Embark ID:</span> All players must compete on their own registered Embark ID.</li>
        <li><span className="font-semibold">Connection:</span> Stable internet connection is required — repeated connection issues may result in disqualification.</li>
        <li><span className="font-semibold">Official Build:</span> Players must use the current official build of THE FINALS (no unauthorized modifications).</li>
      </ul>

      <h2 className="mt-8 mb-2 text-yellow-300">5. Code of Integrity</h2>
      <ul className="mb-6">
        <li><span className="font-semibold">Fair Competition:</span> Winning should only ever come from skill, teamwork, and strategy.</li>
        <li><span className="font-semibold">Transparency:</span> If a team suspects a violation, it must be reported, not retaliated against.</li>
        <li><span className="font-semibold">Sportsmanship:</span> Celebrate victories respectfully and accept losses with dignity.</li>
      </ul>

      <h2 className="mt-8 mb-2 text-yellow-300">6. Penalties</h2>
      <ul className="mb-6">
        <li>Violations of these rules may result in:</li>
        <ul className="ml-6">
          <li>Match forfeiture</li>
          <li>Disqualification from the tournament</li>
          <li>Temporary or permanent ban from Murph Tournaments</li>
        </ul>
      </ul>

      <h2 className="mt-8 mb-2 text-yellow-300">7. Updates &amp; Final Say</h2>
      <ul className="mb-6">
        <li>Murph Tournaments reserves the right to:</li>
        <ul className="ml-6">
          <li>Modify rules between events to ensure competitive integrity.</li>
          <li>Make final decisions in disputes where rules do not provide explicit guidance.</li>
        </ul>
      </ul>

      <p className="mt-8 text-green-400 font-semibold text-lg flex items-center gap-2">✅ By registering and participating, you agree to follow these rules and uphold the spirit of fair play.</p>
    </article>
  );
}