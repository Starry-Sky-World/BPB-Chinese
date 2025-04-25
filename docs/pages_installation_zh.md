# 安装通过 Cloudflare Pages 上传方式

## 引言
您可能知道，在 Cloudflare 上构建代理有两种常用的方法：Worker 和 Pages。值得注意的是，更常见的方法 Worker 有一个限制，即每天不允许发送超过十万个请求。当然，这个限制对于 2-3 个人使用来说是足够的。为了绕过 Worker 方法的这个限制，我们通常会将一个域名连接到 Worker，这样就可以实现无限使用（这似乎是 Cloudflare 的一个 bug）。然而，Pages 没有这个限制（最近有报道称这种方法也可能有限制，请自行测试）。当然，因为我们在Pages方法中使用了 Pages functions 的功能，所以仍然会收到一封邮件，通知您已达到100k的容量限制，即使使用个人域名也会收到这封邮件。**但是在实践中，您的服务不会中断。**

## 第一步 - Cloudflare Pages
如果您还没有 Cloudflare 账户，请从[此处](https://dash.cloudflare.com/sign-up)创建一个账户（这里只需要一个电子邮件地址进行注册；考虑到 Cloudflare 的敏感性，建议使用可靠的电子邮件，如 Gmail）。

从 [Starry-Sky-World/BPB-Chinese](https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest/download/worker.zip) 下载 Worker 的 Zip 文件。

现在，在您的 Cloudflare 账户中，从左侧菜单进入 `Workers and Pages` 部分，点击 `Create Application` 并选择 `Pages`：

<p align="center">
  <img src="assets/images/Pages_application.jpg">
</p>

点击 `Upload assets` 进入下一步。
会有一个 `Project Name`，这将成为您面板的域名，请起一个任意的名称，不要包含 bpb 字样，否则您的账户可能会被 Cloudflare 识别。点击 `Create Project`。这一步需要上传您下载的 Zip 文件，点击 `Select from computer`，然后选择 Upload zip 并上传文件，最后点击 `Deploy site`，然后 `Continue to project`。

好的，您的项目已创建，但尚不能使用。从同一个 `Deployment` 页面，在 `Production` 部分点击 `visit`。您会看到一个错误，提示必须先设置 UUID 和 Trojan Password。会有一个链接，在浏览器中打开它并保持打开，下一步会用到。

<p align="center">
  <img src="assets/images/Generate_secrets.jpg">
</p>

## 第三步 - 创建 Cloudflare KV 并设置 UUID 和 Trojan 密码
从左侧菜单进入 KV 部分：

<p align="center">
  <img src="assets/images/Nav_dash_kv.jpg">
</p>

点击 `Create`，输入一个任意名称并添加。

返回到 `Workers and Pages` 部分，进入您创建的 Pages 项目，参考下图进入 `Settings` 部分：

<p align="center">
  <img src="assets/images/Settings_functions.jpg">
</p>

在这里，找到页面中的 `Bindings` 部分（类似于 Worker），点击 `Add` 并选择 `KV Namespace`。`Variable name`必须是 `kv`（大小写必须一致），`KV namespace` 选择您在第二步创建的那个 KV，然后 `save`。

<p align="center">
  <img src="assets/images/Pages_bind_kv.jpg">
</p>

好的，KV 的工作就完成了。

在同一个 `Settings` 部分，您会看到 `Variables and Secrets`。点击 `Add variable`，第一个字段输入大写的 `UUID`，您也可以在上一步的链接中获取 UUID 并复制到 Value 字段，然后 `Save`。再次点击 `Add variable`，第一个字段输入大写的 `TR_PASS`，您也可以从上一步的链接中获取 Trojan 密码并复制到 Value 字段，然后 `Save`。

现在从页面顶部点击 `Create deployment`，然后像之前一样再次上传同一个 Zip 文件。

现在您可以返回到 `Deployments` 页面，在 `Production` 部分点击 `visit`，然后在末尾添加一个 `panel/` 并进入面板。
关于设置和注意事项的教程可以在[主教程](configuration_fa.md)中找到。
安装已完成，接下来的说明可能对大多数人来说不是必需的！
<br><br>
高级设置（可选）

## 1- 固定 Proxy IP：

我们有一个问题是，此代码默认使用大量随机的 Proxy IP，每次连接到在 Cloudflare 后面的网站（包括大部分网络内容）时都会选择一个新的随机 IP，导致您的 IP 会不断变化。对于某些用户（特别是交易者），这种 IP 变化可能会成为问题。从 2.3.5 版本开始，您可以通过面板本身更改 Proxy IP，操作完成后更新订阅即可。但是，我建议使用下面解释的方法，因为：

> [!CAUTION]
> 如果您通过面板应用 Proxy IP 并且该 IP 失效，您必须更换一个 IP 并更新订阅。这意味着如果您已经提供了分享配置，并且更改了 Proxy IP，那么就没用了，因为用户没有订阅来更新配置。因此，建议仅将此方法用于个人使用。但是，下面解释的第二种方法的优点是通过 Cloudflare 仪表板完成，无需更新配置。
<br><br>

要更改 Proxy IP，在进入项目后，从 `Settings` 部分打开 `Environment variables`：

<p align="center">
  <img src="assets/images/Pages_env_vars.jpg">
</p>

在这里需要指定值。每次点击 `Add`，输入一个值并 `Save`：

<p align="center">
  <img src="assets/images/Pages_add_variables.jpg">
</p>

现在点击 `Add variable`，第一个字段输入大写的 `PROXY_IP`。您也可以从下面的链接获取 IP。打开这些链接，会显示一些 IP，您可以检查它们的国家并选择一个或多个：

>[Proxy IP](https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/)

<p align="center">
  <img src="assets/images/Proxy_ips.jpg">
</p>

> [!TIP]
> 如果想使用多个 Proxy IP，可以用逗号分隔输入，例如 `151.213.181.145`,`5.163.51.41`,`bpb.yousef.isegaro.com`

现在从页面顶部点击 `Create deployment`，然后像最开始一样再次上传同一个 Zip 文件，更改就会生效。
<br><br>

## 2- 更改 Fallback 域名：

您一定已经注意到，打开 Pages 的主域名时会进入 Cloudflare 的速度测试网站。要更改它，操作步骤与设置 Proxy IP 类似，只是这个变量的名称在点击 `Add variable` 时必须是 `FALLBACK`，值是一个没有 https:// 或 http:// 的任意域名。例如 www.speedtest.net 或 npmjs.org。
<br><br>

## 3- 更改接收订阅的路径：

默认情况下，接收订阅链接的路径与 VLESS 使用的 UUID 相同。但是如果分享配置，用户可以从配置中提取 UUID 并通过它导入您的订阅，从而访问您的所有配置。当然，当分享时，我认为就不必担心过度使用，但无论如何，有能力更改路径，这样用户就无法访问订阅。步骤与第 1 和第 2 部分完全相同，不同之处在于变量名称是 `SUB_PATH`。如果您转到 secrets/ 或 Secrets 生成器页面，您会看到添加了一个 `Random Subscription URI path` 选项，它会为您生成一个路径，您可以使用它或设置一个任意值（考虑到允许的字符）。
<br><br>

## 4- 连接域名到 Pages：

要执行此操作，请转到 Cloudflare 仪表板，在 `Workers and Pages` 部分选择您的面板项目。转到 `Custom domains` 部分并点击 `set up a custom domain`。在这里会要求您输入一个域名（请注意，您之前必须已经购买了一个域名并在同一个账户上激活，此处不介绍教程）。现在假设您有一个域名 bpb.com，在 Domain 部分可以輸入整个域名或一个任意的子域名。例如 xyz.bpb.com，然后点击 `Continue`，在接下来页面点击 `Activate domain`。Cloudflare 会自动将 Pages 连接到您的域名（这需要一些时间，Cloudflare 自己说可能需要长达 48 小时）。好了，这段时间过后，您可以使用 `https://xyz.bpb.com/panel` 地址进入您的面板并获取新的订阅。
<br><br>

## 面板更新

要更新，像创建步骤一样，从 [Starry-Sky-World/BPB-Chinese](https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest/download/worker.zip) 下载新的 Zip 文件。在您的 Cloudflare 账户中转到 `Workers and Pages` 部分，进入您创建的 Pages 项目，从页面顶部点击 `Create deployment`，然后像最开始一样再次上传新的 Zip 文件即可。
