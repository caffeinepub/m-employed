import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import JobsBrowsePage from './pages/JobsBrowsePage';
import JobDetailPage from './pages/JobDetailPage';
import CandidateDashboardPage from './pages/candidate/CandidateDashboardPage';
import EmployerDashboardPage from './pages/employer/EmployerDashboardPage';
import JobEditorPage from './pages/employer/JobEditorPage';
import JobApplicationsPage from './pages/employer/JobApplicationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MessagesThreadPage from './pages/MessagesThreadPage';
import OnboardingPage from './pages/OnboardingPage';
import FounderAboutPage from './pages/FounderAboutPage';
import AboutPlatformPage from './pages/AboutPlatformPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs',
  component: JobsBrowsePage,
});

const jobDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$jobId',
  component: JobDetailPage,
});

const candidateDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidate/dashboard',
  component: CandidateDashboardPage,
});

const employerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/dashboard',
  component: EmployerDashboardPage,
});

const jobEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs/new',
  component: JobEditorPage,
});

const jobEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs/$jobId/edit',
  component: JobEditorPage,
});

const jobApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employer/jobs/$jobId/applications',
  component: JobApplicationsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages/$applicationId',
  component: MessagesThreadPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
});

const founderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/founder',
  component: FounderAboutPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPlatformPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  jobsRoute,
  jobDetailRoute,
  candidateDashboardRoute,
  employerDashboardRoute,
  jobEditorRoute,
  jobEditRoute,
  jobApplicationsRoute,
  profileRoute,
  settingsRoute,
  messagesRoute,
  onboardingRoute,
  founderRoute,
  aboutRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
