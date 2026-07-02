import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Octokit } from "@octokit/rest";

const UPLOAD_DIR = "public/uploads";
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function safeName(fileName: string): { name: string } {
  const rawExt = path.extname(fileName).toLowerCase();
  const ext = ALLOWED_EXT.has(rawExt) ? rawExt : ".jpg";
  const base =
    path
      .basename(fileName, path.extname(fileName))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "image";
  return { name: `${Date.now()}-${base}${ext}` };
}

async function writeLocal(name: string, buffer: Buffer) {
  const dir = path.join(process.cwd(), UPLOAD_DIR);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), buffer);
}

/**
 * Сохраняет загруженное изображение и возвращает публичный путь (/uploads/...).
 * В проде коммитит файл в GitHub-репозиторий (появится на сайте после ребилда,
 * ~1 минута). В разработке пишет в локальный public/uploads.
 */
export async function saveUploadedImage(
  fileName: string,
  base64: string
): Promise<string> {
  const { name } = safeName(fileName);
  const publicUrl = `/uploads/${name}`;
  const buffer = Buffer.from(base64, "base64");

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (process.env.NODE_ENV !== "production" || !token || !owner || !repo) {
    await writeLocal(name, buffer);
    return publicUrl;
  }

  const octokit = new Octokit({ auth: token });
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    branch,
    path: `${UPLOAD_DIR}/${name}`,
    message: `content: upload image ${name}`,
    content: base64,
  });

  // Локальная копия для дев-сервера, если ФС доступна на запись.
  try {
    await writeLocal(name, buffer);
  } catch {
    // serverless: ФС только для чтения — это ожидаемо
  }

  return publicUrl;
}
