import { polyfillCountryFlagEmojis } from 'https://cdn.skypack.dev/country-flag-emoji-polyfill';

// 检查本地存储中的深色模式设置，如果启用则添加到 body 类
localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
// 默认的 HTTPS 端口列表
const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
// 默认的 HTTP 端口列表
const defaultHttpPorts = ['80', '8080', '8880', '2052', '2082', '2086', '2095'];

// 从 /panel/settings 获取面板设置
fetch('/panel/settings')
    .then(async response => response.json())
    .then(data => {
        const { success, status, message, body } = data;
        // 如果状态码是 401 且密码未设置，则打开重置密码模态框
        if (status === 401 && !body.isPassSet) {
            const closeBtn = document.querySelector(".close");
            openResetPass();
            // 隐藏关闭按钮
            closeBtn.style.display = 'none';
        }
        // 如果请求不成功，抛出错误
        if (!success) throw new Error(`数据查询失败，状态 ${status}: ${message}`);
        const { subPath, proxySettings } = body;
        // 将 subPath 编码后存储为全局变量
        globalThis.subPath = encodeURIComponent(subPath);
        // 使用获取到的代理设置初始化面板
        initiatePanel(proxySettings);
    })
    // 捕获错误并输出到控制台
    .catch(error => console.error("数据查询错误：", error.message || error));

// 将一些函数添加到 window 对象
Object.assign(window, { subURL, openQR, dlURL });
// 为各种元素添加事件监听器
document.getElementById('openResetPass').addEventListener('click', openResetPass); // 打开重置密码
document.getElementById('closeResetPass').addEventListener('click', closeResetPass); // 关闭重置密码
document.getElementById('closeQR').addEventListener('click', closeQR); // 关闭二维码
document.getElementById('darkModeToggle').addEventListener('click', darkModeToggle); // 深色模式切换
// 下载 Warp 配置（区分 Amnezia 和非 Amnezia）
document.getElementById('dlAmneziaConfigsBtn').addEventListener('click', () => downloadWarpConfigs(true));
document.getElementById('dlConfigsBtn').addEventListener('click', () => downloadWarpConfigs(false));
// 复制终端命令到剪贴板
document.getElementById('endpointScanner').addEventListener('click', () => copyToClipboard('bash <(curl -fsSL https://raw.githubusercontent.com/bia-pain-bache/warp-script/refs/heads/main/endip/install.sh)'));
document.getElementById('updateWarpConfigs').addEventListener('click', updateWarpConfigs); // 更新 Warp 配置
document.getElementById('VLConfigs').addEventListener('click', handleProtocolChange); // 监听 VL 配置更改
document.getElementById('TRConfigs').addEventListener('click', handleProtocolChange); // 监听 TR 配置更改
document.getElementById('resetSettings').addEventListener('click', resetSettings); // 重置设置
document.getElementById('configForm').addEventListener('submit', updateSettings); // 提交配置表单
document.getElementById('logout').addEventListener('click', logout); // 退出登录
document.getElementById('passwordChangeForm').addEventListener('submit', resetPassword); // 重置密码表单
document.getElementById('addUdpNoise').addEventListener('click', addUdpNoise); // 添加 UDP 噪声
// 为现有的删除噪声按钮添加事件监听器
document.querySelectorAll('button.delete-noise').forEach(element => element.addEventListener('click', deleteUdpNoise));
// 为所有 HTTPS 端口输入框添加更改监听器
document.querySelectorAll('.https').forEach(element => element.addEventListener('change', handlePortChange));
document.getElementById('refresh-geo-location').addEventListener('click', fetchIPInfo); // 刷新地理位置信息

// 点击模态框外部区域时关闭模态框
window.onclick = (event) => {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    if (event.target == qrModal) {
        qrModal.style.display = "none";
        // 移除二维码图片
        qrcodeContainer.lastElementChild.remove();
    }
}

// 初始化面板
function initiatePanel(proxySettings) {
    const {
        VLConfigs,
        TRConfigs,
        ports,
        xrayUdpNoises // 这里的命名可能与 renderUdpNoiseBlock 中的 xrayUdpNoises 对应
    } = proxySettings;

    // 计算当前激活的协议数量
    globalThis.activeProtocols = VLConfigs + TRConfigs;
    // 过滤出激活的 TLS 端口
    globalThis.activeTlsPorts = ports.filter(port => defaultHttpsPorts.includes(port));

    // 需要填充值的 select 元素 ID 列表
    const selectElements = ["VLTRFakeDNS", "VLTRenableIPv6", "warpFakeDNS", "warpEnableIPv6"];
    // 需要填充 checked 状态的 checkbox 元素 ID 列表
    const checkboxElements = ["VLConfigs", "TRConfigs", "bypassLAN", "blockAds", "bypassIran", "blockPorn", "bypassChina", "blockUDP443", "bypassRussia", "bypassOpenAi"];
    // 需要填充值的 input 元素 ID 列表
    const inputElements = [
        "remoteDNS", "localDNS", "outProxy", "customCdnHost", "customCdnSni", "bestVLTRInterval",
        "fragmentLengthMin", "fragmentLengthMax", "fragmentIntervalMin", "fragmentIntervalMax",
        "fragmentPackets", "bestWarpInterval", "hiddifyNoiseMode", "knockerNoiseMode", "noiseCountMin",
        "noiseCountMax", "noiseSizeMin", "noiseSizeMax", "noiseDelayMin", "noiseDelayMax",
        "amneziaNoiseCount", "amneziaNoiseSizeMin", "amneziaNoiseSizeMax",
    ];
    // 需要填充值并处理换行的 textarea 元素 ID 列表
    const textareaElements = ["proxyIPs", "cleanIPs", "customCdnAddrs", "warpEndpoints", "customBypassRules", "customBlockRules"];

    // 使用获取到的设置填充面板元素
    populatePanel(selectElements, checkboxElements, inputElements, textareaElements, proxySettings);
    // 渲染端口列表
    renderPortsBlock(ports);
    // 渲染 UDP 噪声块
    renderUdpNoiseBlock(xrayUdpNoises);
    // 初始化表单监听器
    initiateForm();
    // 获取并显示 IP 信息
    fetchIPInfo();
    // polyfill 国家旗帜 emoji
    polyfillCountryFlagEmojis();
}

// 填充面板元素
function populatePanel(selectElements, checkboxElements, inputElements, textareaElements, proxySettings) {
    // 填充 select 元素的值
    selectElements.forEach(key => document.getElementById(key).value = proxySettings[key]);
    // 填充 checkbox 元素的 checked 状态
    checkboxElements.forEach(key => document.getElementById(key).checked = proxySettings[key]);
    // 填充 input 元素的值
    inputElements.forEach(key => document.getElementById(key).value = proxySettings[key]);
    // 填充 textarea 元素的值并调整行高
    textareaElements.forEach(key => {
        const element = document.getElementById(key);
        // 将数组值用换行符连接
        const value = proxySettings[key]?.join('\r\n');
        // 根据数组长度设置 textarea 的行数
        const rowsCount = proxySettings[key].length;
        element.style.height = 'auto';
        if (rowsCount) element.rows = rowsCount;
        element.value = value;
    })
}

// 初始化表单，设置初始 FormData 并添加监听器
function initiateForm() {
    const configForm = document.getElementById('configForm');
    // 保存表单的初始状态
    globalThis.initialFormData = new FormData(configForm);
    // 启用应用按钮
    enableApplyButton();

    // 当表单内容发生变化时启用应用按钮
    configForm.addEventListener('input', enableApplyButton);
    configForm.addEventListener('change', enableApplyButton);

    // 为 textarea 添加监听器，使其高度自适应内容
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = `${this.scrollHeight}px`;
        });
    });
}

// 检查表单数据是否已更改
function hasFormDataChanged() {
    const configForm = document.getElementById('configForm');
    // 将 FormData 转换为对象以便进行比较
    const formDataToObject = (formData) => Object.fromEntries(formData.entries());
    const currentFormData = new FormData(configForm);
    const initialFormDataObj = formDataToObject(globalThis.initialFormData);
    const currentFormDataObj = formDataToObject(currentFormData);
    // 将对象转换为 JSON 字符串进行比较
    return JSON.stringify(initialFormDataObj) !== JSON.stringify(currentFormDataObj);
}

// 根据表单数据是否更改来启用或禁用应用按钮
function enableApplyButton() {
    const applyButton = document.getElementById('applyButton');
    const isChanged = hasFormDataChanged();
    applyButton.disabled = !isChanged;
    // 切换 disabled 类的样式
    applyButton.classList.toggle('disabled', !isChanged);
}

// 打开重置密码模态框
function openResetPass() {
    const resetPassModal = document.getElementById('resetPassModal');
    resetPassModal.style.display = "block";
    // 禁用页面滚动
    document.body.style.overflow = "hidden";
}

// 关闭重置密码模态框
function closeResetPass() {
    const resetPassModal = document.getElementById('resetPassModal');
    resetPassModal.style.display = "none";
    // 启用页面滚动
    document.body.style.overflow = "";
}

// 关闭二维码模态框
function closeQR() {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    qrModal.style.display = "none";
    // 移除生成的二维码
    qrcodeContainer.lastElementChild.remove();
}

// 切换深色模式
function darkModeToggle() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    // 在本地存储中保存深色模式状态
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// 获取指定 IP 的详细信息
async function getIpDetails(ip) {
    try {
        const response = await fetch('/panel/my-ip', { method: 'POST', body: ip });
        const data = await response.json();
        const { success, status, message, body } = data;
        // 如果请求不成功，抛出错误
        if (!success) throw new Error(`获取目标 IP 失败，状态 ${status}: ${message}`);
        return body;
    } catch (error) {
        console.error("获取 IP 错误：", error.message || error)
    }
}

// 获取并更新 IP 信息显示
async function fetchIPInfo() {
    const refreshIcon = document.getElementById("refresh-geo-location").querySelector('i');
    // 添加旋转动画
    refreshIcon.classList.add('fa-spin');
    // 更新 UI 显示函数
    const updateUI = (ip = '-', country = '-', countryCode = '-', city = '-', isp = '-', cfIP) => {
        // 生成国家旗帜 emoji
        const flag = countryCode !== '-' ? String.fromCodePoint(...[...countryCode].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) : '';
        // 更新对应的元素内容
        document.getElementById(cfIP ? 'cf-ip' : 'ip').textContent = ip;
        document.getElementById(cfIP ? 'cf-country' : 'country').textContent = country + ' ' + flag;
        document.getElementById(cfIP ? 'cf-city' : 'city').textContent = city;
        document.getElementById(cfIP ? 'cf-isp' : 'isp').textContent = isp;
    };

    try {
        // 获取当前 IP 信息（非 Cloudflare）
        const response = await fetch('https://ipwho.is/' + '?nocache=' + Date.now(), { cache: "no-store" });
        const data = await response.json();
        const { success, ip, message } = data;
        // 如果请求不成功，抛出错误
        if (!success) throw new Error(`获取其他目标 IP 失败，请求地址为 ${response.url}: ${message}`);
        // 获取 IP 详细信息
        const { country, countryCode, city, isp } = await getIpDetails(ip);
        // 更新 UI
        updateUI(ip, country, countryCode, city, isp);
        // 移除旋转动画
        refreshIcon.classList.remove('fa-spin');
    } catch (error) {
        console.error("获取 IP 错误：", error.message || error)
    }

    try {
        // 获取 Cloudflare IP 信息
        const response = await fetch('https://ipv4.icanhazip.com/?nocache=' + Date.now(), { cache: "no-store" });
        // 检查响应状态
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`获取 Cloudflare 目标 IP 失败，状态 ${response.status}，请求地址为 ${response.url}: ${errorMessage}`);
        }

        const ip = await response.text();
        // 获取 IP 详细信息
        const { country, countryCode, city, isp } = await getIpDetails(ip);
        // 更新 Cloudflare IP UI
        updateUI(ip, country, countryCode, city, isp, true);
        // 移除旋转动画
        refreshIcon.classList.remove('fa-spin');
    } catch (error) {
        console.error("获取 IP 错误：", error.message || error)
    }
}

// 下载 Warp 配置
function downloadWarpConfigs(isAmnezia) {
    // 构建下载 URL
    const client = isAmnezia ? "?app=amnezia" : "";
    window.location.href = "/panel/get-warp-configs" + client;
}

// 生成订阅 URL 并复制到剪贴板
function subURL(path, app, tag, hiddifyType) {
    // 构建订阅 URL
    const url = `${hiddifyType ? 'hiddify://import/' : ''}${window.origin}/sub/${path}/${globalThis.subPath}${app ? `?app=${app}` : ''}#BPB-${tag}`;
    copyToClipboard(url); // 复制到剪贴板
}

// 下载配置 URL 的内容并保存为文件
async function dlURL(path, app) {
    try {
        // 获取配置内容
        const response = await fetch(`${window.origin}/sub/${path}/${subPath}${app ? `?app=${app}` : ''}`);
        const data = await response.text();
        // 检查响应状态
        if (!response.ok) throw new Error(`下载失败，状态 ${response.status}，请求地址为 ${response.url}: ${data}`);
        // 创建 Blob 对象
        const blob = new Blob([data], { type: 'application/json' });
        // 创建下载链接
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'config.json'; // 设置下载文件名
        // 添加到 DOM 并触发点击
        document.body.appendChild(link);
        link.click();
        // 移除链接
        document.body.removeChild(link);
    } catch (error) {
        console.error("下载错误：", error.message || error);
    }
}

// 打开二维码模态框并生成二维码
function openQR(path, app, tag, title, sbType, hiddifyType) {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    // 构建 URL (兼容 sing-box 和 hiddify 类型)
    const url = `${sbType ? 'sing-box://import-remote-profile?url=' : ''}${hiddifyType ? 'hiddify://import/' : ''}${window.origin}/sub/${path}/${globalThis.subPath}${app ? `?app=${app}` : ''}#BPB-${tag}`;
    let qrcodeTitle = document.getElementById("qrcodeTitle");
    qrcodeTitle.textContent = title; // 设置二维码标题
    qrModal.style.display = "block"; // 显示模态框
    // 创建二维码容器元素
    let qrcodeDiv = document.createElement("div");
    qrcodeDiv.className = "qrcode";
    // 设置二维码样式
    qrcodeDiv.style.padding = "2px";
    qrcodeDiv.style.backgroundColor = "#ffffff";
    // 使用 QRCode 库生成二维码
    new QRCode(qrcodeDiv, {
        text: url, // 二维码内容
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H // 纠错级别
    });
    // 将二维码添加到容器中
    qrcodeContainer.appendChild(qrcodeDiv);
}

// 复制文本到剪贴板并显示成功提示
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        // 成功提示
        .then(() => alert('✅ 已复制到剪贴板:\n\n' + text))
        // 失败提示
        .catch(error => console.error('复制失败：', error));
}

// 更新 Warp 配置
async function updateWarpConfigs() {
    // 确认是否执行更新
    const confirmReset = confirm('⚠️ 确定要更新吗？');
    if (!confirmReset) return; // 如果取消则返回
    const refreshBtn = document.getElementById('updateWarpConfigs');
    document.body.style.cursor = 'wait'; // 设置鼠标样式为等待
    const refreshButtonVal = refreshBtn.innerHTML; // 保存按钮原始文本
    refreshBtn.innerHTML = '⌛ 加载中...'; // 更新按钮文本

    try {
        // 发送更新请求
        const response = await fetch('/panel/update-warp', { method: 'POST', credentials: 'include' });
        const { success, status, message } = await response.json();
        document.body.style.cursor = 'default'; // 恢复鼠标样式
        refreshBtn.innerHTML = refreshButtonVal; // 恢复按钮文本
        // 如果更新不成功
        if (!success) {
            alert(`⚠️ 发生错误，请重试！\n⛔ ${message}`); // 显示错误提示
            throw new Error(`更新 Warp 配置失败，状态 ${status}: ${message}`); // 抛出错误
        }

        alert('✅ Warp 配置更新成功！😎'); // 显示成功提示
    } catch (error) {
        console.error("更新 Warp 配置错误：", error.message || error) // 控制台输出错误详情
    }
}

// 处理协议（VL/TR）切换时的逻辑
function handleProtocolChange(event) {
    // 如果协议被选中
    if (event.target.checked) {
        globalThis.activeProtocols++; // 激活协议计数增加
        return true;
    }

    // 如果协议被取消选中
    globalThis.activeProtocols--; // 激活协议计数减少
    // 如果没有协议被选中
    if (globalThis.activeProtocols === 0) {
        event.preventDefault(); // 阻止默认行为（取消选中）
        event.target.checked = !event.target.checked; // 恢复选中状态
        alert("⛔ 至少应选择一个协议！🫤"); // 提示用户
        globalThis.activeProtocols++; // 恢复激活协议计数
        return false;
    }
}

// 处理端口切换时的逻辑
function handlePortChange(event) {
    // 如果端口被选中
    if (event.target.checked) {
        globalThis.activeTlsPorts.push(event.target.name); // 将端口添加到激活列表
        return true;
    }

    // 如果端口被取消选中
    globalThis.activeTlsPorts = globalThis.activeTlsPorts.filter(port => port !== event.target.name); // 从激活列表中移除端口
    // 如果没有 TLS 端口被选中
    if (globalThis.activeTlsPorts.length === 0) {
        event.preventDefault(); // 阻止默认行为
        event.target.checked = !event.target.checked; // 恢复选中状态
        alert("⛔ 至少应选择一个 TLS 端口！🫤"); // 提示用户
        globalThis.activeTlsPorts.push(event.target.name); // 恢复到至少一个选中状态
        return false;
    }
}

// 重置面板设置
function resetSettings() {
    // 确认是否重置设置
    const confirmReset = confirm('⚠️ 这将重置所有面板设置。\n确定要继续吗？');
    if (!confirmReset) return; // 如果取消则返回
    const resetBtn = document.querySelector('#resetSettings i');
    resetBtn.classList.add('fa-spin'); // 添加旋转动画
    const formData = new FormData();
    formData.append('resetSettings', 'true'); // 添加重置标记
    document.body.style.cursor = 'wait'; // 设置鼠标样式为等待

    // 发送重置请求
    fetch('/panel/reset-settings', { method: 'POST', body: formData, credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const { success, status, message, body } = data;
            document.body.style.cursor = 'default'; // 恢复鼠标样式
            resetBtn.classList.remove('fa-spin'); // 移除旋转动画
            // 如果重置不成功
            if (!success) throw new Error(`重置设置失败，状态 ${status}: ${message}`); // 抛出错误
            initiatePanel(body); // 使用返回的默认设置初始化面板
            alert('✅ 面板设置已成功重置为默认值！😎'); // 显示成功提示
        })
        .catch(error => console.error("重置设置错误：", error.message || error)); // 控制台输出错误详情
}

// 更新设置
function updateSettings(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    event.stopPropagation(); // 阻止事件冒泡

    // 需要验证的元素 ID 列表
    const elementsToCheck = ['cleanIPs', 'customCdnAddrs', 'customCdnSni', 'customCdnHost', 'proxyIPs', 'customBypassRules', 'customBlockRules'];
    const configForm = document.getElementById('configForm');
    const formData = new FormData(configForm); // 获取表单数据

    // 执行所有验证函数
    const validations = [
        validateMultipleIpDomains(elementsToCheck), // 验证 IP/域名列表
        validateWarpEndpoints(), // 验证 Warp 终端节点
        validateMinMax(), // 验证最小-最大值范围
        validateChainProxy(), // 验证链式代理配置
        validateCustomCdn(), // 验证自定义 CDN 配置
        validateXrayNoises(formData), // 验证 Xray 噪声
    ];

    // 如果任何验证失败，则停止并返回
    if (!validations.every(Boolean)) return false;

    const applyButton = document.getElementById('applyButton');
    document.body.style.cursor = 'wait'; // 设置鼠标样式为等待
    const applyButtonVal = applyButton.value; // 保存按钮原始文本
    applyButton.value = '⌛ 加载中...'; // 更新按钮文本

    // 发送更新设置请求
    fetch('/panel/update-settings', { method: 'POST', body: formData, credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const { success, status, message } = data;
            document.body.style.cursor = 'default'; // 恢复鼠标样式
            applyButton.value = applyButtonVal; // 恢复按钮文本
            // 如果会话过期
            if (status === 401) {
                alert('⚠️ 会话已过期！请重新登录。'); // 提示用户
                window.location.href = '/login'; // 跳转到登录页
            }

            // 如果更新不成功
            if (!success) throw new Error(`更新设置失败，状态 ${status}: ${message}`); // 抛出错误
            initiateForm(); // 重新初始化表单状态
            alert('✅ 设置已成功应用！😎'); // 显示成功提示
        })
        .catch(error => console.error("更新设置错误：", error.message || error)); // 控制台输出错误详情
}

// 验证单个 IP 或域名是否合法
function isValidIpDomain(value) {
    // IPv6 格式正则表达式
    const ipv6Regex = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\](?:\/(?:12[0-8]|1[01]?\d|[0-9]?\d))?$/gm;
    // IPv4 格式正则表达式
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/(?:\d|[12]\d|3[0-2]))?$/gm;
    // 域名格式正则表达式
    const domainRegex = /^(?=.{1,253}$)(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,63}$/gm;
    // 只要匹配其中一种格式即为合法
    return ipv4Regex.test(value) || ipv6Regex.test(value) || domainRegex.test(value);
}

// 验证多个 IP 或域名（来自 textarea 行）
function validateMultipleIpDomains(elements) {
    // 从 textarea 获取值，按换行符分割并过滤掉空行
    const getValue = (id) => document.getElementById(id).value?.split('\n').filter(Boolean);

    const ips = [];
    // 收集所有指定元素的 IP/域名列表
    elements.forEach(id => ips.push(...getValue(id)));
    // 找出所有无效的 IP/域名
    const invalidIPs = ips?.filter(value => value && !isValidIpDomain(value.trim()));

    // 如果存在无效项
    if (invalidIPs.length) {
        // 显示错误提示，列出所有无效项
        alert('⛔ 无效的 IP 或域名！🫤\n👉 请在每行输入一个 IP/域名。\n\n' + invalidIPs.map(ip => '⚠️ ' + ip).join('\n'));
        return false; // 验证失败
    }

    return true; // 验证成功
}

// 验证 Warp 终端节点格式
function validateWarpEndpoints() {
    // 验证单个终端节点是否合法（格式为 IP:端口 或 [IPv6]:端口 或 域名:端口）
    function isValidEndpoint(value) {
        // 包含端口的 IPv6 格式正则表达式
        const ipv6Regex = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\](?:\/(?:12[0-8]|1[01]?\d|[0-9]?\d))?:(?:6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/gm;
        // 包含端口的 IPv4 格式正则表达式
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/(?:\d|[12]\d|3[0-2]))?:(?:6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/gm;
        // 包含端口的域名格式正则表达式
        const domainRegex = /^(?=.{1,253}$)(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,63}:(?:6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/gm;
        // 只要匹配其中一种格式即为合法
        return ipv4Regex.test(value) || ipv6Regex.test(value) || domainRegex.test(value);
    }

    // 获取 Warp 终端节点列表
    const warpEndpoints = document.getElementById('warpEndpoints').value?.split('\n');
    // 找出所有无效的终端节点
    const invalidEndpoints = warpEndpoints?.filter(value => value && !isValidEndpoint(value.trim()));

    // 如果存在无效项
    if (invalidEndpoints.length) {
        // 显示错误提示，列出所有无效项
        alert('⛔ 无效的终端节点！🫤\n\n' + invalidEndpoints.map(endpoint => '⚠️ ' + endpoint).join('\n'));
        return false; // 验证失败
    }

    return true; // 验证成功
}

// 验证最小-最大值范围配置
function validateMinMax() {
    // 获取元素的整数值
    const getValue = (id) => parseInt(document.getElementById(id).value, 10);

    // 获取所有需要验证的最小值和最大值
    const fragmentLengthMin = getValue('fragmentLengthMin');
    const fragmentLengthMax = getValue('fragmentLengthMax');
    const fragmentIntervalMin = getValue('fragmentIntervalMin');
    const fragmentIntervalMax = getValue('fragmentIntervalMax');
    const noiseCountMin = getValue('noiseCountMin');
    const noiseCountMax = getValue('noiseCountMax');
    const noiseSizeMin = getValue('noiseSizeMin');
    const noiseSizeMax = getValue('noiseSizeMax');
    const noiseDelayMin = getValue('noiseDelayMin');
    const noiseDelayMax = getValue('noiseDelayMax');

    // 检查所有最小-最大关系是否合法
    if (fragmentLengthMin >= fragmentLengthMax || fragmentIntervalMin > fragmentIntervalMax || noiseCountMin > noiseCountMax || noiseSizeMin > noiseSizeMax || noiseDelayMin > noiseDelayMax) {
        alert('⛔ 最小值应小于或等于最大值！🫤'); // 显示错误提示
        return false; // 验证失败
    }

    return true; // 验证成功
}

// 验证链式代理配置
function validateChainProxy() {
    const chainProxy = document.getElementById('outProxy').value?.trim(); // 获取链式代理配置，去除首尾空格
    // VLESS 配置正则表达式
    const isVless = /vless:\/\/[^\s@]+@[^\s:]+:[^\s]+/.test(chainProxy);
    // 是否包含 security 参数
    const hasSecurity = /security=/.test(chainProxy);
    // Socks 或 Http 配置正则表达式
    const isSocksHttp = /^(http|socks):\/\/(?:([^:@]+):([^:@]+)@)?([^:@]+):(\d+)$/.test(chainProxy);
    // security 参数的值是否合法（tls, none, reality）
    const securityRegex = /security=(tls|none|reality)/;
    const validSecurityType = securityRegex.test(chainProxy);
    // transmission 参数的值是否合法（tcp, grpc, ws）
    const validTransmission = /type=(tcp|grpc|ws)/.test(chainProxy);

    // 如果配置不是 VLESS 且不是 Socks/Http 且配置不为空，则为无效配置
    if (!(isVless && (hasSecurity && validSecurityType || !hasSecurity) && validTransmission) && !isSocksHttp && chainProxy) {
        // 显示错误提示
        alert('⛔ 配置无效！🫤 \n - 链式代理应为 VLESS, Socks 或 Http！\n - VLESS 传输类型应为 GRPC, WS 或 TCP\n - VLESS security 应为 TLS, Reality 或 None\n - socks 或 http 格式应为：\n + (socks or http)://user:pass@host:port\n + (socks or http)://host:port');
        return false; // 验证失败
    }

    let match = chainProxy.match(securityRegex);
    const securityType = match?.[1] || null; // 提取 security 参数的值
    match = chainProxy.match(/:(\d+)\?/);
    const vlessPort = match?.[1] || null; // 提取 VLESS 的端口

    // 如果是 VLESS 类型且 security 为 TLS 且端口不是 443，则为无效配置
    if (isVless && securityType === 'tls' && vlessPort !== '443') {
        alert('⛔ 作为链式代理使用时，VLESS TLS 端口只能是 443！🫤'); // 显示错误提示
        return false; // 验证失败
    }

    return true; // 验证成功
}

// 验证自定义 CDN 配置
function validateCustomCdn() {
    // 获取自定义 CDN 相关字段的值
    const customCdnHost = document.getElementById('customCdnHost').value;
    const customCdnSni = document.getElementById('customCdnSni').value;
    const customCdnAddrs = document.getElementById('customCdnAddrs').value?.split('\n').filter(Boolean); // 获取地址列表，过滤空行

    // 判断是否启用了自定义 CDN (任一字段有值即视为启用)
    const isCustomCdn = customCdnAddrs.length || customCdnHost !== '' || customCdnSni !== '';
    // 如果启用了自定义 CDN，但并非所有字段都有值，则为无效配置
    if (isCustomCdn && !(customCdnAddrs.length && customCdnHost && customCdnSni)) {
        alert('⛔ 所有“自定义”字段应同时填写或同时清空！🫤'); // 显示错误提示
        return false; // 验证失败
    }

    return true; // 验证成功
}

// 验证 Xray UDP 噪声配置
function validateXrayNoises(formData) {
    // 从 FormData 获取所有 UDP 噪声相关的值列表
    const udpNoiseModes = formData.getAll('udpXrayNoiseMode') || [];
    const udpNoisePackets = formData.getAll('udpXrayNoisePacket') || [];
    const udpNoiseDelaysMin = formData.getAll('udpXrayNoiseDelayMin') || [];
    const udpNoiseDelaysMax = formData.getAll('udpXrayNoiseDelayMax') || [];
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/; // Base64 正则表达式
    let submisionError = false; // 标记是否存在提交错误

    // 遍历每个噪声配置进行验证
    for (const [index, mode] of udpNoiseModes.entries()) {
        // 验证噪声延迟的最小-最大关系
        if (udpNoiseDelaysMin[index] > udpNoiseDelaysMax[index]) {
            alert('⛔ 噪声延迟的最小值应小于或等于最大值！🫤'); // 显示错误提示
            submisionError = true; // 设置错误标记
            break; // 停止验证
        }

        // 根据噪声模式进行特定验证
        switch (mode) {
            case 'base64':
                // 验证 Base64 噪声包是否为有效的 Base64 格式
                if (!base64Regex.test(udpNoisePackets[index])) {
                    alert('⛔ Base64 噪声包不是有效的 Base64 值！🫤'); // 显示错误提示
                    submisionError = true; // 设置错误标记
                }
                break;

            case 'rand':
                // 验证 Random 噪声包是否为有效的范围格式 (例如 "0-10")
                if (!(/^\d+-\d+$/.test(udpNoisePackets[index]))) {
                    alert('⛔ Random 噪声包应为 "0-10" 或 "10-30" 这样的范围格式！🫤'); // 显示错误提示
                    submisionError = true; // 设置错误标记
                } else {
                    const [min, max] = udpNoisePackets[index].split("-").map(Number);
                    // 验证 Random 噪声包范围的最小-最大关系
                    if (min > max) {
                        alert('⛔ Random 噪声包的最小值应小于或等于最大值！🫤'); // 显示错误提示
                        submisionError = true; // 设置错误标记
                    }
                }
                break;

            case 'hex':
                // 验证 Hex 噪声包是否为有效的十六进制格式 (偶数长度，包含 0-9, a-f, A-F)
                if (!(/^(?=(?:[0-9A-Fa-f]{2})*$)[0-9A-Fa-f]+$/.test(udpNoisePackets[index]))) {
                    alert('⛔ Hex 噪声包不是有效的十六进制值！它应具有偶数长度并由 0-9, a-f 和 A-F 组成。🫤'); // 显示错误提示
                    submisionError = true; // 设置错误标记
                }
                break;
        }

        if (submisionError) break; // 如果已发现错误，停止遍历
    }

    return !submisionError; // 返回验证结果 (没有错误则为 true)
}

// 退出登录
function logout(event) {
    event.preventDefault(); // 阻止默认行为（跳转）

    // 发送退出登录请求
    fetch('/logout', { method: 'GET', credentials: 'same-origin' })
        .then(response => response.json())
        .then(data => {
            const { success, status, message } = data;
            // 如果退出不成功
            if (!success) throw new Error(`退出登录失败，状态 ${status}: ${message}`); // 抛出错误
            window.location.href = '/login'; // 跳转到登录页
        })
        .catch(error => console.error("退出登录错误：", error.message || error)); // 控制台输出错误详情
}

// 为密码输入框添加“显示/隐藏密码”切换功能
document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", function () {
        const input = this.previousElementSibling; // 获取前一个兄弟元素（输入框）
        const isPassword = input.type === "password"; // 判断当前是否为密码类型
        input.type = isPassword ? "text" : "password"; // 切换输入框类型
        this.textContent = isPassword ? "visibility" : "visibility_off"; // 切换按钮文本内容（图标）
    });
});

// 重置密码功能
function resetPassword(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    const resetPassModal = document.getElementById('resetPassModal');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError'); // 错误提示元素
    const newPassword = newPasswordInput.value; // 新密码
    const confirmPassword = confirmPasswordInput.value; // 确认密码

    // 验证两次输入的密码是否一致
    if (newPassword !== confirmPassword) {
        passwordError.textContent = "密码不匹配"; // 显示错误提示
        return false; // 验证失败
    }

    // 验证密码复杂度要求
    const hasCapitalLetter = /[A-Z]/.test(newPassword); // 包含大写字母
    const hasNumber = /[0-9]/.test(newPassword); // 包含数字
    const isLongEnough = newPassword.length >= 8; // 长度至少 8 位

    // 如果不满足复杂度要求
    if (!(hasCapitalLetter && hasNumber && isLongEnough)) {
        passwordError.textContent = '⚠️ 密码必须包含至少一个大写字母、一个数字，且长度至少为 8 个字符。'; // 显示错误提示
        return false; // 验证失败
    }

    // 发送重置密码请求
    fetch('/panel/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain' // 设置内容类型
        },
        body: newPassword, // 将新密码作为请求体发送
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(data => {
            const { success, status, message } = data;
            // 如果重置不成功
            if (!success) {
                passwordError.textContent = `⚠️ ${message}`; // 显示错误信息
                throw new Error(`重置密码失败，状态 ${status}: ${message}`); // 抛出错误
            }

            resetPassModal.style.display = "none"; // 关闭重置密码模态框
            document.body.style.overflow = ""; // 恢复页面滚动
            alert("✅ 密码修改成功！👍"); // 显示成功提示
            window.location.href = '/login'; // 跳转到登录页

        }).catch(error => console.error("重置密码错误：", error.message || error)); // 控制台输出错误详情
}

// 渲染端口显示块
function renderPortsBlock(ports) {
    let noneTlsPortsBlock = '', tlsPortsBlock = ''; // 分离 TLS 和非 TLS 端口块
    // 所有可能的端口 (根据 window.origin 是否包含 workers.dev 判断是否包含默认 HTTP 端口)
    const allPorts = [...(window.origin.includes('workers.dev') ? defaultHttpPorts : []), ...defaultHttpsPorts];

    // 遍历所有端口，生成 HTML 块
    allPorts.forEach(port => {
        const isChecked = ports.includes(port) ? 'checked' : ''; // 判断端口是否被选中
        const clss = defaultHttpsPorts.includes(port) ? 'class="https"' : ''; // 如果是 HTTPS 端口添加 class
        const portBlock = `
            <div class="routing">
                <input type="checkbox" name=${port} ${clss} value="true" ${isChecked}>
                <label>${port}</label>
            </div>`;

        // 根据是否为 HTTPS 端口添加到对应的块
        defaultHttpsPorts.includes(port) ? tlsPortsBlock += portBlock : noneTlsPortsBlock += portBlock;
    });

    // 将生成的 HTML 添加到页面中
    document.getElementById("tls-ports").innerHTML = tlsPortsBlock;
    // 如果存在非 TLS 端口，则显示非 TLS 端口块
    if (noneTlsPortsBlock) {
        document.getElementById("non-tls-ports").innerHTML = noneTlsPortsBlock;
        document.getElementById("none-tls").style.display = 'flex';
    }
}

// 添加新的 UDP 噪声配置块
function addUdpNoise() {
    const container = document.getElementById("noises"); // 噪声容器
    const noiseBlock = document.getElementById("udp-noise-1"); // 作为克隆源的第一个噪声块
    const index = container.children.length + 1; // 新噪声块的索引
    const clone = noiseBlock.cloneNode(true); // 克隆噪声块
    clone.querySelector("h4").textContent = `噪声 ${index}`; // 更新标题
    clone.id = `udp-noise-${index}`; // 更新 ID
    clone.querySelector("button").addEventListener('click', deleteUdpNoise); // 为新噪声块的删除按钮添加监听器
    container.appendChild(clone); // 将新噪声块添加到容器中
    document.getElementById("configForm").dispatchEvent(new Event("change")); // 触发表单更改事件以更新应用按钮状态
}

// 删除 UDP 噪声配置块
function deleteUdpNoise(event) {
    const container = document.getElementById("noises"); // 噪声容器
    // 如果只剩一个噪声块，不允许删除
    if (container.children.length === 1) {
        alert('⛔ 您不能删除所有噪声！'); // 提示用户
        return;
    }

    // 确认是否删除噪声
    const confirmReset = confirm('⚠️ 这将删除该噪声。\n确定要继续吗？');
    if (!confirmReset) return; // 如果取消则返回
    event.target.closest(".inner-container").remove(); // 移除最近的噪声块容器
    document.getElementById("configForm").dispatchEvent(new Event("change")); // 触发表单更改事件以更新应用按钮状态
}

// 渲染 UDP 噪声配置块
function renderUdpNoiseBlock(xrayUdpNoises) {
    let udpNoiseBlocks = ''; // 用于构建所有噪声块的 HTML 字符串

    // 遍历 UDP 噪声配置数组，为每个配置生成 HTML 块
    xrayUdpNoises.forEach((noise, index) => {
        udpNoiseBlocks += `
            <div id="udp-noise-${index + 1}" class="inner-container">
                <div class="header-container">
                    <h4>噪声 ${index + 1}</h4>
                    <button type="button" class="delete-noise">
                        <i class="fa fa-minus-circle fa-2x" aria-hidden="true"></i>
                    </button>      
                </div>
                <div class="section">
                    <div class="form-control">
                        <label>😵‍💫 v2ray 模式</label>
                        <div>
                            <select name="udpXrayNoiseMode">
                                <option value="base64" ${noise.type === 'base64' ? 'selected' : ''}>Base64</option>
                                <option value="rand" ${noise.type === 'rand' ? 'selected' : ''}>随机 (Random)</option>
                                <option value="str" ${noise.type === 'str' ? 'selected' : ''}>字符串 (String)</option>
                                <option value="hex" ${noise.type === 'hex' ? 'selected' : ''}>十六进制 (Hex)</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-control">
                        <label>📥 噪声包</label>
                        <div>
                            <input type="text" name="udpXrayNoisePacket" value="${noise.packet}">
                        </div>
                    </div>
                    <div class="form-control">
                        <label>🕞 噪声延迟</label>
                        <div class="min-max">
                            <input type="number" name="udpXrayNoiseDelayMin"
                                value="${noise.delay.split('-')[0]}" min="1" required>
                            <span> - </span>
                            <input type="number" name="udpXrayNoiseDelayMax"
                                value="${noise.delay.split('-')[1]}" min="1" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label>🎚️ 噪声数量</label>
                        <div>
                            <input type="number" name="udpXrayNoiseCount" value="${noise.count}" min="1" required>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    // 将生成的 HTML 添加到页面中
    document.getElementById("noises").innerHTML = udpNoiseBlocks;
}