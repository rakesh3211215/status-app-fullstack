import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import i18n from "./i18n/i18n";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddStatus from "./pages/AddStatus";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/routes/AdminRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import UserTable from "./components/admin/UserTable";
import StatusTable from "./components/admin/StatusTable";
import CategoryManager from "./components/admin/CategoryManager";
import StatusesPage from "./components/admin/StatusesPage";
import CategoriesPage from "./components/admin/CategoriesPage";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/add-status" element={<AddStatus />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboard />}>
                      <Route
                        index
                        element={
                          <div>
                            Admin Dashboard Home - Select a section from the
                            sidebar
                          </div>
                        }
                      />
                      <Route path="users" element={<UserTable />} />
                      <Route path="statuses" element={<StatusesPage />} />
                      <Route path="categories" element={<CategoriesPage />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
