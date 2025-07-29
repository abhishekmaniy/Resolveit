import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Shield, Clock, CheckCircle, ArrowRight, Sparkles, Star, AlertTriangle, Flame, Leaf } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export function HomePage() {

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    if (user?.role === 'Admin') {
      navigate('/admin');
    } else {
      navigate('/user');
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div
        className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center text-center px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated Icons */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.div
            className="absolute text-primary opacity-10 animate-float-slow top-10 left-10 h-20 w-20"
            whileHover={{ scale: 1.1 }}
          >
            <MessageCircle />
          </motion.div>
          <motion.div
            className="absolute text-secondary opacity-10 animate-float-fast bottom-10 right-16 h-16 w-16"
            whileHover={{ scale: 1.1 }}
          >
            <Shield />
          </motion.div>
          <motion.div
            className="absolute text-muted opacity-10 animate-float-medium top-1/3 right-1/4 h-14 w-14"
            whileHover={{ scale: 1.1 }}
          >
            <Clock />
          </motion.div>
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500 opacity-20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500 opacity-20 blur-2xl rounded-full" />
        </div>

        {/* Hero Content */}
        <motion.div
          className="z-10 space-y-6 max-w-3xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent drop-shadow-lg">
            ResolveIt
          </h1>
          <p className="text-xl text-muted-foreground">
            Your trusted platform for submitting and tracking complaints. We value your feedback and are committed to resolving your concerns promptly and professionally.
          </p>

          <div className="flex flex-col gap-4 justify-center items-center pt-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button onClick={() => setIsAuthModalOpen(true)} size="lg" className="text-lg px-8 py-6 z-10">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <span onClick={() => setIsAuthModalOpen(true)} className="text-primary cursor-pointer hover:underline">
                Sign in
              </span>{' '}
              to continue
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Features */}
      <motion.section
        className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Decorative Background Icons */}
        <Sparkles className="absolute top-10 left-10 text-indigo-100 dark:text-indigo-900 w-20 h-20 animate-pulse opacity-30 dark:opacity-20" />
        <Star className="absolute bottom-20 right-16 text-yellow-100 dark:text-yellow-900 w-16 h-16 animate-spin-slow opacity-30 dark:opacity-20" />
        <Sparkles className="absolute top-1/2 left-1/2 text-indigo-100 dark:text-indigo-900 w-24 h-24 -translate-x-1/2 -translate-y-1/2 opacity-10" />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl z-10">
          {[
            {
              icon: <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />,
              title: 'Easy Submission',
              description: 'Simple and intuitive form to submit your complaints with all necessary details.',
            },
            {
              icon: <Shield className="h-8 w-8 text-primary mx-auto mb-2" />,
              title: 'Secure & Private',
              description: 'Your complaints are handled with complete confidentiality and security.',
            },
            {
              icon: <Clock className="h-8 w-8 text-primary mx-auto mb-2" />,
              title: 'Quick Response',
              description: 'We aim to acknowledge and respond to all complaints within 24 hours.',
            },
          ].map(({ icon, title, description }, index) => (
            <motion.div
              key={index}
              className="text-center hover:shadow-xl hover:scale-105 transition-all duration-300 dark:bg-gray-800 dark:text-white"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  {icon}
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="dark:text-gray-300">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Priority Levels Info */}
      <motion.section
        className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-rose-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 px-4 py-12 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {/* Decorative Icons */}
        <Leaf className="absolute top-8 left-10 text-green-100 dark:text-green-900 w-14 h-14 animate-pulse opacity-30 dark:opacity-20" />
        <Sparkles className="absolute bottom-10 left-20 text-yellow-100 dark:text-yellow-900 w-16 h-16 animate-spin-slow opacity-20 dark:opacity-10" />

        <Card className="w-full max-w-4xl z-10 dark:bg-gray-800 dark:text-white">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Priority Levels Guide</CardTitle>
            <CardDescription>
              Help us prioritize your complaint by selecting the appropriate level:
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 mt-4">
            {[
              {
                icon: <Leaf className="text-success mt-1" />,
                badge: <Badge variant="secondary" className="text-success">Low</Badge>,
                description: "General inquiries, suggestions, or minor issues that don't affect functionality.",
              },
              {
                icon: <AlertTriangle className="text-warning mt-1" />,
                badge: <Badge variant="default" className="text-warning">Medium</Badge>,
                description: 'Issues that affect functionality but have workarounds available.',
              },
              {
                icon: <Flame className="text-destructive mt-1" />,
                badge: <Badge variant="destructive">High</Badge>,
                description: 'Critical issues that severely impact functionality or cause service disruption.',
              },
            ].map(({ icon, badge, description }, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {icon}
                <div>
                  {badge}
                  <p className="text-sm mt-1 text-muted-foreground dark:text-gray-300">
                    {description}
                  </p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.section>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}