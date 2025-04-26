import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'esbuild';
import { sync } from 'glob';
import { minify as jsMinify } from 'terser';
import { minify as htmlMinify } from 'html-minifier';
import JSZip from "jszip";
import obfs from 'javascript-obfuscator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

const ASSET_PATH = join(__dirname, '../src/assets'); // 源代码/资产路径
const DIST_PATH = join(__dirname, '../dist/'); // dist 目录

// 处理 HTML 页面
async function processHtmlPages() {
    // 查找所有 index.html 文件
    const indexFiles = sync('**/index.html', { cwd: ASSET_PATH });
    const result = {};

    for (const relativeIndexPath of indexFiles) {
        const dir = pathDirname(relativeIndexPath);
        // 构建完整路径
        const base = (file) => join(ASSET_PATH, dir, file);

        // 读取文件
        const indexHtml = readFileSync(base('index.html'), 'utf8');
        const styleCode = readFileSync(base('style.css'), 'utf8');
        const scriptCode = readFileSync(base('script.js'), 'utf8');

        // 压缩脚本
        const finalScriptCode = await jsMinify(scriptCode);
        // 内联样式和脚本
        const finalHtml = indexHtml
            .replace(/__STYLE__/g, `<style>${styleCode}</style>`)
            .replace(/__SCRIPT__/g, finalScriptCode.code);

        // 压缩最终的 HTML
        const minifiedHtml = htmlMinify(finalHtml, {
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            minifyCSS: true
        });

        // 将目录名映射到压缩后的 HTML 内容
        result[dir] = JSON.stringify(minifiedHtml);
    }

    console.log('✅ 资源打包成功！');
    return result;
}

// 构建 worker
async function buildWorker() {

    // 处理 HTML 页面
    const htmls = await processHtmlPages();
    // 读取并进行 base64 编码的 favicon
    const faviconBuffer = readFileSync('./src/assets/favicon.ico');
    const faviconBase64 = faviconBuffer.toString('base64');

    // 构建 worker 脚本
    const code = await build({
        entryPoints: [join(__dirname, '../src/worker.js')],
        bundle: true,
        format: 'esm',
        write: false,
        external: ['cloudflare:sockets'],
        platform: 'node',
        define: {
            __PANEL_HTML_CONTENT__: htmls['panel'] ?? '""',
            __LOGIN_HTML_CONTENT__: htmls['login'] ?? '""',
            __ERROR_HTML_CONTENT__: htmls['error'] ?? '""',
            __SECRETS_HTML_CONTENT__: htmls['secrets'] ?? '""',
            __ICON__: JSON.stringify(faviconBase64)
        }
    });

    console.log('✅ Worker 构建成功！');

    // 压缩 worker 代码
    const minifiedCode = await jsMinify(code.outputFiles[0].text, {
        module: true,
        output: {
            comments: false
        }
    });

    console.log('✅ Worker 压缩成功！');

    // 混淆 worker 代码
    const obfuscationResult = obfs.obfuscate(minifiedCode.code, {
        stringArrayThreshold: 1,
        stringArrayEncoding: [
            "rc4"
        ],
        numbersToExpressions: true,
        transformObjectKeys: true,
        renameGlobals: true,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.2,
        simplify: true,
        compact: true,
        target: "node"
    });

    const worker = obfuscationResult.getObfuscatedCode();
    console.log('✅ Worker 混淆成功！');

    // 如果 dist 目录不存在则创建
    mkdirSync(DIST_PATH, { recursive: true });
    // 写入 worker 文件
    writeFileSync('./dist/worker.js', worker, 'utf8');

    // 创建 zip 归档
    const zip = new JSZip();
    zip.file('_worker.js', worker);
    zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    }).then(nodebuffer => writeFileSync('./dist/worker.zip', nodebuffer));

    console.log('✅ Worker 文件发布成功！');
}

// 执行构建过程，捕获错误并退出
buildWorker().catch(err => {
    console.error('❌ 构建失败:', err);
    process.exit(1);
});
