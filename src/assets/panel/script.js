localStorage.getItem('darkMode') === 'enabled' && document.body.classList.add('dark-mode');
import { polyfillCountryFlagEmojis } from 'https://cdn.skypack.dev/country-flag-emoji-polyfill';

const defaultHttpsPorts = ['443', '8443', '2053', '2083', '2087', '2096'];
const defaultHttpPorts = ['80', '8080', '8880', '2052', '2082', '2086', '2095'];

fetch('/panel/settings')
    .then(async response => response.json())
    .then(data => {
        const { success, status, message, body } = data;
        // 如果状态码是 401 且密码未设置，打开重置密码模态框并隐藏关闭按钮
        if (status === 401 && !body.isPassSet) {
            const closeBtn = document.querySelector(".close");
            openResetPass();
            closeBtn.style.display = 'none';
        }

        if (!success) throw new Error(`状态 ${status} - ${message}`); // Data query error: status ${status} - ${message}
        const { subPath, proxySettings } = body;
        globalThis.subPath = encodeURIComponent(subPath);
        initiatePanel(proxySettings);
    })
    .catch(error => console.error("数据查询错误:", error.message || error)) // Data query error:
    .finally(() => {
        // 定义点击事件及其处理函数
        const clickEvents = [
            ['openResetPass', openResetPass], // 打开重置密码模态框
            ['closeResetPass', closeResetPass], // 关闭重置密码模态框
            ['closeQR', closeQR], // 关闭二维码模态框
            ['darkModeToggle', darkModeToggle], // 切换深色模式
            ['dlAmneziaConfigsBtn', () => downloadWarpConfigs(true)], // 下载 Warp Amnezia 配置
            ['dlConfigsBtn', () => downloadWarpConfigs(false)], // 下载 Warp Wireguard 配置
            ['endpointScanner', () => copyToClipboard('bash <(curl -fsSL https://raw.githubusercontent.com/Starry-Sky-World/BPB-Chinese/main/endip/install.sh)')], // 复制 Endpoint 扫描器脚本
            ['updateWarpConfigs', updateWarpConfigs], // 更新 Warp 配置
            ['VLConfigs', handleProtocolChange], // 处理 VLESS 协议选择变化
            ['TRConfigs', handleProtocolChange], // 处理 Trojan 协议选择变化
            ['resetSettings', resetSettings], // 重置设置
            ['logout', logout], // 注销
            ['addUdpNoise', () => addUdpNoise(true, globalThis.xrayNoiseCount)], // 添加 UDP 噪声
            ['refresh-geo-location', fetchIPInfo] // 刷新地理位置信息
        ];

        // 为元素绑定点击事件
        clickEvents.forEach(([id, handler]) => {
            const element = document.getElementById(id);
            if (element) element.addEventListener('click', handler);
        });

        // 定义表单提交事件及其处理函数
        const submitEvents = [
            ['configForm', updateSettings], // 提交配置表单
            ['passwordChangeForm', resetPassword] // 提交密码修改表单
        ];

        // 为表单绑定提交事件
        submitEvents.forEach(([id, handler]) => {
            const form = document.getElementById(id);
            if (form) form.addEventListener('submit', handler);
        });

        // 为 UDP 噪声模式选择器绑定 change 事件
        document.querySelectorAll('[name="udpXrayNoiseMode"]')?.forEach(noiseSelector => noiseSelector.addEventListener('change', generateUdpNoise));
        // 为删除噪声按钮绑定 click 事件
        document.querySelectorAll('button.delete-noise')?.forEach(deleteNoise => deleteNoise.addEventListener('click', deleteUdpNoise));
        // 为 HTTPS 端口复选框绑定 change 事件
        document.querySelectorAll('.https')?.forEach(port => port.addEventListener('change', handlePortChange));

        // 将函数添加到全局 window 对象，以便 HTML 中可以直接调用
        Object.assign(window, { subURL, openQR, dlURL });
        // 点击模态框外部时关闭模态框
        window.onclick = (event) => {
            const qrModal = document.getElementById('qrModal');
            const qrcodeContainer = document.getElementById('qrcode-container');
            if (event.target == qrModal) {
                qrModal.style.display = "none";
                qrcodeContainer.lastElementChild.remove(); // 移除之前生成的二维码
            }
        }
    });

// 初始化面板
function initiatePanel(proxySettings) {

    const {
        VLConfigs, // VLESS 配置是否启用
        TRConfigs, // Trojan 配置是否启用
        ports, // 启用的端口
        xrayUdpNoises // Xray UDP 噪声配置
    } = proxySettings;

    globalThis.activeProtocols = VLConfigs + TRConfigs; // 启用协议数量
    globalThis.activeTlsPorts = ports.filter(port => defaultHttpsPorts.includes(port)); // 启用的 TLS 端口
    globalThis.xrayNoiseCount = xrayUdpNoises.length; // UDP 噪声数量

    // 定义不同类型的表单元素
    const selectElements = ["VLTRFakeDNS", "VLTRenableIPv6", "warpFakeDNS", "warpEnableIPv6"];
    const checkboxElements = ["VLConfigs", "TRConfigs", "bypassLAN", "blockAds", "bypassIran", "blockPorn", "bypassChina", "blockUDP443", "bypassRussia", "bypassOpenAi"];
    const inputElements = [
        "remoteDNS", "localDNS", "outProxy", "customCdnHost", "customCdnSni", "bestVLTRInterval",
        "fragmentLengthMin", "fragmentLengthMax", "fragmentIntervalMin", "fragmentIntervalMax",
        "fragmentPackets", "bestWarpInterval", "hiddifyNoiseMode", "knockerNoiseMode", "noiseCountMin",
        "noiseCountMax", "noiseSizeMin", "noiseSizeMax", "noiseDelayMin", "noiseDelayMax",
        "amneziaNoiseCount", "amneziaNoiseSizeMin", "amneziaNoiseSizeMax",
    ];
    const textareaElements = ["proxyIPs", "cleanIPs", "customCdnAddrs", "warpEndpoints", "customBypassRules", "customBlockRules"];

    // 填充面板数据
    populatePanel(selectElements, checkboxElements, inputElements, textareaElements, proxySettings);
    // 渲染端口区块
    renderPortsBlock(ports);
    // 渲染 UDP 噪声区块
    renderUdpNoiseBlock(xrayUdpNoises);
    // 初始化表单状态（判断是否修改）
    initiateForm();
    // 获取并显示 IP 信息
    fetchIPInfo();
    // 启用国家国旗 Emoji
    polyfillCountryFlagEmojis();
}

// 使用 proxySettings 的数据填充面板的表单元素
function populatePanel(selectElements, checkboxElements, inputElements, textareaElements, proxySettings) {
    selectElements.forEach(key => document.getElementById(key).value = proxySettings[key]);
    checkboxElements.forEach(key => document.getElementById(key).checked = proxySettings[key]);
    inputElements.forEach(key => document.getElementById(key).value = proxySettings[key]);
    textareaElements.forEach(key => {
        const element = document.getElementById(key);
        // 将数组值转换为换行符分隔的字符串
        const value = proxySettings[key]?.join('\r\n');
        // 根据内容行数调整 textarea 高度
        const rowsCount = proxySettings[key].length;
        element.style.height = 'auto';
        if (rowsCount) element.rows = rowsCount;
        element.value = value;
    })
}

// 初始化表单，保存初始状态并监听变化以启用应用按钮
function initiateForm() {
    const configForm = document.getElementById('configForm');
    // 保存初始表单数据
    globalThis.initialFormData = new FormData(configForm);
    // 启用应用按钮
    enableApplyButton();

    // 监听输入和变化，启用应用按钮
    configForm.addEventListener('input', enableApplyButton);
    configForm.addEventListener('change', enableApplyButton);

    // 自动调整 textarea 高度
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
    const formDataToObject = (formData) => Object.fromEntries(formData.entries());
    const currentFormData = new FormData(configForm);
    const initialFormDataObj = formDataToObject(globalThis.initialFormData);
    const currentFormDataObj = formDataToObject(currentFormData);
    // 将对象转换为字符串进行比较
    return JSON.stringify(initialFormDataObj) !== JSON.stringify(currentFormDataObj);
}

// 根据表单是否更改来启用/禁用应用按钮
function enableApplyButton() {
    const applyButton = document.getElementById('applyButton');
    const isChanged = hasFormDataChanged();
    applyButton.disabled = !isChanged; // 如果未更改，禁用按钮
    applyButton.classList.toggle('disabled', !isChanged); // 切换 disabled 类
}

// 打开重置密码模态框
function openResetPass() {
    const resetPassModal = document.getElementById('resetPassModal');
    resetPassModal.style.display = "block";
    document.body.style.overflow = "hidden"; // 禁用页面滚动
}

// 关闭重置密码模态框
function closeResetPass() {
    const resetPassModal = document.getElementById('resetPassModal');
    resetPassModal.style.display = "none";
    document.body.style.overflow = ""; // 恢复页面滚动
}

// 关闭二维码模态框
function closeQR() {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    qrModal.style.display = "none";
    // 移除生成的二维码图片
    qrcodeContainer.lastElementChild.remove();
}

// 切换深色模式
function darkModeToggle() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    // 将模式状态保存到 localStorage
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// 获取 IP 详细信息
async function getIpDetails(ip) {
    try {
        const response = await fetch('/panel/my-ip', { method: 'POST', body: ip });
        const data = await response.json();
        const { success, status, message, body } = data;
        if (!success) throw new Error(`状态 ${status} - ${message}`); // Fetching IP error: status ${status} - ${message}
        return body;
    } catch (error) {
        console.error("获取 IP 错误:", error.message || error) // Fetching IP error:
    }
}

// 获取并显示 IP 地理位置信息
async function fetchIPInfo() {
    const refreshIcon = document.getElementById("refresh-geo-location").querySelector('i');
    refreshIcon.classList.add('fa-spin'); // 添加旋转动画
    // 更新 UI 函数
    const updateUI = (ip = '-', country = '-', countryCode = '-', city = '-', isp = '-', cfIP) => {
        // 生成国旗 Emoji
        const flag = countryCode !== '-' ? String.fromCodePoint(...[...countryCode].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)) : '';
        document.getElementById(cfIP ? 'cf-ip' : 'ip').textContent = ip;
        document.getElementById(cfIP ? 'cf-country' : 'country').textContent = country + ' ' + flag;
        document.getElementById(cfIP ? 'cf-city' : 'city').textContent = city;
        document.getElementById(cfIP ? 'cf-isp' : 'isp').textContent = isp;
    };

    try {
        // 获取 Other targets IP
        const response = await fetch('https://ipwho.is/' + '?nocache=' + Date.now(), { cache: "no-store" });
        const data = await response.json();
        const { success, ip, message } = data;
        if (!success) throw new Error(`获取 Other targets IP 失败，状态码 ${response.status}，URL ${response.url} - ${message}`); // Fetch Other targets IP failed at ${response.url} - ${message}
        // 获取 IP 详细信息并更新 UI
        const { country, countryCode, city, isp } = await getIpDetails(ip);
        updateUI(ip, country, countryCode, city, isp);
        refreshIcon.classList.remove('fa-spin'); // 移除旋转动画
    } catch (error) {
        console.error("获取 IP 错误:", error.message || error) // Fetching IP error:
    }

    try {
        // 获取 Cloudflare targets IP
        const response = await fetch('https://ipv4.icanhazip.com/?nocache=' + Date.now(), { cache: "no-store" });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`获取 Cloudflare targets IP 失败，状态码 ${response.status}，URL ${response.url} - ${errorMessage}`); // Fetch Cloudflare targets IP failed with status ${response.status} at ${response.url} - ${errorMessage}
        }

        const ip = await response.text();
        // 获取 IP 详细信息并更新 UI
        const { country, countryCode, city, isp } = await getIpDetails(ip);
        updateUI(ip, country, countryCode, city, isp, true);
        refreshIcon.classList.remove('fa-spin'); // 移除旋转动画
    } catch (error) {
        console.error("获取 IP 错误:", error.message || error) // Fetching IP error:
    }
}

// 下载 Warp 配置
function downloadWarpConfigs(isAmnezia) {
    const client = isAmnezia ? "?app=amnezia" : ""; // 如果是 Amnezia，添加参数
    window.location.href = "/panel/get-warp-configs" + client; // 跳转到下载链接
}

// 生成订阅 URL
function generateSubUrl(path, app, tag, hiddifyType, singboxType) {
    const url = new URL(window.location.href);
    url.pathname = `/sub/${path}/${globalThis.subPath}`; // 设置订阅路径
    // 添加应用参数
    app && url.searchParams.append('app', app);
    // 添加标签作为 hash
    if (tag) url.hash = `💦 BPB ${tag}`;

    // 返回特定客户端的 URL 方案
    if (singboxType) return `sing-box://import-remote-profile?url=${url.href}`;
    if (hiddifyType) return `hiddify://import/${url.href}`;
    return url.href; // 返回普通 URL
}

// 复制订阅 URL 到剪贴板
function subURL(path, app, tag, hiddifyType, singboxType) {
    const url = generateSubUrl(path, app, tag, hiddifyType, singboxType);
    copyToClipboard(url);
}

// 下载配置
async function dlURL(path, app) {
    const url = generateSubUrl(path, app);

    try {
        const response = await fetch(url);
        const data = await response.text();
        if (!response.ok) throw new Error(`状态 ${response.status}, URL ${response.url} - ${data}`); // status ${response.status} at ${response.url} - ${data}
        // 创建 Blob 对象并下载
        const blob = new Blob([data], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'config.json'; // 设置下载文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("下载错误:", error.message || error); // Download error:
    }
}

// 打开二维码模态框并生成二维码
function openQR(path, app, tag, title, singboxType, hiddifyType) {
    const qrModal = document.getElementById('qrModal');
    const qrcodeContainer = document.getElementById('qrcode-container');
    const url = generateSubUrl(path, app, tag, hiddifyType, singboxType);
    let qrcodeTitle = document.getElementById("qrcodeTitle");
    qrcodeTitle.textContent = title; // 设置二维码标题
    qrModal.style.display = "block"; // 显示模态框
    let qrcodeDiv = document.createElement("div");
    qrcodeDiv.className = "qrcode";
    qrcodeDiv.style.padding = "2px";
    qrcodeDiv.style.backgroundColor = "#ffffff";
    // 使用 qrcodejs 库生成二维码
    new QRCode(qrcodeDiv, {
        text: url,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H // 错误纠正级别
    });
    qrcodeContainer.appendChild(qrcodeDiv); // 将二维码添加到容器
}

// 将文本复制到剪贴板并提示
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert('✅ 已复制到剪贴板:\n\n' + text)) // ✅ Copied to clipboard:
        .catch(error => console.error('复制失败:', error)); // Failed to copy:
}

// 更新 Warp 配置
async function updateWarpConfigs() {
    const confirmReset = confirm('⚠️ 您确定吗？'); // ⚠️ Are you sure?
    if (!confirmReset) return;
    const refreshBtn = document.getElementById('updateWarpConfigs');
    document.body.style.cursor = 'wait'; // 显示等待光标
    const refreshButtonVal = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '⌛ 载入中...'; // ⌛ Loading...

    try {
        const response = await fetch('/panel/update-warp', { method: 'POST', credentials: 'include' });
        const { success, status, message } = await response.json();
        document.body.style.cursor = 'default'; // 恢复默认光标
        refreshBtn.innerHTML = refreshButtonVal; // 恢复按钮文本
        if (!success) {
            alert(`⚠️ 发生错误，请重试！\n⛔ ${message}`); // ⚠️ An error occured, Please try again!\n⛔ ${message}
            throw new Error(`状态 ${status} - ${message}`); // status ${status} - ${message}
        }

        alert('✅ Warp 配置更新成功！'); // ✅ Warp configs updated successfully!
    } catch (error) {
        console.error("更新 Warp 配置错误:", error.message || error) // Updating Warp configs error:
    }
}

// 处理协议选择变化（VLESS/Trojan）
function handleProtocolChange(event) {
    if (event.target.checked) {
        globalThis.activeProtocols++; // 启用协议数量加一
        return true;
    }

    globalThis.activeProtocols--; // 启用协议数量减一
    // 如果所有协议都被禁用，阻止操作并提示
    if (globalThis.activeProtocols === 0) {
        event.preventDefault();
        event.target.checked = !event.target.checked;
        alert("⛔ 至少需要选择一个协议！"); // ⛔ At least one Protocol should be selected!
        globalThis.activeProtocols++; // 协议数量恢复
        return false;
    }
}

// 处理 TLS 端口选择变化
function handlePortChange(event) {
    if (event.target.checked) {
        globalThis.activeTlsPorts.push(event.target.name); // 添加启用端口
        return true;
    }

    // 移除禁用的端口
    globalThis.activeTlsPorts = globalThis.activeTlsPorts.filter(port => port !== event.target.name);
    // 如果所有 TLS 端口都被禁用，阻止操作并提示
    if (globalThis.activeTlsPorts.length === 0) {
        event.preventDefault();
        event.target.checked = !event.target.checked;
        alert("⛔ 至少需要选择一个 TLS 端口！"); // ⛔ At least one TLS port should be selected!
        globalThis.activeTlsPorts.push(event.target.name); // 端口数量恢复
        return false;
    }
}

// 重置面板设置
function resetSettings() {
    const confirmReset = confirm('⚠️ 这将重置所有面板设置。\n❓ 您确定吗？'); // ⚠️ This will reset all panel settings.\n❓ Are you sure?
    if (!confirmReset) return;
    const resetBtn = document.querySelector('#resetSettings i');
    resetBtn.classList.add('fa-spin'); // 添加旋转动画
    const formData = new FormData();
    formData.append('resetSettings', 'true');
    document.body.style.cursor = 'wait'; // 显示等待光标

    fetch('/panel/reset-settings', { method: 'POST', body: formData, credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            const { success, status, message, body } = data;
            document.body.style.cursor = 'default'; // 恢复默认光标
            resetBtn.classList.remove('fa-spin'); // 移除旋转动画
            if (!success) throw new Error(`状态 ${status} - ${message}`); // status ${status} - ${message}
            // 重新初始化面板
            initiatePanel(body);
            alert('✅ 面板设置已成功重置为默认！'); // ✅ Panel settings reset to default successfully!
        })
        .catch(error => console.error("重置设置错误:", error.message || error)); // Reseting settings error:
}

// 更新设置（提交表单）
function updateSettings(event) {
    event.preventDefault();
    event.stopPropagation();

    // 需要验证的 textarea 元素
    const elementsToCheck = ['cleanIPs', 'customCdnAddrs', 'customCdnSni', 'customCdnHost', 'proxyIPs', 'customBypassRules', 'customBlockRules'];
    const configForm = document.getElementById('configForm');
    const formData = new FormData(configForm);

    // 执行所有验证规则
    const validations = [
        validateMultipleIpDomains(elementsToCheck), // 验证 IP/域名
        validateWarpEndpoints(), // 验证 Warp 节点
        validateMinMax(), // 验证最小/最大值
        validateChainProxy(), // 验证链式代理
        validateCustomCdn(), // 验证自定义 CDN
        validateXrayNoises(formData), // 验证 Xray 噪声配置
    ];

    // 如果有任何验证失败，停止提交
    if (!validations.every(Boolean)) return false;

    const applyButton = document.getElementById('applyButton');
    document.body.style.cursor = 'wait'; // 显示等待光标
    const applyButtonVal = applyButton.value;
    applyButton.value = '⌛ 载入中...'; // 更新按钮文本

    fetch('/panel/update-settings', { method: 'POST', body: formData, credentials: 'include' })
        .then(response => response.json())
        .then(data => {

            const { success, status, message } = data;
            // 处理会话过期
            if (status === 401) {
                alert('⚠️ 会话已过期！请重新登录。'); // ⚠️ Session expired! Please login again.
                window.location.href = '/login';
            }

            if (!success) throw new Error(`状态 ${status} - ${message}`); // status ${status} - ${message}
            // 重新初始化表单状态
            initiateForm();
            alert('✅ 设置已成功应用！'); // ✅ Settings applied successfully!
        })
        .catch(error => console.error("更新设置错误:", error.message || error)) // Update settings error:
        .finally(() => {
            document.body.style.cursor = 'default'; // 恢复默认光标
            applyButton.value = applyButtonVal; // 恢复按钮文本
        });
}

// 验证单个 IP 或域名格式
function isValidIpDomain(value) {
    const ipv6Regex = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\](?:\/(?:12[0-8]|1[01]?\d|[0-9]?\d))?$/gm;
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/(?:\d|[12]\d|3[0-2]))?$/gm;
    const domainRegex = /^(?=.{1,253}$)(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,63}$/gm;
    // 检查是否匹配 IPv4、IPv6 或域名格式
    return ipv4Regex.test(value) || ipv6Regex.test(value) || domainRegex.test(value);
}

// 验证多个 IP 或域名（从 textarea 中获取）
function validateMultipleIpDomains(elements) {

    const getValue = (id) => document.getElementById(id).value?.split('\n').filter(Boolean); // 按行分割并过滤空行

    const ips = [];
    elements.forEach(id => ips.push(...getValue(id))); // 收集所有 IP/域名
    const invalidIPs = ips?.filter(value => value && !isValidIpDomain(value.trim())); // 过滤出无效的

    // 如果存在无效 IP/域名，提示错误
    if (invalidIPs.length) {
        alert('⛔ 无效的IP或域名。\n👉 请每行输入一个IP/域名。\n\n' + invalidIPs.map(ip => '⚠️ ' + ip).join('\n')); // ⛔ Invalid IPs or Domains.\n👉 Please enter each IP/domain in a new line.\n\n ⚠️ ${ip}
        return false;
    }

    return true;
}

// 验证 Warp 节点格式（IP/域名:端口）
function validateWarpEndpoints() {

    function isValidEndpoint(value) {
        // 包含端口号的 IPv6、IPv4 和域名正则
        const ipv6Regex = /^\[(?:(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,7}:|(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}|(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}|(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}|(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}|(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}|[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}|:(?::[a-fA-F0-9]{1,4}){1,7})\](?:\/(?:12[0-8]|1[01]?\d|[0-9]?\d))?:(?:6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/gm;
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?:\/(?:\d|[12]\d|3[0-2]))?:(?:6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/gm;
        const domainRegex = /^(?=.{1,253}$)(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,63}:(?:6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/gm;
        return ipv4Regex.test(value) || ipv6Regex.test(value) || domainRegex.test(value);
    }

    const warpEndpoints = document.getElementById('warpEndpoints').value?.split('\n');
    const invalidEndpoints = warpEndpoints?.filter(value => value && !isValidEndpoint(value.trim()));

    // 如果存在无效节点，提示错误
    if (invalidEndpoints.length) {
        alert('⛔ 无效的节点。\n\n' + invalidEndpoints.map(endpoint => '⚠️ ' + endpoint).join('\n')); // ⛔ Invalid endpoint.\n\n⚠️ ${endpoint}
        return false;
    }

    return true;
}

// 验证最小/最大值设置
function validateMinMax() {

    const getValue = (id) => parseInt(document.getElementById(id).value, 10);

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

    // 检查所有最小/最大对，确保最小值小于等于最大值
    if (fragmentLengthMin >= fragmentLengthMax || fragmentIntervalMin > fragmentIntervalMax || noiseCountMin > noiseCountMax || noiseSizeMin > noiseSizeMax || noiseDelayMin > noiseDelayMax) {
        alert('⛔ 最小值应小于等于最大值！'); // ⛔ Minimum should be smaller or equal to Maximum!
        return false;
    }

    return true;
}

// 验证链式代理配置
function validateChainProxy() {

    const chainProxy = document.getElementById('outProxy').value?.trim();
    // 检查 VLESS 格式
    const isVless = /vless:\/\/[^\s@]+@[^\s:]+:[^\s]+/.test(chainProxy);
    const hasSecurity = /security=/.test(chainProxy);
    // 检查 Socks 或 Http 格式
    const isSocksHttp = /^(http|socks):\/\/(?:([^:@]+):([^:@]+)@)?([^:@]+):(\d+)$/.test(chainProxy);
    const securityRegex = /security=(tls|none|reality)/;
    const validSecurityType = securityRegex.test(chainProxy); // 检查 নিরাপত্তা (security) 类型是否有效
    const validTransmission = /type=(tcp|grpc|ws)/.test(chainProxy); // 检查传输类型是否有效

    // 如果不是有效的 VLESS、Socks 或 Http 格式，且不为空，则提示错误
    if (!(isVless && (hasSecurity && validSecurityType || !hasSecurity) && validTransmission) && !isSocksHttp && chainProxy) {
        alert('⛔ 配置无效！\n - 链式代理应为 VLESS, Socks 或 Http！\n - VLESS 传输类型应为 GRPC, WS 或 TCP\n - VLESS 安全类型应为 TLS, Reality 或 None\n - socks 或 http 格式应为：\n + (socks或http)://用户:密码@主机:端口\n + (socks或http)://主机:端口'); // ⛔ Invalid Config!\n - The chain proxy should be VLESS, Socks or Http!\n - VLESS transmission should be GRPC,WS or TCP\n - VLESS security should be TLS,Reality or None\n - socks or http should be like:\n + (socks or http)://user:pass@host:port\n + (socks or http)://host:port
        return false;
    }

    let match = chainProxy.match(securityRegex);
    const securityType = match?.[1] || null;
    match = chainProxy.match(/:(\d+)\?/);
    const vlessPort = match?.[1] || null;

    // 如果是 VLESS TLS，端口必须是 443
    if (isVless && securityType === 'tls' && vlessPort !== '443') {
        alert('⛔ VLESS TLS 端口只能是 443 才能用作链式代理！'); // ⛔ VLESS TLS port can be only 443 to be used as a proxy chain!
        return false;
    }

    return true;
}

// 验证自定义 CDN 设置
function validateCustomCdn() {

    const customCdnHost = document.getElementById('customCdnHost').value;
    const customCdnSni = document.getElementById('customCdnSni').value;
    const customCdnAddrs = document.getElementById('customCdnAddrs').value?.split('\n').filter(Boolean);

    const isCustomCdn = customCdnAddrs.length || customCdnHost !== '' || customCdnSni !== '';
    // 如果启用了自定义 CDN，则所有字段都必须填写
    if (isCustomCdn && !(customCdnAddrs.length && customCdnHost && customCdnSni)) {
        alert('⛔ 所有“自定义”字段应同时填写或删除！'); // ⛔ All "Custom" fields should be filled or deleted together!
        return false;
    }

    return true;
}

// 验证 Xray UDP 噪声配置
function validateXrayNoises(formData) {
    // 获取所有 UDP 噪声相关的表单数据
    const udpNoiseModes = formData.getAll('udpXrayNoiseMode') || [];
    const udpNoisePackets = formData.getAll('udpXrayNoisePacket') || [];
    const udpNoiseDelaysMin = formData.getAll('udpXrayNoiseDelayMin') || [];
    const udpNoiseDelaysMax = formData.getAll('udpXrayNoiseDelayMax') || [];
    const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/; // Base64 正则
    let submisionError = false;

    // 遍历每个噪声配置进行验证
    for (const [index, mode] of udpNoiseModes.entries()) {
        // 验证延迟最小/最大值
        if (parseInt(udpNoiseDelaysMin[index], 10) > parseInt(udpNoiseDelaysMax[index], 10)) {
            alert('⛔ 最小噪声延迟应小于等于最大值！'); // ⛔ The minimum noise delay should be smaller or equal to maximum!
            submisionError = true;
            break;
        }

        // 根据噪声模式进行特定验证
        switch (mode) {
            case 'base64':
                if (!base64Regex.test(udpNoisePackets[index])) {
                    alert('⛔ Base64 噪声数据包不是有效的 base64 值！'); // ⛔ The Base64 noise packet is not a valid base64 value!
                    submisionError = true;
                }
                break;

            case 'rand':
                if (!(/^\d+-\d+$/.test(udpNoisePackets[index]))) {
                    alert('⛔ 随机噪声数据包应为范围格式，例如 0-10 或 10-30！'); // ⛔ The Random noise packet should be a range like 0-10 or 10-30!
                    submisionError = true;
                } else {
                    const [min, max] = udpNoisePackets[index].split("-").map(Number);
                    if (min > max) {
                        alert('⛔ 随机噪声数据包的最小值应小于等于最大值！'); // ⛔ The minimum Random noise packet should be smaller or equal to maximum!
                        submisionError = true;
                    }
                }
                break;

            case 'hex':
                if (!(/^(?=(?:[0-9A-Fa-f]{2})*$)[0-9A-Fa-f]+$/.test(udpNoisePackets[index]))) {
                    alert('⛔ Hex 噪声数据包不是有效的十六进制值！它应具有偶数长度，且由 0-9, a-f 和 A-F 组成。'); // ⛔ The Hex noise packet is not a valid hex value! It should have even length and consisted of 0-9, a-f and A-F.
                    submisionError = true;
                }
                break;
        }

        if (submisionError) break; // 如果当前噪声验证失败，则跳出循环
    }

    return !submisionError; // 返回是否有错误
}

// 注销
function logout(event) {
    event.preventDefault();

    fetch('/logout', { method: 'GET', credentials: 'same-origin' })
        .then(response => response.json())
        .then(data => {
            const { success, status, message } = data;
            if (!success) throw new Error(`状态 ${status} - ${message}`); // status ${status} - ${message}
            window.location.href = '/login'; // 注销成功后跳转到登录页
        })
        .catch(error => console.error("注销错误:", error.message || error)); // Logout error:
}

// 为密码输入框添加显示/隐藏功能
document.querySelectorAll(".toggle-password").forEach(toggle => {
    toggle.addEventListener("click", function () {
        const input = this.previousElementSibling; // 获取前面的输入框
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password"; // 切换输入框类型
        this.textContent = isPassword ? "visibility" : "visibility_off"; // 切换图标文本
    });
});

// 重置密码
function resetPassword(event) {
    event.preventDefault();
    const resetPassModal = document.getElementById('resetPassModal');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('passwordError');
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // 验证密码一致性
    if (newPassword !== confirmPassword) {
        passwordError.textContent = "密码不匹配"; // Passwords do not match
        return false;
    }

    // 验证密码复杂性
    const hasCapitalLetter = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const isLongEnough = newPassword.length >= 8;

    if (!(hasCapitalLetter && hasNumber && isLongEnough)) {
        passwordError.textContent = '⚠️ 密码必须包含至少一个大写字母、一个数字，且长度至少为8个字符。'; // ⚠️ Password must contain at least one capital letter, one number, and be at least 8 characters long.
        return false;
    }

    // 发送重置密码请求
    fetch('/panel/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: newPassword,
        credentials: 'same-origin'
    })
        .then(response => response.json())
        .then(data => {

            const { success, status, message } = data;
            if (!success) {
                passwordError.textContent = `⚠️ ${message}`;
                throw new Error(`状态 ${status} - ${message}`); // status ${status} - ${message}
            }

            alert("✅ 密码修改成功！👍"); // ✅ Password changed successfully! 👍
            window.location.href = '/login'; // 修改成功后跳转到登录页

        })
        .catch(error => console.error("重置密码错误:", error.message || error)) // Reset password error:
        .finally(() => {
            resetPassModal.style.display = "none"; // 关闭模态框
            document.body.style.overflow = ""; //恢复页面滚动
        });
}

// 渲染端口选择区块
function renderPortsBlock(ports) {
    let noneTlsPortsBlock = '', tlsPortsBlock = '';
    // 获取所有预设端口
    const allPorts = [...(window.origin.includes('workers.dev') ? defaultHttpPorts : []), ...defaultHttpsPorts];

    // 遍历所有端口，生成复选框 HTML
    allPorts.forEach(port => {
        const isChecked = ports.includes(port) ? 'checked' : '';
        const clss = defaultHttpsPorts.includes(port) ? 'class="https"' : '';
        const portBlock = `
            <div class="routing">
                <input type="checkbox" name=${port} ${clss} value="true" ${isChecked}>
                <label>${port}</label>
            </div>`;

        // 根据是否是 HTTPS 端口添加到对应的区块
        defaultHttpsPorts.includes(port) ? tlsPortsBlock += portBlock : noneTlsPortsBlock += portBlock;
    });

    document.getElementById("tls-ports").innerHTML = tlsPortsBlock; // 设置 TLS 端口 HTML
    // 如果存在非 TLS 端口，显示非 TLS 端口区块
    if (noneTlsPortsBlock) {
        document.getElementById("non-tls-ports").innerHTML = noneTlsPortsBlock;
        document.getElementById("none-tls").style.display = 'flex';
    }
}

// 添加 UDP 噪声配置区块
function addUdpNoise(isManual, index, noise) {

    // 如果没有提供噪声数据，使用默认值
    if (!noise) return addUdpNoise(isManual, index, {
        type: 'rand', // 默认模式：随机
        packet: '50-100', // 默认数据包范围
        delay: '1-5', // 默认延迟范围
        count: 5 // 默认计数
    });

    const container = document.createElement('div');
    container.className = "inner-container";
    container.id = `udp-noise-${index + 1}`; // 设置唯一ID

    // 生成噪声配置区块的 HTML
    container.innerHTML = `
        <div class="header-container">
            <h4>噪声 ${index + 1}</h4> <!-- Noise ${index + 1} -->
            <button type="button" class="delete-noise" title="删除噪声"> <!-- Delete noise -->
                <i class="fa fa-minus-circle fa-2x" aria-hidden="true"></i>
            </button>
        </div>
        <div class="section">
            <div class="form-control">
                <label>😵‍💫 v2ray 模式</label> <!-- 😵‍💫 v2ray Mode -->
                <div>
                    <select name="udpXrayNoiseMode">
                        <option value="base64" ${noise.type === 'base64' ? 'selected' : ''}>Base64</option>
                        <option value="rand" ${noise.type === 'rand' ? 'selected' : ''}>随机</option> <!-- Random -->
                        <option value="str" ${noise.type === 'str' ? 'selected' : ''}>字符串</option> <!-- String -->
                        <option value="hex" ${noise.type === 'hex' ? 'selected' : ''}>Hex</option>
                    </select>
                </div>
            </div>
            <div class="form-control">
                <label>📥 噪声数据包</label> <!-- 📥 Noise Packet -->
                <div>
                    <input type="text" name="udpXrayNoisePacket" value="${noise.packet}">
                </div>
            </div>
            <div class="form-control">
                <label>🕞 噪声延迟 (ms)</label> <!-- 🕞 Noise Delay -->
                <div class="min-max">
                    <input type="number" name="udpXrayNoiseDelayMin"
                        value="${noise.delay.split('-')[0]}" min="1" required>
                    <span> - </span>
                    <input type="number" name="udpXrayNoiseDelayMax"
                        value="${noise.delay.split('-')[1]}" min="1" required>
                </div>
            </div>
            <div class="form-control">
                <label>🎚️ 噪声计数</label> <!-- 🎚️ Noise Count -->
                <div>
                    <input type="number" name="udpXrayNoiseCount" value="${noise.count}" min="1" required>
                </div>
            </div>
        </div>`;

    // 为删除按钮和模式选择器绑定事件
    container.querySelector(".delete-noise").addEventListener('click', deleteUdpNoise);
    container.querySelector("select[name='udpXrayNoiseMode']").addEventListener('change', generateUdpNoise);

    document.getElementById("noises").append(container); // 将新区块添加到容器
    isManual && enableApplyButton(); // 如果是手动添加，启用应用按钮
    globalThis.xrayNoiseCount++; // 增加噪声计数
}

// 根据选择的模式生成随机噪声数据包内容
function generateUdpNoise(event) {

    // 随机 Base64 字符串生成函数
    const generateRandomBase64 = length => {
        const array = new Uint8Array(Math.ceil(length * 3 / 4));
        crypto.getRandomValues(array);
        let base64 = btoa(String.fromCharCode(...array));
        return base64.slice(0, length);
    }

    // 随机 Hex 字符串生成函数
    const generateRandomHex = length => {
        const array = new Uint8Array(Math.ceil(length / 2));
        crypto.getRandomValues(array);
        let hex = [...array].map(b => b.toString(16).padStart(2, '0')).join('');
        return hex.slice(0, length);
    }

    // 随机字符串生成函数
    const generateRandomString = length => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = new Uint8Array(length);
        return Array.from(crypto.getRandomValues(array), x => chars[x % chars.length]).join('');
    };

    // 获取当前噪声区块的数据包输入框
    const noisePacket = event.target.closest(".inner-container").querySelector('[name="udpXrayNoisePacket"]');

    // 根据选择的模式设置默认或随机生成的数据包内容
    switch (event.target.value) {
        case 'base64':
            noisePacket.value = generateRandomBase64(64); // 默认生成 64 长度 Base64
            break;

        case 'rand':
            noisePacket.value = "50-100"; // 默认随机范围
            break;

        case 'hex':
            noisePacket.value = generateRandomHex(64); // 默认生成 64 长度 Hex
            break;

        case 'str':
            noisePacket.value = generateRandomString(64); // 默认生成 64 长度字符串
            break;
    }
}

// 删除 UDP 噪声配置区块
function deleteUdpNoise(event) {
    // 如果只剩下一个噪声，阻止删除
    if (globalThis.xrayNoiseCount === 1) {
        alert('⛔ 您不能删除所有噪声！'); // ⛔ You cannot delete all noises!
        return;
    }

    const confirmReset = confirm('⚠️ 这将删除该噪声。\n❓ 您确定吗？'); // ⚠️ This will delete the noise.\n❓ Are you sure?
    if (!confirmReset) return;
    event.target.closest(".inner-container").remove(); // 移除当前噪声区块
    enableApplyButton(); // 启用应用按钮
    globalThis.xrayNoiseCount--; // 减少噪声计数
}

// 渲染现有的 UDP 噪声配置区块
function renderUdpNoiseBlock(xrayUdpNoises) {
    // 遍历噪声数据，逐个添加区块
    xrayUdpNoises.forEach((noise, index) => {
        addUdpNoise(false, index, noise); // 不是手动添加，而是渲染现有数据
    });
}
