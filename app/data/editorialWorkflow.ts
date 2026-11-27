import type { EditorialStatus } from "./learningContracts";

export type EditorialRole = "kazakh-language" | "chinese-pedagogy" | "standards";

export type EditorialReview = {
  reviewerId: string;
  role: EditorialRole;
  decision: "pass" | "changes-requested";
  checklistVersion: string;
};

export type EditorialRevisionRecord = {
  entityId: string;
  revisionId: string;
  authorId: string;
  status: EditorialStatus;
  reviews: EditorialReview[];
};

export type EditorialTransitionResult =
  | { ok: true; revision: EditorialRevisionRecord }
  | { ok: false; reason: string };

export function transitionEditorialRevision(
  revision: EditorialRevisionRecord,
  next: EditorialStatus,
  releaseChecksPassed = false,
): EditorialTransitionResult {
  if (revision.status === "published") return { ok: false, reason: "published-revision-is-immutable" };

  if (revision.status === "draft" && next === "pending-review") {
    return { ok: true, revision: { ...revision, status: next } };
  }

  if (revision.status === "pending-review" && next === "draft") {
    const requested = revision.reviews.some((review) => review.decision === "changes-requested");
    return requested
      ? { ok: true, revision: { ...revision, status: "draft" } }
      : { ok: false, reason: "reviewer-change-request-required" };
  }

  if (revision.status === "pending-review" && next === "reviewed") {
    const requiredRoles: EditorialRole[] = ["kazakh-language", "chinese-pedagogy", "standards"];
    const passes = requiredRoles.every((role) =>
      revision.reviews.some((review) =>
        review.role === role && review.reviewerId !== revision.authorId && review.decision === "pass"
      ),
    );
    return passes
      ? { ok: true, revision: { ...revision, status: "reviewed" } }
      : { ok: false, reason: "required-independent-reviews-incomplete" };
  }

  if (revision.status === "reviewed" && next === "published") {
    return releaseChecksPassed
      ? { ok: true, revision: { ...revision, status: "published" } }
      : { ok: false, reason: "release-checks-required" };
  }

  return { ok: false, reason: `invalid-editorial-transition:${revision.status}->${next}` };
}
