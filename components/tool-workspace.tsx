import type { ToolDefinition } from "@/types";
import { TextCounter } from "./tools/text-counters";
import { CaseConverter } from "./tools/case-converter";
import { TextCompare } from "./tools/text-compare";
import { WebsiteCounter } from "./tools/website-counter";
import { ColorWheel } from "./tools/color-wheel";
import { RandomColor } from "./tools/random-color";
import { ImageToText } from "./tools/image-to-text";
import { FileConverter } from "./tools/file-converter";

export function ToolWorkspace({ tool }: { tool: ToolDefinition }) {
  if (tool.kind === "word-counter") return <TextCounter />;
  if (tool.kind === "character-counter") return <TextCounter characterOnly />;
  if (tool.kind === "capitalize") return <CaseConverter />;
  if (tool.kind === "compare") return <TextCompare />;
  if (tool.kind === "website-counter") return <WebsiteCounter />;
  if (tool.kind === "color-wheel") return <ColorWheel />;
  if (tool.kind === "random-color") return <RandomColor />;
  if (tool.kind === "image-to-text") return <ImageToText />;
  return <FileConverter tool={tool} />;
}
