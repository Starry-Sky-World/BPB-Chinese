<h1 align="center">使用方法和设置</h1>

假设您的 worker 或 pages 名称是 `worker-polished-leaf-d022`：

您可以通过在末尾添加 `panel/` 来访问面板，如下所示：

>`https://worker-polished-leaf-d022.workers.dev/panel`

系统会要求您设置新密码并登录，就这么简单。
> [!IMPORTANT]
> 密码必须至少**8个字符**，并且至少包含一个**大写字母**和一个**数字**。以后您也可以从面板底部更改密码。
现在让我们来看看面板的不同部分：
<br><br>

# 1 - Normal 订阅

<p align="center">
  <img src="assets/images/Normal-Configs.jpg">
</p>

我从这部分开始是因为很多人喜欢不使用 fragment 或使用面板设置，但请注意，您必须知道如何在应用程序中进行设置，否则可能会遇到问题。我建议使用 `Full Normal` 订阅，因为它们已经应用了所有面板设置，您不需要做任何特殊操作。请注意，面板的路由规则、链式代理和 DNS 设置不会应用到这个订阅（需要在程序中手动设置）。
这个链接会给您 6 个配置。（您可以通过设置中的清洁 IP、端口和协议部分增加配置数量）这 6 个配置有什么区别？

- **Websocket 路径：** 每个配置都有不同的路径。
- **配置地址：** 这 6 个配置中，第一个是您的 worker 域名，第二个是 www.speedtest.net（在大多数运营商上是干净的），第 3 到第 6 个是您域名的 IP，这些通常也是干净的。两个 IPv4 和两个 IPv6。

如何增加它们的数量？更多说明和设置在[添加清洁 IP](#1-4--清洁-ip-设置)、[添加端口](#1-9--选择端口)、[选择协议](#1-8--选择协议)和[添加自定义 CDN](#1-6--自定义-cdn-设置)部分有详细解释。
> [!CAUTION]
>要使用此订阅，请在您使用的任何应用程序的设置中关闭 Mux。

> [!WARNING]
> 使用此 Worker 会经常改变您的设备 IP，因此不要将其用于交易、PayPal 以及像 Hetzner 这样对 IP 敏感的网站，可能会被封禁。关于固定 IP，我们提供了两个解决方案，一个是在设置时[设置 Proxy IP](#1-2--proxy-ip-设置)，另一个是[使用链式代理](#1-3--链式代理设置)。
<br><br>

# 2 - Full Normal 订阅

<p align="center">
  <img src="assets/images/Full-Normal-Configs.jpg">
</p>

这个订阅提供上面的配置，但区别在于面板的 VLESS / Trojan 部分的所有设置都会应用到其中，您可以在[这里](#1--vlesstrojan-设置)了解，同时这些订阅还包含 **Best Ping** 配置（稍后解释）。通过应用路由设置，它可以阻止约 90% 的伊朗和国外广告，绕过伊朗和中国网站（无需关闭 VPN 进行支付等），绕过 LAN，阻止色情和 QUIC，同时 Sing-box 订阅还能很好地阻止钓鱼和恶意软件等内容。
> [!TIP]
> 什么是 **Best Ping** 配置？这个配置将面板的所有配置合并在一起，每 30 秒检查哪个配置速度更好并连接到它！如果您添加了清洁 IP、启用了 Trojan 协议或选择了其他端口，它们也会添加到 Best Ping 中。在后面的 Fragment 和 Warp 订阅中也有这种类型的配置。
<br><br>

# 3 - Fragment 订阅

<p align="center">
  <img src="assets/images/Fragment-Sub.jpg">
</p>

> [!NOTE]
> **Fragment 配置的特点**
> 
> 1- 即使个人域名或 worker 被封锁也能连接
> 
> 2- 改善所有运营商的质量和速度，特别是那些在 Cloudflare 上有干扰的运营商

<br>

## 3-1 - Xray 的 Fragment 订阅

这是指使用 Xray 内核的程序，实际上是面板中 FRAGMENT SUB 表的第一行，在应用程序中导入方式与普通订阅相同。这部分的配置名称中都有一个 `F`。

这个订阅会给您与 Full Normal 订阅相同数量的配置，但带有 fragment（使用您在面板中应用的 fragment 设置），外加 **Best Fragment** 和 **Workerless** 配置。您在面板中进行的任何设置，当您更新订阅时都会应用到所有配置。

> [!TIP]
> WorkerLess 配置不使用 worker，可以打开很多被封锁的网站和应用！比如 YouTube、Twitter、Google Play 和其他被封锁的网站，这里列不完。请注意，由于这个配置不使用 worker，所以不会改变您的 IP，因此不适合安全性要求高的工作。您在面板中对 fragment 所做的更改也会应用到这个配置，除了链式代理。

> [!TIP]
> Best Fragment 配置会应用 18 个不同的 fragment 值，并根据您的运营商选择速度最快的！这 18 种情况的选择确保没有遗漏任何范围，配置每 1 分钟测试所有大小范围，并连接到最好的。
关于 fragment 的高级设置在[这里](#4-2--fragment-设置)有解释。
<br><br>

## 3-2- Hiddify 的 Fragment 订阅

FRAGMENT SUB 表的第二行是为 Hiddify 程序使用 fragment，但有一点不同。由于这个程序的限制，面板的许多设置不会应用到这个订阅，实际上程序会重写这些设置。这部分的配置名称中都有一个 `F`。您需要在 Hiddify 程序中手动应用以下设置，目前无法从面板应用：

 1. Remote DNS
 2. Local DNS
 3. Fragment Packets
 4. Routing

> [!CAUTION]
> 1- 一定要从程序设置中将 Remote DNS 更改为一个 DOH，例如：
> https://8.8.8.8/dns-query 或 https://94.140.14.14/dns-query
> 如果在此部分使用 ...//:udp 或纯 IP，您的 worker 将无法工作。
> 
> 2- 如果您在程序中手动开启了 Fragment，面板的 fragment 设置将不会应用。

还有另一种方法，就是将普通订阅导入 Hiddify 程序，然后像下图这样自己启用 fragment：
<p align="center">
  <img src="assets/images/Hiddify_fragment.jpg">
</p>
<br><br>

# 4- Warp 订阅

<p align="center">
  <img src="assets/images/Warp-Configs.jpg">
</p>

这个订阅提供一个 IP 在伊朗的 Warp 配置，一个 IP 在国外的 Warp on Warp 配置（简称 WoW）（目前由于 Cloudflare 的变化，有时会给出伊朗 IP），一个总是有伊朗 IP 的 Warp Best Ping 配置会连接到最快的 Warp 配置，以及一个 IP 在国外的 WoW Best Ping 配置会连接到最快的 WoW 配置。默认只有一个 Warp 和 WoW 配置，但如果您编辑 Endpoints 部分，Warp 和 WoW 配置的数量会根据输入的 Endpoint 数量增加。

您也可以下载 Warp 配置的 zip 文件，进入 Wireguard 程序，导入下载的 zip 文件。请注意，伊朗大多数运营商都已封锁 Warp，只有当您的运营商开放 Wireguard 时才使用这个程序。

请务必使用扫描器在您的运营商上找到合适的 Endpoint。面板中有扫描器脚本，复制它并在 Android 的 Termux 中运行。关于如何放入面板，请阅读高级设置 7-4 部分。普通 warp 订阅可能在一些运营商（如 Irancell）上工作得很好，但对于其他运营商，请使用 Warp Pro 订阅。
<br><br>

# 5- Warp PRO 订阅

<p align="center">
  <img src="assets/images/Warp-Pro-Configs.jpg">
</p>

GFW-Knocker 和 Hiddify 团队在 Xray 和 Singbox 内核上进行了新的开发，产生了 MahsaNG、NikaNG、v2rayN-PRO 和 Hiddify 程序，这让我们能够为伊朗的情况优化 warp 连接，类似于团队在 Oblivion 上所做的工作。因此，我在面板中添加了 WARP PRO SUB，可以从 WARP PRO SETTINGS 部分进行自定义。每个运营商的最佳值是通过经验获得的，就像 fragment 设置一样，在不同时间可能也会有所不同，但默认值已经过测试，目前工作良好，您只需要设置合适的 Endpoint。

> [!CAUTION]
> Hiddify 应用程序的版本必须至少是 2.0.5。

您也可以下载 Pro 配置的 zip 文件，进入 WG Tunnel 程序，点击 + 并选择下载的 zip 文件，不需要做任何特殊设置，配置就会连接。对于 Amnezia 也是相同的步骤，只是这个程序不能正确读取 zip 文件，下载 zip 文件后先解压，然后将您想要的任何配置导入 Amnezia 并连接。
<br><br>
<h1 align="center">My IP 表格</h1>

<p align="center">
  <img src="assets/images/My-IP.jpg">
</p>

连接到代理后，您可以刷新页面并查看此表格来了解您的 IP。这个表格有两行，第一行显示您在 Cloudflare 地址上的 IP，如果您有 Proxy IP，您在 Cloudflare 地址上的 IP 将是这个 Proxy IP，对于其他地址则是一个随机的 Cloudflare IP。因此，您可以通过这种方式检查您选择的 Proxy IP 是否已应用。如果您使用 Warp 配置连接，那么表格的两行应该显示相同的 IP。请注意，为了使这部分正常工作，如果您使用 uBlock Origin 扩展，您需要禁用它。
<br><br>

<h1 align="center">高级设置</h1>

首先要说的是，如果您做了任何错误的更改，不用担心，在 APPLY SETTINGS 按钮旁边有一个 Reset 按钮，可以将面板恢复到默认设置。
<br><br>

## 1- VLESS/TROJAN 设置

<p align="center">
  <img src="assets/images/VLESS_Trojan_settings.jpg">
</p>

这部分是用于 Fragment 配置和 Clash 及 Singbox 订阅的设置，对普通 v2ray 部分的配置以及 warp 订阅没有影响。

### 1-1- DNS 服务器

默认情况下，我为 Remote DNS 设置了 Google DOH，为 Local DNS 设置了 Google DNS。也就是说，默认配置是：

>`Remote DNS: https://8.8.8.8/dns-query`
>
>`Local DNS: 8.8.8.8`

> [!CAUTION]
> 绝对不要使用 `https://1.1.1.1/dns-query` 或 `https://cloudflare-dns.com/dns-query` 作为 remote DNS，因为它会增加延迟并使连接不稳定。

> [!TIP]
> 从版本 2.5.5 开始，您可以使用官方的 DOH 或 DOT，并确信它们有最好的性能，这里举几个例子：
>
> `https://dns.google/dns-query`
>
> `https://dns.adguard-dns.com/dns-query`
>
> `https://dns.quad9.net/dns-query`
>
> `tls://dns.google`

您也可以启用 Fake DNS，它有助于提高 DNS 速度，但请注意它可能与某些程序不兼容或影响系统 DNS，因此如果您不确切知道它是什么，最好不要启用它。
<br><br>

### 1-2- Proxy IP 设置

从版本 2.3.5 开始，您可以通过面板本身更改 Proxy IP，只需应用更改并更新订阅即可。但我建议使用旧的 Cloudflare 仪表板方法，因为：

> [!CAUTION]
> 如果通过面板设置 Proxy IP，当该 IP 失效时，您需要替换一个新的 IP 并更新订阅。这意味着如果您已经分享了配置，更改 Proxy IP 就没有意义了，因为用户没有订阅来更新配置。因此建议这种方法只用于个人使用。而旧方法的好处是不需要更新配置。

例如，您可以从下面的链接选择 Proxy IP，它会显示一些 IP，您可以检查它们的国家并选择一个或多个：

>[Proxy IP](https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/)

> [!TIP]
> 如果您想要多个 Proxy IP，可以像下图那样输入。
<br><br>

### 1-3- 链式代理设置

我们之前说过可以设置一个 Proxy IP 来固定 Cloudflare 网站的 IP，但当我们访问普通网站时，我们的 IP 仍然是 worker 的 IP，这个 IP 每隔一段时间就会改变。为了完全固定所有网站的 IP，添加了这个部分。我们可以在这里放置一个免费的 VLESS、Socks 或 Http 配置，即使它被封锁（只要它只在伊朗被封锁但仍然可用），我们的 IP 就会永久固定为这个配置的 IP。
   
> [!CAUTION]
> 1- 这个配置本身不能是 worker，否则您的最终 IP 仍会改变。
>
> 2- 获取免费配置的来源很多，我推荐 [racevpn.com](https://racevpn.com)，虽然它有时间限制，但您可以根据国家获取配置。您也可以使用 [IRCF](https://ircfspace.github.io/tconfig/) 的配置或 [ی ب خ](https://t.me/TheTVCbot) Telegram 机器人，但他们的一些配置可能已失效。
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
> 7- 这部分仅应用于除 Normal 表第一行和 Warp 订阅之外的所有订阅，应用后请务必更新订阅。但普通订阅会单独给您那个配置。例如，您可以在 Nekobox 或 Husi 程序的 Group 部分编辑您的订阅，并将此配置设置为 Landing Proxy，这样订阅就会链式化。最近 v2rayNG 程序从版本 1.9.1 也添加了这个功能，您需要复制配置名称，进入 Subscription group setting 编辑您的订阅，并在 `Next proxy remarks` 部分粘贴名称。

> [!IMPORTANT]
> 1- 如果您使用 VLESS TLS 配置进行链式代理，其端口必须是 443，否则面板不会允许。
> 
> 2- alpn 值为 randomized 的 VLESS 配置在 Clash 上不工作，因为它不支持。
>
> 3- VLESS WS 配置不适合在 Sing-box 上进行链式代理，有 bug。
<br><br>

### 1-4- 清洁 IP 设置

普通（无 fragment）订阅链接会给您 6 个配置。在这里您可以增加配置数量。还有一个扫描器，您可以根据您的操作系统下载 zip 文件，解压后运行 CloudflareScanner 文件，测试完成后会将输出写入 result.csv 文件，您可以根据延迟和下载速度进行选择，建议在 Windows 上进行测试，测试时请确保 VPN 已断开。通常它会给出好的 IP，但对于高级扫描，请[在这里](https://github.com/bia-pain-bache/Cloudflare-Clean-IP-Scanner/blob/master/README.md)阅读指南。

> [!TIP]
> 在支持 IPv6 的运营商（如 Rightel、Irancell 和 Asiatech）上，首先在 SIM 卡上启用 IPv6，然后在 V2RayNG 设置中启用 Prefer IPv6 选项，在这 6 个配置中使用最后两个或使用您自己域名的那个。总的来说，始终点击一次 Real delay all configuration，并使用最好的那个连接。

面板提供的那 6 个默认配置都是清洁 IP，而且如果您使用 Fragment 配置，清洁 IP 就不那么重要了，但一些运营商如电信在普通配置上仍然需要清洁 IP。

如果您想在那 6 个配置之外添加使用您自己的清洁 IP 的其他配置，请按照图片所示逐行输入您的清洁 IP 或域名，然后点击 Apply。

现在如果您在应用程序中点击 Update subscription，您会看到新的配置已添加。

此外，这些新配置也会同时添加到 fragment 部分。

<br>

> [!CAUTION]
> 应用后务必更新订阅。
<br><br>

### 1-5- 启用 IPv6

面板默认也提供 IPv6 配置，但如果您的运营商不支持，您可以禁用它以减少配置数量并优化 DNS 设置。
<br><br>

### 1-6- 自定义 CDN 设置

我们有 3 个名为 Custom CDN 的字段，用于当您将自己的 Worker 域名放在另一个 CDN 后面时使用，比如 Fastly 或 Gcore 或任何其他 CDN。这 3 个部分依次是：

1- `Custom Addr` 部分实际上相当于 Cloudflare 的 IP 或清洁 IP。但您在这里使用任何 CDN 时都必须使用它们自己的 IP，不能为 Fastly 或 Gcore 使用 Cloudflare IP。这里和清洁 IP 一样，您可以逐行添加域名、IPv4 或 IPv6，请注意 IPv6 必须在 [ ] 之间，例如：
> [2a04:4e42:200::731] 

2- `Custom Host` 部分应该填写您在该 CDN 中定义的指向您的 worker 的 host。例如，在 Fastly 中可以定义一个虚假的域名地址。

3- `Custom SNI` 部分既可以填写那个虚假的域名，也可以填写在同一个 CDN 上的网站。例如 speedtest.net（不带 www）网站在 Fastly CDN 上。

设置好这部分后，配置会添加到 Normal 订阅中，所有 Sing-box、Clash 和 v2ray 等订阅都会有。这些配置的名称中都有一个 `C` 以区别于其他配置。

> [!IMPORTANT]
> 目前只有端口 443 和 80 的配置可以使用此方法连接。

> [!TIP]
> 这些配置会出现在 Normal 和 Full Normal 订阅中。但如果您使用 Normal 订阅，您需要手动从配置设置中启用 Allow Insecure。Full Normal 会自动应用。
<br><br>

### 1-7- Best Ping 检查时间

在所有 Fragment 或 Sing-box 和 Clash 订阅中，我们都有 Best Ping。默认情况下，它每 30 秒找到最佳配置或 Fragment 值并连接到它，但如果网速不好，而您正在观看视频或玩游戏，这 30 秒可能会造成问题，您可能会经历延迟。您可以从这里设置时间，最少可以是 10 秒，最多 90 秒。
<br><br>

### 1-8- 选择协议

您可以启用 VLESS 和 Trojan 中的一个或两个协议。
> [!CAUTION]
> 这两个协议在 Cloudflare 上不能很好地支持 UDP 连接，因此例如 Telegram 语音通话将不起作用。您也不能使用 UDP DNS 作为 remote DNS，如果您在程序中看到 remote DNS 是一个 IP 如 1.1.1.1 或类似 udp://1.1.1.1 的东西，您会遇到问题。请务必使用以下格式：
>
> `https://IP/dns-query` 如 `https://8.8.8.8/dns-query` , `https://94.140.14.14/dns-query` ....
> 
> `https://doh/dns-query` 如 `https://dns.google/dns-query` , `https://cloudflare-dns.com/dns-query` ....
> 
> `tcp://IP` 如 `tcp://8.8.8.8` , `tcp://94.140.14.14` ....
> 
> `tls://IP` 如 `tls://dns.google` , `tls://cloudflare-dns.com` ....
<br>

### 1-9- 选择端口

从这部分您可以选择您需要的端口。其中一些会给您 TLS 配置，这更安全，但当 TLS 和 Fragment 受到干扰时，这些配置会连接。
> [!CAUTION]
> 请注意，要使用非 TLS 配置，您必须使用 Workers 方式部署。否则，http 端口不会在面板中显示，因为它们不适用于 Pages 方式。

> [!TIP]
> 非 TLS 配置只会添加到普通订阅中。
<br><br>

## 2- Fragment 设置

<p align="center">
  <img src="assets/images/Fragment-Settings.jpg">
</p>

默认设置：
   

>`Length: 100-200`
>
>`Interval: 1-1`
>
>`Packets: tlshello`

现在您可以设置参数并点击 Apply。这样 fragment 配置就会使用您的设置提供。

> [!NOTE]
> 您可以更改一个参数或同时更改所有参数。任何更改都会保存，下次不需要重新设置。

> [!IMPORTANT]
> fragment 值有最大限制，Length 不能超过 500，Interval 不能超过 30。
<br><br>

## 3- WARP 通用设置

<p align="center">
  <img src="assets/images/Warp-Settings.jpg">
</p>

在 Warp 和 Warp Pro 订阅之间共享，并应用于两者，有两个主要部分：

1. 我们有 Endpoints，这些对 Warp 来说就像 VLESS 的清洁 IP。它们既应用于 Warp 配置也应用于 WoW。我还提供了一个扫描器脚本，您可以在 Android 的 Termux 或 Linux 上运行它并放入面板，当然这不是 100% 可靠的，您还需要测试。

> [!CAUTION]
> 请注意，Endpoint 必须以 IP:Port 或 Domain:port 的格式输入，并且必须逐行输入。
> 
> 要输入 IPv6，必须将其放在 [] 中。请看下面的例子：
> 
> 123.45.8.6:1701  engage.cloudflareclient:2408 [2a06:98c1:3120::3]:939

2. 您也可以为 Warp 配置单独启用 Fake DNS，它有助于提高 DNS 速度，但请注意它可能与某些程序不兼容或影响系统 DNS，因此如果您不确切知道它是什么，最好不要启用它。
3. 如果您的运营商不支持 IPv6，您可以禁用它以优化 DNS 和代理性能。
4. Warp Configs 部分是这样的：如果您点击 Update，它会从 Cloudflare 获取新的 warp 配置并保存，如果您更新订阅，您会看到它们已经改变。但这部分与连接速度完全无关。
5. Best Ping 检查时间。在 Warp 和 Warp PRO 订阅中，我们有 Best Ping。默认情况下，它每 30 秒找到最佳配置或 Endpoint 并连接到它，但如果网速不好，而您正在观看视频或玩游戏，这 30 秒可能会造成问题，您可能会经历延迟。您可以从这里设置时间，最少可以是 10 秒，最多 90 秒。
<br><br>

## 4- WARP PRO 设置

<p align="center">
  <img src="assets/images/Warp-Pro-Settings.jpg">
</p>

这只适用于 WARP PRO 订阅，我在上面解释过它是什么。它有几个部分：

1. 第一个是 UDP noise，这是 Xray 内核最近添加的功能，可以与 v2rayNG 和 v2rayN 程序一起使用。您添加的每个噪声可以有四种模式：Base64、String、hex 和 random。您还可以在 Noise Count 部分指定要向配置添加多少个噪声。请注意，您可以定义多个不同类型的噪声，它们不需要都相同。Packet 中输入的值必须符合 Mode，Base64 需要一个真实的 Base64 值，String 可以是任何字符串，Random 只需要输入字符串长度，hex 需要一个 hex 字符串。例如：

> Base64: NTUyMjU0NjItN2I4MC00YWFmLWE3NDgtNjZiYWZiNjlmNmQ2

> String: salamchetori123

> Random: 10-30

> Hex: 01d800f9373b2c418713aafde43021004ac3b89f

> [!TIP]
> 您可以[从这里](https://onlinebase64tools.com/base64-encode)将任意文本转换为 Base64。
> 
> 您也可以[从这里](https://onlinetools.com/random/generate-random-hexadecimal-numbers)生成一个 Hex。

您可以从 Warp Pro 订阅获取此部分的配置。

2. 第一个是 Hiddify Noise Mode，它决定在什么模式下生成噪声（假包）。Hiddify 团队的 Singbox 内核支持这些模式：
   
- m1 到 m6 模式
- h_HEX 模式，其中 HEX 可以是 00 到 FF 之间，例如 h_0a、h_f9 和 h_9c 等
- g_HEX_HEX_HEX 模式，其中 HEX 也像上面一样，例如 g_0a_ff_9c
  
3. 第二个是 NikaNG Noise Mode，它有这些模式：

- none 模式意味着不应用任何噪声，实际上就是普通的 warp 配置。
- quic 模式是开发团队为伊朗情况推荐的。
- random 模式会随机生成噪声。
- 最后一个模式，您可以使用自己的自定义 HEX 字符串，例如 fe09ad5600bc...
  
4. Noise Count 部分是发送的这些假包或噪声的数量。例如，面板默认说发送 10 到 15 个。
5. 接下来是 Noise size，顾名思义是这些包的长度。
6. 最后的 Noise Delay 是这些噪声之间的间隔。

7. 这部分是为 Amnezia、WG Tunnel 和 Clash 程序准备的，因为它们都遵循相同的设置。像前面的部分一样，您指定噪声数量和最小最大大小。在 Warp Pro sub 表中，除了应用程序订阅外，您还可以下载 Amnezia 和 WG Tunnel 配置的 zip 文件。
 
这些设置会随着时间通过每个运营商的试错逐渐确定。
<br><br>

## 5- 路由规则设置

<p align="center">
  <img src="assets/images/Routing_rules.jpg">
</p>

这部分是为了让配置（除了 Normal 订阅提供的那些）能够：
1. 直接连接 LAN。例如，对 127.0.0.1 或 192.168.1.1 的访问是直接的。
2. 直接连接中国网站而不使用 VPN（访问某些网站，特别是支付网关时不需要断开连接）
3. 直接访问中国网站。
4. 直接访问俄罗斯网站。
5. 阻止约 80% 的中国和国外广告。
6. 阻止色情网站。
7. 阻止 QUIC 连接（由于网络不稳定）

默认情况下，此部分是禁用的，因为您需要先确保程序的 Geo asset 是最新的。
> [!CAUTION]
> 如果您启用了它但 VPN 无法连接，唯一的原因是 Geo asset 未更新。从 v2rayNG 程序菜单进入 Geo asset files 部分，点击云或下载图标进行更新，如果更新失败，将无法连接。如果无论如何都无法更新，请从以下两个链接下载文件，然后不要点击更新，而是点击添加按钮并导入这两个文件：
> 
>[geoip.dat](https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat)
> 
>[geosite.dat](https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat) 

### 5-1- 自定义规则设置

如果您需要上面部分中没有的设置，您可以使用这部分，例如，假设您已经阻止了色情内容，但有一个特定的色情网站不在列表中没有被阻止，您可以在这里添加。
> [!TIP]
> 您可以在这部分使用三种不同的格式：
> 
> 1- 域名如 `google.com`，但请注意，如果您输入 google.com，所有子域名也会被阻止或直连，如 drive.google.com 或 mail.google.com
> 
> 2- 您可以放置单个 IPv4 或 IPv6，请注意 IPv6 必须像面板其他部分一样以这种格式输入：`[2606:4700::6810:85e5]`
> 
> 3- 您可以放置一个 IP 范围，如 `192.168.1.1`/32 或 128/`[2606:4700::6810:85e5]`
 