export type BuildState = "queued" | "in_progress" | "success" | "failure" | "cancelled" | "unknown";

export type BuildStatus = {
  state: BuildState;
  label: string;
  runId: number | null;
  runNumber: number | null;
  branch: string | null;
  updatedAt: string | null;
  url: string | null;
  checkedAt: string;
};

type GitHubRun = {
  id?: number;
  run_number?: number;
  status?: string;
  conclusion?: string | null;
  head_branch?: string | null;
  updated_at?: string | null;
  html_url?: string | null;
};

const API_URL = "https://api.github.com/repos/kholqin/Setankober.cctv/actions/runs?per_page=1";

export function normalizeBuildState(status?: string, conclusion?: string | null): BuildState {
  if (status === "queued" || status === "waiting" || status === "requested") return "queued";
  if (status === "in_progress") return "in_progress";
  if (conclusion === "success") return "success";
  if (conclusion === "cancelled") return "cancelled";
  if (conclusion === "failure" || conclusion === "timed_out" || conclusion === "action_required") return "failure";
  return "unknown";
}

export function pollingDelayMs(attempt: number, state: BuildState): number {
  if (state === "queued" || state === "in_progress") return 15_000;
  return Math.min(60_000, 5_000 * Math.max(1, Math.min(attempt, 6)));
}

export async function fetchLatestBuildStatus(signal?: AbortSignal): Promise<BuildStatus> {
  const response = await fetch(API_URL, {
    headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
    signal,
  });
  if (!response.ok) throw new Error(`GitHub API HTTP ${response.status}`);
  const body = (await response.json()) as { workflow_runs?: GitHubRun[] };
  const run = body.workflow_runs?.[0];
  const state = normalizeBuildState(run?.status, run?.conclusion);
  return {
    state,
    label: state === "in_progress" ? "BUILDING" : state.replace("_", " ").toUpperCase(),
    runId: run?.id ?? null,
    runNumber: run?.run_number ?? null,
    branch: run?.head_branch ?? null,
    updatedAt: run?.updated_at ?? null,
    url: run?.html_url ?? null,
    checkedAt: new Date().toISOString(),
  };
}
