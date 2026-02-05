// src/pages/Dashboard.jsx  (ya App.jsx mein daal sakta hai)
import Navbar from '../Dashboard/Navbar';
import AccountList from '../Dashboard/AccountMain';

export default function Dashboard() {
  return (
    <div className=" bg-gray-50">
      {/* <Navbar /> */}
      <AccountList />
    </div>
  );
}