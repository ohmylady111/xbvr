# XBVR 简体中文分支

上游项目：[xbapps/xbvr](https://github.com/xbapps/xbvr)。本分支仅做 Web UI 国际化，不翻译影片标题、简介、演员名称、站点名称或后端日志，不修改媒体文件、数据库结构或刮削规则。

## 使用语言切换

导航栏右侧可选择「简体中文 / English」，即时生效；浏览器允许本地存储时会记住选择。首次进入跟随浏览器语言：中文（包含 zh、zh-CN、zh-SG、zh-Hans、zh-TW 等）使用简体中文，其他语言回退英文。此分支不提供繁体中文翻译。

语言偏好只保存在当前浏览器的 `localStorage["xbvr.locale"]`，不会改变服务器设置或其他客户端。

## 从源码构建

沿用上游的 Go + Vue 2 工具链，项目根目录执行：

```sh
npm install --package-lock=false
node --test ui/tests/*.test.cjs
npm run build
go build -o xbvr .
```

Go 程序嵌入 `ui/dist`，所以必须先构建前端。默认网页端口沿用上游 9999。正式使用前按上游说明备份已有配置、数据库，并确保使用正确的数据目录。

## 翻译维护

- `ui/src/locales/en-GB.json`：英文键值。
- `ui/src/locales/zh-CN.json`：对应简体中文，保留原始键、占位符和技术名称。
- `ui/src/locale.js`：语言识别与偏好保存。
- 新增界面文字使用 `$t` / `this.$t`，不要直接写中文到模板。
- API 字段、枚举、路由、搜索语法与数据库内容保持原样。

上游仍使用 Vue 2 与部分停止维护的依赖；安装时可能出现弃用和依赖安全提示。此分支未将框架升级与汉化混在一起，也不宣称已修复上游依赖问题。
