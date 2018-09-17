import { Component } from 'preact';

export default class EventSink extends Component {
    getChildContext() {
        function fun(handler, event) {
            if (Array.isArray(handler)) {
                for (var i = 0; i < handler.length; ++i) {
                    if (!this(handler[i], event))
                        return false;
                }
                return true;
            }
            return handler(event);
        }
        return { dispatch: fun.bind(fun, this.props.handler) };
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div> // developit/preact#946
        );
    }
}
