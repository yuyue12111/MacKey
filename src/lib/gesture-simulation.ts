import type {
  GestureMatchResult,
  GestureMismatchReason,
  GestureSimulationInput,
} from '@/types/gesture';
import type { AcceptedGesture, GestureErrorHint } from '@/types/course';

function mismatch(
  kind: GestureMismatchReason['kind'],
  fallback: string,
  custom?: string
): GestureMatchResult {
  return {
    matched: false,
    reason: {
      kind,
      messageZh: custom ?? fallback,
    },
  };
}

export function matchGestureInput(
  input: GestureSimulationInput,
  accepted: AcceptedGesture,
  hints?: GestureErrorHint
): GestureMatchResult {
  if (input.fingerCount !== accepted.fingerCount) {
    return mismatch('fingerCount', `这一步需要 ${accepted.fingerCount} 指操作。`, hints?.fingerCountZh);
  }

  if (input.mode !== accepted.mode) {
    return mismatch('mode', '动作类型不对，再试一次。', hints?.modeZh);
  }

  if ((accepted.minDistance ?? 0) > 0 && input.distance < (accepted.minDistance ?? 0)) {
    return mismatch('distance', '动作幅度有点小，再做得更明显一点。', hints?.fallbackZh);
  }

  if (accepted.direction && input.direction !== accepted.direction) {
    return mismatch('direction', `方向不对，试试向${directionZh(accepted.direction)}。`, hints?.directionZh);
  }

  if (accepted.edge && input.edge !== accepted.edge) {
    return mismatch('edge', `这一步需要从${edgeZh(accepted.edge)}开始。`, hints?.edgeZh);
  }

  if (accepted.tapCount && input.tapCount !== accepted.tapCount) {
    return mismatch('tapCount', accepted.tapCount === 2 ? '这一步需要双击。' : '这一步需要单次点击。', hints?.tapCountZh);
  }

  if (accepted.pinchKind && input.pinchKind !== accepted.pinchKind) {
    return mismatch(
      'pinchKind',
      accepted.pinchKind === 'in' ? '这是向内捏合，不是向外张开。' : '这是向外张开，不是向内捏合。',
      hints?.pinchKindZh
    );
  }

  if (accepted.rotationDirection && input.rotationDirection !== accepted.rotationDirection) {
    return mismatch(
      'rotationDirection',
      accepted.rotationDirection === 'clockwise' ? '旋转方向不对，试试顺时针。' : '旋转方向不对，试试逆时针。',
      hints?.rotationZh
    );
  }

  return { matched: true };
}

function directionZh(direction: AcceptedGesture['direction']) {
  if (direction === 'up') return '上';
  if (direction === 'down') return '下';
  if (direction === 'left') return '左';
  return '右';
}

function edgeZh(edge: AcceptedGesture['edge']) {
  if (edge === 'left') return '左侧边缘';
  if (edge === 'right') return '右侧边缘';
  if (edge === 'top') return '顶部边缘';
  return '底部边缘';
}
