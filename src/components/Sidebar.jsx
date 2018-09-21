import { Component } from 'preact';
import Portal from 'preact-portal';

import style from 'sidebar.css';
export default class Sidebar extends Component {
    getChildContext() {
        return { closeSidebar: this.props.onClose };
    }

    render({visible, children}) {
        return visible ? (
            <Portal into="body">
                <div className="sidebar-wrapper">
                    <span className="sidebar-close" type="reset" onClick={this.props.onClose.bind(this)}>✖</span>
                    <div className="sidebar-content">
                        {children}
                    </div>
                </div>
            </Portal>
        ) : null;
    }
}
