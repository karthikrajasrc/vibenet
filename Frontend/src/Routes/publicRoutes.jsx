import { useContext } from "react";
import { AuthContext } from "../../authProvider";
import { Navigate } from "react-router";


const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;