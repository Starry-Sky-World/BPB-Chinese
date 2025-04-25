<h1 align="center">如何使用和配置</h1>

假设您的 workers 或 pages 名称是 `worker-polished-leaf-d022`：

通过在末尾添加 `panel/`，您可以像下面这样访问面板：

>`https://worker-polished-leaf-d022.workers.dev/panel`

系统将要求您设置新密码并登录，然后即可使用。
> [!IMPORTANT]
> 密码必须至少包含 **8 个字符**，并且至少包含一个**大写字母**和一个**数字**。之后，您也可以从面板底部更改密码。
现在让我们看看面板的不同部分：
<br><br>

# 1 - Normal 订阅

<p align="center">
  <img src="assets/images/Normal-Configs.jpg">
</p>

我从这一部分开始介绍，因为许多人喜欢在不使用 Fragment 或使用面板默认设置的情况下使用。但请注意，您需要自己了解如何在应用程序中进行配置，否则可能会遇到问题。我建议使用 `Full Normal` 订阅，因为所有面板设置都已应用于其中，您无需进行任何特殊操作。请注意，此订阅不应用面板的 Routing Rules、Chain Proxy 和 DNS 设置（您需要在应用程序中手动配置）。
此链接为您提供 6 个配置。（您可以通过在 Clean IP、Port 和 Protocol 设置部分增加数量来增加配置数量）。这 6 个配置有什么区别呢？

-   **配置路径 Websocket Path：** 每个配置都有不同的路径。
-   **配置地址：** 这 6 个配置中的第一个是您的 worker 的域名，第二个是 `www.speedtest.net` 的地址，该地址在大多数运营商下都很干净，而第三到第六个是您自己的域名 IP 地址，这些通常也很干净。包括两个 IPv4 和两个 IPv6。

那么如何增加它们的数量呢？有关更多说明和设置，请参阅 [添加 Clean IP](#1-4--设置-clean-ip) 和 [添加端口](#1-9--选择-port) 、 [选择协议](#1-8--选择-protocol) 以及 [添加 Custom CDN](#1-6--设置-custom-cdn) 部分。
> [!CAUTION]
> 要使用此订阅，请务必在使用应用程序的设置中关闭 Mux。

> [!WARNING]
> 使用此 Worker，您的设备 IP 会频繁改变。因此，请勿将其用于交易和 PayPal 等敏感活动，甚至像 Hetzner 这样的网站也可能会封禁。我们提供了两种固定 IP 的解决方案：一种是启动时 [设置 Proxy IP](#1-2--设置-proxy-ip)，另一种是 [使用 Chain Proxy](#1-3--设置-chain-proxy)。
<br><br>

# 2 - Full Normal 订阅

<p align="center">
  <img src="assets/images/Full-Normal-Configs.jpg">
</p>

此订阅提供上述配置，但不同之处在于所有 VLESS/Trojan 面板设置都已应用于其中，您可以[在此](#1--vlesstrojan-设置) 了解。此外，这些订阅包含 **Best Ping** 配置（下文有解释）。应用路由设置后，它可以阻止大约 90% 的国内和国际广告，绕过国内和中国网站（无需为支付网关等关闭 VPN 连接），绕过 LAN，阻止 Porn 和 QUIC 连接，并且 Sing-box 订阅在很大程度上阻止了网络钓鱼和恶意软件等内容。
> [!TIP]
> **Best Ping** 配置是什么？此配置整合了面板中的所有配置，每 30 秒检查哪个配置速度更快，然后连接到该配置！如果您输入了 Clean IP、启用了 Trojan 协议或选择了其他端口，它们也会添加到 Best Ping 中。这种类型的配置在 Fragment 和 Warp 订阅中也有，下文会介绍。
<br><br>

# 3 - Fragment 订阅

<p align="center">
  <img src="assets/images/Fragment-Sub.jpg">
</p>

> [!NOTE]
> **Fragment 配置的特点**
>
> 1- 即使个人域名或 worker 被过滤，也能连接
>
> 2- 改善所有运营商的网络质量和速度，特别是那些在使用 Cloudflare 时遇到干扰的运营商
<br>

## 3-1 - Xray 的 Fragment 订阅

指使用 Xray 内核的应用程序，本质上是面板中 FRAGMENT SUB 表格的第一行，在应用程序中导入方式与普通订阅相同。这些配置的名称中包含一个 `F`。

此订阅为您提供与 Full Normal 订阅相同数量的 Fragment 配置（使用您在面板中应用的 Fragment 设置），外加 **Best Fragment** 和 **Workerless** 配置。您在面板中进行的任何设置更改，在更新订阅后会应用于所有配置。

> [!TIP]
> WorkerLess 配置无需 worker 即可打开许多被过滤的网站和应用程序！例如 YouTube、Twitter、Google Play 和其他在此无法一一列出的被过滤网站。请注意，此配置不使用 worker，因此不会改变您的 IP，不适用于安全敏感的操作。您在面板中应用的 Fragment 设置（Chain Proxy 除外）也会应用于此配置。

> [!TIP]
> Best Fragment 配置会应用 18 个不同的 Fragment 值，并根据您的运营商选择速度最好的那个！这 18 个状态的选择方式是为了覆盖所有可能的范围，配置会每 1 分钟测试所有大小范围，并连接到最佳状态。
有关 Fragment 的高级设置也在[此处](#4-2--fragment-设置)进行了说明。
<br><br>

## 3-2- Hiddify 的 Fragment 订阅

FRAGMENT SUB 表格的第二行用于在 Hiddify 应用程序上使用 Fragment，但有一个区别。由于此应用程序的限制，许多面板设置不会应用于此订阅，程序本身会覆盖这些设置。这些配置的名称中包含一个 `F`。以下设置需要您在 Hiddify 应用程序中手动应用，目前无法通过面板应用：

1.  Remote DNS
2.  Local DNS
3.  Fragment Packets
4.  Routing

> [!CAUTION]
> 1- 务必在应用程序设置中将 Remote DNS 更改为 DOH，例如：
> https://8.8.8.8/dns-query 或 https://94.140.14.14/dns-query
> 如果您在此处使用 ...//:udp 或空 IP，您的 worker 将无法工作。
>
> 2- 如果您在应用程序中手动启用了 Fragment，则面板的 Fragment 设置将不起作用。

当然，还有另一种方法是导入 Normal 订阅到 Hiddify 应用程序中，然后如图所示自行启用 Fragment：
<p align="center">
  <img src="assets/images/Hiddify_fragment.jpg">
</p>
<br><br>

# 4- Warp 订阅

<p align="center">
  <img src="assets/images/Warp-Configs.jpg">
</p>

此订阅提供一个伊朗 Cloudflare IP 的 Warp 配置，一个国外 IP 的 Warp on Warp (简称 WoW) 配置（目前由于 Cloudflare 更改，有时会提供伊朗 IP），一个连接到最快 Warp 配置并始终使用伊朗 IP 的 Warp Best Ping 配置，以及一个连接到最快 WoW 配置并使用国外 IP 的 WoW Best Ping 配置。默认情况下只有一个 Warp 和一个 WoW 配置，但如果您编辑 Endpoints 部分，Warp 和 WoW 配置会根据输入的 Endpoints 数量增加。

您也可以下载 Warp 配置的 Zip 文件，导入到 Wireguard 应用程序中。请注意，伊朗的大多数运营商已经阻止了 Warp，只有当您的运营商允许使用 Wireguard 时，才能使用此应用程序。

请务必使用扫描器找到适合您运营商的 Endpoint。扫描脚本可在面板中找到，复制并在 Android 上的 Termux 中运行。有关如何将其放入面板的信息，请阅读高级设置 7-4 部分。普通 Warp 订阅可能在某些运营商（如 Irancell）上效果良好，但对于其他运营商，请使用 Warp Pro 订阅。
<br><br>

# 5- Warp PRO 订阅

<p align="center">
  <img src="assets/images/Warp-Pro-Configs.jpg">
</p>

GFW-Knocker 和 Hiddify 团队在 Xray 和 Singbox 内核上进行了新的开发，其成果是 MahsaNG、NikaNG、v2rayN-PRO 和 Hiddify 等应用程序，这使我们能够优化在伊朗条件下连接到 Warp 的方式，类似于 Oblivion 团队所做的工作。因此，我将 WARP PRO SUB 添加到了面板中，可以在 WARP PRO SETTINGS 部分进行个性化设置。每个运营商的最佳值是通过实验确定的，可能在不同时间也有所不同，但默认值经过测试，目前效果良好，只需放置合适的 Endpoint。

> [!CAUTION]
> Hiddify 应用程序的版本也必须至少是 2.0.5。

您也可以下载 Pro 配置的 Zip 文件，导入到 WG Tunnel 应用程序中，点击 + 并选择下载的 Zip 文件，您无需进行任何特殊设置，配置即可连接。对于 Amnezia，步骤也类似，只是该应用程序无法正确读取 zip 文件，下载 zip 文件后先解压，然后将所需的配置导入 Amnezia 并连接。
<br><br>
<h1 align="center">我的 IP 表格</h1>

<p align="center">
  <img src="assets/images/My-IP.jpg">
</p>

连接到代理后，您可以刷新页面并查看此表格以了解您的 IP。此表格有两行，第一行显示您对于 Cloudflare 地址的 IP，如果您设置了 Proxy IP，您对于 Cloudflare 地址的 IP 将是此 Proxy IP，对于其他地址则是一个随机的 Cloudflare IP。因此，您可以通过此方式检查您选择的 Proxy IP 是否已应用。如果您使用 Warp 配置连接，那么两行的 IP 理应相同。请注意，为了使此部分正常工作，如果您使用了 uBlock Origin 扩展，则需要将其禁用。
<br><br>

<h1 align="center">高级设置</h1>

首先，如果您进行了任何错误的更改，请不要担心，APPLY SETTINGS 按钮旁边有一个 Reset 按钮，可以将面板恢复到默认设置。
<br><br>

## 1- VLESS/TROJAN 设置

<p align="center">
  <img src="assets/images/VLESS_Trojan_settings.jpg">
</p>

此部分用于配置 Fragment、Clash 和 Singbox 订阅的设置，不影响 v2ray Normal 部分的配置以及 Warp 订阅。

### 1-1- DNS 服务器

默认情况下，我将 Google DOH 设置为 Remote DNS，将 Google DNS 设置为 Local DNS。这意味着默认配置如下：

>`Remote DNS: https://8.8.8.8/dns-query`
>
>`Local DNS: 8.8.8.8`

> [!CAUTION]
> 绝对不要使用 `https://1.1.1.1/dns-query` 或 `https://cloudflare-dns.com/dns-query` 作为 remote DNS，因为这会增加 ping 并导致连接不稳定。

> [!TIP]
> 从 2.5.5 版本起，您可以使用官方的 DOH 或 DOT，并确保它们具有最佳性能，例如以下几个：
>
> `https://dns.google/dns-query`
>
> `https://dns.adguard-dns.com/dns-query`
>
> `https://dns.quad9.net/dns-query`
>
> `tls://dns.google`

您也可以启用 Fake DNS，这有助于提升 DNS 速度，但请注意，它可能与某些应用程序不兼容或干扰系统 DNS，因此如果您不确切知道其作用，最好不要启用。
<br><br>

### 1-2- Proxy IP 设置

从 2.3.5 版本起，您也可以通过面板更改 Proxy IP，只需应用设置并更新订阅即可。但建议使用 Cloudflare dashboard 的旧方法，因为：

> [!CAUTION]
> 如果您通过面板应用 Proxy IP，并且该 IP 失效，您需要替换一个 IP 并更新订阅。这意味着如果您已经捐赠了配置并且更改了 Proxy IP，就没有用了，因为用户没有订阅来更新配置。因此，建议仅用于个人使用。而旧方法的好处是无需更新配置。

例如，您可以从以下链接选择 Proxy IP，它会显示一些 IP，您可以查看其国家并选择一个或多个：

>[Proxy IP](https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/)

> [!TIP]
> 如果您想拥有多个 Proxy IP，可以像图片所示一样输入。
<br><br>

### 1-3- Chain Proxy 设置

前面提到可以设置一个 Proxy IP 来固定 Cloudflare 背后的网站 IP，但打开普通网站时，我们的 IP 仍然属于 Worker，并且会不时变化。为了完全固定所有网站的 IP，添加了此部分。我们可以在此处放置一个免费的 VLESS 或 Socks 或 Http 配置（即使被过滤了，只要在伊朗能工作即可），这样我们的 IP 就会永远固定为该配置的 IP。

> [!CAUTION]
> 1- 此配置本身不应是 Worker，否则您的最终 IP 仍然会改变。
>
> 2- 获取免费配置的来源很多，我推荐 [racevpn.com](https://racevpn.com)，当然它有时间限制，您可以按国家获取配置。您也可以使用 [IRCF](https://ircfspace.github.io/tconfig/) 的配置或电报机器人 [y b x](https://t.me/TheTVCbot)，但其中一些配置可能已失效。
>
> 3- VLESS 配置可以是以下类型之一：
>
> `Reality TCP`
>
> `Reality GRPC`
>
> `Reality WS`
>
> `Reality TCP Header`
>
> `WS TLS`
>
> `GRPC TLS`
>
> `TCP TLS`
>
> `WS`
>
> `GRPC`
>
> `TCP`
>
> `TCP Header`
>
> 5- Socks 配置可以是以下形式之一：
>
> socks://`address`:`port`
>
> socks://`user`:`pass`@`address`:`port`
>
> 6- Http 配置可以是以下形式之一：
>
> http://`address`:`port`
>
> http://`user`:`pass`@`address`:`port`
>
> 7- 此部分仅应用于所有订阅（Normal 表格的第一行和 Warp 订阅除外），应用后务必更新订阅。而 Normal 订阅会单独提供该配置。例如，在 Nekobox 或 Husi 应用程序的 Group 部分，您可以编辑您的订阅并设置此配置为 Landing Proxy，这样订阅就形成了 Chain。最近 v2rayNG 应用程序从 1.9.1 版本起也增加了此功能，您需要复制配置名称，进入 Subscription group setting 编辑您的订阅，并将名称粘贴到 `Next proxy remarks` 部分。

> [!IMPORTANT]
> 1- 如果您使用 VLESS TLS 配置进行 Chain 代理，端口必须是 443，否则面板不允许。
>
> 2- 用于 Chain 的 VLESS 配置中 alpn 设置为 randomized 的在 Clash 上无法工作，因为它不支持。
>
> 3- VLESS WS 配置不适合 Chain 到 Sing-box，有 bug。
<br><br>

### 1-4- Clean IP 设置

Normal（无 Fragment）订阅链接为您提供 6 个配置。您可以在此处增加配置数量。还有一个扫描器，您可以根据您的操作系统下载 zip 文件，解压后运行 CloudflareScanner 程序，测试完成后将在 result.csv 文件中输出结果，您可以根据 Delay 和 Download speed 进行选择。建议在 Windows 上进行扫描，并且测试时务必断开 VPN。正常情况下会给出很好的 IP，但有关高级扫描，请阅读[此处](https://github.com/bia-pain-bache/Cloudflare-Clean-IP-Scanner/blob/master/README.md)的指南。

> [!TIP]
> 在支持 IPv6 的运营商（如 Rightel、Irancell 和 Asi@Tech）上，先在 SIM 卡上启用 IPv6，然后在 V2RayNG 的设置中启用 Prefer IPv6 选项，并在那 6 个配置中选择最后两个或地址是您自己域名的那个。总的来说，始终运行一次 Real delay all configuration，并连接到延迟最优的那个。



面板提供的 6 个默认配置都是 Clean IP。另外，如果您使用 Fragment 配置，Clean IP 的重要性就大大降低了，但电信等某些运营商在普通配置上仍然需要 Clean IP。

好的，如果您想在除了这 6 个配置之外添加其他使用您自己 Clean IP 的配置，请像图片所示那样将您的 Clean IP 或域名逐行输入并点击 Apply。

现在，如果您在应用程序中点击 Update subscription，您会看到新的配置已添加。

此外，这些新配置也会同时添加到 Fragment 部分。

<br>

> [!CAUTION]
> 应用设置后务必更新订阅。
<br><br>

### 1-5- 启用 IPv6

面板默认提供 IPv6 配置，但如果您的运营商不支持，为了简化配置和优化 DNS 设置，您可以禁用它。
<br><br>

### 1-6- Custom CDN 设置

我们有 3 个名为 Custom CDN 的字段，用于将您自己的 Worker 域名带到另一个 CDN 后面，例如 Fastly 或 Gcore 或任何其他 CDN。这 3 部分依次是：

1- `Custom Addr` 部分，这本质上等同于 Cloudflare 的 IP 或 Clean IP。但您在此处使用的任何 CDN 都必须使用自己的 IP，不能将 Cloudflare IP 用于 Fastly 或 Gcore。就像我们之前提到的 Clean IP 一样，您可以逐行输入域名、IPv4 或 IPv6，请注意 IPv6 必须像面板其他部分一样包含在 `[ ]` 中，例如：
> [2a04:4e42:200::731]

2- `Custom Host` 部分，您需要放入您在该 CDN 中定义的指向您自己的 Worker 的 host。例如，在 Fastly 中可以定义一个虚假的域名地址。

3- `Custom SNI` 部分，您可以放入那个虚假的域名，或者一个在该 CDN 上的网站。例如，`speedtest.net`（不含 www）网站就在 Fastly CDN 上。

现在设置好此部分后，其配置将添加到 Normal 订阅中，所有 Sing-box、Clash 和 v2ray 等订阅都将拥有此配置。这些配置的名称中包含一个 `C`，以便与其他配置区分。

> [!IMPORTANT]
> 目前，只有 443 和 80 端口的配置支持此方法连接。

> [!TIP]
> 这些配置出现在 Normal 和 Full Normal 订阅中。但如果您使用 Normal 订阅，则需要手动在配置设置中启用 Allow Insecure。Full Normal 会自动应用。
<br><br>

### 1-7- Best Ping 检查间隔时间

在所有 Fragment、Sing-box 和 Clash 订阅中，我们都有 Best Ping。默认情况下，它每 30 秒查找最佳配置或 Fragment 值并连接。但是，如果网速不好并且您正在观看视频或玩游戏，这 30 秒可能会带来麻烦并导致延迟体验。您可以从此处设置间隔时间，最短 10 秒，最长 90 秒。
<br><br>

### 1-8- 选择 Protocol

您可以启用 VLESS 和 Trojan 中的一个或两个协议。
> [!CAUTION]
> 这两种协议在 Cloudflare 上对 UDP 连接的支持不是很好，因此例如 Telegram 语音通话将无法工作。您也不能使用 UDP DNS 作为 remote DNS。如果您在某个应用程序中看到 remote DNS 是一个 IP，例如 1.1.1.1 或类似于 `udp://1.1.1.1` 的东西，您会遇到问题。务必使用以下格式：
>
> `https://IP/dns-query` 例如 `https://8.8.8.8/dns-query` , `https://94.140.14.14/dns-query` ....
>
> `https://doh/dns-query` 例如 `https://dns.google/dns-query` , `https://cloudflare-dns.com/dns-query` ....
>
> `tcp://IP` 例如 `tcp://8.8.8.8` , `tcp://94.140.14.14` ....
>
> `tls://IP` 例如 `tls://dns.google` , `tls://cloudflare-dns.com` ....
<br>

### 1-9- 选择 Port

在此部分，您可以选择所需的端口。其中一些端口会为您提供 TLS 配置，这更安全，但在 TLS 和 Fragment 出现干扰时，这些配置可以连接。
> [!CAUTION]
> 请注意，要使用 non-TLS 配置，必须使用 Workers 方法部署。否则，面板中不会显示 HTTP 端口，因为它们无法与 Pages 方法一起工作。

> [!TIP]
> non-TLS 配置仅添加到 Normal 订阅中。
<br><br>

## 2- Fragment 设置

<p align="center">
  <img src="assets/images/Fragment-Settings.jpg">
</p>

默认情况下：

>`Length: 100-200`
>
>`Interval: 1-1`
>
>`Packets: tlshello`

现在您可以调整参数并点击 Apply。这样 Fragment 配置就会根据您的设置提供了。

> [!NOTE]
> 您可以只更改一个参数或全部一起更改。您进行的任何更改都会被保存，下次无需重新设置。

> [!IMPORTANT]
> Fragment 值有最大限制，Length 不能超过 500，Interval 不能超过 30。
<br><br>

## 3- WARP GENERAL 设置

<p align="center">
  <img src="assets/images/Warp-Settings.jpg">
</p>

在 Warp 和 Warp Pro 订阅之间共享，并应用于两者，主要包含两个部分：

1.  有一个 Endpoints，这些对于 Warp 就像 VLESS 的 Clean IP 一样。它们对 Warp 和 WoW 配置都适用。我还提供了扫描脚本，您可以在 Android 的 Termux 或 Linux 上运行，然后将其放在面板中。当然，它不是 100% 准确的，需要您自己测试。

> [!CAUTION]
> 请注意，输入 Endpoint 的格式是 IP:Port 或 Domain:port，需要逐行输入。
>
> 输入 IPv6 时需要包含在 [] 中。请注意以下示例：
>
> 123.45.8.6:1701 engage.cloudflareclient:2408 [2a06:98c1:3120::3]:939

2.  您可以单独为 Warp 配置启用 Fake DNS，这有助于提升 DNS 速度，但请注意，它可能与某些应用程序不兼容或干扰系统 DNS，因此如果您不确切知道其作用，最好不要启用。
3.  如果您的运营商不支持 IPv6，为了优化 DNS 和代理性能，您可以禁用它。
4.  Warp Configs 部分的操作是，如果您点击 Update，它会从 Cloudflare 获取新的 Warp 配置并保存，如果您更新订阅，您会发现它们发生了变化。但这部分与连接速度完全无关。
5.  Best Ping 检查间隔时间。在 Warp 和 Warp PRO 订阅中，我们都有 Best Ping。默认情况下，它每 30 秒查找最佳配置或 Endpoint 并连接。但是，如果网速不好并且您正在观看视频或玩游戏，这 30 秒可能会带来麻烦并导致延迟体验。您可以从此处设置间隔时间，最短 10 秒，最长 90 秒。
<br><br>

## 4- WARP PRO 设置

<p align="center">
  <img src="assets/images/Warp-Pro-Settings.jpg">
</p>

仅适用于 WARP PRO 订阅，什么是 WARP PRO，上文已解释。它包含几个部分：

1.  第一个是 UDP noise，这是 Xray 内核最近添加的功能，可以与 v2rayNG 和 v2rayN 应用程序一起使用。您添加的任何 noise 都可以有 Base64、String、hex 和 random 四种模式。您还可以在 Noise Count 部分确定将多少个这种 noise 添加到配置中。请注意，您可以定义具有不同类型的多个 noise，它们不必都相同。在 Packet 中输入的值必须与 Mode 对应，Base64 需要真实的 Base64 值，String 可以是任何字符串，Random 只需要输入字符串长度，hex 则是 Hex 字符串。示例：

> Base64: NTUyMjU0NjItN2I4MC00YWFmLWE3NDgtNjZiYWZiNjlmNmQ2
>
> String: salamchetori123
>
> Random: 10-30
>
> Hex: 01d800f9373b2c418713aafde43021004ac3b89f

> [!TIP]
> 您可以在 [此处](https://onlinebase64tools.com/base64-encode) 将自定义文本转换为 Base64。
>
> 您也可以在 [此处](https://onlinetools.com/random/generate-random-hexadecimal-numbers) 生成 Hex 字符串。

此部分的配置可以从 Warp Pro 订阅中获取。

2.  第一个是 Hiddify Noise Mode，它决定了 noise（假包）的生成模式。Hiddify 团队的 Singbox 内核支持以下模式：

-   模式 m1 到 m6
-   模式 h_HEX，其中 HEX 可以是 00 到 FF 之间的值，例如 h_0a, h_f9 和 h_9c 等。
-   模式 g_HEX_HEX_HEX，其中 HEX 同样如上，例如 g_0a_ff_9c

3.  第二个是 NikaNG Noise Mode，它有以下模式：

-   模式 none 表示不应用任何 noise，这实际上是普通的 Warp 配置。
-   模式 quic，该模式由开发者团队为伊朗网络状况推荐。
-   模式 random 会随机生成 Noise。
-   最后一个模式是您可以自己使用自定义的 HEX 字符串，例如 fe09ad5600bc...

4.  Noise Count 部分是发送的假包或 noise 的数量。例如，面板默认设置为发送 10 到 15 个。
5.  下一个是 Noise size，顾名思义，这是这些包的长度。
6.  最后一个是 Noise Delay，这是发送这些 noise 之间的时间间隔。

7.  此部分适用于 Amnezia、WG Tunnel 和 Clash 等应用程序，因为它们都遵循相同的设置。与之前的部分类似，您需要指定 noise 的数量以及最小和最大大小。在 Warp Pro sub 表格中，除了应用程序订阅外，您还可以下载 Amnezia 和 WG Tunnel 配置的 Zip 文件。

这些设置会随着对每个运营商的测试和尝试而逐步确定。
<br><br>

## 5- Routing Rules 设置

<p align="center">
  <img src="assets/images/Routing_rules.jpg">
</p>

此部分用于使配置（除了 Normal 订阅提供的那些）能够：
1.  直接连接到 LAN。例如，访问 127.0.0.1 或 192.168.1.1 将直接连接。
2.  直接访问国内网站而无需 VPN（访问某些网站，特别是支付网关时无需断开连接）
3.  直接访问中国网站。
4.  直接访问俄罗斯网站。
5.  阻止大约 80% 的国内和国际广告。
6.  阻止色情网站。
7.  阻止 QUIC 连接（由于網絡不穩定）

正常情况下，此部分是禁用的，您需要先确保您的应用程序的 Geo asset 已更新。
> [!CAUTION]
> 如果您启用了此功能但 VPN 无法连接，唯一的原因是 Geo asset 未更新。在 v2rayNG 应用程序菜单中，进入 Geo asset files 部分，点击云或下载图标进行更新。如果更新失败，您将无法连接。如果您尝试了所有办法仍无法更新，请从以下两个链接下载两个文件，然后不再尝试更新，而是点击添加按钮并导入这两个文件：
>
>[geoip.dat](https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat)
>
>[geosite.dat](https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat)

### 5-1- Custom Rules 设置

如果您需要 above 部分不包含的设置，可以使用此部分。例如，假设您阻止了色情网站，但某个特定的色情网站不在列表中且未被阻止，您可以使用此处进行阻止。
> [!TIP]
> 您可以在此部分使用三种不同的格式：
>
> 1- 域名，例如 `google.com`。请注意，如果您输入 google.com，其所有子域名也会被阻止或直接连接，例如 drive.google.com 或 mail.google.com。
>
> 2- 您可以放置单个 IPv4 或 IPv6。请注意，IPv6 必须像面板其他部分一样以 `[2606:4700::6810:85e5]` 这样的格式输入。
>
> 3- 您可以放置一个 IP 段，例如 `192.168.1.1`/32 或 128/`[2606:4700::6810:85e5]`
