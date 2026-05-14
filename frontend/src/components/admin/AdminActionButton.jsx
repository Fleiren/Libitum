const AdminActionButton = ({ onClick, label, icon }) => {
    return (
        <button className="button-admin" onClick={onClick}>
            {icon && <span className="icon">{icon}</span>}
            {label}
        </button>
    );
};
export default AdminActionButton;