function resetCodeBlocks(expandedBlocksSize: number, setExpandedBlocks: (arg: Set<number>) => void): boolean {
  if (expandedBlocksSize > 0) {
    setExpandedBlocks(new Set<number>());
    return true;
  }

  return false;
}

function expandBlock(blockId: number, expandedBlockIdsSet: Set<number>, setExpandedBlockIdsSet: (arg: Set<number>) => void) {
  if (!expandedBlockIdsSet.has(blockId)) {
    setExpandedBlockIdsSet(new Set<number>([...expandedBlockIdsSet, blockId]));
  }
}

export default {
  resetCodeBlocks,
  expandBlock,
};
