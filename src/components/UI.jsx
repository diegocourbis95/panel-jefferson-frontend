export function Badge({ children, variant = '' }) { return <span className={`badge ${variant}`}>{children}</span> }
export function Modal({ title, onClose, children }) { return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal" onMouseDown={e=>e.stopPropagation()}><button className="close" onClick={onClose}>×</button><h2>{title}</h2>{children}</section></div> }
export function Empty({ children = 'No hay registros para mostrar.' }) { return <p className="empty">{children}</p> }
