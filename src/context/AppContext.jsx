/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

// Create Context
export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [allEucator, setAllEducator] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  // ✅ Fetch All Courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");
      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch All Courses
  const fetchAllEducator = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/educator");
      if (data.success) {
        console.log(data)
        setAllEducator(data.educators);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch User Data
  const fetchUserData = async () => {
    if (user?.publicMetadata?.role === "educator") {
      setIsEducator(true);
    }
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // Add to AppContext.jsx
  const enrollInCourse = async (courseId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/enroll`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        fetchUserEnrolledCourses(); // Refresh enrolled courses
        toast.success("Successfully enrolled in course!");
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };
  // ✅ Fetch Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/user/enrolled-courses",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // ✅ Fetch Educator Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      // 💡 Note: Make sure this URL matches your backend route
      const { data } = await axios.get(`${backendUrl}/api/educator/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Could not fetch dashboard data: " + error.message);
    }
  };
  // ✅ Fetch Enrolled Students for an Educator
  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      // 💡 Note: Ensure this URL matches your backend route for getEnrolledStudentsData
      const { data } = await axios.get(
        `${backendUrl}/api/educator/enrolled-students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents);
      } else {
        // Don't show an error if there are just no students yet
        if (data.count !== 0) {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Could not fetch student data: " + error.message);
    }
  };

  // ✅ Average Rating
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) return 0;
    const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0);
    return Math.floor(total / course.courseRatings.length);
  };

  // ✅ Chapter Time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    if (Array.isArray(chapter.chapterContent)) {
      chapter.chapterContent.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    }
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // ✅ Total Course Duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent?.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        chapter.chapterContent.forEach((lecture) => {
          time += lecture.lectureDuration;
        });
      }
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // ✅ Total No. of Lectures
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent?.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // 🧠 Load on Mount
  useEffect(() => {
    fetchAllCourses();
    fetchAllEducator()
  }, []);

  // Add this new useEffect hook to trigger the fetch
  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
      fetchDashboardData();
    }
  }, [isEducator]); // Dependency array ensures this runs when isEducator changes

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  // ✅ Context Value
  const value = {
    currency,
    allCourses,
    navigate,
    isEducator,
    setIsEducator,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    setEnrolledCourses,
    fetchAllCourses,
    setAllCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    enrollInCourse,
    fetchEnrolledStudents,
    enrolledStudents,
    dashboardData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
