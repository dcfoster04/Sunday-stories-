import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentLeague } from "@/lib/auth";
import { generateLeagueProfile, generatePreviewIssue } from "@/lib/ai/service";
import { buildLeagueProfileInput } from "@/lib/leagueProfile";
import { generateInviteSlug } from "@/lib/utils";

const MIN_OWNERS = 2;

/**
 * Generates (or regenerates) the league's shareable Preview Issue. A
 * regenerate reuses the existing shareSlug so a link a commissioner has
 * already shared never breaks — only the content underneath it updates.
 */
export async function POST() {
  const league = await getCurrentLeague();
  if (!league) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const [owners, memories] = await Promise.all([
    db.owner.findMany({ where: { leagueId: league.id } }),
    db.leagueMemory.findMany({ where: { leagueId: league.id } }),
  ]);

  if (owners.length < MIN_OWNERS) {
    return NextResponse.json(
      { error: `Add at least ${MIN_OWNERS} managers before generating a preview issue.` },
      { status: 400 },
    );
  }

  const profileInput = buildLeagueProfileInput(league, owners, memories);

  // Always regenerate the profile too, so the issue is built from the
  // freshest read of current owners/memories rather than a possibly-stale
  // snapshot from onboarding.
  const profile = await generateLeagueProfile(profileInput);
  await db.leagueProfile.upsert({
    where: { leagueId: league.id },
    create: { leagueId: league.id, data: profile },
    update: { data: profile },
  });

  const issueData = await generatePreviewIssue({ ...profileInput, profile });

  const existing = await db.previewIssue.findFirst({
    where: { leagueId: league.id },
    orderBy: { createdAt: "desc" },
  });

  const issue = existing
    ? await db.previewIssue.update({
        where: { id: existing.id },
        data: {
          issueLabel: issueData.issueLabel,
          headline: issueData.headline,
          dek: issueData.dek,
          data: issueData,
        },
      })
    : await db.previewIssue.create({
        data: {
          leagueId: league.id,
          shareSlug: generateInviteSlug(league.leagueName),
          issueLabel: issueData.issueLabel,
          headline: issueData.headline,
          dek: issueData.dek,
          data: issueData,
        },
      });

  return NextResponse.json({ issue: { ...issue, data: issueData } });
}
