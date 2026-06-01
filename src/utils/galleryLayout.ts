import { Product } from '@/types/Product';

const GAP = 8;

function rowHeight(n: number, ratioSum: number, width: number): number {
  return (width - (n - 1) * GAP) / ratioSum;
}

export function buildRows(
  products: Product[],
  containerWidth: number,
  targetHeight: number,
  variance: number
): Product[][] {
  const minH = Math.max(targetHeight - variance, 40);
  const maxH = targetHeight + variance;
  const result: Product[][] = [];
  let row: Product[] = [];
  let ratioSum = 0;

  for (const p of products) {
    const r = (p.images[0]?.width ?? 1) / (p.images[0]?.height ?? 1);

    if (row.length === 0) {
      row.push(p);
      ratioSum = r;
      continue;
    }

    const hOut  = rowHeight(row.length,     ratioSum,     containerWidth);
    const hWith = rowHeight(row.length + 1, ratioSum + r, containerWidth);

    if (hOut > maxH) {
      // Row still too tall — keep adding
      row.push(p); ratioSum += r;
    } else if (hWith < minH) {
      // Adding would overshoot — close now
      result.push(row);
      row = [p]; ratioSum = r;
    } else {
      // Both in range — pick whichever is closer to target
      if (Math.abs(hOut - targetHeight) <= Math.abs(hWith - targetHeight)) {
        result.push(row);
        row = [p]; ratioSum = r;
      } else {
        row.push(p); ratioSum += r;
      }
    }
  }

  if (row.length > 0) result.push(row);
  return result;
}

export function computeRowHeight(
  row: Product[],
  containerWidth: number,
  targetHeight: number,
  isLast: boolean
): number {
  const ratioSum = row.reduce(
    (s, p) => s + (p.images[0]?.width ?? 1) / (p.images[0]?.height ?? 1),
    0
  );
  if (isLast && row.length === 1) {
    const r = (row[0].images[0]?.width ?? 1) / (row[0].images[0]?.height ?? 1);
    return Math.min(targetHeight, containerWidth / r);
  }
  return (containerWidth - (row.length - 1) * GAP) / ratioSum;
}

export function itemWidth(product: Product, rowHeight: number): number {
  const r = (product.images[0]?.width ?? 1) / (product.images[0]?.height ?? 1);
  return r * rowHeight;
}
