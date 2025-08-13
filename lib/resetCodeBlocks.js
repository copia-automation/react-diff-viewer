export function resetCodeBlocks(expandedBlocksSize, setExpandedBlocks) {
    if (expandedBlocksSize > 0) {
        setExpandedBlocks(new Set());
        return true;
    }
    return false;
}
