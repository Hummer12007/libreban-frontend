import Sortable from 'sortablejs';

const sortableRef = (id, opts = {}) => (instance) => {
    if (!instance) return;
    let options = {
        animation: 150,
        draggable: `.${id}`,
        dragClass: `${id}-dragging`, ghostClass: `${id}-ghost`, chosenClass: `${id}-chosen`,
    };
    Object.assign(options, opts);
    Sortable.create(instance, options);
};

export default sortableRef;
