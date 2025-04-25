<h1 align="center">通过 Cloudflare Pages 上传进行安装</h1>

## 前言
你可能知道，在 Cloudflare 上使用 Worker 和 Pages 两种方式来构建代理。有趣的是，更常用的 Worker 方法有一个限制，即每天只允许发送不超过十万个请求。当然，这个限制对于 2-3 个人使用来说是足够的。为了绕路 Worker 方法的这个限制，我们可以将一个域名连接到 Worker 上，这样就可以实现无限制使用（这似乎是 Cloudflare 的一个 bug）。但是 Pages 没有这个限制（最近有报告称这种方法可能也会有限制，请自行测试）。不过，因为我们在这种方法中使用了 Pages functions 功能，你仍然会收到一封关于 10 万请求容量已满的电子邮件，这与 Worker 类似。即使使用个人域名，你也会收到这封邮件。**但是，经验表明，你的服务最终不会被中断。**

## 第一步 - Cloudflare Pages
如果你没有 Cloudflare 账户，请[点击这里](https://dash.cloudflare.com/sign-up)创建一个（这里只需要一个电子邮件地址进行注册，考虑到 Cloudflare 的敏感性，建议使用可靠的电子邮件，如 Gmail）。

从[这里](https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest/download/worker.zip)下载 Worker 的 zip 文件。

现在，在你的 Cloudflare 账户中，从页面左侧菜单进入 `Workers and Pages` 部分，点击 `Create Application`，然后选择 `Pages`：

<p align="center">
  <img src="assets/images/Pages_application.jpg">
</p>

在这里点击 `Upload assets`，然后进入下一步。
有一个 `Project Name`，这将是你的面板域名。输入一个你喜欢的名字，并且不要包含 bpb 字样，否则你的账户可能会被 Cloudflare 识别。点击 `Create Project`。在这一步，你需要上传你下载的 Zip 文件。点击 `Select from computer`，然后选择 Upload zip 并上传文件，最后点击 `Deploy site`，然后 `Continue to project`。

好的，你的项目已经创建完成，但尚不可用。从同一个 `Deployment` 页面，在 `Production` 部分点击 `visit`，你会看到一个错误，提示你必须首先配置 UUID 和 Trojan Password。页面上有一个链接，在浏览器中打开它，保留该页面，下一步会需要它。

<p align="center">
  <img src="assets/images/Generate_secrets.jpg">
</p>

## 第三步 - 创建 Cloudflare KV 并设置 UUID 和 Trojan Pass
从左侧菜单进入 KV 部分：

<p align="center">
  <img src="assets/images/Nav_dash_kv.jpg">
</p>

点击 `Create`，给它起一个你喜欢的名字，然后点击 Add。

回到 `Workers and Pages` 部分，进入你创建的 Pages 项目。参照下图，进入 `Settings` 部分：

<p align="center">
  <img src="assets/images/Settings_functions.jpg">
</p>

在这里，像 Worker 一样找到页面上的 `Bindings` 部分，点击 `Add` 并选择 `KV Namespace`。`Variable name` 必须是 `kv`（就像我写的一样），`KV namespace` 选择你在第二步创建的那个 KV，然后点击 `save`。

<p align="center">
  <img src="assets/images/Pages_bind_kv.jpg">
</p>

好的，我们 KV 的工作完成了。

在同一个 `Settings` 部分，你会看到 `Variables and Secrets`。点击 `Add variable`，在第一个框中输入 `UUID`（大写），你可以从上一步的链接中获取 UUID，复制到 Value 部分，然后点击 `Save`。再点击一次 `Add variable`，在第一个框中输入 `TR_PASS`（大写），你可以从上一步的链接中获取 Trojan 密码，复制到 Value 部分，然后点击 `Save`。

好的，现在点击页面顶部的 `Create deployment`，并像之前一样再次上传同一个 zip 文件。

现在你可以回到 `Deployments` 页面，在 `Production` 部分点击 `visit`，然后在末尾添加一个 `/panel` 并进入面板。
配置和技巧的说明都在[主要教程](configuration_fa.md)中。
安装已经完成，下面的说明可能对大多数人来说不是必需的！
<br><br>
<h1 align="center">高级设置（可选）</h1>

## 1- 固定代理 IP：

我们有一个问题，就是这个代码默认使用大量代理 IP。每次连接到 Cloudflare 后面的站点（包含互联网的很大一部分）时，它会随机选择一个新的 IP，导致你的 IP 持续变化。这种 IP 变化对某些人来说可能是有问题的（尤其是交易员）。从版本 2.3.5 开始，你可以通过面板本身来更改代理 IP，方法是应用更改，然后更新订阅，就好了。但我建议使用下面解释的方法，因为：

> [!CAUTION]
> 如果你通过面板应用代理 IP 并且该 IP 失效，你必须替换一个 IP 并更新订阅。这意味着如果你捐赠了配置并且更改了代理 IP，这对用户就没有用了，因为用户没有订阅来更新配置。因此，建议仅在个人使用时采用此方法。但是，下面介绍的第二种方法的优点是可以通过 Cloudflare 控制面板完成，无需更新配置。
<br><br>

要更改代理 IP，当你进入项目后，在 `Settings` 部分打开 `Environment variables`：

<p align="center">
  <img src="assets/images/Pages_env_vars.jpg">
</p>

在这里你需要指定值。每次点击 `Add`，输入一个变量并点击 `Save`：

<p align="center">
  <img src="assets/images/Pages_add_variables.jpg">
</p>

现在点击 `Add variable`，在第一个框中输入 `PROXY_IP`（大写），你可以从下面的链接获取 IP。打开这些链接会显示一些 IP，你可以检查它们的国家并选择一个或多个：

>[Proxy IP](https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/)

<p align="center">
  <img src="assets/images/Proxy_ips.jpg">
</p>

> [!TIP]
> 如果你想有多个代理 IP，可以用逗号分隔输入，例如 `151.213.181.145`,`5.163.51.41`,`bpb.yousef.isegaro.com`

好的，现在点击页面顶部的 `Create deployment`，并像第一次一样再次上传同一个 zip 文件，更改将生效。
<br><br>

## 2- 更改 Fallback 域名：

你肯定注意到，当你打开主要的 Pages 域名时，它会进入 Cloudflare 的速度测试网站。要更改它，可以按照设置代理 IP 的步骤进行，只是当你点击 `Add variable` 时，这个变量名必须是 `FALLBACK`。它的值应该是一个不带 https:// 或 http:// 的自定义域名，例如 www.speedtest.net 或 npmjs.org。
<br><br>

## 3- 更改获取订阅的路径：

默认情况下，获取订阅链接的路径与用于 VLESS 的 UUID 相同。但是，如果你捐赠了配置，用户可以从配置中获取 UUID，从而通过该路径访问你的订阅并获取你所有的配置。当然，我认为当我们捐赠时就不应该担心使用更多，但无论如何，可以更改路径，这样用户就无法访问订阅了。步骤与第 1 节和第 2 节完全相同，不同之处在于变量名是 `SUB_PATH`。如果你进入 secrets/ 路径或 Secrets generator 的页面，你会看到一个 `Random Subscription URI path` 选项，它为你生成了一个路径。你可以使用它，或者设置一个你喜欢的值（注意允许的字符）。
<br><br>

## 4- 将域名连接到 Pages：

为此，你需要前往 Cloudflare 控制面板，并从 `Workers and Pages` 部分选择你的面板。进入 `Custom domains` 部分，点击 `set up a custom domain`。这里要求你输入一个 Domain（注意，你必须提前购买一个域名并在同一个账户上激活，这里不介绍如何操作）。现在假设你有一个域名叫 bpb.com，在 Domain 部分你可以输入主域名或一个你喜欢的子域名，例如 xyz.bpb.com。然后点击 `Continue`，在下一页点击 `Activate domain`。Cloudflare 会自动将 Pages 连接到你的域名（这个过程需要一些时间，Cloudflare 自己说可能需要长达 48 小时）。好的，在这段时间之后，你就可以通过地址 `https://xyz.bpb.com/panel` 进入你的面板并获取新的订阅。
<br><br>

<h1 align="center">更新面板</h1>

要更新面板，像安装时一样，从[这里](https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest/download/worker.zip)下载新的 zip 文件。在你的 Cloudflare 账户中，进入 `Workers and Pages` 部分，进入你创建的 Pages 项目，点击页面顶部的 `Create deployment`，并像第一次一样再次上传新的 zip 文件，就好了。
