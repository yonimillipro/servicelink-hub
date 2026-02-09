import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Categories from "./pages/Categories";
import CompanyProfile from "./pages/CompanyProfile";
import SearchPage from "./pages/SearchPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Provider dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardServices from "./pages/dashboard/DashboardServices";
import AddService from "./pages/dashboard/AddService";
import EditService from "./pages/dashboard/EditService";
import DashboardInquiries from "./pages/dashboard/DashboardInquiries";
import DashboardCompany from "./pages/dashboard/DashboardCompany";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCompanies from "./pages/admin/AdminCompanies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:slug" element={<Services />} />
              <Route path="/companies/:id" element={<CompanyProfile />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Auth />} />
              <Route path="/register" element={<Auth />} />
              <Route path="/forgot-password" element={<Auth />} />

              {/* Provider Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute requireProvider>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/services" element={
                <ProtectedRoute requireProvider>
                  <DashboardServices />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/services/add" element={
                <ProtectedRoute requireProvider>
                  <AddService />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/services/:id/edit" element={
                <ProtectedRoute requireProvider>
                  <EditService />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/inquiries" element={
                <ProtectedRoute requireProvider>
                  <DashboardInquiries />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/company" element={
                <ProtectedRoute requireProvider>
                  <DashboardCompany />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/services" element={
                <ProtectedRoute requireAdmin>
                  <AdminServices />
                </ProtectedRoute>
              } />
              <Route path="/admin/categories" element={
                <ProtectedRoute requireAdmin>
                  <AdminCategories />
                </ProtectedRoute>
              } />
              <Route path="/admin/companies" element={
                <ProtectedRoute requireAdmin>
                  <AdminCompanies />
                </ProtectedRoute>
              } />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
