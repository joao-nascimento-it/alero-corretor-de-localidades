import { Result } from "@/kinds/Result.ts";

export type ParseRawLocalidadesService = (
  source: string,
  dest: string,
) => Promise<Result<void, Error>>;
