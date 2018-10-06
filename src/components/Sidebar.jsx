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

export default class InlineEdit extends React.Component {
    static defaultProps = {
        minLength: 1,
        maxLength: 256,
        editingElement: 'input',
        staticElement: 'span',
        tabIndex: 0,
        isDisabled: false,
        editing: false
    };

    state = {
        editing: this.props.editing,
        text: this.props.text,
        minLength: this.props.minLength,
        maxLength: this.props.maxLength,
    };

    componentWillReceiveProps(nextProps) {
        const isTextChanged = (nextProps.text !== this.props.text);
        const isEditingChanged = (nextProps.editing !== this.props.editing);
        let nextState = {};
        if (isTextChanged) {
            nextState.text = nextProps.text;
        }
        if (isEditingChanged) {
            nextState.editing = nextProps.editing;
        }
        if (isTextChanged || isEditingChanged) {
            this.setState(nextState);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let inputElem = ReactDOM.findDOMNode(this.refs.input);
        if (this.state.editing && !prevState.editing) {
            inputElem.focus();
            inputElem.setSelectionRange(0, inputElem.value.length);
        } else if (this.state.editing && prevProps.text != this.props.text) {
            this.finishEditing();
        }
    }

    startEditing = (text, e) => {
        this.setState({editing: true, text: text});
    };

    finishEditing = () => {
        if (this.isInputValid(this.state.text) && this.props.text != this.state.text){
            this.commitEditing();
        } else if (this.props.text === this.state.text || !this.isInputValid(this.state.text)) {
            this.cancelEditing();
        }
    };

    cancelEditing = () => {
        this.setState({editing: false, text: this.props.text});
    };

    commitEditing = () => {
        this.setState({editing: false, text: this.state.text});
        let newProp = {};
        newProp[this.props.paramName] = this.state.text;
        this.props.change(newProp);
    };

    isInputValid = (text) => {
        return (text.length >= this.state.minLength && text.length <= this.state.maxLength);
    };

    keyDown = (event) => {
        if (event.keyCode === 13) {
            this.finishEditing();
        } else if (event.keyCode === 27) {
            this.cancelEditing();
        }
    };

    textChanged = (event) => {
        this.setState({
            text: event.target.value.trim()
        });
    };

    render(props, { text, editing }) {
        if (this.props.isDisabled) {
          const Element = this.props.element || this.props.staticElement;
          return <Element
              className={this.props.className}
              style={this.props.style} >
              {text || this.props.placeholder}
          </Element>;
        } else if (!editing) {
            const Element = this.props.element || this.props.staticElement;
            return <Element
                className={this.props.className}
                onClick={this.startEditing}
                tabIndex={this.props.tabIndex}
                style={this.props.style} >
                {text || this.props.placeholder}
            </Element>;
        } else {
            const Element = this.props.element || this.props.editingElement;
            return <Element
                onKeyDown={this.keyDown}
                onBlur={this.finishEditing}
                className={this.props.activeClassName}
                placeholder={this.props.placeholder}
                defaultValue={text}
                onChange={this.textChanged}
                style={this.props.style}
                ref="input" />;
        }
    }
}
