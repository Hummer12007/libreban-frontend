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

export const move = (data, src, dst) => {
    if (src.id === dst.id) {
        return {
            ...data,
            [src.id]: {...data[src.id], tickets: reorder(data[src.id].tickets, src.idx, dst.idx)}
        };
    }
    const srcData = Array.from(data[src.id].tickets);
    const dstData = Array.from(data[dst.id].tickets);

    const [removed] = srcData.splice(src.idx, 1);
    dstData.splice(dst.idx, 0, removed);

    return {
        ...data,
        [src.id]: {...data[src.id], tickets: srcData},
        [dst.id]: {...data[dst.id], tickets: dstData}
    };
};

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }  

export const boardChanger = (event) => {
    const {type, ...opts} = event;
    if (type === 'move-container') {
        const { column, dest } = opts;
        return (prevState, props) => {
            const idx = prevState.order.indexOf(column);
            if (idx < 0 || dest > prevState.columns.length)
                return;
            return { order: reorder(prevState.order, idx, dest) };
        }
    } else if (type === 'move-ticket') {
        const { ticket, dest, destIdx } = opts;
        return (prevState, props) => {
            if (!dest in prevState.columns)
                return;
            var srcIdx = -1;
            const src = Object.keys(prevState.columns).find((col) => (srcIdx = prevState.columns[col].tickets.indexOf(ticket)) != -1);
            if (srcIdx < 0 || destIdx < 0 || destIdx > prevState.columns[dest].tickets.length)
                return;
            return { columns: move(prevState.columns,
                { id: src, idx: srcIdx },
                { id: dest, idx: destIdx }) };
        }
    } else if (type === 'add-ticket') {
        const { column, name, description, idx, rid, tid } = opts;
        var _rid;
        if (idx == undefined)
            event.rid = _rid = uuidv4();
        return (prevState, props) => {
            if (!column in prevState.columns)
                return;
            const col = prevState.columns[column];
            const tkt = {name: name, description: description};
            const tkts = prevState.tickets;
            if (idx != undefined) {
                delete(tkts[rid]);
                if (col.tickets.indexOf(rid) > 0)
                    col.tickets.splice(col.tickets.indexOf(rid), 1);
                tkts[tid] = tkt;
                col.tickets.splice(idx, 0, tid);
            } else {
                tkt.status = 'pending';
                prevState.tickets[_rid] = tkt;
                col.tickets.push(_rid);
            }
            return {
                columns: {...prevState.columns, [`${column}`]: col},
                tickets: tkts
            };
        };
    } else if (type === 'show-modal') {
        return { hasModal: true };
    } else if (type === 'show-sidebar') {
        return { hasSidebar: true };
    }
}
