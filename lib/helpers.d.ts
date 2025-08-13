declare function resetCodeBlocks(expandedBlocksSize: number, setExpandedBlocks: (arg: Set<number>) => void): boolean;
export declare function expandBlock(blockId: number, expandedBlockIdsSet: Set<number>, expandBlockById: (arg: Set<number>) => void): void;
declare const _default: {
    resetCodeBlocks: typeof resetCodeBlocks;
    expandBlock: typeof expandBlock;
};
export default _default;
