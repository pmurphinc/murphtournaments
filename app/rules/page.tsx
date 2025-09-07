import { prisma } from "@/lib/prisma";
export default async function RulesPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1>Murph Tournaments – Official Rules &amp; Fair Play Policy</h1>
      <p>At Murph Tournaments, we are committed to creating a competitive environment that emphasizes fair play, respect, and integrity. By participating in any Murph Tournament, you agree to abide by the rules outlined below.</p>

      <h2>1. General Conduct</h2>
      <ul>
        <li>All players must show respect toward staff, opponents, and the community.</li>
        <li>Toxic behavior, including harassment, hate speech, threats, or personal attacks, will not be tolerated.</li>
        <li>Match integrity is paramount: all outcomes must be the result of skill and strategy, not cheating or exploitation.</li>
      </ul>

      <h2>2. Gameplay Rules (THE FINALS)</h2>
      <ul>
        <li><strong>Class Limits:</strong> No triple-stacking classes (max two of the same class per team).</li>
        <li><strong>Cheating &amp; Exploits:</strong> The use of cheats, macros, or in-game exploits is strictly prohibited.</li>
        <li><strong>Stream Sniping:</strong> Watching or relaying information from live streams to gain an advantage is not allowed.</li>
        <li><strong>Disconnects/Crashes:</strong> If a disconnect occurs mid-match, the match will continue unless deemed unplayable by staff.</li>
        <li><strong>Map &amp; Mode Rotation:</strong> Matches follow official Murph Tournament formats (Cashout, Final Round, or custom event rules).</li>
      </ul>

      <h2>3. Tournament Structure</h2>
      <ul>
        <li><strong>Match Format:</strong> Unless otherwise stated, tournaments are run in Double Elimination BO1 (Best of 1). Finals formats may vary.</li>
        <li><strong>Start Times:</strong> Teams must be present in the Tournament Stage channel 15 minutes prior to start time for check-in and briefing.</li>
        <li><strong>No-Shows:</strong> Teams not present at match time may forfeit their match.</li>
        <li><strong>Disputes:</strong> Any issues must be reported to staff immediately after a match for review.</li>
      </ul>

      <h2>4. Technical Requirements</h2>
      <ul>
        <li>All players must compete on their own registered Embark ID.</li>
        <li>Stable internet connection is required — repeated connection issues may result in disqualification.</li>
        <li>Players must use the current official build of THE FINALS (no unauthorized modifications).</li>
      </ul>

      <h2>5. Code of Integrity</h2>
      <ul>
        <li><strong>Fair Competition:</strong> Winning should only ever come from skill, teamwork, and strategy.</li>
        <li><strong>Transparency:</strong> If a team suspects a violation, it must be reported, not retaliated against.</li>
        <li><strong>Sportsmanship:</strong> Celebrate victories respectfully and accept losses with dignity.</li>
      </ul>

      <h2>6. Penalties</h2>
      <ul>
        <li>Violations of these rules may result in:</li>
        <ul>
          <li>Match forfeiture</li>
          <li>Disqualification from the tournament</li>
          <li>Temporary or permanent ban from Murph Tournaments</li>
        </ul>
      </ul>

      <h2>7. Updates &amp; Final Say</h2>
      <ul>
        <li>Murph Tournaments reserves the right to:</li>
        <ul>
          <li>Modify rules between events to ensure competitive integrity.</li>
          <li>Make final decisions in disputes where rules do not provide explicit guidance.</li>
        </ul>
      </ul>

      <p className="mt-6 text-green-400 font-semibold">✅ By registering and participating, you agree to follow these rules and uphold the spirit of fair play.</p>
    </article>
  );
}