export const genItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

export const move = (src, dst) => {
    if (src.id === dst.id) {
        return {[src.id]: reorder(src.arr, src.idx, dst.idx)};
    }
    const srcData = Array.from(src.arr);
    const dstData = Array.from(dst.arr);

    const [removed] = srcData.splice(src.idx, 1);
    dstData.splice(dst.idx, 0, removed);

    return { [src.id]: srcData, [dst.id]: dstData };
};
