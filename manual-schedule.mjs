// manual-schedule.js —— 手动维护的日程（韩国/亚洲/中国等，无法自动抓取的部分）
// monitor.mjs 每次自动更新时，会把这里的条目和"日本官咖自动抓取"的条目合并。
// 看到新行程时，往下面数组加一条即可，格式和示例一致。
export const MANUAL_EVENTS = [
  { date: "2026-01-26", type: "birthday", title: "金在中生日 🎂", region: "", note: "Boss Babies 应援" },
  // GALAXY 1986 亚洲巡演（媒体确证）
  { date: "2026-02-08", type: "concert", title: "J-Party GALAXY 1986 · 台北", region: "台湾", note: "TICC 台北国际会议中心 18:00" },
  { date: "2026-03-15", type: "concert", title: "J-Party GALAXY 1986 · 横滨", region: "日本", note: "Pacifico横滨 国立大厅" },
  { date: "2026-03-21", type: "concert", title: "J-Party GALAXY 1986 · 曼谷", region: "泰国", note: "" },
  { date: "2026-03-28", type: "concert", title: "J-Party GALAXY 1986 · 新加坡", region: "新加坡", note: "Arena @ EXPO 19:30" },
  // THE WAVE 韩国场（多家媒体确证）
  { date: "2026-08-29", type: "concert", title: "CONCERT [THE WAVE] · 首尔 D1", region: "韩国", note: "KBS Arena 首尔江西区" },
  { date: "2026-08-30", type: "concert", title: "CONCERT [THE WAVE] · 首尔 D2", region: "韩国", note: "KBS Arena 首尔江西区" },
  // 中国场（来自音符/iNKODE官方公告）
  { date: "2026-08-16", type: "fanmeeting", title: "FAN MEETING · 深圳", region: "中国", note: "特别的爱 深情予你 [音符/星羽]" },
];
