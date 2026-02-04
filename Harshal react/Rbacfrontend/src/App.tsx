import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import { Toaster } from "react-hot-toast";
import { PrivateRoute, PublicRoute } from "./guards/auth";
import AdminPanel from "./pages/admin";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
            fontFamily: "Josefin Sans, sans-serif",
          },
          success: {
            duration: 3000,
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/admin"
        element={
          <AdminPanel/>
        } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
