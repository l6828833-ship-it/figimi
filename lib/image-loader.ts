import type { ImageLoaderProps } from "next/image";

export default function cloudflareImageLoader({ src, width, quality }: ImageLoaderProps) {
  if (process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_RESIZING === "true" && !src.startsWith("/")) return `/cdn-cgi/image/format=auto,fit=scale-down,width=${width},quality=${quality || 82}/${src}`;
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}width=${width}&quality=${quality || 82}`;
}
