import { Route, Routes } from "react-router";
import { APP_ROUTES } from "../../util/constants";
import NotFound from "../../pages/notFound/NotFound";
import { AuthMiddleware } from "../../core/middleware/AuthMiddleware";
import AppLayout from "../../components/layout/AppLayout";
import AuthLayout from "../../components/layout/AuthLayout";
import Login from "../../pages/authPages/Login";
import Register from "../../pages/authPages/Register";

export const AppRoutes = () => (
  <Routes>
    {/* register routes */}
    <Route
      path={APP_ROUTES.LOGIN}
      element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      }
    />
    <Route
      path={APP_ROUTES.REGISTER}
      element={
        <AuthLayout>
          <Register />
        </AuthLayout>
      }
    />

    {/* private routes */}
    <Route
      element={
        <AuthMiddleware>
          <AppLayout />
        </AuthMiddleware>
      }
    >
      <Route path={APP_ROUTES.HOME} element={<h1>Home</h1>} />
      <Route path={APP_ROUTES.NOTFOUND} element={<NotFound />} />
    </Route>
  </Routes>
);
