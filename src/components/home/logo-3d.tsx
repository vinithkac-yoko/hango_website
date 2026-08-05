"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

/**
 * Faux-3D Hango mark.
 *
 * The logo is a flat silhouette, so depth is faked by stacking copies of it
 * along Z and darkening each one — the classic extrusion trick. Turning the
 * stack sweeps the side of the extrusion into view, which reads as a solid
 * object without any WebGL.
 */
const DEPTH = 16; // layers
const STEP = 1.6; // px between layers

const LAYERS = Array.from({ length: DEPTH }, (_, i) => {
  const t = i / (DEPTH - 1);
  return {
    z: -i * STEP,
    // Back layers fall away toward the shadow side of the extrusion.
    brightness: 1 - t * 0.72,
    saturate: 1 - t * 0.25,
  };
});

export default function Logo3D({
  mx,
  my,
  size = 84,
}: {
  /** Normalised pointer position from the hero, -0.5 … 0.5 */
  mx: MotionValue<number>;
  my: MotionValue<number>;
  size?: number;
}) {
  // The pointer nudges the object; it keeps turning on its own regardless.
  const rotateY = useTransform(mx, [-0.5, 0.5], [-16, 16]);
  const rotateX = useTransform(my, [-0.5, 0.5], [10, -10]);

  return (
    <div
      className="relative"
      style={{ width: size, height: size * 1.38, perspective: 900 }}
      aria-hidden="true"
    >
      {/* Light the object throws onto the plinth behind it */}
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(251,54,64,0.45) 0%, rgba(251,54,64,0.1) 45%, transparent 72%)",
        }}
      />

      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
      >
        {/* Continuous slow turn, independent of the pointer */}
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: [-26, 26, -26] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          {LAYERS.map((layer, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage: "url(/brand/hango-mark-red.png)",
                transform: `translateZ(${layer.z}px)`,
                filter: `brightness(${layer.brightness}) saturate(${layer.saturate})`,
              }}
            />
          ))}

          {/* Front face sits proud of the stack and carries the neon */}
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/brand/hango-mark-red.png)",
              transform: `translateZ(${STEP}px)`,
              filter: "drop-shadow(0 0 14px rgba(251,54,64,0.75))",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
