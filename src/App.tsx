import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import StatisticsPage from "./pages/StatisticsPage";
import StepsPage from "./pages/StepsPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import ExplorePage from "./pages/ExplorePage";
import IdeaDetailPage from "./pages/IdeaDetailPage";
import SubmitIdeaPage from "./pages/SubmitIdeaPage";
import CoFoundersPage from "./pages/CoFoundersPage";
import InvestorsPage from "./pages/InvestorsPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import WorkspacePage from "./pages/WorkspacePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/steps" element={<StepsPage />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/idea/:id" element={<IdeaDetailPage />} />
            <Route path="/submit-idea" element={<SubmitIdeaPage />} />
            <Route path="/cofounders" element={<CoFoundersPage />} />
            <Route path="/investors" element={<InvestorsPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <AIChatBot />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
