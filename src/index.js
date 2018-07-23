import { h, render } from 'preact';
import Board from 'components/Board';
import style from 'app.css';

const root = document.getElementById('root');
render(<Board {...initialState} />, root.parentElement, root);
