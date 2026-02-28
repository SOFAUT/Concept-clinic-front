import { Route, Routes } from "react-router";
import { APP_ROUTES } from "../../util/constants";
import NotFound from "../../pages/notFound/NotFound";
import { AuthMiddleware } from "../../core/middleware/AuthMiddleware";
import AppLayout from "../../components/layout/AppLayout";
import AuthLayout from "../../components/layout/AuthLayout";
import Home from "../../pages/Home";
import Login from "../../pages/authPages/Login";
import LoginClinic from "../../pages/authPages/LoginClinic";
import Register from "../../pages/authPages/Register";
import RegisterClinic from "../../pages/authPages/RegisterClinic";

// Admin Pages
import AdminDashboard from "../../pages/adminPages/Dashboard";
import ClinicsManagement from "../../pages/adminPages/ClinicsManagement";

// Clinic Pages
import ClinicDashboard from "../../pages/clinicPages/Dashboard";
import Appointments from "../../pages/clinicPages/Appointments";
import Patients from "../../pages/clinicPages/Patients";
import Procedures from "../../pages/clinicPages/Procedures";

// Patient Pages
import PatientLanding from "../../pages/patientPages/PatientLanding";
import PatientDashboard from "../../pages/patientPages/Dashboard";
import PatientHistory from "../../pages/patientPages/History";
import MyAppointments from "../../pages/patientPages/MyAppointments";
import PaymentDashboard from "../../pages/patientPages/PaymentDashboard";
import Profile from "../../pages/patientPages/Profile";
import LocationForm from "../../pages/patientPages/LocationForm";
import PatientCards from "../../pages/patientPages/PatientCards";

// Onboarding Pages
import ChooseRole from "../../pages/onboarding/ChooseRole";
import OnboardingPatient from "../../pages/onboarding/OnboardingPatient";
import OnboardingClinic from "../../pages/onboarding/OnboardingClinic";

// Common Components

export const AppRoutes = () => (
  <Routes>
    {/* Home pública */}
    <Route path={APP_ROUTES.HOME} element={<Home />} />

    {/* Onboarding routes */}
    <Route path="/choose-role" element={<ChooseRole />} />
    <Route path="/onboarding/patient" element={<OnboardingPatient />} />
    <Route path="/onboarding/clinic" element={<OnboardingClinic />} />

    {/* Auth routes */}
    <Route
      path={APP_ROUTES.LOGIN}
      element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      }
    />
    <Route
      path={APP_ROUTES.LOGIN_CLINIC}
      element={
        <AuthLayout>
          <LoginClinic />
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
    <Route
      path={APP_ROUTES.REGISTER_CLINIC}
      element={
        <AuthLayout>
          <RegisterClinic />
        </AuthLayout>
      }
    />

    {/* Patient Landing (rota própria, sem sidebar) */}
    <Route
      path={APP_ROUTES.PATIENT.LANDING}
      element={
        <AuthMiddleware>
          <PatientLanding />
        </AuthMiddleware>
      }
    />

    {/* Private routes */}
    <Route
      element={
        <AuthMiddleware>
          <AppLayout />
        </AuthMiddleware>
      }
    >
      {/* Admin Routes */}
      <Route path={APP_ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
      <Route path={APP_ROUTES.ADMIN.CLINICS} element={<ClinicsManagement />} />

      {/* Clinic Routes */}
      <Route path={APP_ROUTES.CLINIC.DASHBOARD} element={<ClinicDashboard />} />
      <Route path={APP_ROUTES.CLINIC.APPOINTMENTS} element={<Appointments />} />
      <Route path={APP_ROUTES.CLINIC.PATIENTS} element={<Patients />} />
      <Route path={APP_ROUTES.CLINIC.PROCEDURES} element={<Procedures />} />

      {/* Patient Routes */}
      <Route path={APP_ROUTES.PATIENT.DASHBOARD} element={<PatientDashboard />} />
      <Route path={APP_ROUTES.PATIENT.APPOINTMENTS} element={<MyAppointments />} />
      <Route path={APP_ROUTES.PATIENT.HISTORY} element={<PatientHistory />} />
      <Route path={APP_ROUTES.PATIENT.PAYMENTS} element={<PaymentDashboard />} />
      <Route path={APP_ROUTES.PATIENT.PROFILE} element={<Profile />} />
      <Route path={APP_ROUTES.PATIENT.LOCATION} element={<LocationForm />} />
      <Route path={APP_ROUTES.PATIENT.CARDS} element={<PatientCards />} />
    </Route>

    {/* 404 - Deve ser a última rota */}
    <Route path={APP_ROUTES.NOTFOUND} element={<NotFound />} />
  </Routes>
);
