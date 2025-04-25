# 通过 Cloudflare Workers 安装

首先从 [Starry-Sky-World/BPB-Chinese](https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest/download/worker.js) 下载 Worker 代码。

然后编辑您创建的 Worker，点击 Edit code，从左侧边栏删除 worker.js 文件，然后上传新文件。如果出错，也请删除 package-lock.json 文件。由于代码很多，用手机复制粘贴非常困难，请按照下图进行上传。在手机上打开侧边菜单，按住并上传。

<p align="center">
  <img src="assets/images/Worker_mobile_upload.jpg">
</p>

最后，`Save and Deploy` Worker。

> [!TIP]
> 请注意，面板的更新步骤完全相同，删除旧文件，上传新文件并部署即可。之前的设置将保留，只有面板会更新。
<br>

现在从这里返回到 Worker 仪表板并按照以下步骤操作：

<p align="center">
  <img src="assets/images/Navigate_worker_dash.jpg">
</p>

首先从仪表板顶部点击 `Visit`，您会看到一个错误，提示必须先设置 UUID 和 Trojan Password，会有一个链接，在浏览器中打开并保留，下一步会用到。

<p align="center">
  <img src="assets/images/Generate_secrets.jpg">
</p>

从此处进入 `KV` 页面：

<p align="center">
  <img src="assets/images/Nav_dash_kv.jpg">
</p>

在 KV 部分点击 `Create`，输入一个任意名称，例如 Test，然后点击 `Add`。

再次从左侧菜单转到 `Workers & Pages` 部分，打开您创建的 Worker，进入 `Settings` 部分并找到 `Bindings`。点击 `Add` 并选择 `KV Namespace`，如下所示，从底部下拉菜单中选择您创建的 KV（在示例中是 Test）。重要的是上面的下拉菜单，必须将其设置为 `kv`，然后点击 `Deploy`。
<p align="center">
  <img src="assets/images/Bind_kv.jpg">
</p>

在同一个 `Settings` 部分，您会看到 `Variables and Secrets`。点击 `Add variable`，第一个字段输入大写的 `UUID`，您可以从您打开的链接中复制 UUID 到 Value 字段，然后点击 `Deploy`。再次点击 `Add variable`，第一个字段输入大写的 `TR_PASS`，您可以从同一个链接中获取 Trojan 密码并复制到 Value 字段，然后点击 `Deploy`。

例如，假设您的 Worker 域名是 worker-polished-leaf-d022.workers.dev，在其末尾添加 `panel/` 即可进入面板。例如：

>`https://worker-polished-leaf-d022.workers.dev/panel`

它会要求您设置新密码并登录，然后就完成了。
安装已完成，接下来的说明可能对大多数人来说不是必需的。
关于设置和注意事项的教程可以在[主教程](configuration_fa.md)中找到。
<br><br>
高级设置（可选）

## 1- 固定 Proxy IP：

我们有一个问题是，此代码默认使用大量随机的 Proxy IP，每次连接到在 Cloudflare 后面的网站（包括大部分网络内容）时都会选择一个新的随机 IP，导致您的 IP 会不断变化。对于某些用户（特别是交易者），这种 IP 变化可能会成为问题。从 2.3.5 版本开始，您可以通过面板本身更改 Proxy IP，操作完成后更新订阅即可。但是，我建议使用下面解释的方法，因为：

> [!CAUTION]
> 如果您通过面板应用 Proxy IP 并且该 IP 失效，您必须更换一个 IP 并更新订阅。这意味着如果您已经提供了分享配置，并且更改了 Proxy IP，那么就没用了，因为用户没有订阅来更新配置。因此，建议仅将此方法用于个人使用。但是，下面解释的第二种方法的优点是通过 Cloudflare 仪表板完成，无需更新配置。
<br><br>

要更改 Proxy IP，从左侧菜单转到 `Workers & Pages` 部分，打开您创建的 Worker，进入 `Settings` 部分并找到 `Variables and Secrets`：

<p align="center">
  <img src="assets/images/Workers_variables.jpg">
</p>

在这里需要指定值。每次点击 `Add`，输入一个值并 `Deploy`：

<p align="center">
  <img src="assets/images/Workers_add_variables.jpg">
</p>

现在点击 `Add variable`，第一个字段输入大写的 `PROXY_IP`。您也可以从下面的链接获取 IP。打开这些链接，会显示一些 IP，您可以检查它们的国家并选择一个或多个：

>[Proxy IP](https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/)

<p align="center">
  <img src="assets/images/Proxy_ips.jpg">
</p>

> [!TIP]
> 如果想使用多个 Proxy IP，可以用逗号分隔输入，例如 `151.213.181.145`,`5.163.51.41`,`bpb.yousef.isegaro.com`

<br><br>

## 2- 更改 Fallback 域名：

您一定已经注意到，打开 Pages 的主域名时会进入 Cloudflare 的速度测试网站。要更改它，操作步骤与设置 Proxy IP 类似，只是这个变量的名称在点击 `Add variable` 时必须是 `FALLBACK`，值是一个没有 https:// 或 http:// 的任意域名。例如 www.speedtest.net 或 npmjs.org。
<br><br>

## 3- 更改接收订阅的路径：

默认情况下，接收订阅链接的路径与 VLESS 使用的 UUID 相同。但是如果分享配置，用户可以从配置中提取 UUID 并通过它导入您的订阅，从而访问您的所有配置。当然，当分享时，我认为就不必担心过度使用，但无论如何，有能力更改路径，这样用户就无法访问订阅。步骤与第 1 和第 2 部分完全相同，不同之处在于变量名称是 `SUB_PATH`。如果您转到 secrets/ 或 Secrets 生成器页面，您会看到添加了一个 `Random Subscription URI path` 选项，它会为您生成一个路径，您可以使用它或设置一个任意值（考虑到允许的字符）。
<br><br>

## 4- 连接域名到 Workers：

要执行此操作，请转到 Cloudflare 仪表板，在 `Workers and Pages` 部分选择您的 Worker。转到 `Settings` 部分，您会看到最上方的 `Domains & Routes`，点击 `Add +` 并选择 `Custom domain`。在这里会要求您输入一个域名（请注意，您之前必须已经购买了一个域名并在同一个账户上激活，此处不介绍教程）。现在假设您有一个域名 bpb.com，在 Domain 部分可以输入整个域名或一个任意的子域名。例如 xyz.bpb.com。然后点击 `Add domain`。Cloudflare 会自动将 Worker 连接到您的域名（这需要一些时间，Cloudflare 自己说可能需要长达 24 小时）。
之后必须再次点击 `Add +` 并选择 `Route`，Zone 部分选择您自己的域名，Route 部分必须这样输入新域名：
> `*bpb.com/*`

好了，之后您就可以使用 `https://xyz.bpb.com/panel` 地址进入您的面板并获取新的订阅。

> [!TIP]
> 1- 如果将域名连接到 Worker，流量将像 Pages 一样变为无限。
>
> 2- Worker 本身支持非 TLS 端口，如 80 和 8080 等，并在面板中显示，但如果连接了域名，这些端口将不再工作，面板也不会显示它们。
