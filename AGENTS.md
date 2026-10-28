# Web 2.0 Next Agent Notes

## 项目目标

表达自我，连接彼此。以宣言和个人网站名录为核心，让 Web 2.0 的开放精神在 Agent 时代继续生长。项目定位见 README.md；界面文案以 `src/i18n/locales/` 为准，宣言以 `docs/manifesto.<locale>.md` 为准。

## 工作约定

- 使用 Conventional Commits；必要时按逻辑拆分提交。
- 代码采用 MIT，项目原创内容采用 CC BY 4.0；站主投稿及第三方材料不自动适用这两种许可。遵循 `docs/licensing.en.md` 的范围与贡献条款。
- 当前使用 Astro 静态生成，部署目标为 Cloudflare Workers Static Assets。未经用户明确要求，不创建 Git 提交、不推送、不部署。
- `.github/workflows/deploy.yml` 在本仓库 `main` 推送或手动触发时，先校验再发布至 Cloudflare；推送到 `main` 会触发生产部署。PR 校验不使用 Cloudflare 凭据，部署凭据通过 GitHub Secrets 配置。
- 文档只记录事实与当前约定，不保留讨论过程、未采用的提案、阶段计划或重复的页面文案，除非用户明确要求。`docs/` 保留网站使用的内容源及长期维护指南。
- 产品界面展示目标与结果，不展示内部推理过程。
- 未确定的技术栈、托管、许可或投稿机制不能写成已确定事实。
- 不将群聊原文、成员信息、账号凭据或其他私人资料加入仓库。
- 名录只使用自愿提交或明确允许使用的公开资料；不把推断当作作者自述。
- gh 和 wrangler 命令应在沙箱外执行。
- Node.js 使用 24.x，具体最低版本及本地、CI 固定版本以 `package.json`、`.nvmrc` 为准。

## 品牌与页面约定

- 发起方为 Next Token 词元之外（https://nexttoken.tv），页脚品牌区保留署名与链接。首页名录选取四位主理人（杨攀、向阳乔木、歸藏、Orange）及小互、姚金刚的网站；展示名单以 `src/data/sites.ts` 为准，不按完整名录的文件顺序截取。

- 固定标语为“表达自我，连接彼此。”和“Express yourself. Connect with others.”；首页、宣言、元信息和分享图片保持一致。页面与卡片从语言字典及宣言源文件取文案，不维护额外副本。
- 参与者是对等的网站拥有者。导航使用“加入 / Join”，分享入口使用“分享你的网站 / Share your website”；不使用“加入我们”或把对等理念直接改写成新口号。
- 宣言是首页的核心阅读内容：位于主视觉之后、网站名录之前，完整展开，有外边框，采用标题在上、正文在下的版式；同时保留独立宣言页和可保存图片。
- 不承诺搜索排名、AI 引用或流量提升；`llms.txt` 不保证所有 Agent 都会自动读取。
- 首页是名录预览，完整列表、RSS 和机器目录保留全部记录。记录来自 `sites/`，不为首页截断共同数据源，不翻译或补写未经站主确认的资料。
- 具体布局、图标、页脚和消息复制区域遵循 [视觉与交互约定](docs/visual-direction.md)；区分当前设计与全站通用要求，不把单个组件的样式选择推广到所有链接和按钮。

## 名录贡献

- 首页和加入页以把网站交给 Agent 为主要引导；独立“如何运作”页明确解释 Agent 读取规则、准备 JSON、通过 GitHub PR 提交、自动检查、维护者审核、合并和部署后进入名录的实际机制。首页和加入页正文不展开技术流程。页脚以“面向 Agent / For agents”为独立小节标题，与“了解开放网络”和“项目”同级，提供“什么是 llms.txt？ / What is llms.txt?”介绍页入口；介绍页按阅读语言本地化，实际文件链接统一指向英文 `/llms.txt`。保留 head 发现声明、Agent 文档和开源项目链接。

- 加入、更新和移除网站默认遵循 `CONTRIBUTING.md` 与 `docs/agent-guide.en.md`；中文参考 `CONTRIBUTING.zh-CN.md` 与 `docs/agent-guide.md`，通过 GitHub PR 完成。
- 名录文件位于 `sites/<slug>.json`，字段以 `schemas/site.schema.json` 为准；不要修改校验器来绕过投稿限制。
- 提交前运行 `npm run validate:directory`、`npm test`、`npm run check` 和 `npm run build`。
- PR 正文默认使用 `.github/pull_request_template.md`，中文可使用 `.github/PULL_REQUEST_TEMPLATE/site.zh-CN.md`；如实填写授权、来源和验证结果；不发布私人证明或凭据。

## 国际化

- 本站 URL 统一不带末尾斜线：正式首页写作 `https://web20next.com`，页面路径使用 `/manifesto`、`/zh` 等形式。显示、复制、Agent 指令、canonical、Open Graph、文档和生成资源遵循同一规则；绝对公开链接通过 `publicUrl()` 生成。根路径相对链接 `/` 是必要的例外。保留查询参数和锚点，不改写外部网站地址。Astro 与 Cloudflare 配置共同处理无末尾斜线的页面路由。

- 默认英文无路径前缀，中文使用 `/zh`；语言配置以 `src/i18n/index.ts` 为准。仓库默认 `README.md`、`CONTRIBUTING.md` 与 `.github/pull_request_template.md` 使用英文；中文贡献指南为 `CONTRIBUTING.zh-CN.md`，中文 PR 模板为 `.github/PULL_REQUEST_TEMPLATE/site.zh-CN.md`。
- 指令性、功能性及面向 Agent 的站内链接统一使用无语言前缀的地址，不附加 `/zh` 或其他语言路径；包括 Agent 消息中的网站地址、分享与复制链接、订阅地址、llms.txt 和机器读取入口。对外地址使用正式域名 `https://web20next.com`。阅读页面导航、语言切换及对应语言页面的 canonical 保留正确的语言路径。
- 界面文案通过语言字典维护，不在页面组件里硬编码单一语言。保持中英文的共建立场和相同投稿规则。
- 中英文严格对应事实、动作、条件和确定程度；英文使用自然表达，不机械逐字翻译。中文中的 Agent、Feed 使用该大小写，英文遵循普通句式大小写。术语及审校范围见 [国际化约定](docs/i18n.md)。
- llms.txt 统一使用英文，所有界面语言共享 `docs/llms.en.txt`，页面发现声明指向 `/llms.txt`；不新增翻译版本。
- 新语言须补齐字典与相关 Markdown/Agent 资源；遵循 `docs/i18n.md`，不得自动翻译站主资料。

## 设计系统与 CSS

- 所有手写 CSS 仅位于 `src/styles/global.css`，包括页面、组件、设计系统示例与社交分享图片样式。禁止在组件、HTML 或生成脚本中定义内嵌样式，也不通过 JavaScript 写入 style。
- 优先使用全局设计变量和已有组件类。设计系统页为 `/design-system`、`/zh/design-system`，其变量标注读取同一 CSS 来源。
- 构建产物使用外链 CSS，不把样式嵌入 HTML。页面通过 `npm run dev` 或构建后的 `npm run preview` 预览；只维护 Astro 源码，不在仓库中另存导出的 HTML 页面副本。`dist/` 是部署构建产物，不纳入版本控制。
- 修改共享样式后检查页面与卡片；影响卡片的修改需执行 `npm run generate:social` 并检查图片，最后运行 `npm run build` 和 `npm test`。

## 规范入口与验证

- [国际化约定](docs/i18n.md)：语言、术语、URL 与翻译对应关系。
- [视觉与交互约定](docs/visual-direction.md)：当前设计、组件样式和阅读层级。
- [社交分享资源](docs/social-sharing.md)：图片生成、公开域名、号召文案和元信息。
- [双语网站审校 skill](.agents/skills/review-bilingual-site/SKILL.md)：做完整双语审校或跨页面文案同步时使用；单个低影响文案修改只验证受影响范围。
- `npm test` 已验证语言键与占位符、固定口号、介绍文章章节及来源链接、单一 CSS、URL 格式、名录和 RSS。自然程度、语义等价与视觉层级仍需实际阅读和预览，不以测试通过替代。
- 更新文档时替换已失效的事实，不累积讨论记录；未部署、未验证的外部状态不得写成已完成。
