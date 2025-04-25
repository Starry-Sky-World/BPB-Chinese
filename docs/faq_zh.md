<h1 align="center">⁉️ 常见问题</h1>

1- 为什么 Fragment 配置无法连接？
- 如果你启用了 `Routing` 并且 VPN 无法连接，唯一的原因就是 Geo asset 没有更新。进入 v2rayNG 应用的 `Geo asset files` 部分，点击云图标或下载按钮进行更新。如果更新失败，将无法连接。如果无论如何都无法更新，请从以下两个链接下载文件，然后不再点击更新，改为点击添加按钮并将这两个文件导入：
>
>[geoip.dat](https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat)
>
>[geosite.dat](https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat)
<br>

2- 为什么 Normal 配置无法连接？
- 使用这些配置时，需要在你使用的每个应用程序的设置中关闭 `Mux`。
<br>

3- 为什么 Nekobox 或 Hiddify Next 等应用程序无法打开任何网站？
- 你需要在应用程序设置中将 `remote DNS` 设置为这样：
> `https://8.8.8.8/dns-query`
<br>

4- 为什么 Fragment 配置在我的运营商下速度很慢？
- 每个运营商都有其特定的 Fragment 设置。大多数情况下使用面板默认值即可，但某些情况下以下数值在你的运营商下可能更好，需要测试：
> `Length: 10-100`
>
> `Length: 10-20`
<br>

5- 为什么我的 Ping 这么高？
- 绝对不要使用 `https://1.1.1.1/dns-query` 作为 remote DNS，因为它会拉高 Ping。
<br>

6- 我按照那两个链接设置了 Proxy IP，但网站打不开！
- 这些 IP 的数量很多，很多可能已经失效了。你需要测试以找到一个好的。
<br>

7- 我设置了 proxy IP 刚开始能用，但现在又不能用了！
- 如果你使用单个 IP，很可能过一段时间后会再次失效，很多网站就打不开了。需要从头再来这些步骤。如果不需要固定的 IP 进行特定操作，最好保留面板的默认设置，不要设置单个 Proxy IP。
<br>

8- 为什么我去 `panel/` 地址会报错？
- 请按照设置教程进行操作，KV 没有正确配置。
<br>

9- 我部署了，但 Cloudflare 报 1101 错误！
- 如果是 Worker，请尝试使用 Pages 方法构建。如果 Pages 也报错，说明你的 Cloudflare 账户已被识别。使用一个正式的电子邮件地址（如 Gmail）重新创建一个 GitHub 和 Cloudflare 账户，最好使用 Pages 方法，并且项目名称务必更改，不要包含 bpb 字样。
- 现已提供[新的 Pages 安装方法](https://github.com/Starry-Sky-World/BPB-Chinese/blob/main/docs/pages_upload_installation_fa.md)，这是目前最推荐的方法。请现在使用这种方法进行操作。
<br>

10- 我可以使用它进行交易吗？
- 如果你的 Cloudflare IP 是德国（通常如此），并且你使用单个德国 Proxy IP，可能没有问题，但最好使用 Chain Proxy 方法来固定 IP。
<br>

11- 我使用 Pages 方法部署了，但在 GitHub 更新版本时 Sync fork 后面板版本没有变！
- Cloudflare 每次你更新都会为该版本创建一个新的测试链接，所以当你打开项目时，在 Deployment 部分会看到几个不同的链接。这些都不是你面板的主链接，你需要点击页面顶部 Production 部分的 Visit Site，从那里进入面板。
<br>

12- 我启用了 non TLS 端口但无法连接！
- 注意，使用 non TLS 配置仅适用于未自定义域名，通过 Workers 直接部署的情况。
<br>

13- 为什么 Best Fragment 配置无法连接或 Ping 高无法工作？
- 在设置中关闭 `Prefer IPv6`。
<br>

14- 为什么 Telegram 语音通话或 Clubhouse 无法工作？
- Cloudflare 无法正确建立 UDP 协议连接，目前没有有效的解决方案。
<br>

15- 为什么 Normal Trojan 配置无法连接？
- 如果你想通过 Normal 订阅连接，你需要检查你的每个应用程序的 Remote DNS 设置是否与面板相同。udp://1.1.1.1 或 1.1.1.1 格式不适用于 Trojan。以下格式适用：
- `https://8.8.8.8/dns-query`
- `tcp://8.8.8.8`
- `tls://8.8.8.8`
- 推荐使用 Full Normal 或 Fragment 订阅，它们包含了所有必要的设置。
<br>

16- 为什么 ChatGPT 打不开？
- 这是因为面板的默认 Proxy IP 是公共的，很多可能对 ChatGPT 来说是可疑的。你需要从以下链接查找、测试并选择一个适合自己的 IP：
> https://www.nslookup.io/domains/bpb.yousef.isegaro.com/dns-records/
<br>

17- 我忘了面板密码怎么办？
- 前往 Cloudflare 控制面板，在 KV 部分找到你为 Worker 或 Pages 创建的那个 KV，点击 view。进入 KV Pairs 部分，在表格中会看到一个 pwd，它对应的值就是你的密码。
<br>

18- 如果我不更改 UUID 和 Trojan 密码会怎样？
- 从版本 2.7.7 开始，设置这两个参数是强制性的，没有它们面板将无法启动。
