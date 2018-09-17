import { render } from 'preact';
import Board from 'components/Board';
import style from 'app.css';

const root = document.getElementById('root');
//const socket = undefined;
const socket = new WebSocket(`${window.location.protocol == 'http:' ? 'ws' : 'wss'}://${window.location.host}${window.location.pathname}/updates`);

socket.onmessage = (event) => {
    console.log(event.data);
}

socket.onopen = (event) => {
    console.log("Connected");
};

socket.onclose = (event) => {
    console.log("Closed");
};

socket.onerror = (event) => {
    console.log("Error");
};

//socket.onerror += refresh the page(?);
//socket.onclose += refresh if !event.wasClean

render(<Board {...initialState} socket={socket} />, root.parentElement, root);
