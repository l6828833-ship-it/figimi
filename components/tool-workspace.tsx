import type { ToolDefinition } from "@/types";
import { TextCounter } from "./tools/text-counters";
import { CaseConverter } from "./tools/case-converter";
import { TextCompare } from "./tools/text-compare";
import { WebsiteCounter } from "./tools/website-counter";
import { ColorWheel } from "./tools/color-wheel";
import { FileConverter } from "./tools/file-converter";

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  if (tool.kind === "word-counter") return <TextCounter />;
  if (tool.kind === "character-counter") return <TextCounter characterOnly />;
  if (tool.kind === "capitalize") return <CaseConverter />;
  if (tool.kind === "compare") return <TextCompare />;
  if (tool.kind === "website-counter") return <WebsiteCounter />;
  if (tool.kind === "color-wheel") return <ColorWheel />;
  return <FileConverter tool={tool} />;
}
