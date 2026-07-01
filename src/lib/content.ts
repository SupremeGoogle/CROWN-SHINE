import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Octokit } from "@octokit/rest";
import type { SiteContent } from "@/types/site-content";

const CONTENT_RELATIVE_PATH = "src/content/site.json";

function localContentPath() {
  return path.join(process.cwd(), CONTENT_RELATIVE_PATH);
}

async function readLocalContent(): Promise<SiteContent> {
  const raw = await fs.readFile(localContentPath(), "utf-8");
  return JSON.parse(raw) as SiteContent;
}

/**
 * В проде контент читается напрямую из GitHub (raw.githubusercontent.com),
 * чтобы правки из админ-панели появлялись на сайте без полного редеплоя.
 * В разработке — читаем локальный файл для быстрой итерации.
 */
export async function getSiteContent(): Promise<SiteContent> {
  if (process.env.NODE_ENV !== "production") {
    return readLocalContent();
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!owner || !repo) {
    return readLocalContent();
  }

  try {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${CONTENT_RELATIVE_PATH}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`GitHub raw fetch failed: ${res.status}`);
    return (await res.json()) as SiteContent;
  } catch {
    return readLocalContent();
  }
}

/** Сохраняет контент коммитом в GitHub-репозиторий (используется админ-панелью). */
export async function saveSiteContent(
  content: SiteContent,
  commitMessage = "content: update site content via admin panel"
): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!token || !owner || !repo) {
    throw new Error(
      "GITHUB_TOKEN / GITHUB_OWNER / GITHUB_REPO не заданы в переменных окружения"
    );
  }

  const octokit = new Octokit({ auth: token });
  const serialized = JSON.stringify(content, null, 2) + "\n";

  let sha: string | undefined;
  try {
    const existing = await octokit.repos.getContent({
      owner,
      repo,
      path: CONTENT_RELATIVE_PATH,
      ref: branch,
    });
    if (!Array.isArray(existing.data) && existing.data.type === "file") {
      sha = existing.data.sha;
    }
  } catch {
    // файла ещё нет — создаём новый
  }

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    branch,
    path: CONTENT_RELATIVE_PATH,
    message: commitMessage,
    content: Buffer.from(serialized, "utf-8").toString("base64"),
    sha,
  });

  // Обновляем локальную копию, чтобы дев-сервер сразу отражал изменения.
  try {
    await fs.writeFile(localContentPath(), serialized, "utf-8");
  } catch {
    // в serverless-окружении файловая система только для чтения — это ожидаемо
  }
}
