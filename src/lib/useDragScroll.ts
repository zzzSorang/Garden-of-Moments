import { RefObject, useEffect } from 'react';
import { Platform } from 'react-native';

/** 이만큼(px) 넘게 끌면 '드래그'로 보고, 손을 뗄 때 식물 누름(클릭)을 막음 */
const DRAG_SLOP = 5;

type Scrollable = { getScrollableNode?: () => unknown } | null;

/**
 * 웹에서 마우스로 잡고 끌어 가로 스크롤하기.
 * 폰(터치)은 ScrollView가 원래 손가락 스크롤을 지원해서 웹 마우스일 때만 동작해요.
 */
export function useDragScroll(ref: RefObject<Scrollable>, enabled = true) {
  useEffect(() => {
    if (Platform.OS !== 'web' || !enabled) return;
    const node = ref.current?.getScrollableNode?.() as HTMLElement | undefined;
    if (!node) return;

    let startX = 0;
    let startLeft = 0;
    let down = false;
    let dragged = false;
    node.style.cursor = 'grab';

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      dragged = false;
      startX = e.clientX;
      startLeft = node.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) > DRAG_SLOP) {
        dragged = true;
        node.style.cursor = 'grabbing';
        node.style.userSelect = 'none';
      }
      if (dragged) node.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      node.style.cursor = 'grab';
      node.style.userSelect = '';
    };
    const onClick = (e: MouseEvent) => {
      if (dragged) {
        e.stopPropagation();
        e.preventDefault();
        dragged = false;
      }
    };

    node.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    node.addEventListener('click', onClick, true);
    return () => {
      node.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      node.removeEventListener('click', onClick, true);
      node.style.cursor = '';
    };
  }, [ref, enabled]);
}
