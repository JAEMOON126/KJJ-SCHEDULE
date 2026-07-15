# 金在中日程 · 添加操作指南（供飞书 agent 执行）

**触发方式**：当圆圆在飞书发送以 `JJ:` 开头的消息时，按下面步骤操作。
例如：`JJ: 8月29-30日 首尔 THE WAVE 演唱会`

## 项目位置
`/Users/lvlita/.openclaw/idol-schedule/`

## 第 1 步：编辑手动日程文件
打开 `/Users/lvlita/.openclaw/idol-schedule/manual-schedule.mjs`，
在 `MANUAL_EVENTS` 数组里加一条（保持数组格式正确）：

```js
{ date: "2026-08-29", type: "concert", title: "CONCERT [THE WAVE] · 首尔", region: "韩国", note: "KBS Arena" },
```

字段说明：
- `date`：`YYYY-MM-DD`，必填。圆圆若只说"8月29日"，补全年份 2026。
- `type`：从这些里选 —— `concert`演唱会 / `fanmeeting`见面会 / `release`专辑 / `broadcast`节目 / `event`活动 / `birthday`生日
- `title`：行程名称，简洁。
- `region`：`韩国` / `日本` / `中国` / `台湾` / `泰国` / `新加坡` 等。
- `note`：场馆/时间等补充，可留空 `""`。

若圆圆一次给多场（如演唱会 D1/D2），就加多条。

## 第 2 步：重新生成日历数据并推送
在项目目录执行：
```bash
cd /Users/lvlita/.openclaw/idol-schedule && node monitor.mjs && ./publish.sh
```
（monitor.mjs 会把手动日程合并进 schedule.js；publish.sh 推送到 GitHub，网页随之更新。）

如果只想快速加、不想跑完整 monitor，也可以只重新生成日程再推送——但跑完整 monitor 最稳妥。

## 第 3 步：回复圆圆
告诉她已加入哪几条行程，并附网页链接：
https://JAEMOON126.github.io/KJJ-SCHEDULE/

## 注意
- 只改 `manual-schedule.mjs`，不要动 `schedule.js`（它是自动生成的）。
- 不确定日期/类型时，先问圆圆确认，不要猜。
