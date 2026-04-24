import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

function basePath() {
  return process.env.LOCAL_STORAGE_PATH || "./uploads";
}

export async function saveLocalFile(params: {
  organizationId: string;
  agreementId: string;
  fileName: string;
  buffer: Buffer;
}) {
  const folder = join(basePath(), params.organizationId, params.agreementId);

  await mkdir(folder, { recursive: true });

  const filePath = join(folder, params.fileName);
  await writeFile(filePath, params.buffer);

  return filePath;
}
