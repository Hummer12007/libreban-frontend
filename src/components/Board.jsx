import { h, Component } from 'preact';
import sortableRef from 'util/sortableUtils';
import { move, reorder } from 'util/dataUtils';

const Column = ({ id, idx, title, items }, { onEvent }) =>
    <div className={`${id}-column`}>
        <h2 className={`${id}-title`}>{title}</h2>
        <div className={`${id}-list`} data-sort-kind='column' data-column-idx={idx}
            ref={sortableRef(id, { group: `${id}-group`, onEnd: onEvent })} >
            {items.map((item, idx) =>
                <div className={id}>{item}</div>
            )}
        </div>
    </div>;

export default class Board extends Component {
    state = {};

    getChildContext() {
        return { onEvent: this.processChildEvent.bind(this) };
    }

    processChildEvent({ to, oldIdx, newIdx, from }) {
        const { columns, data } = this.state;
        switch (to.dataset.sortKind) {
        case 'container':
            this.setState({ columns: reorder(columns, oldIdx, newIdx) })
            break;
        case 'column':
            const froCol = columns[from.dataset.columnIdx], toCol = columns[to.dataset.columnIdx];
            const res = move(
                { arr: data[froCol].items, id: froCol, idx: oldIdx },
                { arr: data[toCol].items, id: toCol, idx: newIdx });
            var newData = Object.assign({}, data);
            Object.assign(newData[froCol], { items: res[froCol] });
            Object.assign(newData[toCol], { items: res[toCol] });
            this.setState({ data: newData });
            break;
        default:
            break;
        }
    }

    constructor(props) {
        super(props);
        const { columns, data } = props;
        this.state.columns = columns;
        this.state.data = {};
        columns.forEach((column) => {this.state.data[column] = data[column];});
      }

    render({ }, { columns, data }) {
        return (
            <div className='container' data-sort-kind='container'
                ref={sortableRef('group-column', { handle: '.group-title', onEnd: this.getChildContext().onEvent })}>
                {columns.map((item, idx) =>
                    <Column id='group' idx={idx} title={data[item].title} items={data[item].items} />
                )}
            </div>
        );
    }
}
