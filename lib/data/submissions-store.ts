import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import type {
  EventSubmission,
  StoredSubmission,
  SubmissionStatus,
} from "@/config/submissions";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

async function readAll(): Promise<StoredSubmission[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const parsed = JSON.parse(raw) as StoredSubmission[];

  return Array.isArray(parsed) ? parsed : [];
}

async function writeAll(submissions: StoredSubmission[]) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), "utf-8");
}

export async function createSubmission(payload: EventSubmission) {
  const submissions = await readAll();
  const entry: StoredSubmission = {
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
    payload,
  };

  submissions.unshift(entry);
  await writeAll(submissions);

  return entry;
}

export async function listSubmissions(status?: SubmissionStatus) {
  const submissions = await readAll();

  if (!status) return submissions;

  return submissions.filter((submission) => submission.status === status);
}

export async function getSubmission(id: string) {
  const submissions = await readAll();
  return submissions.find((submission) => submission.id === id) ?? null;
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
) {
  const submissions = await readAll();
  const index = submissions.findIndex((submission) => submission.id === id);

  if (index === -1) return null;

  submissions[index] = {
    ...submissions[index],
    status,
    reviewedAt: new Date().toISOString(),
  };

  await writeAll(submissions);

  return submissions[index];
}
