// notify-feishu.mjs —— 通过 openclaw 的飞书机器人给"圆圆"推送消息
// 复用 ~/.openclaw/openclaw.json 里已配置的飞书应用（官方 API，非第三方代理）
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const OPENCLAW_CFG = join(homedir(), ".openclaw", "openclaw.json");
const RECEIVE_ID = "ou_33d4b9d5042448d59d4087d813379527"; // 圆圆（管理员）

let _token = null;
async function getToken() {
  if (_token) return _token;
  const f = JSON.parse(readFileSync(OPENCLAW_CFG, "utf8")).channels.feishu;
  const res = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: f.appId, app_secret: f.appSecret }),
  });
  const j = await res.json();
  if (j.code !== 0) throw new Error("飞书 token 获取失败: " + j.msg);
  _token = j.tenant_access_token;
  return _token;
}

// 发送纯文本消息给圆圆
export async function pushFeishu(text) {
  try {
    const token = await getToken();
    const res = await fetch("https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        receive_id: RECEIVE_ID,
        msg_type: "text",
        content: JSON.stringify({ text }),
      }),
    });
    const j = await res.json();
    return j.code === 0;
  } catch (e) {
    console.log("飞书推送出错:", e.message);
    return false;
  }
}
