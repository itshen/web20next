# Web 2.0 Next

[English](README.md) · 简体中文

**表达自我，连接彼此。**

Web 2.0 Next 是一个以宣言与个人网站名录为核心的共建项目：延续个人网站、博客与友情链接的开放精神，让个人表达与真实连接在 Agent 时代继续生长。

## 项目信息

- 项目名称：Web 2.0 Next
- 发起方：[Next Token 词元之外](https://nexttoken.tv)
- 中文定位：Web 2.0 的下一章
- GitHub 组织与仓库标识：`web20next/web20next`
- 正式站点地址：`https://web20next.com`
- 网站核心内容：宣言、个人网站名录、加入名录入口
- 技术架构：Astro 静态生成、TypeScript、原生 CSS；目标部署平台为 Cloudflare Workers Static Assets。

## 资料目录

- [Agent 工作约定](AGENTS.md)：项目固定要求、规范入口与验证边界。
- [双语网站审校 skill](.agents/skills/review-bilingual-site/SKILL.md)：中英文语义对齐、自然表达与跨页面、分享图片同步检查，可用于其他双语网站。
- [宣言](docs/manifesto.zh-CN.md)：完整中文宣言，也是中文页面与分享图片的内容来源。
- [视觉与交互约定](docs/visual-direction.md)：当前配色、布局、图标、页脚和消息复制区规范。
- [设计系统](https://web20next.com/design-system)：网站的设计变量与组件示例。本地通过 `npm run dev` 预览；默认语言入口为 `src/pages/index.astro`，页面共用 `src/views/` 组件。

## 参与开放网络

面向人的入口是把 Web 2.0 Next 与自己的网站地址交给 Agent；`/join` 提供可复制的自然语言消息。首页和页脚不展示 PR 流程或 llms.txt 链接。`/how-it-works`（中文 `/zh/how-it-works`）用流程图和正文说明 Agent 准备资料、发起 PR、检查与审核、合并部署、进入名录的机制。HTML `rel="describedby"` 为支持该发现方式的 Agent 提供 llms.txt 入口；它不保证所有 Agent 都会自动读取。Agent 读取下述规范后协助提交；GitHub 开源链接保留。

网站通过 GitHub Pull Request 加入、更新或移除名录。每个网站对应 `sites/<slug>.json`，由站主或获授权者提交；维护者审核合并并成功部署后更新网站。

- [贡献指南](CONTRIBUTING.zh-CN.md)：字段、提交、审核、更正和移除规则。
- [Agent 投稿指南](docs/agent-guide.md)：Agent 的资料核实与 PR 提交约定。
- [PR 模板](.github/PULL_REQUEST_TEMPLATE/site.zh-CN.md)、[资料示例](examples/site.example.json)与 [JSON Schema](schemas/site.schema.json)。
- 网站 `/llms.txt` 提供 Agent 发现入口，`/directory.json` 导出与页面相同的名录。
- 正式名录由 `sites/*.json` 提供；示例文件不进入正式名录。
- 背景介绍：`/xfn`、`/rss`、`/web-2-0`、`/llms`，支持中文对应页面。页脚保留品牌、GitHub、RSS 入口与个人网站徽章，其余链接按了解开放网络、面向 Agent、项目三个小节展示，RSS 订阅页提供介绍入口。
- 首页展示四位主理人（杨攀、向阳乔木、歸藏、Orange）及小互、姚金刚的网站，并通过“更多网站”进入完整名录：英文 `/websites`，中文 `/zh/websites`。完整名录、RSS 与 `/directory.json` 均包含全部记录。
- GitHub 校验工作流检查 PR 和推送；部署工作流在 `main` 更新且检查通过后发布网站。

## 内容原则

个人网站由站主自主维护；名录收录自愿提交、适合公开的信息。内容准确、来源明确，公开范围由本人决定。

## 开发与构建

使用 Node.js 24（最低 24.14.1）；`.nvmrc` 与 CI 固定使用 24.14.1，`package.json` 限定 24.x。在本仓库根目录执行：

```sh
npm ci
npm run dev
```

- `npm run validate:directory`：校验名录字段、网址与重复记录；构建前也会自动执行。
- `npm test`：运行名录、国际化、RSS、URL 与样式架构回归测试。
- `npm run check`：检查 Astro 与 TypeScript。
- `npm run build`：生成静态网站到 `dist/`。
- `npm run preview`：预览构建产物。
- `npm run preview:cf`：构建后使用 Wrangler 在本地预览 Cloudflare 静态资源服务。
- `npm run deploy:dry-run`：构建并校验部署打包，不发布网站。
- `npm run deploy`：验证 `SITE_URL`、检查、构建并发布至 Cloudflare，需要已授权的 Cloudflare 账号。

包含 Wrangler 的命令在沙箱外执行。

## 架构与部署

- 页面使用 Astro 组件，默认在构建时生成 HTML；没有 React 运行时或 SSR 服务。
- 样式位于 `src/styles/global.css`；首页宣言默认完整展开，参与说明位于 `/join`。
- 宣言按语言读取 `docs/manifesto.<locale>.md`，页面与 Markdown 资源保持单一内容来源。
- `public/` 保存静态资源；`dist/` 是构建产物，不纳入版本控制。使用 `npm run dev` 或构建后的 `npm run preview` 预览页面。
- Cloudflare 配置位于 `wrangler.jsonc`，部署名称为 `web20next`，静态资源目录为 `dist/`，未知路径返回 `404.html`。
- [部署工作流](.github/workflows/deploy.yml) 在推送到 `main`（包括合并 PR）时自动发布 `web20next` Worker；也可在 **Actions → Deploy website → Run workflow** 中选择 `main` 手动触发。仅 `web20next/web20next` 仓库的 `main` 分支允许部署，PR 和 Fork 不发布到生产环境。
- 在 GitHub 仓库 **Settings → Secrets and variables → Actions → New repository secret** 中配置 `CLOUDFLARE_API_TOKEN`（有权向目标账号部署 Workers 的 API Token）和 `CLOUDFLARE_ACCOUNT_ID`（目标 Cloudflare 账号 ID）。使用 Cloudflare 的 **Edit Cloudflare Workers** 模板，将权限限定到目标账号及必要的 Zone；操作见 [Cloudflare 认证指南](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)。凭据只存入 GitHub Secrets。
- 每次部署先按锁文件安装依赖、校验正式地址、运行测试及类型检查，再构建并发布 `dist/`。构建包含名录校验；Cloudflare Action 使用锁文件固定的 Wrangler。凭据仅传入最初的配置检查与部署步骤；缺少 Secret 时立即停止部署。部署任务串行执行；独立校验工作流继续检查 PR 和推送。
- `wrangler.jsonc` 在部署时将 `web20next.com` 作为自定义域名绑定到 `web20next` Worker，并关闭 `workers.dev` 地址。Cloudflare 账号中须有已激活的 `web20next.com` Zone，部署 Token 须具有对应账号与 Zone 的 Workers Scripts Edit、Workers Routes Edit 和 Zone Read 权限。自动部署统一使用 GitHub Actions；如同一 Worker 已启用 Cloudflare Workers Builds 自动触发，应关闭该触发以避免重复部署。
- 当前采用纯静态资源部署，无需 Cloudflare SSR adapter。后续如需服务端投稿或动态路由，再引入对应服务。

## 国际化

- 默认英文：首页 `/`、Agent 协助分享页 `/join`、Agent 入口 `/llms.txt`。
- 中文：首页 `/zh`、Agent 协助分享页 `/zh/join`、Agent 入口统一为英文 `/llms.txt`（`/zh/llms.txt` 保留为相同内容的兼容地址）。
- 导航以地球图标和当前语言展示下拉选择器，语言列表由配置生成，支持扩展及滚动；切换保留当前页面，JavaScript 可用时也保留章节锚点。
- 语言注册、默认语言和路径由 `src/i18n/index.ts` 管理，文案位于 `src/i18n/locales/`。
- 两种语言共用布局和名录，站主提交的资料保持原文。
- 新增语言的文件规范与校验方式见 [国际化指南](docs/i18n.md)。

## RSS 订阅

- 英文订阅说明 `/subscribe`、中文订阅说明 `/zh/subscribe` 均提供统一订阅地址 `/rss.xml`；另保留 `/zh/rss.xml` 中文 Feed 路由。
- 页脚和名录提供订阅入口，HTML 声明 RSS 自动发现链接。订阅页支持复制地址。
- RSS 2.0 包含对应语言的完整宣言和当前名录中的网站介绍；网站资料保留站主原文。新增、更正或移除资料后，Feed 在下一次成功构建、部署时同步。
- 网站条目的稳定 GUID 来自 JSON 文件名；修改名称、介绍或网址时保留文件名。重复构建不产生新 ID。阅读器是否提示已有条目的更正取决于阅读器行为。
- 没有可靠发布日期的内容不输出 `pubDate`，不使用部署时间冒充发布时间。Feed 不抓取或转载作者文章；读者可以通过名录中的站点 RSS/Atom 链接单独订阅。
- 默认站点地址为 `https://web20next.com`，用于 Feed 中的绝对链接。无需额外配置环境变量；`SITE_URL` 可覆盖为其他 HTTPS 根地址（不带路径、查询参数或片段），`npm run deploy` 会校验最终地址。
- 本地开发仍可通过 `http://127.0.0.1:4322` 访问，生成的对外链接默认使用正式域名。如需仅测试 Feed 内部的本地链接，可用 `SITE_URL=http://127.0.0.1:4322 npm run dev -- --host 127.0.0.1 --port 4322` 启动。

## 宣言与社交分享

- 独立宣言页：英文 `/manifesto`，中文 `/zh/manifesto`。首页第二节继续完整展示宣言；独立页面提供分享卡片下载和页面链接复制。
- 保存用的宣言卡片为 1080 × 1350 PNG；网站和宣言页的 Open Graph 图片为 1200 × 630 PNG，每种图片均有中英文版本。
- 指令、Agent 消息和功能链接不带语言前缀；宣言分享地址统一为 `https://web20next.com/manifesto`，订阅地址统一为 `https://web20next.com/rss.xml`。阅读页面及语言切换继续使用对应语言路径。
- 页面输出 Open Graph、Twitter 大图卡片及 canonical 元信息。宣言分享链接、canonical 和 Open Graph 元信息统一使用 `src/lib/site-url.ts` 中的正式域名 `https://web20next.com`，不受本地预览的 `SITE_URL` 覆盖；社交平台需要能够公开访问网站和图片才能生成链接预览。
- 图片存放在 `public/social/`，Cloudflare 直接提供静态资源。图片生成和更新方式见 [社交分享资源](docs/social-sharing.md)。

## 设计系统

- 英文 `/design-system`，中文 `/zh/design-system`，页脚提供入口。页面演示品牌、颜色、字体、间距、布局、圆角、阴影、按钮状态、输入框、名录、徽章、RSS 和分享图片。
- 所有手写 CSS 集中在 `src/styles/global.css`：设计变量、基础样式、组件、响应式规则、社交卡片及设计系统示例。组件与页面只引用 class，不定义内嵌 CSS。
- 构建配置禁止内嵌样式，生成页面使用外链 CSS。Astro 开发服务器使用其自带的样式热更新机制。
- 设计系统的变量标注从 CSS 读取。样式架构测试检查单一 CSS 来源及内嵌样式，避免样式重新分散。

## 许可

代码采用 [MIT](LICENSE)，项目原创宣言、文案、文章和分享卡片采用 [CC BY 4.0](LICENSE-CONTENT)。站主条目与第三方内容不自动适用这两种许可；请参阅[许可范围与投稿授权](docs/licensing.md)。
