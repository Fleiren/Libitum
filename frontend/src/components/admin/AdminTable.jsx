// src/components/admin/AdminTable.jsx
const AdminTable = ({ headers, children }) => (
    <table className="admin-table">
        <thead>
            <tr>
                {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                ))}
            </tr>
        </thead>
        <tbody>
            {children}
        </tbody>
    </table>
);
export default AdminTable;