<h1 align="center">通过 Cloudflare Workers 安装</h1>

首先从[这里](https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest/download/worker.js)下载 Worker 代码。

然后点击您创建的 Worker 的 Edit code，从左侧边栏删除 `worker.js` 文件并上传新文件。如果报错，也删除 package-lock.json 文件。由于代码量很大，在手机上复制粘贴比较困难，请参照下图上传。在手机上，打开侧边菜单，长按并上传。

<p align="center">
  <img src="assets/images/Worker_mobile_upload.jpg">
</p>

最后点击 `Save and Deploy` 部署 Worker。

> [!TIP]
> 请注意，面板更新的步骤也是一样的，删除旧文件，上传新文件并部署。之前的设置会保留，只更新面板。
<br>

现在返回 Worker 仪表板，按照以下步骤操作：

<p align="center">
  <img src="assets/images/Navigate_worker_dash.jpg">
</p>

首先点击仪表板顶部的 `Visit`，您会看到错误提示需要先设置 UUID 和 Trojan 密码。有一个链接，在浏览器中打开它并保留，下一步会用到。

<p align="center">
  <img src="assets/images/Generate_secrets.jpg">
</p>

从这里进入 `KV` 页面：

<p align="center">
  <img src="assets/images/Nav_dash_kv.jpg">
</p>

在 KV 部分点击 `Create`，输入一个自定义名称（例如 Test）并点击 `Add`。

再次从左侧菜单进入 `Workers & Pages`，打开您创建的 Worker，进入 `Settings` 并找到 `Bindings`。点击 `Add` 并选择 `KV Namespace`，如下图所示从下拉菜单中选择您创建的 KV（在示例中是 Test）。重要的是上面的下拉菜单，其值必须设置为 `kv` 并点击 `Deploy`。
<p align="center">
  <img src="assets/images/Bind_kv.jpg">
</p>

在同一个 `Settings` 部分，您会看到 `Variables and Secrets` 部分，点击 `Add variable`，第一个框中输入大写的 `UUID`，UUID 可以从您之前打开的链接中复制到 Value 框中，然后点击 `Deploy`。再次点击 `Add variable`，第一个框中输入大写的 `TR_PASS`，Trojan 密码也可以从同一个链接获取并复制到 Value 框中，然后点击 `Deploy`。

例如，假设您的 Worker 域名是 worker-polished-leaf-d022.workers.dev，在末尾添加 `panel/` 并进入面板。例如：

>`https://worker-polished-leaf-d022.workers.dev/panel`

系统会要求您设置新密码并登录，就这么简单。
安装到此结束，以下说明可能不是所有人都需要。
设置和注意事项的教程在[主教程](configuration_zh.md)中。
<br><br>
<h1 align="center">高级设置（可选）</h1>

## 1- 固定 Proxy IP：

我们有一个问题，这个代码默认使用大量 Proxy IP，每次连接到 Cloudflare 后端的网站（包括大部分网站）时都会随机选择一个新的 IP，导致您的 IP 会不断变化。这种 IP 变化可能会给某些用户带来问题（特别是交易者）。从版本 2.3.5 开始，您可以通过面板本身更改 Proxy IP，只需应用更改并更新订阅即可。但我建议使用下面解释的方法，因为：

> [!CAUTION]
> 如果通过面板设置 Proxy IP，当该 IP 失效时，您需要替换一个新的 IP 并更新订阅。这意味着如果您已经分享了配置，更改 Proxy IP 就没有意义了，因为用户没有订阅来更新配置。因此建议这种方法只用于个人使用。而下面要说的第二种方法的好处是通过 Cloudflare 仪表板完成，不需要更新配置。
<br><br>

要更改 Proxy IP，从左侧菜单进入 `Workers & Pages`，打开您创建的 Worker，进入 `Settings` 并找到 `Variables and Secrets`：

<p align="center">
  <img src="assets/images/Workers_variables.jpg">
</p>

在这里您需要指定值。每次点击 `Add` 输入一个并点击 `Deploy`：

<p align="center">
  <img src="assets/images/Workers_add_variables.jpg">
</p>

现在点击 `Add variable`，第一个框中输入大写的 `PROXY_IP`，IP 可以从下面的链接获取，打开后会显示一些 IP，您可以检查它们的国家并选择一个或多个：

>[Proxy IP](https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/)

<p align="center">
  <img src="assets/images/Proxy_ips.jpg">
</p>

> [!TIP]
> 如果您想要多个 Proxy IP，可以用逗号分隔输入，例如 `151.213.181.145`,`5.163.51.41`,`bpb.yousef.isegaro.com`


<br><br>

## 2- 更改 Fallback 域名：

您可能注意到当打开 Pages 主域名时会进入 Cloudflare 速度测试网站。要更改它，需要按照更改 Proxy IP 的步骤操作，只是当点击 `Add variable` 时变量名必须是 `FALLBACK`，值应该是一个不带 https:// 或 http:// 的域名。例如 www.speedtest.net 或 npmjs.org。
<br><br>

## 3- 更改订阅获取路径：

默认情况下，订阅链接的路径与 VLESS 使用的 UUID 相同。但如果您分享配置，用户可以从配置中提取 UUID 并通过该方式访问您的订阅，从而访问您的所有配置。虽然在分享时我们可能不应该担心过度使用，但仍然可以更改路径使用户无法访问订阅。步骤与第 1 和第 2 部分相同，只是变量名是 `SUB_PATH`。如果您访问 secrets/ 页面（即 Secrets 生成器页面），您会看到添加了一个 `Random Subscription URI path` 选项，它会为您生成一个路径，您可以使用它或设置自己想要的值（注意使用允许的字符）。
<br><br>

## 4- 将域名连接到 Workers：

要做到这一点，进入 Cloudflare 仪表板，从 `Workers and Pages` 部分选择您的 Worker。进入 `Settings` 部分，您会在开头看到 `Domains & Routes`，点击 `Add +` 并选择 `Custom domain`。这里会要求您输入一个域名（注意您必须先购买一个域名并在同一账户上激活它，这里不介绍如何操作）。假设您有一个域名叫 bpb.com，在 Domain 部分您可以输入域名本身或一个自定义子域名。例如 xyz.bpb.com。然后点击 `Add domain`。Cloudflare 会自动将 Worker 连接到您的域名（这需要一些时间，Cloudflare 说可能需要长达 24 小时）。
然后您需要再次点击 `Add +` 并这次选择 `Route`，在 Zone 部分选择您的域名，在 Route 部分您需要这样输入新域名：
> `*bpb.com/*`

好了，之后您就可以通过 `https://xyz.bpb.com/panel` 访问您的面板并获取新的订阅了。

> [!TIP]
> 1- 如果您将域名连接到 Worker，就像 Pages 一样流量将变为无限制。
> 
> 2- Worker 本身支持非 TLS 端口如 80 和 8080 等，并在面板中显示，但如果连接了域名，这些端口将不再工作，面板也不会显示它们。 