import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { backendUrl, getToken } = useContext(AppContext);
  const [isEducator, setIsEducator] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const isCourseListPage = location.pathname.includes("/course-list");
  const { openSignIn } = useClerk();
  const { user, isLoaded } = useUser();

  // Check educator status on user load
  useEffect(() => {
    const checkEducatorStatus = async () => {
      if (isLoaded && user) {
        try {
          const token = await getToken();
          const { data } = await axios.get(
            `${backendUrl}/api/educator/check-role`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (data.success) {
            setIsEducator(data.isEducator);
          }
        } catch (error) {
          console.error("Error checking educator status:", error);
        }
      }
    };
    
    checkEducatorStatus();
  }, [user, isLoaded, backendUrl, getToken]);

  const becomeEducator = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      if (isEducator) {
        navigate('/educator');
        return;
      }

      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/educator/update-role`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate('/educator');
      } else {
        toast.error(data.message || "Failed to become educator");
      }
    } catch (error) {
      console.error("Error becoming educator:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img 
        onClick={() => navigate('/')} 
        src={assets.logo} 
        alt="logo" 
        className="w-32 lg:w-36 cursor-pointer" 
      />

      {/* Desktop View */}
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <Link to="/course-list" className="hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all">
          Course List
        </Link>
        <Link to="/about-us" className="hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all">
          About Us
        </Link>
        {user && (
          <div className="flex items-center gap-5">
            <button 
              onClick={becomeEducator}
              disabled={loading}
              className={loading ? "opacity-50" : ""}
            >
              {isEducator ? 'Educator Dashboard' : 'Become Educator'}
            </button>
            <span>|</span>
            <Link to="/my-enrollments">My Enrollments</Link>
          </div>
        )}
        
        {user ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button 
            onClick={() => openSignIn()} 
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        {user && (
          <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
            <button 
              onClick={becomeEducator}
              disabled={loading}
              className={loading ? "opacity-50" : ""}
            >
              {isEducator ? 'Dashboard' : 'Become Educator'}
            </button>
            <span>|</span>
            <Link to="/my-enrollments">Enrollments</Link>
          </div>
        )}
        
        {user ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="User Icon" className="w-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;