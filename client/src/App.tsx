import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import HowToPlay from "./pages/HowToPlay";
import FantasyCricket from "./pages/FantasyCricket";
import ResponsibleGaming from "./pages/ResponsibleGaming";
import FairPlay from "./pages/FairPlay";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import TermsConditions from "./pages/Terms";
import PrivacyPolicy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import TeamBuilder from "./pages/TeamBuilder";
import TeamDetails from "./pages/TeamDetails";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={AboutUs} />
      <Route path={"/how-to-play"} component={HowToPlay} />
      <Route path={"/fantasy-cricket"} component={FantasyCricket} />
      <Route path={"/responsible-gaming"} component={ResponsibleGaming} />
      <Route path={"/fair-play"} component={FairPlay} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/terms"} component={TermsConditions} />
      <Route path={"/privacy"} component={PrivacyPolicy} />
      <Route path={"/disclaimer"} component={Disclaimer} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/team-builder/:matchId"} component={TeamBuilder} />
      <Route path={"/team/:teamId"} component={TeamDetails} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
