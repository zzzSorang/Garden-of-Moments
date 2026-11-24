import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

/**
 * 웹에서 Skia(흔들리는 꽃)를 쓰려면 CanvasKit 엔진을 먼저 불러와야 해요.
 * 엔진 파일은 public/canvaskit.wasm (node_modules/canvaskit-wasm 에서 복사).
 */
export function loadSkia(): Promise<void> {
  return LoadSkiaWeb({ locateFile: (file: string) => `/${file}` });
}
