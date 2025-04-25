<h1 align="center">BPB Panel 💦</h1>

### 🌏 阅读文件 (Readme) [波斯语](README_fa.md)

<p align="center">
  <img src="docs/assets/images/Panel.jpg">
</p>
<br>

## 简介
本项目旨在提供一个用户面板，用于获取免费且安全的 `VLESS`、`Trojan` 和 `Warp` 配置，即使在域名或 Warp 被运营商屏蔽的情况下也能保持连接。提供两种部署选项：
- **Workers** 部署
- **Pages** 部署
<br>

🌟 如果你觉得 **BPB Panel** 有价值，你的捐赠意义重大 🌟
- **USDT (BEP20):** `0x111EFF917E7cf4b0BfC99Edffd8F1AbC2b23d158`

## 功能

1.  **免费**: 无需任何费用。
2.  **用户友好的面板:** 设计易于导航、配置和使用。
3.  **协议:** 提供 VLESS、Trojan 和 Wireguard (Warp) 协议。
4.  **Warp Pro 配置:** 针对关键情况优化的 Warp 配置。
5.  **支持 Fragment:** 在关键网络环境下支持 Fragment 功能。
6.  **完整路由规则:** 绕过伊朗/中国/俄罗斯和局域网，屏蔽 QUIC、色情、广告、恶意软件、钓鱼等。
7.  **链式代理 (Chain Proxy):** 能够添加链式代理来固定 IP。
8.  **支持广泛的客户端:** 为 Xray、Sing-box 和 Clash 内核客户端提供订阅链接。
9.  **密码保护面板:** 使用密码保护你的面板安全。
10. **完全可定制:** 能够使用在线扫描器设置干净的 IP/域名，设置 Proxy IP、DNS 服务器、选择端口和协议、Warp 最佳端点等等。
<br>

## 局限性

1.  **UDP 传输**: Workers 上的 VLESS 和 Trojan 协议无法正常处理 UDP，因此默认屏蔽了 UDP（某些连接如 Telegram 视频通话等将不起作用），同时 UDP DNS 在这些协议上也不工作（因此支持并默认设置了 DOH，这也更安全）。
2.  **请求限制**: 每个 Worker 每天支持 10 万次 VLESS 和 Trojan 请求，因此只够 2-3 个用户使用。你可以使用个人自定义域名来绕过 VLESS/Trojan 或 Warp 配置上的限制，这些是无限量的。

## 如何使用:
- [安装 (Pages - 新推荐方法)](docs/pages_upload_installation_fa.md)

- [安装 (Worker)](docs/worker_installation_fa.md)

- [如何使用](docs/configuration_fa.md)

- [常见问题 (FAQ)](docs/faq.md)
<br>

## 支持的客户端
| 客户端  | 版本 | Fragment | Warp Pro |
| :-------------: | :-------------: | :-------------: | :-------------: |
| **v2rayNG**  | 1.9.33 或更高版本  | :heavy_check_mark: | :heavy_check_mark: |
| **v2rayN**  | 7.8.3 或更高版本  | :heavy_check_mark: | :heavy_check_mark: |
| **v2rayN-PRO**  | 1.8 或更高版本  | :heavy_check_mark: | :heavy_check_mark: |
| **Husi**  |   | :x: | :x: |
| **Sing-box**  | 1.11.2 或更高版本  | :x: | :x: |
| **Streisand**  | 1.6.48 或更高版本  | :heavy_check_mark: | :heavy_check_mark: |
| **V2Box**  |   | :x: | :x: |
| **Shadowrocket**  |   | :x: | :x: |
| **Nekoray**  |   | :heavy_check_mark: | :x: |
| **Hiddify**  | 2.5.7 或更高版本  | :heavy_check_mark: | :heavy_check_mark: |
| **NikaNG**  |   | :heavy_check_mark: | :heavy_check_mark: |
| **Clash Meta**  |   | :x: | :x: |
| **Clash Verge Rev**  |   | :x: | :x: |
| **FLClash**  |   | :x: | :x: |

## 环境变量
| 变量  | 用途 |
| :-------------: | :-------------: |
| **UUID**  | VLESS UUID  |
| **TR_PASS**  | Trojan 密码  |
| **PROXY_IP**  | 代理 IP 或域名 (VLESS, Trojan)  |
| **SUB_PATH**  | 订阅 URI  |
| **FALLBACK**  | 回退域名 (VLESS, Trojan) |
| **DOH_URL**  | 核心 DOH |

---

## 随时间增长的星标数量
[![Stargazers Over Time](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel.svg?variant=adaptive)](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel)

---

### 特别鸣谢
- VLESS, Trojan [Cloudflare-workers/pages 代理脚本](https://github.com/yonggekkk/Cloudflare-workers-pages-vless) 由 [yonggekkk](https://github.com/yonggekkk) 创建
- CF-vless 代码作者 [3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)
- CF 优选 IP 程序作者 [badafans](https://github.com/badafans/Cloudflare-IP-SpeedTest), [XIU2](https://github.com/XIU2/CloudflareSpeedTest)
