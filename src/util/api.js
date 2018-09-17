export const dispatchApiUpdate = ({type, ...opts}) => {
    const cb = opts.callback;
    delete(opts.callback);
    fetch(`/board/${boardId}/${type}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(opts)
    })
    .then((res) => res.json())
    .then((data) => {
        return cb ? cb(data) : undefined;
    });

    //console.log('Dispatching ' + type + ' for board ' + boardId + ', ');
};
