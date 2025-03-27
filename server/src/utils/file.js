export function getFileType(filename) {
  const extname = filename.split(".").at(-1)?.toLowerCase();
  switch (extname) {
    case "avi":
    case "flv":
    case "mov":
    case "mp4":
      return "video";

    case "gif":
    case "jpeg":
    case "jpg":
    case "png":
    case "svg":
    case "webp":
      return "image";
  }
}
