export function resetCodeBlocks(
  expandedBlocksSize: number,
  setExpandedBlocks: (arg: Set<number>) => void,
): boolean {
  if (expandedBlocksSize > 0) {
    setExpandedBlocks(new Set<number>());
    return true;
  }

  return false;
}
