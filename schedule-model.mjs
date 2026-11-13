// 纯函数：把生成的 schedule.js 和手动 schedule.json 合成页面要用的列表。
// 生成器每天会重写 schedule.js，所以去重和补字段都放在渲染时做。

const TBA = /待公布|TBA|TBD/i;

const TZ_LABELS = {
  "Asia/Tokyo": "JST",
  "Asia/Seoul": "KST",
  "Asia/Shanghai": "CST",
  "Asia/Taipei": "GMT+8",
  "Asia/Macau": "GMT+8",
  "Asia/Hong_Kong": "HKT",
  "Asia/Bangkok": "ICT",
  "Asia/Singapore": "SGT",
};

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

export function safeUrl(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.href;
  } catch {
    return "";
  }
}

function first(obj, keys) {
  if (!obj) return "";
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") return String(value).trim();
  }
  return "";
}

function clock(value) {
  const match = String(value ?? "").trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return "";
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return "";
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

export function eventFields(event) {
  const tz = first(event, ["tz", "timezone"]);
  return {
    venue: first(event, ["venue", "place", "location"]),
    start: clock(first(event, ["start", "startTime", "time"])),
    open: clock(first(event, ["open", "openTime", "doors"])),
    end: clock(first(event, ["end", "endTime"])),
    tz,
    tzLabel: first(event, ["tzLabel", "timezoneLabel", "tzName"]) || TZ_LABELS[tz] || "",
    source: safeUrl(first(event, ["source", "sourceUrl", "url", "link"])),
  };
}

export function metaLine(event) {
  const fields = eventFields(event);
  const parts = [];
  if (fields.start) {
    const range = fields.end ? `${fields.start}–${fields.end}` : fields.start;
    parts.push(fields.tzLabel ? `${range} ${fields.tzLabel}` : range);
  }
  if (fields.open) parts.push(`开场 ${fields.open}`);
  if (fields.venue) parts.push(fields.venue);
  return parts.join(" · ");
}

// note 里如果只是把场馆和时间再写一遍，就不再单独显示。
export function extraNote(event) {
  const note = String(event?.note ?? "").trim();
  const meta = metaLine(event);
  if (!note) return "";
  if (!meta) return note;
  const fields = eventFields(event);
  let rest = note;
  for (const bit of [fields.venue, fields.start, fields.end, fields.open, fields.tzLabel, "开场", "开演", "重播"]) {
    if (bit) rest = rest.split(bit).join("");
  }
  rest = rest.replace(/[\s:：.。,，/／·・\-–—]+/g, "");
  return rest ? note : "";
}

function normTitle(title) {
  return String(title ?? "")
    .toLowerCase()
    .replace(/[〈〉<>「」『』【】[\]"'“”]/g, "")
    .replace(/[·・.\s]/g, "");
}

function isJxCore(title) {
  return /jx/i.test(title || "") && /core/i.test(title || "");
}

export function sameShow(a, b) {
  if (!a || !b || a.date !== b.date) return false;
  if (isJxCore(a.title) && isJxCore(b.title)) return true;
  const left = normTitle(a.title);
  const right = normTitle(b.title);
  if (!left || !right) return false;
  if (left === right) return true;
  const [shorter, longer] = left.length <= right.length ? [left, right] : [right, left];
  return shorter.length >= 8 && longer.includes(shorter);
}

function richness(event) {
  const fields = eventFields(event);
  let score = 0;
  if (fields.venue) score += 5;
  if (fields.start) score += 4;
  if (fields.source) score += 2;
  if (fields.tz || fields.tzLabel) score += 1;
  if (/[·・]/.test(event.title || "")) score += 3;
  const note = event.note || "";
  if (note && !TBA.test(note)) score += 2;
  if (TBA.test(note)) score -= 3;
  return score;
}

function mergePair(a, b) {
  const primary = richness(a) >= richness(b) ? a : b;
  const secondary = primary === a ? b : a;
  const merged = { ...secondary };
  for (const [key, value] of Object.entries(primary)) {
    if (value !== undefined && value !== null && String(value).trim() !== "") merged[key] = value;
  }
  const cityTitle = [a.title, b.title]
    .filter((title) => title && /[·・]/.test(title))
    .sort((x, y) => y.length - x.length)[0];
  if (cityTitle) merged.title = cityTitle;
  const notes = [a.note, b.note].filter((note) => note && !TBA.test(note));
  if (notes.length) merged.note = notes.sort((x, y) => y.length - x.length)[0];
  if ([a.type, b.type].includes("rerun") && [a.type, b.type].includes("concert")) merged.type = "rerun";
  return merged;
}

export function mergeSchedules(generated, manual) {
  const items = (generated || []).map((event) => ({ ...event }));
  for (const event of manual || []) {
    const index = items.findIndex((item) => sameShow(item, event));
    if (index === -1) items.push({ ...event });
    else items[index] = mergePair(items[index], event);
  }
  const deduped = [];
  for (const event of items) {
    const index = deduped.findIndex((item) => sameShow(item, event));
    if (index === -1) deduped.push(event);
    else deduped[index] = mergePair(deduped[index], event);
  }
  deduped.sort((a, b) => a.date.localeCompare(b.date) || String(a.title).localeCompare(String(b.title)));
  return deduped;
}
