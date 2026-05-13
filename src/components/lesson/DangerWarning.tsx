import { AlertTriangle } from 'lucide-react';

export default function DangerWarning() {
  return (
    <div className="flex items-start gap-3 bg-[#FFF8F0] border border-gold-light rounded-2xl p-4 mb-8">
      <AlertTriangle size={18} className="text-gold-dim shrink-0 mt-0.5" strokeWidth={1.2} />
      <p className="text-[13px] text-ink-secondary font-light leading-relaxed">
        练习期间请勿按{' '}
        <code className="font-mono text-xs bg-[rgba(212,165,116,0.15)] px-1.5 py-0.5 rounded">⌘Q</code>
        {' '}或{' '}
        <code className="font-mono text-xs bg-[rgba(212,165,116,0.15)] px-1.5 py-0.5 rounded">⌘W</code>
        ，可能导致页面关闭。网站已尽量拦截这些快捷键，但浏览器级别的操作可能无法完全阻止。
      </p>
    </div>
  );
}
