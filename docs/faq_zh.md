# ⁉️ 常见问题

1- 为什么Fragment配置无法连接？
- 如果您启用了`Routing`但VPN无法连接，唯一的原因是Geo asset未更新。从v2rayNG程序菜单进入`Geo asset files`部分，点击云或下载图标进行更新。如果更新失败，将无法连接。如果无论如何都无法更新，请从以下两个链接下载文件，然后不要点击更新，而是点击添加按钮并导入这两个文件：
>
>[geoip.dat](https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat)
>
>[geosite.dat](https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat)

2- 为什么普通配置无法连接？
- 要使用这些配置，请在您使用的任何应用程序的设置中关闭`Mux`。

3- 为什么Nekobox或Hiddify Next应用程序无法打开任何网站？
- 您需要在应用程序设置中将`remote DNS`设置为：
> `https://8.8.8.8/dns-query`

4- 为什么Fragment配置在我的运营商网络上速度很慢？
- 每个运营商都有其特定的Fragment设置。大多数情况下面板默认设置都可以，但在您的运营商网络上，这些值可能更好，您需要测试：
> `Length: 10-100`
>
> `Length: 10-20`

5- 为什么我的Ping值这么高？
- 绝对不要使用`https://1.1.1.1/dns-query`作为remote DNS，因为它会增加ping值。

6- 我按照两个Proxy IP教程设置了，但网站打不开！
- 这些IP数量很多，可能很多已经失效。您需要测试才能找到一个好用的。

7- 使用proxy IP时原本可以工作，但现在失效了！
- 如果您使用单个IP，它可能在一段时间后失效，导致许多网站无法打开。您需要重新执行这些步骤。如果您没有特殊需求需要固定IP，建议保持面板默认设置，不要设置单个Proxy IP。

8- 为什么访问`panel/`时报错？
- 请按照安装教程设置，KV配置不正确。

9- 我部署了但是Cloudflare显示1101错误！
- 如果是Worker，请使用Pages方式创建。如果Pages也报错，说明您的Cloudflare账号已被识别，请使用Gmail等正式邮箱创建新的Cloudflare账号，最好使用Pages方式，同时确保项目名称中不包含bpb。
- 现在提供了一个[新方法](https://github.com/bia-pain-bache/BPB-Worker-Panel/blob/main/docs/pages_upload_installation_fa.md)用于Pages，这是目前最推荐的方法。请现在使用这种方法。

10- 我可以用它来交易吗？
- 如果您的Cloudflare IP是德国的（通常是这样），使用单个德国Proxy IP可能没问题，但最好使用Chain Proxy方法来固定IP。

11- 通过Pages创建但没有non TLS端口！
- 请注意，要使用non TLS配置，您必须通过Workers部署，且不使用自定义域名（Custom Domain）。

12- 为什么Best Fragment配置无法连接或显示ping但不工作？
- 在设置中关闭`Prefer IPv6`。

13- 为什么Telegram语音通话或clubhouse不工作？
- Cloudflare无法正确建立UDP协议，目前没有有效的解决方案。请使用Warp配置。

14- 为什么普通Trojan配置无法连接？
- 如果您想使用普通订阅连接，请检查您使用的任何程序的Remote DNS是否与面板相同，udp://1.1.1.1或1.1.1.1格式与trojan不兼容。以下格式适用：
- `https://8.8.8.8/dns-query`
- `tcp://8.8.8.8`
- `tls://8.8.8.8`
- 建议使用Full Normal或Fragment订阅，它们包含所有设置。

15- 为什么ChatGPT打不开？
- 因为面板默认的Proxy IP是公共的，许多可能被ChatGPT认为可疑。您需要从以下链接查找并测试，找到适合您的IP：
> https://www.nslookup.io/domains/bpb.yousef.is

或者在面板的routing部分启用Bypass ChatGPT选项。

16- 忘记面板密码怎么办？
- 进入Cloudflare控制面板，在KV部分找到您为Worker或Pages创建的KV并点击view，转到KV Pairs部分，在表格中找到pwd，对应的值就是您的密码。

17- 如果不更改UUID和Trojan密码会怎样？
- 从版本2.7.7开始，设置这两个参数是必需的，没有这些面板将无法启动。

18- 使用Pages上传方法创建但显示404。
- Cloudflare需要大约4-5分钟的时间来注册Pages域名，因此请稍等片刻，然后刷新页面即可正常工作。 