import type { JSX } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('authToken');
  token ? toast.error("You are already authenticated",{icon:null}) :null
  return token ? <Navigate to="/" replace /> : children;
};
export const PrivateRoute = ({ children }:{children:JSX.Element}) => {
  const token = localStorage.getItem('authToken');
  token ? null :toast.error("You need to be authenticated first to go to the home page",{icon:null})
  return token ? children : <Navigate to="/login" replace />;
};