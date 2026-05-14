import AdminActionButton from "./AdminActionButton.jsx";

const UserRow = ({ user, onDelete }) => (
    <tr>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td><span className={`${user.role}`}>{user.role}</span></td>
        <td>
            <AdminActionButton 
                label="Eliminar" 
                icon="🗑️" 
                onClick={() => onDelete(user.id)} 
            />
        </td>
    </tr>
);
export default UserRow;