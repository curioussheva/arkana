import type { DestinyPointKey } from './types';

/**
 * Normalized (x, y) position of each point on the diamond diagram, in the
 * range [-1, 1] on both axes, with (0, 0) at the center (point E).
 * Multiply by half the desired canvas size + offset by canvas center to
 * get actual pixel coordinates when rendering.
 *
 * Layout (per the Destiny Matrix / Natalia Ladini method):
 *   - A (day), B (month), C (year), D (A+B+C) sit at the four corners
 *     of the diamond (top, right, bottom, left).
 *   - E (sum of all four corners) sits at the exact center.
 *   - F, G, H, I are midpoints along each of the four outer edges.
 *   - J, K, L, M are midpoints along the four inner diagonals
 *     connecting each corner to the center.
 */
export const POINT_LAYOUT: Record<DestinyPointKey, { x: number; y: number }> = {
  // Outer corners
  A: { x: 0, y: -1 },   // top
  B: { x: 1, y: 0 },    // right
  C: { x: 0, y: 1 },    // bottom
  D: { x: -1, y: 0 },   // left
  // Center
  E: { x: 0, y: 0 },
  // Edge midpoints
  F: { x: 0.5, y: -0.5 },  // between A (top) and B (right)
  G: { x: 0.5, y: 0.5 },   // between B (right) and C (bottom)
  H: { x: -0.5, y: 0.5 },  // between C (bottom) and D (left)
  I: { x: -0.5, y: -0.5 }, // between D (left) and A (top)
  // Inner diagonal midpoints (corner-to-center)
  J: { x: 0, y: -0.5 },  // between A (top) and E (center)
  K: { x: 0.5, y: 0 },   // between B (right) and E (center)
  L: { x: 0, y: 0.5 },   // between C (bottom) and E (center)
  M: { x: -0.5, y: 0 },  // between D (left) and E (center)
};

/**
 * Line segments to draw for the diamond's outer outline
 * (A -> F -> B -> G -> C -> H -> D -> I -> A).
 */
export const OUTER_OUTLINE: DestinyPointKey[] = ['A', 'F', 'B', 'G', 'C', 'H', 'D', 'I', 'A'];

/**
 * The two main diagonals through the center, each passing through a pair
 * of inner points: vertical (A-J-E-L-C) and horizontal (D-M-E-K-B).
 */
export const VERTICAL_DIAGONAL: DestinyPointKey[] = ['A', 'J', 'E', 'L', 'C'];
export const HORIZONTAL_DIAGONAL: DestinyPointKey[] = ['D', 'M', 'E', 'K', 'B'];

// NOTE: Named interpretive groupings (e.g. "Love Line", "Money Line",
// "Karmic Tail") are NOT included here yet. Different Destiny Matrix
// sources define these subsets somewhat differently, and getting this
// wrong would misinform users — needs deeper source verification before
// encoding as app content. Track as a follow-up once the core diamond
// visualization is working.
