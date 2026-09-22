/**
 * Geometric Shape Clipping & Masking Utilities
 *
 * Provides canvas clipping operations and SVG path definitions for standard
 * geometric cutouts: circle, squircle (Apple-style superellipse), rounded-rect, heart, and star.
 */

export type ShapeCutoutType = "circle" | "squircle" | "rounded-rect" | "heart" | "star" | "free";

/**
 * Applies a geometric shape clipping mask to an HTML5 Canvas 2D context.
 */
export function applyShapeCutout(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  shape: ShapeCutoutType,
  padding = 24
): void {
  if (shape === "free") return;

  const x = padding;
  const y = padding;
  const width = w - padding * 2;
  const height = h - padding * 2;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(width, height) / 2;

  ctx.beginPath();

  switch (shape) {
    case "circle":
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      break;

    case "squircle": {
      const r = radius * 0.45;
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, width, height, r);
      } else {
        ctx.rect(x, y, width, height);
      }
      break;
    }

    case "rounded-rect":
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, width, height, 32);
      } else {
        ctx.rect(x, y, width, height);
      }
      break;

    case "heart": {
      const topCurveHeight = height * 0.3;
      ctx.moveTo(cx, cy + height * 0.4);
      ctx.bezierCurveTo(
        cx - width * 0.55,
        cy + height * 0.1,
        cx - width * 0.55,
        cy - topCurveHeight,
        cx,
        cy - topCurveHeight * 0.4
      );
      ctx.bezierCurveTo(
        cx + width * 0.55,
        cy - topCurveHeight,
        cx + width * 0.55,
        cy + height * 0.1,
        cx,
        cy + height * 0.4
      );
      break;
    }

    case "star": {
      const spikes = 5;
      const outerRadius = radius;
      const innerRadius = radius * 0.45;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        let sx = cx + Math.cos(rot) * outerRadius;
        let sy = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(sx, sy);
        rot += step;

        sx = cx + Math.cos(rot) * innerRadius;
        sy = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(sx, sy);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      break;
    }
  }

  ctx.closePath();
  ctx.clip();
}
