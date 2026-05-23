import AdminActionButton from "./AdminActionButton.jsx";

const UserRow = ({ user, onDelete }) => {
    
    return(
        <tr>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td><span className={`${user.roles?.[0]?.name}`}>{user.roles?.[0]?.name}</span></td>
        <td>
            <AdminActionButton 
                label="Eliminar" 
                icon="🗑️" 
                onClick={() => onDelete(user.id)} 
            />
        </td>
    </tr>
    );
    
};
export default UserRow;