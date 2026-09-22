/**
 * Canvas Transparency Checkerboard Utility
 *
 * Draws a subtle checkerboard pattern on an HTML5 2D canvas context to inspect
 * transparent graphics, PNGs, and stickers.
 */

export interface CheckerboardOptions {
  /** Size of each square in pixels. Default: 16 */
  squareSize?: number;
  /** Background light square color. Default: '#f5f5f4' */
  lightColor?: string;
  /** Background dark square color. Default: '#e7e5e4' */
  darkColor?: string;
}

/**
 * Draws a standard checkerboard pattern on the specified canvas context.
 */
export function drawCheckerboard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options: CheckerboardOptions = {}
): void {
  const {
    squareSize = 16,
    lightColor = "#f5f5f4",
    darkColor = "#e7e5e4",
  } = options;

  const cols = Math.ceil(width / squareSize);
  const rows = Math.ceil(height / squareSize);

  ctx.save();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? lightColor : darkColor;
      ctx.fillRect(c * squareSize, r * squareSize, squareSize, squareSize);
    }
  }
  ctx.restore();
}
