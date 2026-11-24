import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

/**
 * 웹 시작점. Skia는 처음 불러와지는 순간 CanvasKit 엔진에 묶이기 때문에,
 * 엔진(public/canvaskit.wasm)을 먼저 불러온 뒤에 앱 코드를 불러와요.
 * 엔진을 못 불러와도 앱은 열려요 (흔들리는 꽃만 안 보임).
 */
LoadSkiaWeb({ locateFile: (file: string) => `/${file}` })
  .catch(() => {})
  .then(() => require('expo-router/entry'));
