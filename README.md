# BPB-Chinese

这是 BPB Panel 的中文文档仓库。本仓库包含了完整的中文安装教程和使用说明。

## 文档目录

- [向导安装教程](docs/wizard_installation_zh.md) - 推荐使用此方法安装
- [Worker 安装教程](docs/worker_installation_zh.md) - 通过 Cloudflare Workers 安装
- [Pages 上传安装教程](docs/pages_upload_installation_zh.md) - 通过 Cloudflare Pages 安装
- [配置和使用说明](docs/configuration_zh.md) - 详细的配置教程和使用说明
- [常见问题解答](docs/faq_zh.md) - 常见问题和解决方案

## 安装方法

我们提供了三种安装方式：

### 1. 向导安装（推荐）

使用 BPB Wizard 进行安装是最简单的方法。该方法支持 Workers 和 Pages 两种部署方式，并且会自动完成所有必要的配置。

[查看向导安装教程](docs/wizard_installation_zh.md)

### 2. Worker 安装

如果您希望通过 Cloudflare Workers 手动安装，可以参考此教程。

[查看 Worker 安装教程](docs/worker_installation_zh.md)

### 3. Pages 上传安装

通过 Cloudflare Pages 安装的方法，适合需要更大请求配额的用户。

[查看 Pages 上传安装教程](docs/pages_upload_installation_zh.md)

## 配置说明

安装完成后，您可以参考配置说明来了解：

- Normal 订阅设置
- Full Normal 订阅设置
- Fragment 订阅设置
- Warp 订阅设置
- Warp PRO 订阅设置
- IP 表格说明
- 高级设置（包括 VLESS/TROJAN、DNS、Proxy IP、链式代理等）
- 路由规则设置

[查看完整配置说明](docs/configuration_zh.md)

## 常见问题

如果您在使用过程中遇到问题，请先查看常见问题解答：

[查看常见问题解答](docs/faq_zh.md)

## 注意事项

1. 请确保您的 Cloudflare 账号已完成邮箱验证。
2. 建议使用可靠的邮箱服务（如 Gmail）注册 Cloudflare 账号。
3. 在使用 Worker 方式时，每天有 100,000 请求的限制（除非绑定了自定义域名）。
4. Pages 方式没有请求限制，但可能会收到超出限制的提醒邮件（不影响使用）。
5. 配置更新时请注意备份您的设置。

## 文档更新

本文档会随着项目的更新而更新，请定期检查是否有新的更新。如果您发现任何问题或有改进建议，欢迎提出。

<h1 align="center">BPB Panel 💦</h1>

### 🌏 Readme in [Farsi](README_fa.md)

<p align="center">
  <img src="docs/assets/images/Panel.jpg">
</p>
<br>

## Introduction
This project is aimed to provide a user panel to access FREE and SECURE `VLESS`, `Trojan` and `Warp` configs and stay conntected even with a blocked domain or blocked Warp on ISPs, offering two deployment options: 
- **Workers** deployment
- **Pages** deployment
<br>

🌟 If you found **BPB Panel** valuable, Your donations make all the difference 🌟
- **USDT (BEP20):** `0x111EFF917E7cf4b0BfC99Edffd8F1AbC2b23d158`

## Features

1. **Free**: No cost involved.
2. **User-Friendly Panel:** Designed for easy navigation, configuration and usage.
3. **Protocols:** Provides VLESS, Trojan and Wireguard (Warp) protocols.
4. **Warp Pro configs:** Optimized Warp for crucial circumstances.
5. **Support Fragment:** Supports Fragment functionality for crucial network situations.
6. **Full routing rules:** Bypassing Iran/China/Russia and LAN, Blocking QUIC, Porn, Ads, Malwares, Phishing...
7. **Chain Proxy:** Capable of adding a chain proxy to fix IP.
8. **Supports Wide Range of Clients:** Offers subscription links for Xray, Sing-box and Clash core clients.
9. **Password-Protected Panel:** Secure your panel with password protection.
10. **Fully customizable:** Ability to use online scanner and setting up clean IP-domains, Proxy IP, setting DNS servers, choosing ports and protocols, Warp endpoints...
<br>

## Limitations

1. **UDP transport**: VLESS and Trojan protocols on workers cannot handle UDP properly, so UDP is blocked by default (some connections like Telegram video calls etc. will not work), also UDP DNS do not work on these protocols (so DOH is supported and set by default which is also safer).
2. **Request limit**: each worker supports 100K requests per day for VLESS and Trojan, so it's sufficient for only 2-3 users. You can use custom personal domains for bypassing limitation on VLESS/Trojan or Warp configs which are limitless.

## How to use:
- [Wizard installation - Workers and Pages](docs/wizard_installation_fa.md)

- [Manual installation - Pages](docs/pages_upload_installation_fa.md)

- [Manual installation - Workers](docs/worker_installation_fa.md)

- [How to use](docs/configuration_fa.md)

- [FAQ](docs/faq.md)
<br>

## Supported Clients
| Client  | Version | Fragment | Warp Pro |
| :-------------: | :-------------: | :-------------: | :-------------: |
| **v2rayNG**  | 1.9.33 or higher  | :heavy_check_mark: | :heavy_check_mark: |
| **v2rayN**  | 7.8.3 or higher  | :heavy_check_mark: | :heavy_check_mark: |
| **v2rayN-PRO**  | 1.8 or higher  | :heavy_check_mark: | :heavy_check_mark: |
| **Husi**  |   | :x: | :x: |
| **Sing-box**  | 1.11.2 or higher  | :x: | :x: |
| **Streisand**  | 1.6.48 or higher  | :heavy_check_mark: | :heavy_check_mark: |
| **V2Box**  |   | :x: | :x: |
| **Shadowrocket**  |   | :x: | :x: |
| **Nekoray**  |   | :heavy_check_mark: | :x: |
| **Hiddify**  | 2.5.7 or higher  | :heavy_check_mark: | :heavy_check_mark: |
| **NikaNG**  |   | :heavy_check_mark: | :heavy_check_mark: |
| **Clash Meta**  |   | :x: | :x: |
| **Clash Verge Rev**  |   | :x: | :x: |
| **FLClash**  |   | :x: | :x: |

## Environment variables
| Variable  | Usage |
| :-------------: | :-------------: |
| **UUID**  | VLESS UUID  |
| **TR_PASS**  | Trojan Password  |
| **PROXY_IP**  | Proxy IP or domain (VLESS, Trojan)  |
| **SUB_PATH**  | Subscriptions' URI  |
| **FALLBACK**  | Fallback domain (VLESS, Trojan) |
| **DOH_URL**  | Core DOH |

---

## Stargazers Over Time
[![Stargazers Over Time](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel.svg?variant=adaptive)](https://starchart.cc/bia-pain-bache/BPB-Worker-Panel)

---

### Special Thanks
- VLESS, Trojan [Cloudflare-workers/pages proxy script](https://github.com/yonggekkk/Cloudflare-workers-pages-vless) created by [yonggekkk](https://github.com/yonggekkk)
- CF-vless code author [3Kmfi6HP](https://github.com/3Kmfi6HP/EDtunnel)
- CF preferred IP program author [badafans](https://github.com/badafans/Cloudflare-IP-SpeedTest), [XIU2](https://github.com/XIU2/CloudflareSpeedTest)