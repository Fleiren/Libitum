import { Navigate, Outlet} from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext.js";

const AdminRoute = () => {
    const {user, loading} = useAuthContext();
    console.log("🕵️‍♂️ Guard detectando usuario:", user, "| Rol:", user?.role);
    //Si cualquier cosa falla lleva al usuario al login.
    let element = <div className="loading-screen">Verificando permisos...</div>;
    if(loading){
        //cambiar por el cargando.
        element = <div className="loading-screen">Verificando permisos...</div>;
    }else if(user && user.role !== "admin"){
         
        element = <Navigate to="/" replace/>    
         
    }else if(user && user.role === "admin"){
        element = <Outlet />;   
    }else if (user === null) {
        
        element = <Navigate to="/login" replace />;
    }

    return element;
}

export default AdminRoute;