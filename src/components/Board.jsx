import { Component } from 'preact';
import sortableRef from 'util/sortableUtils';
import { boardChanger } from 'util/boardManipulation';
import { dispatchApiUpdate } from 'util/api';

import EventSink from 'components/EventSink'
import Modal from 'components/Modal'
import Sidebar from 'components/Sidebar'

const Item = ({ id, name, description, status }, { dispatch }) =>
    <div className={status === 'pending' ? `${id}-pending` : id} onClick={dispatch.bind(this, "show-sidebar")}>
        <span>{name}</span>
    </div>

const Column = (props, { dispatch }) => {
    const { id, cid, title, items } = props;
    return (
        <div className={`${id}-column`}>
            <h2 className={`${id}-title`}>{title}<span onClick={dispatch.bind(this, "show-modal")}>➕</span></h2>
            <div className={`${id}-list`} data-sort-kind='column' data-column-id={cid}
                ref={sortableRef(id, { group: `${id}-group`, onEnd: dispatch })} >
                {items.map((item, idx) =>
                    <Item id={id} {...item} />
                )}
            </div>
        </div>
    );
};

const Grid = ({ columns, tickets, order }, { dispatch }) =>
    <div className='container' data-sort-kind='container'
        ref={sortableRef('group-column',
            { handle: '.group-title', onEnd: dispatch })}>
        {order.map((item, idx) =>
            <Column id='group' cid={item} title={columns[item].name} items={columns[item].tickets.map((it, ii) => tickets[it])} />
        )}
    </div>;

class GridComponent extends Component {
    propagateChildEvent(dispatch, params) {
        if (params === "show-modal") {
            dispatch({ type: "show-modal", dispatch: false });
            return;
        }

        if (params === "show-sidebar") {
            dispatch({ type: "show-sidebar", dispatch: false });
            return;
        }
        const { to, oldIndex, newIndex, from } = params;
        const { columns, order } = this.props;
        switch (to.dataset.sortKind) {
            case 'container':
                dispatch({ type: 'move-container', column: order[oldIndex], dest: newIndex });
                break;
            case 'column':
                const froCol = from.dataset.columnId, toCol = to.dataset.columnId;
                if (froCol === toCol && oldIndex === newIndex)
                    break;
                dispatch({ type: 'move-ticket', ticket: columns[froCol].tickets[oldIndex], dest: toCol, destIdx: newIndex })
                break;
            default:
                break;
        }
    }

    render({ }, { }, { dispatch }) {
        return (
            <EventSink handler={[this.propagateChildEvent.bind(this, dispatch)]}>
                <Grid {...this.props} />
            </EventSink>
        )
    }
}

const dispatchAddCard = (dispatch, ev) => {
    const data = ['column', 'name', 'description'].map((it, idx) => ({[it]: ev.target.elements[it].value}));
    dispatch({type: 'add-ticket', ...Object.assign({}, ...data)});
}

const CardAdder = ({ columns }, { dispatch, closeModal }) =>
    <form action="javascript:void(0);" onSubmit={dispatchAddCard.bind(undefined, dispatch)}>
        <div className="modal-inner">
            <label> Column:  </label>
            <select className="modal-input" name="column">
                    {columns.map((col) =>
                        <option value={col.id}>{col.name}</option>
                    )}
            </select>
            <label>Title: </label>
            <input className="modal-input" name="name" type="text" />
            <label>Description:</label>
            <textarea  className="modal-input" name="description"></textarea>
        </div>
        <button className="btn" type="submit" onClick={closeModal}>Submit</button>
        <button className="modal-close" type="reset" onClick={closeModal}>✖</button>
    </form>


const CardDesc = ({ card }, { dispatch, closeSidebar}) =>
        <div className="sidebar-inner">
            <p>Status: </p>
            <p>Title: </p>
            <p>Description:</p>
        </div>

export default class Board extends Component {
    state = {
        columns: this.props.columns,
        tickets: this.props.tickets,
        order: this.props.order,
        hasModal: false,
        hasSidebar: false
    };

    constructor(props) {
        super(props);
        if (props.socket) {
            props.socket.onmessage = ((process, event) =>
                process(JSON.parse(event.data))).bind(this, this.processEvent.bind(this));
        }
    }

    processEvent(params) {
        this.setState(boardChanger(params));
        return ('dispatch' in params) ? params.dispatch : true;
    }

    showModal(value) {
        this.setState({hasModal: value});
    }

    showSidebar(value) {
        this.setState({hasSidebar: value});
    }

    render({ }, { columns, tickets, order }) {
        return (
            <EventSink handler={[this.processEvent.bind(this), dispatchApiUpdate]}>
                <GridComponent columns={columns} tickets={tickets} order={order} />
                <Modal visible={this.state.hasModal} onClose={this.showModal.bind(this, false)} dismissable={true}>
                    <CardAdder columns={order.map((it) => ({ id: it, name: columns[it].name}))} />
                </Modal>
            <Sidebar visible={this.state.hasSidebar} onClose={this.showSidebar.bind(this, false)}>
                <CardDesc columns={order.map((it) => ({ id: it, name: columns[it].name}))} />
            </Sidebar>
            </EventSink>
        )
    }
}


