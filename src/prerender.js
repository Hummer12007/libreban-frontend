import render from 'preact-render-to-string';
import Board from 'components/Board';

global.RenderToString = (props) => {
    return render(<Board {...props} />);
}
