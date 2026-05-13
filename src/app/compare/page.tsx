export default function ComparePage() {
  const rows = [
    { mac: '⌘ Command', win: 'Ctrl', usage: '最常用修饰键：复制、粘贴、撤销、全选等' },
    { mac: '⌥ Option', win: 'Alt', usage: '高级操作：逐词移动、特殊字符输入、隐藏其他应用' },
    { mac: '⌃ Control', win: 'Ctrl', usage: '终端命令中断（⌃C）、Mission Control（⌃↑）' },
    { mac: 'Fn / 🌐', win: '—', usage: '切换输入法、打开表情与符号面板' },
    { mac: '⇧ Shift', win: 'Shift', usage: '选择文本、大写输入，功能基本相同' },
    { mac: '⌘Tab', win: 'Alt+Tab', usage: '切换应用' },
    { mac: '⌘W', win: 'Ctrl+W / Alt+F4', usage: '关闭窗口（⌘W）vs 退出应用（⌘Q）' },
    { mac: '⌘Space', win: 'Win+S', usage: '搜索/启动器（Spotlight vs Windows Search）' },
    { mac: '⇧⌘4', win: 'Win+Shift+S', usage: '区域截图' },
    { mac: '⌘,', win: '—', usage: '偏好设置（所有 Mac 应用的约定）' },
    { mac: '⌘Q', win: 'Alt+F4', usage: '完全退出应用' },
    { mac: '空格（访达中）', win: '—', usage: '快速预览文件（Mac 独占功能）' },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-[var(--font-display)] text-4xl font-[250] tracking-[-0.02em] mb-3">
          Mac ↔ Windows 键位对照
        </h1>
        <p className="text-[15px] text-ink-secondary font-light max-w-lg">
          刚从 Windows 转到 Mac？这个对照表帮你快速建立肌肉记忆的转换。
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left px-6 py-4 text-[12px] font-medium text-ink-tertiary uppercase tracking-[0.06em]">
                  Mac 键
                </th>
                <th className="text-left px-6 py-4 text-[12px] font-medium text-ink-tertiary uppercase tracking-[0.06em]">
                  Windows 键
                </th>
                <th className="text-left px-6 py-4 text-[12px] font-medium text-ink-tertiary uppercase tracking-[0.06em]">
                  用途 / 说明
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border-light last:border-b-0 hover:bg-surface-hover transition-colors"
                >
                  <td className="px-6 py-4">
                    <code className="font-mono text-[14px] font-medium text-gold-dim bg-[rgba(212,165,116,0.08)] px-2 py-1 rounded-md">
                      {row.mac}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <code className="font-mono text-[14px] text-ink-secondary bg-[#F5F3EF] px-2 py-1 rounded-md">
                      {row.win}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-ink-secondary font-light">
                    {row.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 bg-surface border border-border rounded-2xl p-8">
        <h2 className="font-[var(--font-display)] text-xl font-[400] tracking-[-0.01em] mb-3">
          一个简单规则
        </h2>
        <p className="text-[15px] text-ink-secondary font-light leading-relaxed">
          在 Mac 上做 Windows 中 <code className="font-mono text-sm bg-[#F5F3EF] px-1.5 py-0.5 rounded-md">Ctrl+?</code> 的操作，
          <strong className="font-medium text-ink"> 大多数时候把 Ctrl 换成 ⌘ 就行了</strong>。
          例如 Ctrl+C → ⌘C，Ctrl+V → ⌘V，Ctrl+Z → ⌘Z。
          例外情况主要是终端（终端里 ⌃C 是中断命令，⌘C 才是拷贝）和一些专业软件。
        </p>
      </div>
    </div>
  );
}
