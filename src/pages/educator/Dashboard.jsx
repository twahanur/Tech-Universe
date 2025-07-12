/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const Dashboard = () => {
  // 1. Consume data and functions directly from the context
  const {
    currency,
    backendUrl,
    getToken,
    userData,
    dashboardData,
    allCourses,
    fetchDashboardData,
    fetchAllCourses,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState([]);
  useEffect(() => {
    if (dashboardData) {
      const courses = userData
        ? allCourses.filter((course) => course.educator._id === userData._id)
        : [];
      console.log(courses);
      setLoading(myCourses.length === 0 && dashboardData.totalCourses === 0);
      if (myCourses.length > 0 || dashboardData.totalCourses > 0) {
        setMyCourses(courses);
        setLoading(false);
      }
    } else {
      setLoading(true);
    }
  }, [dashboardData]);

  // --- Navigates to the course edit page ---
  const handleEditCourse = (courseId) => {
    navigate(`/educator/edit-course/${courseId}`);
  };

  // --- Handles deleting a course ---
  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (window.confirm(`Delete "${courseTitle}"? This action is permanent.`)) {
      try {
        const token = await getToken();
        const response = await axios.delete(
          `${backendUrl}/api/course/${courseId}`, // Assuming a generic course delete endpoint
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          toast.success("Course deleted successfully!");
          // 4. Refresh data using functions from context
          if (fetchDashboardData && fetchAllCourses) {
            fetchDashboardData();
            fetchAllCourses();
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome, {userData?.name || "Educator"}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your performance summary.
          </p>
        </div>

        {/* Key Metrics - All data comes from `dashboardData` */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/educator/student-enrolled">
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-100 rounded-full">
                <img
                  src={assets.patients_icon}
                  alt="Students"
                  className="w-8 h-8"
                />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-800">
                  {dashboardData.totalStudents}
                </p>
                <p className="text-base text-gray-600">Total Students</p>
              </div>
            </div>
          </Link>
          <Link to="/educator/my-courses">
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-shadow">
              <div className="p-3 bg-purple-100 rounded-full">
                <img
                  src={assets.appointments_icon}
                  alt="Courses"
                  className="w-8 h-8"
                />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-800">
                  {dashboardData.totalCourses}
                </p>
                <p className="text-base text-gray-600">Your Courses</p>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-shadow">
            <div className="p-3 bg-green-100 rounded-full">
              <img
                src={assets.earning_icon}
                alt="Earnings"
                className="w-8 h-8"
              />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-800">
                {currency}
                {dashboardData.totalEarnings.toFixed(2)}
              </p>
              <p className="text-base text-gray-600">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* My Courses List - Data is derived from `allCourses` */}
        <div className="bg-white rounded-xl shadow-lg border p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <Link
              to="/educator/add-course"
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              title="Add New Course"
            >
              <img
                src={assets.add_icon}
                alt="Add"
                className="w-5 h-5 filter brightness-0 invert"
              />
            </Link>
          </div>
          <div className="space-y-4">
            {myCourses.length > 0 ? (
              myCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50"
                >
                  <img
                    className="w-16 h-12 rounded-md object-cover"
                    src={
                      course.courseThumbnail?.url ||
                      assets.default_course_thumbnail
                    }
                    alt={course.courseTitle}
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800 truncate">
                      {course.courseTitle}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        course.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditCourse(course._id)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition"
                      title="Edit Course"
                    >
                      <img
                        src={assets.file_upload_icon}
                        alt="Edit"
                        className="w-5 h-5"
                      />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteCourse(course._id, course.courseTitle)
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition"
                      title="Delete Course"
                    >
                      <img
                        src={assets.cross_icon}
                        alt="Delete"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 italic">
                <p>You haven't created any courses yet.</p>
                <Link
                  to="/educator/add-course"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Create your first course
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
