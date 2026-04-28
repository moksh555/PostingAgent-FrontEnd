export const formatRunStartedAt = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatPostsProgress = (done: number, total: number): string =>
  done === total ? `${total}` : `${done} / ${total}`;

export const truncateThreadId = (id: string, head = 6, tail = 4): string => {
  if (id.length <= head + tail + 1) return id;
  return `${id.slice(0, head)}…${id.slice(-tail)}`;
};

export const stripScheme = (url: string): string =>
  url.replace(/^https?:\/\//, "");
