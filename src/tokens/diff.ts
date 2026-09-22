/**
 * Structural Array Diffing Utilities (LCS Algorithm)
 *
 * Provides a business-agnostic Longest Common Subsequence (LCS) diffing engine
 * to compare ordered lists, paragraphs, or bullet items between two document states.
 */

export type DiffChangeType = "keep" | "add" | "remove";

export interface ArrayDiffItem<T> {
  type: DiffChangeType;
  value: T;
}

/**
 * Computes an ordered sequence of keep, add, and remove operations between two arrays.
 *
 * @param arrayA The original or baseline array
 * @param arrayB The updated or target array
 * @param equalityFn Optional comparator function. Defaults to trimmed case-insensitive string equality.
 */
export function diffArray<T = string>(
  arrayA: T[] = [],
  arrayB: T[] = [],
  equalityFn?: (a: T, b: T) => boolean
): ArrayDiffItem<T>[] {
  const areEqual = equalityFn || ((a: T, b: T) => {
    if (typeof a === "string" && typeof b === "string") {
      return a.trim().toLowerCase() === b.trim().toLowerCase();
    }
    return a === b;
  });

  const m = arrayA.length;
  const n = arrayB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (areEqual(arrayA[i], arrayB[j])) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const result: ArrayDiffItem<T>[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && areEqual(arrayA[i - 1], arrayB[j - 1])) {
      result.unshift({ type: "keep", value: arrayB[j - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "add", value: arrayB[j - 1] });
      j--;
    } else if (i > 0) {
      result.unshift({ type: "remove", value: arrayA[i - 1] });
      i--;
    }
  }

  return result;
}

/**
 * Convenience diff helper for string arrays (e.g. highlights, lines, or tags).
 */
export function diffTextLines(linesA: string[] = [], linesB: string[] = []): ArrayDiffItem<string>[] {
  return diffArray(linesA, linesB);
}
