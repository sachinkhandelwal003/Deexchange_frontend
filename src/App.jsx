import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import TopNavbar from './components/TopNavbar'; // Yeh wahi navbar jo humne pehle edit kiya
import CategoryTabs from './components/CategoryTabs';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent/MainContent';
import AccountStatement from './components/AccountStatement';
import GameDetail from './components/GameDetail';
import Dashboard from './components/Dashboard/DashboardMain';
import AddAccountPage from './components/Dashboard/Addaccount';
import AssignAgentPage from './components/Dashboard/AssignAgent';
import MarketAnalysisPage from './components/Dashboard/Market';
import MultiLoginPage from './components/Dashboard/Multilogin';
import SecureAuth from './components/Dashboard/Masterss/SecureAuth';
import Forget from './components/Dashboard/Masterss/Forget';
import Navbar from './components/Dashboard/Navbar';
import Accountreports from "./components/Dashboard/Reports/Accountreports"
import Currentbets from "./components/Dashboard/Reports/CurrentBets"
import GeneralReport from './components/Dashboard/Reports/Generalreports';
import Gamereport from './components/Dashboard/Reports/Gamereports'
import Casino from './components/Dashboard/Reports/Casinoreports'
import Profitloss from './components/Dashboard/Reports/ProfitLoss';
import Casinoresult from './components/Dashboard/Reports/Casinoresult';
import GeneralLock from './components/Dashboard/Reports/GeneralLock';
import Registration from "./components/Dashboard/Reports/Registration";
import Total from './components/Dashboard/Reports/TotalPL';
import Login from './components/Login';
import WinlossReport from './components/Dashboard/Reports/WInLossReport';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
// --- 1. USER LAYOUT (Main Website Look) ---
const UserLayout = ({ sidebarOpen, setSidebarOpen }) => (
  <div className="min-h-screen bg-white">
    <TopNavbar /> {/* Navbar yahan ek hi baar define hai */}
    <CategoryTabs />
    <div className="flex gap-2 pt-1">
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex-1 overflow-hidden">
        <Outlet /> 
      </div>
    </div>
  </div>
);

// --- 2. ADMIN LAYOUT (Dashboard Look) ---
// Isme Sidebar nahi hai, sirf Navbar hai jo har page pe dikhega
const AdminLayout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar /> {/* Navbar yahan bhi fix ho gaya */}
    <div className="pt-[85px] md:pt-[45px]"> {/* Navbar fixed hai isliye padding zaroori hai */}
      <Outlet /> 
    </div>
  </div>
);

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* --- CLIENT ROUTES --- */}
<Route
  element={
    <ProtectedRoute type="user">
      <UserLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </ProtectedRoute>
  }
>
     
          <Route path="/" element={<MainContent />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/account-statement" element={<AccountStatement />} />
        </Route>

        {/* --- ADMIN/DASHBOARD ROUTES --- */}

        <Route>
          <Route path="/user/login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Route>
<Route
  element={
    <ProtectedRoute type="admin">
      <AdminLayout />
    </ProtectedRoute>
  }
>
   

       <Route path="/admin" element={<Dashboard />} />
          <Route path="/add-account" element={<AddAccountPage />} />
          <Route path="/assign-agent" element={<AssignAgentPage />} />
          <Route path="/market-analysis" element={<MarketAnalysisPage />} />
          <Route path="/multi-login" element={<MultiLoginPage />} />
          <Route path="/secure-auth" element={<SecureAuth />} />
          <Route path="/change-password" element={<Forget />} />
            <Route path="/account-reports" element={<Accountreports />} />
            <Route path="/current-bets" element={<Currentbets />} />
            <Route path="/game-report" element={<Gamereport />} />
            <Route path="/general-report" element={<GeneralReport />} />
            <Route path="/casino-report" element={<Casino />} />
            <Route path="/profit-loss" element={<Profitloss />} />
            <Route path="/casino-result" element={<Casinoresult />} />
        
            <Route path="/general-lock" element={<GeneralLock />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/total-profit-loss" element={<Total />} />
                <Route path="/win-loss" element={<WinlossReport />} />
        </Route>
      </Routes>
    </Router>
  );
}