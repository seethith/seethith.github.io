// Eyes react first; the head and shoulders catch up at separate, frame-independent rates.
export function createMascotMotion() {
  let time = 0, lastPointer = -20, targetX = 0, targetY = 0;
  let eyesX = 0, eyesY = 0, headX = 0, headY = 0, bodyX = 0;
  let nextBlink = 2.5, blinkStart = -10, blinkCount = 0;
  let greetingStart = -10, greetingKind = 0;
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const ease = (current: number, target: number, rate: number, dt: number) =>
    current + (target - current) * (1 - Math.exp(-rate * dt));
  const smooth = (v: number) => { const t = clamp(v, 0, 1); return t * t * (3 - 2 * t); };
  function eyeOpen(t: number) {
    if (t < 0 || t > 0.28) return 1;
    if (t < 0.075) return 1 - smooth(t / 0.075);
    if (t < 0.12) return 0;
    return smooth((t - 0.12) / 0.16);
  }
  return {
    look(x: number, y: number) {
      targetX = clamp(x, -1, 1); targetY = clamp(y, -1, 1); lastPointer = time;
    },
    greet() {
      if (time - greetingStart < 1.8) return;
      greetingStart = time; greetingKind = (greetingKind + 1) % 3;
      blinkStart = time + 0.25;
    },
    update(seconds: number) {
      const dt = clamp(seconds, 0, 0.05);
      time += dt;
      const attention = 1 - smooth((time - lastPointer - 6) / 3);
      const x = targetX * attention, y = targetY * attention;
      eyesX = ease(eyesX, x, 13, dt); eyesY = ease(eyesY, y, 13, dt);
      headX = ease(headX, x, 4.2, dt); headY = ease(headY, y, 3.6, dt);
      bodyX = ease(bodyX, headX, 2.2, dt);
      if (time >= nextBlink) {
        blinkStart = time;
        nextBlink = time + (++blinkCount % 5 === 0 ? 0.46 : 3.6 + Math.random() * 2.8);
      }
      const g = time - greetingStart;
      const envelope = g >= 0 && g < 1.8 ? Math.sin(Math.PI * g / 1.8) ** 2 : 0;
      const nod = greetingKind === 1 ? -8 * envelope : 0;
      const tilt = greetingKind === 2 ? 9 * envelope : 0;
      return {
        ParamAngleX: clamp(headX * 35 + Math.sin(time * 0.43) * 1.6, -37, 37),
        ParamAngleY: clamp(headY * 16 + Math.sin(time * 0.61) * 1.4 + nod, -22, 18),
        ParamAngleZ: -headX * 5 + Math.sin(time * 0.58) * 2 + tilt,
        ParamBodyAngleX: bodyX * 4,
        ParamBodyAngleY: Math.sin(time * 0.48) * 0.7,
        ParamBodyAngleZ: bodyX * -1.8 + Math.sin(time * 0.48) * 0.8,
        ParamEyeBallX: eyesX * 0.55,
        ParamEyeBallY: eyesY * 0.45,
        ParamEyeLOpen: eyeOpen(time - blinkStart),
        ParamEyeROpen: eyeOpen(time - blinkStart - 0.012),
        ParamEyeBallForm: 0,
        ParamBreath: (Math.sin(time * Math.PI / 2.7) + 1) / 2,
      };
    },
  };
}
