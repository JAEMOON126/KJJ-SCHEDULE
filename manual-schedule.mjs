// manual-schedule.mjs —— 手动维护的日程（韩国 / 亚洲 / 中国等抓取覆盖不到的部分）
// monitor.mjs 每次自动更新时 import { MANUAL_EVENTS }，再和日本官咖抓取结果合并写进 schedule.js。
//
// 条目本体在 schedule.json。每日摘要以后可以直接合并进那个数组。
// 这里仍导出同名 MANUAL_EVENTS，生成器不用改 import。
// 本文件只用 Node 读取 JSON；页面不 import 它（页面自己 fetch schedule.json），
// 所以再生后即使 schedule.js 丢掉新字段，页面仍能补上。
//
// 单条字段。前 5 个是旧字段，生成器若只会原样抄这几个，note 里也写了场馆和时间。
// 其余都可选；页面缺了也能显示，并且同时认旧名字：
//   date      YYYY-MM-DD
//   type      concert | fanmeeting | release | broadcast | rerun | event | birthday
//   title     显示标题
//   region    韩国 | 日本 | 中国 | 台湾 | …，没有就用空字符串
//   note      自由备注（旧渲染只看这个）
//   venue     场馆。别名 place / location
//   open      开场 HH:MM，当地时间。别名 openTime / doors
//   start     开演 HH:MM，当地时间。别名 startTime / time
//   end       结束 HH:MM。别名 endTime
//   tz        IANA 时区，如 Asia/Tokyo。别名 timezone
//   tzLabel   页面上的简称，如 JST、GMT+8。别名 timezoneLabel / tzName
//   source    官方来源 https URL。别名 sourceUrl / url / link
//
// schedule.json 可以是数组，也可以是 { "events": [ ... ] }。

import { readFileSync } from "node:fs";

const raw = JSON.parse(readFileSync(new URL("./schedule.json", import.meta.url), "utf8"));
export const MANUAL_EVENTS = Array.isArray(raw) ? raw : (raw.events || []);
