import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaTicketAlt, 
  FaDice, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaHourglassHalf,
  FaArrowLeft,
  FaCopy,
  FaRegClock,
  FaExclamationTriangle,
  FaGavel,
  FaCoins,
  FaMoneyBillWave
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const ViewBet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bet, setBet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [settleLoading, setSettleLoading] = useState(false);
  const [settleError, setSettleError] = useState("");
  const [settleSuccess, setSettleSuccess] = useState("");
  const [selectedWinner, setSelectedWinner] = useState("");
  const [settlementStats, setSettlementStats] = useState(null);

  const getToken = () =>
    localStorage.getItem("adminToken") || localStorage.getItem("token") || "";

  const fetchSingleBet = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://devexchangee.in/api/api/admin/get-bet/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.data.success) {
        setBet(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching bet:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSingleBet();
  }, [id]);

  const handleSettleMarket = async () => {
    if (!selectedWinner) {
      setSettleError("Please select a winner");
      return;
    }

    setSettleLoading(true);
    setSettleError("");
    setSettleSuccess("");

    try {
      const response = await axios.post(
        "https://devexchangee.in/api/api/users/settle-bet",
        {
          event_id: bet.event_id,
          winner_selection_id: selectedWinner
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.data.success) {
        setSettleSuccess(`Market settled successfully! ${response.data.total_bets_settled} bets processed.`);
        setTimeout(() => {
          setShowSettleModal(false);
          fetchSingleBet(); // Refresh bet data
        }, 2000);
      }
    } catch (error) {
      setSettleError(error.response?.data?.message || "Error settling market");
    } finally {
      setSettleLoading(false);
    }
  };

  const calculateSettlementPreview = () => {
    if (!bet || !selectedWinner) return null;

    let profit = 0;
    let isWinner = bet.selection_id === selectedWinner;

    // Calculate profit/loss based on bet type and winner
    if (bet.bet_type === "back") {
      if (isWinner) {
        profit = (bet.odds - 1) * bet.stake;
      } else {
        profit = -bet.stake;
      }
    } else { // lay bet
      if (isWinner) {
        profit = -bet.liability;
      } else {
        profit = bet.stake;
      }
    }

    return {
      profit,
      isWinner,
      newBalance: (bet.user_id?.current_balance || 0) + profit,
      exposureReleased: bet.liability
    };
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(field);
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      matched: { color: "bg-green-100 text-green-800 border-green-200", icon: FaCheckCircle, text: "Matched" },
      unmatched: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: FaHourglassHalf, text: "Unmatched" },
      cancelled: { color: "bg-red-100 text-red-800 border-red-200", icon: FaTimesCircle, text: "Cancelled" },
      settled: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: FaCheckCircle, text: "Settled" }
    };
    const config = statusConfig[status] || statusConfig.matched;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.text}
      </span>
    );
  };

  const getResultBadge = (result) => {
    const resultConfig = {
      win: { color: "bg-green-100 text-green-800 border-green-200", icon: FaCheckCircle, text: "Win" },
      loss: { color: "bg-red-100 text-red-800 border-red-200", icon: FaTimesCircle, text: "Loss" },
      pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: FaHourglassHalf, text: "Pending" },
      cancelled: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: FaTimesCircle, text: "Cancelled" },
      void: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: FaExclamationTriangle, text: "Void" }
    };
    const config = resultConfig[result] || resultConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {config.text}
      </span>
    );
  };

  const getBetTypeBadge = (type) => {
    return type === "back" ? (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        BACK
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 border border-pink-200">
        LAY
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDateTime = (date) => {
    if (!date) return "Not Settled";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  const calculateTimeDifference = (placedAt) => {
    if (!placedAt) return "";
    const placed = new Date(placedAt);
    const now = new Date();
    const diffMs = now - placed;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <FaTicketAlt className="w-8 h-8 text-blue-500 animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Fetching bet details...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait while we load the information</p>
        </div>
      </div>
    );
  }

  if (!bet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Bet Not Found</h3>
          <p className="text-gray-600 mb-6">The bet you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if bet can be settled (matched and pending)
  const canSettle = bet.bet_status === "matched" && bet.result === "pending";
  const preview = calculateSettlementPreview();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header with back button and settle button */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center group-hover:bg-gray-50">
              <FaArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Bets</span>
          </button>
          
          {canSettle && (
            <button
              onClick={() => setShowSettleModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <FaGavel className="w-4 h-4" />
              Settle Market
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaTicketAlt className="w-6 h-6 text-blue-500" />
            Bet Details
            <span className="text-sm font-normal text-gray-500 ml-2">ID: {bet._id?.slice(-8)}</span>
          </h1>
          <p className="text-gray-500 mt-1">View complete information about this bet</p>
        </div>

        {/* In Progress Banner */}
        {canSettle && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-4 flex items-center gap-3">
            <div className="animate-spin">
              <FaHourglassHalf className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-yellow-700 font-medium">Bet Pending Settlement</p>
              <p className="text-sm text-yellow-600">This bet is ready to be settled. Click the "Settle Market" button above to process.</p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info & Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#2C3E50] px-6 py-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <FaUser className="w-4 h-4" />
                  User Information
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</label>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-lg font-semibold text-gray-900">{bet.user_id?.client_name || "N/A"}</p>
                      <button
                        onClick={() => handleCopy(bet.user_id?.client_name, "client")}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <FaCopy className={`w-4 h-4 ${copySuccess === "client" ? "text-green-500" : ""}`} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                    <p className="text-gray-800 mt-1">{bet.user_id?.full_name || "N/A"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{formatCurrency(bet.user_id?.current_balance)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Available</label>
                      <p className="text-sm font-medium text-gray-900 mt-1">{formatCurrency(bet.user_id?.available_balance)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#2C3E50] px-6 py-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4" />
                  Status Information
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bet Status:</span>
                    {getStatusBadge(bet.bet_status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Result:</span>
                    {getResultBadge(bet.result)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bet Type:</span>
                    {getBetTypeBadge(bet.bet_type)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sub Type:</span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 capitalize">
                      {bet.bet_sub_type || "Sport"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Bet Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bet Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#2C3E50] px-6 py-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <FaDice className="w-4 h-4" />
                  Bet Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-sm bg-gray-50 px-3 py-1.5 rounded border border-gray-200 flex-1">
                          {bet.event_id}
                        </p>
                        <button
                          onClick={() => handleCopy(bet.event_id, "event")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FaCopy className={`w-4 h-4 ${copySuccess === "event" ? "text-green-500" : ""}`} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Selection ID</label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-sm bg-gray-50 px-3 py-1.5 rounded border border-gray-200 flex-1">
                          {bet.selection_id}
                        </p>
                        <button
                          onClick={() => handleCopy(bet.selection_id, "selection")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FaCopy className={`w-4 h-4 ${copySuccess === "selection" ? "text-green-500" : ""}`} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Market ID</label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-sm bg-gray-50 px-3 py-1.5 rounded border border-gray-200 flex-1">
                          {bet.market_id}
                        </p>
                        <button
                          onClick={() => handleCopy(bet.market_id, "market")}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FaCopy className={`w-4 h-4 ${copySuccess === "market" ? "text-green-500" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Selection</label>
                      <p className="text-gray-800 mt-1 font-medium">{bet.selection_name}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</label>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{bet.odds}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stake</label>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(bet.stake)}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Liability</label>
                      <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(bet.liability)}</p>
                    </div>

                    <div className={`p-4 rounded-lg ${bet.profit_loss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</label>
                      <p className={`text-2xl font-bold mt-1 ${bet.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {bet.profit_loss >= 0 ? '+' : ''}{formatCurrency(bet.profit_loss)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#2C3E50] px-6 py-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  Timeline
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Placed At */}
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaRegClock className="w-5 h-5 text-blue-600" />
                      </div>
                      {!bet.settled_at && (
                        <div className="absolute -bottom-2 left-4 w-0.5 h-8 bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Bet Placed</p>
                      <p className="text-sm text-gray-600 mt-1">{formatDateTime(bet.placed_at)}</p>
                      <p className="text-xs text-gray-400 mt-1">{calculateTimeDifference(bet.placed_at)}</p>
                    </div>
                  </div>

                  {/* Settled At (if available) */}
                  {bet.settled_at && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Bet Settled</p>
                        <p className="text-sm text-gray-600 mt-1">{formatDateTime(bet.settled_at)}</p>
                      </div>
                    </div>
                  )}

                  {/* Admin Actions (if any) */}
                  {bet.is_deleted_by_admin && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-3">
                        <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Bet Deleted by Admin</p>
                          {bet.delete_reason && (
                            <p className="text-sm text-red-600 mt-1">Reason: {bet.delete_reason}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settlement Modal */}
      {showSettleModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-[#2C3E50] px-6 py-4 rounded-t-xl flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <FaGavel className="w-5 h-5" />
                Settle Market
              </h3>
              <button
                onClick={() => {
                  setShowSettleModal(false);
                  setSelectedWinner("");
                  setSettleError("");
                }}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Market Info */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Market Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Event ID:</span>
                    <span className="font-mono font-medium">{bet.event_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selection:</span>
                    <span className="font-medium">{bet.selection_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bet Type:</span>
                    {getBetTypeBadge(bet.bet_type)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stake:</span>
                    <span className="font-medium">{formatCurrency(bet.stake)}</span>
                  </div>
                </div>
              </div>

              {/* Winner Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Winner
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedWinner(bet.selection_id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedWinner === bet.selection_id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <FaCheckCircle className={`w-6 h-6 mx-auto mb-2 ${
                        selectedWinner === bet.selection_id ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <p className="font-medium text-gray-800">This Selection</p>
                      <p className="text-xs text-gray-500 mt-1">Selection ID: {bet.selection_id}</p>
                      <p className="text-xs text-gray-500">{bet.selection_name}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedWinner("other")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedWinner === "other"
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <FaTimesCircle className={`w-6 h-6 mx-auto mb-2 ${
                        selectedWinner === "other" ? 'text-red-500' : 'text-gray-400'
                      }`} />
                      <p className="font-medium text-gray-800">Other Selection</p>
                      <p className="text-xs text-gray-500 mt-1">Different selection wins</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Settlement Preview */}
              {selectedWinner && preview && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <FaMoneyBillWave className="w-4 h-4" />
                    Settlement Preview
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                      <span className="text-sm text-blue-700">Outcome:</span>
                      <span className={`font-medium ${preview.isWinner ? 'text-green-600' : 'text-red-600'}`}>
                        {preview.isWinner ? 'Winner ✓' : 'Loser ✗'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Profit/Loss:</span>
                      <span className={`font-bold ${preview.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {preview.profit >= 0 ? '+' : ''}{formatCurrency(preview.profit)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Exposure Released:</span>
                      <span className="font-medium text-gray-700">{formatCurrency(preview.exposureReleased)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                      <span className="text-sm text-blue-700">New Balance:</span>
                      <span className="font-bold text-gray-800">{formatCurrency(preview.newBalance)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {settleError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <FaExclamationTriangle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-600">{settleError}</p>
                </div>
              )}

              {/* Success Message */}
              {settleSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <FaCheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-green-600">{settleSuccess}</p>
                </div>
              )}

              {/* Warning Message */}
              <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-700">
                  <strong>Note:</strong> This will settle ALL matched bets for this market/event. 
                  The selected winner will determine profit/loss for all bets. This action cannot be undone.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSettleMarket}
                  disabled={!selectedWinner || settleLoading}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {settleLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Settling...
                    </>
                  ) : (
                    <>
                      <FaGavel className="w-4 h-4" />
                      Confirm Settlement
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowSettleModal(false);
                    setSelectedWinner("");
                    setSettleError("");
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBet;