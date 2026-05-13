import type { Shortcut, ShortcutCategoryMeta, ShortcutCategory } from '@/types/shortcut';
import shortcutsData from '../../public/data/shortcuts.json';

export function getAllShortcuts(): Shortcut[] {
  return shortcutsData as Shortcut[];
}

export function getShortcutsByCategory(category: ShortcutCategory): Shortcut[] {
  return (shortcutsData as Shortcut[]).filter((s) => s.category === category);
}

export function getShortcutById(id: string): Shortcut | undefined {
  return (shortcutsData as Shortcut[]).find((s) => s.id === id);
}

export function searchShortcuts(query: string): Shortcut[] {
  if (!query.trim()) return getAllShortcuts();
  const q = query.trim().toLowerCase();
  return (shortcutsData as Shortcut[]).filter((s) => {
    if (s.nameZh.toLowerCase().includes(q)) return true;
    if (s.descriptionZh.toLowerCase().includes(q)) return true;
    if (s.keywords.some((k) => k.toLowerCase().includes(q))) return true;
    const comboStr = [
      ...s.combination.modifiers,
      s.combination.key,
    ].join('').toLowerCase();
    if (comboStr.includes(q)) return true;
    return false;
  });
}

export const CATEGORIES: ShortcutCategoryMeta[] = [
  {
    id: 'system',
    slug: 'system',
    nameZh: '系统全局',
    icon: '⚙️',
    descriptionZh: '锁定屏幕、Spotlight 搜索、强制退出等全局通用快捷键',
    order: 1,
  },
  {
    id: 'text',
    slug: 'text',
    nameZh: '文本编辑',
    icon: '📝',
    descriptionZh: '光标移动、选择文本、输入法切换、Emacs 风格快捷键',
    order: 2,
  },
  {
    id: 'finder',
    slug: 'finder',
    nameZh: '访达',
    icon: '📂',
    descriptionZh: '文件操作、快速预览、路径跳转、删除与恢复',
    order: 3,
  },
  {
    id: 'window',
    slug: 'window',
    nameZh: '窗口管理',
    icon: '🪟',
    descriptionZh: '切换应用、Mission Control、分屏、隐藏窗口',
    order: 4,
  },
  {
    id: 'screenshot',
    slug: 'screenshot',
    nameZh: '截屏录屏',
    icon: '📸',
    descriptionZh: '全屏截图、区域截图、屏幕录制、剪贴板截图',
    order: 5,
  },
  {
    id: 'browser',
    slug: 'browser',
    nameZh: '浏览器',
    icon: '🌐',
    descriptionZh: '标签页管理、地址栏定位、书签、刷新',
    order: 6,
  },
  {
    id: 'terminal',
    slug: 'terminal',
    nameZh: '终端',
    icon: '💻',
    descriptionZh: '终端新建、中断命令、清屏',
    order: 7,
  },
  {
    id: 'accessibility',
    slug: 'accessibility',
    nameZh: '辅助功能',
    icon: '🔍',
    descriptionZh: '缩放、VoiceOver、减少透明度',
    order: 8,
  },
];

export function getCategoryMeta(slug: string): ShortcutCategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
