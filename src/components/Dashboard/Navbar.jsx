import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from './../../assets/image/dev_logo.png';

// --- Recursive Sidebar Item (Tree Structure) ---
const SidebarItem = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="relative select-none ">
      <div 
        className="flex items-center py-1.5 px-4 cursor-pointer hover:bg-gray-100 text-[#333] transition-colors relative group"
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{ paddingLeft: `${(level * 24) + 16}px` }}
      >
        {level > 0 && (
          <>
            <div className="absolute w-4 h-[1px] bg-gray-400 top-1/2" style={{ left: `${(level * 24) - 14}px` }}></div>
            <div className="absolute w-2 h-2 bg-[#0088CC] rounded-full top-1/2 -translate-y-1/2 z-10" style={{ left: `${(level * 24) - 18}px` }}></div>
          </>
        )}
        <span className={`text-[13px] whitespace-nowrap ${level === 0 ? 'font-bold uppercase py-1' : 'font-medium ml-4'}`}>
          {item.title}
        </span>
        {hasChildren && (
          <span className="ml-auto pr-4 text-[16px] font-bold text-gray-500">{isOpen ? '−' : '+'}</span>
        )}
      </div>
      {hasChildren && isOpen && (
        <div className="relative">
          <div className="absolute top-0 bottom-4 w-[1px] bg-gray-400" style={{ left: `${(level * 24) + 6}px` }}></div>
          {item.children.map((child) => (
            <SidebarItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLiveMarket, setShowLiveMarket] = useState(false);
  const [showVirtualMarket, setShowVirtualMarket] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showMasterDropdown, setShowMasterDropdown] = useState(false);
  const [adminName, setAdminName] = useState("Loading..."); // User Name State
  const navigate = useNavigate(); 

  // --- Fetch User Profile for Name ---
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('https://devexchangee.in/api/api/users/get-profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const name = response.data.data.client_name || response.data.data.full_name || "Admin";
          setAdminName(name);
        }
      } catch (err) {
        console.error("Navbar profile fetch error:", err);
        setAdminName("Admin");
      }
    };
    fetchAdminProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  const sportsData = [
    {
      id: "all-sports",
      title: "All Sports",
      children: [
        {
          id: "cricket",
          title: "Cricket",
          children: [
            {
              id: "international",
              title: "International",
              children: [
                {
                  id: "asia",
                  title: "Asia",
                  children: [
                    { id: "india", title: "India" },
                    { id: "pakistan", title: "Pakistan" },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "football",
          title: "Football",
          children: [
            {
              id: "europe",
              title: "Europe",
              children: [
                { id: "epl", title: "Premier League" },
                { id: "laliga", title: "La Liga" },
              ],
            },
          ],
        },
        { id: "tennis", title: "Tennis" },
        { id: "table-tennis", title: "Table Tennis" },
        { id: "badminton", title: "Badminton" },
        { id: "basketball", title: "Basketball" },
        { id: "volleyball", title: "Volleyball" },
        { id: "snooker", title: "Snooker" },
        { id: "ice-hockey", title: "Ice Hockey" },
        { id: "esoccer", title: "Esoccer" },
        { id: "egames", title: "E Games" },
        { id: "futsal", title: "Futsal" },
        { id: "handball", title: "Handball" },
        { id: "kabaddi", title: "Kabaddi" },
        { id: "golf", title: "Golf" },
        { id: "rugby-league", title: "Rugby League" },
        { id: "boxing", title: "Boxing" },
        { id: "beach-volleyball", title: "Beach Volleyball" },
        { id: "mixed-martial-arts", title: "Mixed Martial Arts" },
        { id: "motogp", title: "MotoGP" },
        { id: "chess", title: "Chess" },
        { id: "cycling", title: "Cycling" },
        { id: "motorbikes", title: "Motorbikes" },
        { id: "athletics", title: "Athletics" },
        { id: "basketball-3x3", title: "Basketball 3X3" },
        { id: "sumo", title: "Sumo" },
        { id: "virtual-sports", title: "Virtual Sports" },
        { id: "motor-sports", title: "Motor Sports" },
        { id: "baseball", title: "Baseball" },
        { id: "rugby-union", title: "Rugby Union" },
        { id: "darts", title: "Darts" },
        { id: "american-football", title: "American Football" },
        { id: "soccer", title: "Soccer" },
        { id: "esports", title: "ESports" },
      ],
    },
  ];

  const liveMarketItems = [
    { title: "Premium Casino", path: "/premium-casino" },
    { title: "Tembo Casino", path: "/tembo-casino" },
    { title: "Vip Casino", path: "/vip-casino" },
    { title: "Lucky 6", path: "/lucky-6" },
    { title: "Mogambo", path: "/mogambo" },
    { title: "Unique Teenpatti", path: "/unique-teenpatti" },
    { title: "Roulette", path: "/roulette" },
    { title: "Super Over2", path: "/super-over2" },
    { title: "Lucky15", path: "/lucky15" },
    { title: "Goal", path: "/goal" },
    { title: "Binary", path: "/binary" },
    { title: "Race 20-20", path: "/race-20-20" },
    { title: "Queen", path: "/queen" },
    { title: "Baccarat", path: "/baccarat" },
    { title: "Sport Casino", path: "/sport-casino" },
    { title: "Casino War", path: "/casino-war" },
    { title: "Worli", path: "/worli" },
    { title: "3 Card Judgement", path: "/3-card-judgement" },
    { title: "32 Card Casino", path: "/32-card-casino" },
    { title: "Live Teenpatti", path: "/live-teenpatti" }
  ];

  const virtualMarketItems = [
    { title: "20-20 DTL", path: "/20-20-dtl" },
    { title: "Amar Akbar Anthony", path: "/amar-akbar-anthony" },
    { title: "Muflis Teenpatti", path: "/muflis-teenpatti" },
    { title: "1 Day Teenpatti", path: "/1-day-teenpatti" },
    { title: "1 Day Dragon Tiger", path: "/1-day-dragon-tiger" },
    { title: "Lucky 7", path: "/lucky-7" },
    { title: "Bollywood Casino", path: "/bollywood-casino" },
    { title: "20-20 Teenpatti", path: "/20-20-teenpatti" },
    { title: "Trio", path: "/trio" }
  ];

  const reportItems = [
    { title: "Account Statement", path: "/account-reports" },
    { title: "Current Bets", path: "/current-bets" },
    { title: "General Report", path: "/general-report" },
    { title: "Game Report", path: "/game-report" },
    { title: "Casino Report", path: "/casino-report" },
    { title: "Profit And Loss", path: "/profit-loss" },
    { title: "Casino Result Report", path: "/casino-result" },
    { title: "General Lock", path: "/general-lock" },
    { title: "User Register Detail", path: "/registration" },
    { title: "Total Profit Loss", path: "/total-profit-loss" },
    { title: "User Win Loss", path: "/win-loss" }
  ];
  
  const masterFields = [
    { title: "Secure Auth Verification", path: "/secure-auth" },
    { title: "Change Password", path: "/change-password" },
    { title: "Logout", path: "/admin-login" }
  ];

  return (
    <>
      <nav className="bg-[#0088CC] text-white fixed top-0 left-0 right-0 z-50 font-sans shadow-md h-[85px] lg:h-[45px]">
        
        {/* LINE 1 */}
        <div className="h-[45px] flex items-center justify-between px-4">
          <div className="flex items-center gap-3 h-full">
            <img 
              src={Logo} 
              alt="Logo" 
              className="h-[30px] w-auto cursor-pointer" 
              onClick={() => navigate('/admin')} 
            />
            <button className="hover:bg-black/20 p-1 rounded transition-colors ml-1" onClick={() => setIsSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative h-[45px]" onMouseEnter={() => setShowMasterDropdown(true)} onMouseLeave={() => setShowMasterDropdown(false)}>
              <div className="hover:bg-black px-3 h-full flex items-center gap-1 cursor-pointer text-[13px] font-bold">
                {adminName} <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
              {showMasterDropdown && (
                <div className="absolute top-[45px] right-0 w-56 bg-[#0088CC] shadow-2xl py-1 border-t border-white/10 z-[100]">
                  {masterFields.map((field, i) => (
                    field.title === 'Logout' ? (
                      <button key={i} onClick={handleLogout} className="w-full text-left block px-4 py-2 hover:bg-[#2C3E50] text-[13px] font-bold bg-black/10">Logout</button>
                    ) : (
                      <Link key={i} to={field.path} onClick={() => setShowMasterDropdown(false)} className="block px-4 py-2 hover:bg-[#2C3E50] text-[13px] border-b border-white/5 last:border-none">{field.title}</Link>
                    )
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center bg-white rounded-[2px] h-[32px] px-2 w-[110px] sm:w-[160px]">
              <input type="text" placeholder="All Client" className="bg-transparent text-gray-500 text-[12px] outline-none w-full" />
              <svg className="w-4 h-4 text-[#333] cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m21 21-5.2-5.2m1.7-4.8a7 7 0 1 0-14 0 7 7 0 0 0 14 0z" /></svg>
            </div>
          </div>
        </div>

        {/* LINE 2 */}
        <div className="h-[40px] md:h-[45px] bg-[#0077B3] lg:bg-transparent lg:absolute lg:left-[185px] lg:top-0 flex items-center text-[13px] font-semibold px-1 lg:px-0 lg:overflow-visible overflow-x-auto no-scrollbar relative z-[55]">
          <Link to="/admin" className="hover:bg-black px-3 h-full flex items-center whitespace-nowrap">List of Clients</Link>
          <Link to="/assign-agent" className="hover:bg-black px-3 h-full flex items-center whitespace-nowrap">Assign Agent</Link>
          <Link to="/market-analysis" className="hover:bg-black px-3 h-full flex items-center whitespace-nowrap">Market Analysis</Link>

          {/* Live Market */}
          <div className="relative h-full" onMouseEnter={() => setShowLiveMarket(true)} onMouseLeave={() => setShowLiveMarket(false)}>
            <div className="flex items-center gap-1 cursor-pointer hover:bg-black px-3 h-full whitespace-nowrap">Live Market <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg></div>
            {showLiveMarket && (
              <div className="fixed lg:absolute top-[85px] lg:top-[45px] left-0 w-64 bg-[#0088CC] shadow-2xl py-1 border border-white/10 z-[100] max-h-[70vh] overflow-y-auto">
                {liveMarketItems.map((item, i) => (
                  <Link key={i} to={item.path} onClick={() => setShowLiveMarket(false)} className="block px-4 py-2 hover:bg-[#2C3E50] border-b border-white/5 last:border-none cursor-pointer">{item.title}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Live Virtual Market */}
          <div className="relative h-full" onMouseEnter={() => setShowVirtualMarket(true)} onMouseLeave={() => setShowVirtualMarket(false)}>
            <div className="flex items-center gap-1 cursor-pointer hover:bg-black px-3 h-full whitespace-nowrap">Live Virtual Market <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg></div>
            {showVirtualMarket && (
              <div className="fixed lg:absolute top-[85px] lg:top-[45px] left-0 w-64 bg-[#0088CC] shadow-2xl py-1 border border-white/10 z-[100] max-h-[70vh] overflow-y-auto">
                {virtualMarketItems.map((item, i) => (
                  <Link key={i} to={item.path} onClick={() => setShowVirtualMarket(false)} className="block px-4 py-2 hover:bg-[#2C3E50] border-b border-white/5 last:border-none cursor-pointer">{item.title}</Link>
                ))}
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="relative h-full" onMouseEnter={() => setShowReports(true)} onMouseLeave={() => setShowReports(false)}>
            <div className="flex items-center gap-1 cursor-pointer hover:bg-black px-3 h-full whitespace-nowrap">Reports <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg></div>
            {showReports && (
              <div className="fixed lg:absolute top-[85px] lg:top-[45px] left-0 w-64 bg-[#0088CC] shadow-2xl py-1 border border-white/10 z-[100] max-h-[70vh] overflow-y-auto">
                {reportItems.map((item, i) => (
                  <Link key={i} to={item.path} onClick={() => setShowReports(false)} className="block px-4 py-2 hover:bg-[#2C3E50] border-b border-white/5 last:border-none cursor-pointer">{item.title}</Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/multi-login" className="hover:bg-black px-3 h-full flex items-center whitespace-nowrap">Multi Login</Link>
        </div>
      </nav>

      <div className="h-[85px] lg:h-[45px]"></div>

      {/* SIDEBAR */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 z-[100]" onClick={() => setIsSidebarOpen(false)} />}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-white text-black z-[101] shadow-2xl transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-2xl font-bold text-[#333]">Sports</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-black text-2xl font-bold">&times;</button>
        </div>
        <div className="py-2 overflow-y-auto h-[calc(100vh-65px)]">
          {sportsData.map((sport) => <SidebarItem key={sport.id} item={sport} />)}
        </div>
      </div>
    </>
  );
}