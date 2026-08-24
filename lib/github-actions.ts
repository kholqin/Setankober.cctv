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
  progressPct: number;
  completedSteps: number;
  totalSteps: number;
  currentStep: string | null;
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

type GitHubStep = { name?: string; status?: string; conclusion?: string | null };
type GitHubJob = { name?: string; steps?: GitHubStep[] };

const API_ROOT = "https://api.github.com/repos/kholqin/Setankober.cctv";
const API_HEADERS = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };

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

export function summarizeBuildProgress(state: BuildState, jobs: GitHubJob[]): Pick<BuildStatus, "progressPct" | "completedSteps" | "totalSteps" | "currentStep"> {
  const steps = jobs.flatMap((job) => job.steps ?? []);
  const totalSteps = steps.length;
  const completedSteps = steps.filter((step) => step.status === "completed").length;
  const activeStep = steps.find((step) => step.status === "in_progress")?.name;
  const progressPct = state === "success" ? 100 : totalSteps === 0 ? 0 : Math.min(100, Math.max(0, Math.round((completedSteps / totalSteps) * 100)));
  return { progressPct, completedSteps, totalSteps, currentStep: activeStep ?? null };
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { headers: API_HEADERS, signal });
  if (!response.ok) throw new Error(`GitHub API HTTP ${response.status}`);
  return (await response.json()) as T;
}

export async function fetchLatestBuildStatus(signal?: AbortSignal): Promise<BuildStatus> {
  const body = await fetchJson<{ workflow_runs?: GitHubRun[] }>(`${API_ROOT}/actions/runs?per_page=1`, signal);
  const run = body.workflow_runs?.[0];
  const state = normalizeBuildState(run?.status, run?.conclusion);
  const jobsBody = run?.id ? await fetchJson<{ jobs?: GitHubJob[] }>(`${API_ROOT}/actions/runs/${run.id}/jobs?per_page=100`, signal) : { jobs: [] };
  const progress = summarizeBuildProgress(state, jobsBody.jobs ?? []);
  return {
    state,
    label: state === "in_progress" ? "BUILDING" : state.replace("_", " ").toUpperCase(),
    runId: run?.id ?? null,
    runNumber: run?.run_number ?? null,
    branch: run?.head_branch ?? null,
    updatedAt: run?.updated_at ?? null,
    url: run?.html_url ?? null,
    checkedAt: new Date().toISOString(),
    ...progress,
  };
}
