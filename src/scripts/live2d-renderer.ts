import { Application } from 'pixi.js';
import { config, Live2DModel, MotionPreloadStrategy, type Cubism4InternalModel } from 'pixi-live2d-display/cubism4';
import { createMascotMotion } from './mascot-motion';

// Loaded dynamically, after the locally hosted Cubism Core is ready.
export async function createLive2D(canvas: HTMLCanvasElement) {
  config.sound = false;
  const app = new Application({
    view: canvas, width: 224, height: 380, backgroundAlpha: 0,
    resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true,
    antialias: true, autoStart: false, sharedTicker: false, powerPreference: 'low-power',
  });
  app.ticker.maxFPS = 30;
  let model: Live2DModel;
  try {
    model = await Live2DModel.from('/live2d/InkV4/InkV4.model3.json', {
      autoUpdate: false, autoInteract: false, motionPreload: MotionPreloadStrategy.NONE,
    });
  } catch (error) {
    app.destroy(false, { children: true, texture: true, baseTexture: true });
    throw error;
  }
  app.stage.addChild(model);
  model.update(0);
  // Fit the actual visible mesh, not the model's padded authoring canvas.
  // This keeps the character in view at desktop and dialog aspect ratios.
  const internal = model.internalModel as Cubism4InternalModel;
  const motion = createMascotMotion();
  let frameSeconds = 0;
  // Run our pose before Cubism physics, so each hair chain reacts to head acceleration.
  // Replace the generic focus/breath drivers rather than adding competing transforms.
  internal.eyeBlink = undefined;
  internal.updateFocus = () => {
    const pose = motion.update(frameSeconds);
    // Angle X continuously deforms one set of meshes. No head image selection
    // or opacity blending: eye closure and gaze are also bound in the MOC.
    for (const [id, value] of Object.entries(pose)) {
      internal.coreModel.setParameterValueById(id, value);
    }
  };
  internal.updateNaturalMovements = () => {};
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
  const matrix = internal.localTransform;
  for (let i = 0; i < internal.coreModel.getDrawableCount(); i++) {
    if (internal.coreModel.getDrawableOpacity(i) <= 0) continue;
    const points = internal.getDrawableVertices(i);
    for (let j = 0; j < points.length; j += 2) {
      const x = matrix.a * points[j]! + matrix.c * points[j + 1]! + matrix.tx;
      const y = matrix.b * points[j]! + matrix.d * points[j + 1]! + matrix.ty;
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  app.ticker.add(() => {
    frameSeconds = Math.min(app.ticker.deltaMS, 50) / 1000;
    model.update(frameSeconds * 1000);
  });

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    app.renderer.resize(width, height);
    const scale = Math.min((width - 24) / (right - left), (height - 28) / (bottom - top));
    model.scale.set(scale);
    model.position.set((width - (right + left) * scale) / 2, (height - (bottom + top) * scale) / 2);
    frameSeconds = 0;
    app.render();
  }

  return {
    resize,
    setActive(active: boolean, reducedMotion: boolean) {
      app.stop();
      if (!active) return;
      if (reducedMotion) {
        internal.motionManager.stopAllMotions();
        for (let i = 0; i < internal.coreModel.getParameterCount(); i++) {
          internal.coreModel.setParameterValueByIndex(i, internal.coreModel.getParameterDefaultValue(i));
        }
        internal.coreModel.update();
        app.render();
      } else app.start();
    },
    look(x: number, y: number) { motion.look(x, y); },
    greet() { motion.greet(); },
    destroy() { app.destroy(false, { children: true, texture: true, baseTexture: true }); },
  };
}

export type Live2DRenderer = Awaited<ReturnType<typeof createLive2D>>;
