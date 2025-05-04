<h1 align="center">通过向导安装 BPB Panel</h1>

<p align="center">
  <img src="assets/images/wizard.jpg">
</p>
<br>

## 简介

为了简化安装过程并防止用户在安装过程中出错，我们推出了 BPB Wizard 项目。该项目支持 Workers 和 Pages 两种方式，强烈建议使用这种方法进行安装。

## 第一步

使用这种方法只需要一个 Cloudflare 账号，您可以[在这里](https://dash.cloudflare.com/sign-up/)创建一个账号，别忘了之后去邮箱验证您的账号。

## 第二步

如果您已连接 VPN，请先断开连接。根据您的操作系统从[这里](https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest)下载 zip 文件，解压后运行。

首先程序会登录到您的 Cloudflare 账号，然后返回终端，询问一些设置相关的问题，您可以使用默认设置或输入您想要的值。最后，程序会在浏览器中为您打开面板，安装完成。

> [!TIP]
> 对于每个设置问题，程序都预先生成了一个安全且个性化的值。您可以直接按 Enter 键跳到下一个问题使用默认值，也可以输入您想要的值。

### Android 系统

Android 用户如果已安装 Termux，只需在 Termux 中复制以下代码即可安装 BPB Panel。

### ARM v8

```bash
curl -L -# -o BPB-Wizard.zip https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest/download/BPB-Wizard-linux-arm64.zip && unzip -o BPB-Wizard.zip && chmod +x ./BPB-Wizard-linux-arm64 && ./BPB-Wizard-linux-arm64
```

### ARM v7

```bash
curl -L -# -o BPB-Wizard.zip https://github.com/Starry-Sky-World/BPB-Chinese/releases/latest/download/BPB-Wizard-linux-arm.zip && unzip -o BPB-Wizard.zip && chmod +x ./BPB-Wizard-linux-arm && ./BPB-Wizard-linux-arm
```

> [!IMPORTANT]
> 请注意，Termux 应该只从[官方源](https://github.com/termux/termux-app/releases/latest)下载安装，从 Google Play 安装可能会遇到问题。 