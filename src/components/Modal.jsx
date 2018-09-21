import { Component } from 'preact';
import Portal from 'preact-portal';

import style from 'modal.css';
export default class Modal extends Component {
    getChildContext() {
        return { closeModal: this.props.onClose };
    }

    dismiss() {
        if (this.props.dismissable)
            this.props.onClose();
    }

    render({visible, children}) {
        return visible ? (
            <Portal into="body">
                <div className="modal-wrapper" onClick={this.dismiss.bind(this)}>
                    <div className="modal-content">
                        {children}
                    </div>
                </div>
            </Portal>
        ) : null;
    }
}
