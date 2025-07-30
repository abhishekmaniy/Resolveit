import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';
import { HomePage } from './HomePage';
import { AdminDashboard } from './AdminDashboard';
import { UserDashboard } from './UserDashboard';
import { ComplaintFormData } from '@/types/types';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useComplaintStore } from '@/store/useComplaintStore';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/types';



const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Index = () => {
  const {
    complaints,
    setComplaints,
    addComplaint,
    updateComplaint,
    removeComplaint,
  } = useComplaintStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (user?.role === 'Admin') {
      axios
        .get(`${BACKEND_URL}/complaint`, { withCredentials: true })
        .then((res) => setComplaints(res.data))
        .catch((err) => console.error('Error loading complaints', err));
      navigate('/admin');
    }
    if (user?.role === 'User') {
      axios
        .get(`${BACKEND_URL}/complaint`, { withCredentials: true })
        .then((res) => setComplaints(res.data))
        .catch((err) => console.error('Error loading user complaints', err));
      navigate('/user');
    }
  }, [user, setComplaints]);

  const handleSubmitComplaint = async (data: ComplaintFormData) => {

    try {
      const response = await axios.post(`${BACKEND_URL}/complaint/new`, data, {
        withCredentials: true,
      });

      // Show toast with success message
      toast({
        title: response.data.message,
      });

      // Add complaint to store
      addComplaint(response.data.complaint);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast({
        title: error?.response?.data?.message,
        variant: "destructive",
      })

    }



  };

 

  const handleDeleteComplaint = async (_id: string) => {
    await axios.delete(`${BACKEND_URL}/complaint/${_id}`, {
      withCredentials: true,
    });

    removeComplaint(_id);
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({
    children,
    requiredRole,
  }: {
    children: React.ReactNode;
    requiredRole?: UserRole;
  }) => {

    console.log(isAuthenticated, user)
    console.log("requiredRole", requiredRole, "user role", user.role)

    if (!isAuthenticated) return <Navigate to="/" replace />;
    if (requiredRole && user?.role !== requiredRole)
      return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  return (
    <Layout>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute requiredRole="User">
                <UserDashboard
                  complaints={complaints}
                  onSubmitComplaint={handleSubmitComplaint}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard
                  onDelete={handleDeleteComplaint}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Layout>
  );
};

export default Index;
