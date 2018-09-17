import { Component } from 'preact';
import Portal from 'preact-portal';

import style from 'modal.css';
export default class Modal extends Component {
    getChildContext() {
        return { closeModal: this.props.onClose };
    }

    render({visible, children}) {
        return visible ? (
            <Portal into="body">
                <div className="modal-wrapper">
                    <div className="modal-content">
                        {children}
                    </div>
                </div>
            </Portal>
        ) : null;
    }
}
