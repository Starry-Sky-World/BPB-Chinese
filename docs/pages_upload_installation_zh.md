<h1 align="center">通过 Cloudflare Pages 上传安装</h1>

## 简介
您可能知道在 Cloudflare 上创建代理有两种方法：Worker 和 Pages。有趣的是，更常用的 Worker 方法有一个限制，每天只允许发送 100,000 个请求。当然，这个限制对于 2-3 人的使用是足够的。为了绕过这个限制，在 Worker 方法中，我们会将域名连接到 Worker，这样就变成无限制了（这似乎是 Cloudflare 的一个漏洞）。但 Pages 没有这个限制（最近有报告说这种方法也会有限制，您需要自己测试）。不过，由于我们在这种方法中使用了 Pages functions 功能，您仍然会收到类似 Worker 的邮件，通知您已达到 100k 使用限制。在这种方法中，即使您使用自定义域名，也会收到这封邮件。**但实践表明，您的服务不会被中断。**

## 第一步 - Cloudflare Pages
如果您没有 Cloudflare 账号，请从[这里](https://dash.cloudflare.com/sign-up)创建一个账号（这里只需要一个邮箱来注册，由于 Cloudflare 的敏感性，建议使用 Gmail 等可靠的邮箱）。

从[这里](https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest/download/worker.zip)下载 Worker 的 zip 文件。

现在在您的 Cloudflare 账号中，从左侧菜单进入 `Workers and Pages` 部分，点击 `Create Application` 并选择 `Pages`：

<p align="center">
  <img src="assets/images/Pages_application.jpg">
</p>

这里点击 `Upload assets` 进入下一步。
有一个 `Project Name` 字段，这将成为您面板的域名，请输入一个不包含 bpb 的自定义名称，否则您的账号可能会被 Cloudflare 识别。点击 `Create Project`。在这一步，您需要上传之前下载的 Zip 文件，点击 `Select from computer` 然后选择 Upload zip，上传文件后点击 `Deploy site` 最后点击 `Continue to project`。

好了，您的项目已创建但还不能使用。从同一个 `Deployment` 页面的 `Production` 部分点击 `visit`，您会看到错误提示需要先设置 UUID 和 Trojan 密码。有一个链接，在浏览器中打开它并保留，下一步会用到。

<p align="center">
  <img src="assets/images/Generate_secrets.jpg">
</p>

## 第三步 - 创建 Cloudflare KV 并设置 UUID 和 Trojan 密码
从左侧菜单进入 KV 部分：

<p align="center">
  <img src="assets/images/Nav_dash_kv.jpg">
</p>

点击 `Create` 并输入一个自定义名称，然后点击 Add。

返回 `Workers and Pages` 部分并进入您创建的 Pages 项目，按照下图进入 `Settings`：

<p align="center">
  <img src="assets/images/Settings_functions.jpg">
</p>

这里和 Worker 一样，在页面中找到 `Bindings` 部分，点击 `Add` 并选择 `KV Namespace`，`Variable name` 必须是 `kv`（就像我写的那样），在 `KV namespace` 中选择您在第二步创建的 KV，然后点击 `save`。

<p align="center">
  <img src="assets/images/Pages_bind_kv.jpg">
</p>

好了，KV 的工作完成了。

在同一个 `Settings` 部分，您会看到 `Variables and Secrets` 部分。点击 `Add variable`，第一个框中输入大写的 `UUID`，UUID 可以从上一步的链接中获取并复制到 Value 框中，然后点击 `Save`。再次点击 `Add variable`，第一个框中输入大写的 `TR_PASS`，Trojan 密码也可以从上一步的链接中获取并复制到 Value 框中，然后点击 `Save`。

现在从页面顶部点击 `Create deployment` 并再次上传同样的 zip 文件。

现在您可以返回 `Deployments` 页面，从 `Production` 部分点击 `visit`，然后在末尾添加 `panel/` 进入面板。
设置和注意事项的教程在[主教程](configuration_zh.md)中。
安装到此结束，以下说明可能不是所有人都需要！
<br><br>
<h1 align="center">高级设置（可选）</h1>

## 1- 固定 Proxy IP：

我们有一个问题，这个代码默认使用大量 Proxy IP，每次连接到 Cloudflare 后端的网站（包括大部分网站）时都会随机选择一个新的 IP，导致您的 IP 会不断变化。这种 IP 变化可能会给某些用户带来问题（特别是交易者）。从版本 2.3.5 开始，您可以通过面板本身更改 Proxy IP，只需应用更改并更新订阅即可。但我建议使用下面解释的方法，因为：

> [!CAUTION]
> 如果通过面板设置 Proxy IP，当该 IP 失效时，您需要替换一个新的 IP 并更新订阅。这意味着如果您已经分享了配置，更改 Proxy IP 就没有意义了，因为用户没有订阅来更新配置。因此建议这种方法只用于个人使用。而下面要说的第二种方法的好处是通过 Cloudflare 仪表板完成，不需要更新配置。
<br><br>

要更改 Proxy IP，进入项目后从 `Settings` 部分打开 `Environment variables`：

<p align="center">
  <img src="assets/images/Pages_env_vars.jpg">
</p>

在这里您需要指定值。每次点击 `Add` 输入一个并点击 `Save`：

<p align="center">
  <img src="assets/images/Pages_add_variables.jpg">
</p>

现在点击 `Add variable`，第一个框中输入大写的 `PROXY_IP`，IP 可以从下面的链接获取，打开后会显示一些 IP，您可以检查它们的国家并选择一个或多个：

>[Proxy IP](https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/)

<p align="center">
  <img src="assets/images/Proxy_ips.jpg">
</p>

> [!TIP]
> 如果您想要多个 Proxy IP，可以用逗号分隔输入，例如 `151.213.181.145`,`5.163.51.41`,`bpb.yousef.isegaro.com`

现在从页面顶部点击 `Create deployment` 并再次像开始时那样上传同样的 zip 文件，更改就会生效。
<br><br>

## 2- 更改 Fallback 域名：

您可能注意到当打开 Pages 主域名时会进入 Cloudflare 速度测试网站。要更改它，需要按照更改 Proxy IP 的步骤操作，只是当点击 `Add variable` 时变量名必须是 `FALLBACK`，值应该是一个不带 https:// 或 http:// 的域名。例如 www.speedtest.net 或 npmjs.org。
<br><br>

## 3- 更改订阅获取路径：

默认情况下，订阅链接的路径与 VLESS 使用的 UUID 相同。但如果您分享配置，用户可以从配置中提取 UUID 并通过该方式访问您的订阅，从而访问您的所有配置。虽然在分享时我们可能不应该担心过度使用，但仍然可以更改路径使用户无法访问订阅。步骤与第 1 和第 2 部分相同，只是变量名是 `SUB_PATH`。如果您访问 secrets/ 页面（即 Secrets 生成器页面），您会看到添加了一个 `Random Subscription URI path` 选项，它会为您生成一个路径，您可以使用它或设置自己想要的值（注意使用允许的字符）。
<br><br>

## 4- 将域名连接到 Pages：

要做到这一点，进入 Cloudflare 仪表板，从 `Workers and Pages` 部分选择您的面板。进入 `Custom domains` 部分并点击 `set up a custom domain`。这里会要求您输入一个域名（注意您必须先购买一个域名并在同一账户上激活它，这里不介绍如何操作）。假设您有一个域名叫 bpb.com，在 Domain 部分您可以输入域名本身或一个自定义子域名。例如 xyz.bpb.com，然后点击 `Continue` 在下一页点击 `Activate domain`。Cloudflare 会自动将 Pages 连接到您的域名（这需要一些时间，Cloudflare 说可能需要长达 48 小时）。好了，之后您就可以通过 `https://xyz.bpb.com/panel` 访问您的面板并获取新的订阅了。
<br><br>

<h1 align="center">更新面板</h1>

要更新，和创建时一样从[这里](https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest/download/worker.zip)下载新的 zip 文件。在您的 Cloudflare 账号中进入 `Workers and Pages` 并进入您创建的 Pages 项目，从页面顶部点击 `Create deployment` 并再次像开始时那样上传新的 zip 文件即可。 