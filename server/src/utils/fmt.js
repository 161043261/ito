export function fmtBytes(bytes, fractionDigits) {
  if (bytes === 0) {
    return "0B";
  }
  fractionDigits = Math.max(0, fractionDigits);
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return Number.parseFloat((bytes / Math.pow(1024, i)).toFixed(fractionDigits)) + sizes[i];
}

export function fmtDate(date) {
  if (typeof date === "number") {
    date = new Date(date);
  }

  return date.toLocaleDateString("zh-CN", {
    timeZone: "Asia/Shanghai",
    dateStyle: "full",
    timeStyle: "medium",
    hourCycle: "h24",
  });
}
