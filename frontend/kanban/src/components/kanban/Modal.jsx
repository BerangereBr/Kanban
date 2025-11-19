import ReactDOM from "react-dom";
import '../../styles/modal.scss';

function Modal({ children, onClose }) {
    return ReactDOM.createPortal(
        <div onClick={onClose} className="modal">
            <div onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default Modal;
