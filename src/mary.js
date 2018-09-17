import { render } from 'preact';
import Board from 'components/Board';
import style from 'app.css';

const root = document.getElementById('root');
const socket = undefined;
const initialState = {
    "order": ["todo", "inprogress", "taskreview", "codereview", "done"],
    "columns": {
        "todo": {"name": "To Do", "tickets": [7, 8, 9, 10, 11]}, 
        "inprogress": {"name": "In Progress", "tickets": [2]}, 
        "taskreview": {"name": "Task Review", "tickets": [4]}, 
        "codereview": {"name": "Code Review", "tickets": []}, 
        "done": {"name": "Done", "tickets": [1, 3, 5, 6]}
    },
    "tickets": {"1": {"name": "Implement ticket addition", "description": "As a user I would like to be able to add tickets to the board"}, "2": {"name": "Implement ticket removal", "description": "As a user I would like to be able to remove tickets from the board"}, "3": {"name": "Create board layout", "description": ""}, "4": {"name": "Implement client-client synchronization", "description": ""}, "5": {"name": "Implement React component prerendering", "description": ""}, "6": {"name": "Implement smooth animations", "description": ""}, "7": {"name": "Import tickets from Trello", "description": ""}, "8": {"name": "Command-line client", "description": ""}, "9": {"name": "Embeddability", "description": ""}, "10": {"name": "Custom styles", "description": ""}, "11": {"name": "Unit testing", "description": "test units"}}
}

render(<Board {...initialState} socket={socket} />, root.parentElement, root);
