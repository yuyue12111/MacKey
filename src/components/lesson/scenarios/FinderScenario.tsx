'use client';

import type { Shortcut } from '@/types/shortcut';
import type { ScenarioStep } from '@/types/course';
import {
  Folder, File, Image, FileText, Film, Music, Grid3X3, List,
  ChevronRight, Eye, Trash2, Copy, Info, Trash2Icon,
} from 'lucide-react';

interface FinderScenarioProps {
  step: ScenarioStep;
  phase: 'prompting' | 'correct' | 'complete';
  shortcuts: Shortcut[];
}

const FILES = [
  { name: '项目方案.pdf', icon: <FileText size={16} strokeWidth={1.2} />, type: 'PDF 文稿' },
  { name: '西湖照片.png', icon: <Image size={16} strokeWidth={1.2} />, type: 'PNG 图像' },
  { name: '会议记录.docx', icon: <FileText size={16} strokeWidth={1.2} />, type: 'Word 文稿' },
  { name: '产品视频.mp4', icon: <Film size={16} strokeWidth={1.2} />, type: 'MP4 影片' },
  { name: '背景音乐.mp3', icon: <Music size={16} strokeWidth={1.2} />, type: 'MP3 音频' },
];

const SIDEBAR_ITEMS = [
  { icon: <Folder size={14} />, label: '个人', active: true },
  { icon: <Folder size={14} />, label: '应用程序', active: false },
  { icon: <Folder size={14} />, label: '桌面', active: false },
  { icon: <Folder size={14} />, label: '下载', active: false },
  { icon: <Folder size={14} />, label: '文稿', active: false },
];

const PATH_LABELS: Record<string, string> = {
  'finder-home': '个人',
  'finder-applications': '应用程序',
  'finder-desktop': '桌面',
};

export default function FinderScenario({ step, phase }: FinderScenarioProps) {
  const sid = step.targetShortcutId;
  const isCorrect = phase === 'correct';
  const showPreview = sid === 'finder-preview' && isCorrect;
  const isDeleted = sid === 'finder-delete' && isCorrect;
  const isDuplicated = sid === 'finder-duplicate' && isCorrect;
  const showInfo = sid === 'finder-info' && isCorrect;
  const goFolder = PATH_LABELS[sid] && isCorrect;

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Window title bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border-light bg-[#F5F3EF]">
        <span className="w-3 h-3 rounded-full bg-[#E8C0B0]" />
        <span className="w-3 h-3 rounded-full bg-[#E8D8A0]" />
        <span className="w-3 h-3 rounded-full bg-[#B0D0A0]" />
        <span className="ml-2 text-[11px] text-ink-tertiary font-light flex items-center gap-1">
          <Folder size={12} /> {goFolder ? PATH_LABELS[sid] : '个人'}
          {goFolder && (
            <span className="animate-in fade-in duration-300 text-gold-dim"> ← 已跳转</span>
          )}
        </span>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border-light text-ink-tertiary">
        <ChevronRight size={14} strokeWidth={1.2} className="-rotate-90 opacity-30" />
        <ChevronRight size={14} strokeWidth={1.2} className="opacity-30" />
        <div className="flex items-center gap-1 ml-2">
          <Grid3X3 size={14} strokeWidth={1.2} className="text-ink-secondary" />
          <List size={14} strokeWidth={1.2} />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          {showPreview && <Eye size={14} strokeWidth={1.2} className="text-gold-dim" />}
          <Info size={14} strokeWidth={1.2} className={showInfo ? 'text-gold-dim' : ''} />
          <Copy size={14} strokeWidth={1.2} />
          <Trash2 size={14} strokeWidth={1.2} />
        </div>
      </div>

      <div className="flex min-h-[240px]">
        {/* Sidebar */}
        <div className="w-[130px] border-r border-border-light bg-[#FAFAF8] p-3 space-y-0.5">
          {SIDEBAR_ITEMS.map((item) => {
            const isTarget = goFolder && item.label === PATH_LABELS[sid];
            return (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-2 py-1 rounded-md text-[12px] font-light transition-colors ${
                  isTarget
                    ? 'bg-gold-dim/10 text-gold-dim'
                    : item.active
                      ? 'text-ink'
                      : 'text-ink-tertiary'
                }`}
              >
                {item.icon}
                {item.label}
              </div>
            );
          })}
        </div>

        {/* File list */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-2 gap-1">
            {FILES.map((file) => {
              const isSelected = (showPreview || showInfo) && file.name === '西湖照片.png';
              const isFileDeleted = isDeleted && file.name === '项目方案.pdf';
              const isFileDuped = isDuplicated && file.name === '会议记录.docx';

              return (
                <div
                  key={file.name}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] font-light transition-all duration-300 ${
                    isSelected
                      ? 'bg-gold-dim/10 ring-1 ring-gold-light text-ink'
                      : isFileDeleted
                        ? 'opacity-20 line-through'
                        : isFileDuped
                          ? 'text-ink'
                          : 'text-ink-secondary'
                  }`}
                >
                  <span className="text-ink-tertiary shrink-0">{file.icon}</span>
                  <span className="truncate">{file.name}</span>
                  {isFileDeleted && (
                    <Trash2Icon size={12} className="text-accent-red shrink-0 animate-in fade-in" />
                  )}
                  {isFileDuped && (
                    <span className="text-[10px] text-gold-dim shrink-0 animate-in fade-in">
                      (副本)
                    </span>
                  )}
                </div>
              );
            })}

            {/* Duplicated file */}
            {isDuplicated && (
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] font-light text-ink animate-in fade-in duration-300">
                <span className="text-ink-tertiary shrink-0"><FileText size={16} strokeWidth={1.2} /></span>
                <span className="truncate">会议记录 副本.docx</span>
                <span className="text-[10px] text-gold-dim shrink-0">新增</span>
              </div>
            )}
          </div>

          {/* Quick Look preview panel */}
          {showPreview && (
            <div className="mt-4 border-t border-border-light pt-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Eye size={13} className="text-gold-dim" strokeWidth={1.2} />
                <span className="text-[11px] text-gold-dim font-medium">快速预览</span>
              </div>
              <div className="bg-[#FAFAF8] rounded-xl border border-border p-4 text-center">
                <Image size={40} className="text-ink-tertiary/30 mx-auto mb-2" strokeWidth={1} />
                <p className="text-[13px] text-ink font-light">西湖照片.png</p>
                <p className="text-[11px] text-ink-tertiary font-light">PNG 图像 · 2.4 MB</p>
              </div>
            </div>
          )}

          {/* File info panel */}
          {showInfo && (
            <div className="mt-4 border-t border-border-light pt-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Info size={13} className="text-gold-dim" strokeWidth={1.2} />
                <span className="text-[11px] text-gold-dim font-medium">简介</span>
              </div>
              <div className="bg-[#FAFAF8] rounded-xl border border-border p-4 text-[13px] text-ink-secondary font-light space-y-1">
                <p>种类：PNG 图像</p>
                <p>大小：2,458,112 字节</p>
                <p>尺寸：2048 × 1536</p>
                <p>创建时间：今天 14:30</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
