import render from 'preact-render-to-string';
import { h } from 'preact';
import Board from 'components/Board';

global.RenderToString = (props) => render(<Board {...props} />);
