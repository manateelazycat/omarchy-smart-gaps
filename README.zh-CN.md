# Omarchy Smart Gaps

简体中文 | [English](README.md)

https://github.com/user-attachments/assets/171da180-7709-40d9-ad21-b06e21bd89bb

一个 [Omarchy](https://omarchy.org/) 插件：普通工作区中恰好只有一个可见的平铺窗口时，自动移除内外间距并隐藏边框。截图预览等浮动辅助窗口不会影响布局。工作区出现多个平铺窗口后，正常的间距和边框会立即恢复。

## 安装

```bash
omarchy plugin add https://github.com/manateelazycat/omarchy-smart-gaps.git --enable
```

无需额外配置。

## 卸载

```bash
omarchy plugin remove io.github.manateelazycat.smart-gaps
```

## 依赖

- 带有 Quickshell 插件系统的 Omarchy
- 支持 Lua 配置的 Hyprland 0.56 或更新版本

## 工作原理

插件为 `w[tv1]s[false]` 安装一条运行时 Hyprland 工作区规则。平铺窗口打开、关闭或在工作区之间移动时，Hyprland 会自动更新匹配结果，并忽略浮动辅助窗口。插件卸载时会禁用这条规则；Hyprland 配置重新加载后会重新应用。Omarchy 屏保关闭后，插件也会刷新规则，确保解锁后恢复单窗口布局。

## 协议

GPL-3.0-only。详见 [LICENSE](LICENSE)。
