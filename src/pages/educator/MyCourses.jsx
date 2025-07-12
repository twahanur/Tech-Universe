/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

// ## 1. Skeleton Component for a Modern Loading State
const CourseSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-40 bg-gray-200"></div>
    <div className="p-5">
      <div className="h-6 rounded-md bg-gray-300 w-3/4 mb-4"></div>
      <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4 mt-4">
        <div className="h-4 w-24 rounded-md bg-gray-200"></div>
        <div className="h-4 w-16 rounded-md bg-gray-200"></div>
      </div>
    </div>
  </div>
);

// ## 2. Course Card Component (Adapted for your current data)
const CourseCard = ({ course }) => {
  const getCourseThumbnail = (thumbnail) => {
    if (!thumbnail || !thumbnail.url) return "/default-course-image.png";
    return thumbnail.url;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="overflow-hidden">
        <img
          src={getCourseThumbnail(course.courseThumbnail)}
          alt={course.courseTitle}
          className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-course-image.png";
          }}
        />
      </div>
      <div className="p-5">
        <h3
          className="text-lg font-semibold text-gray-800 truncate"
          title={course.courseTitle}
        >
          {course.courseTitle}
        </h3>

        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4 mt-4">
          <div className="text-left">
            <span className="text-xs text-gray-500 block">Status</span>
            <span
              className={`font-bold text-xs px-2 py-1 rounded-full ${
                course.isPublished
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {course?.isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 block">Created On</span>
            <span className="font-bold">
              {course?.createdAt
                ? new Date(course.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ## 3. Main MyCourses Component
const MyCourses = () => {
  const { allCourses, userData ,enrolledStudents} = useContext(AppContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducatorCourses = () => {
      console.log(enrolledStudents)
      // Set a timeout to better visualize the loading skeleton
      try {
        // Added optional chaining for safety
        const educatorCourses = userData
          ? allCourses.filter(
              (course) => course?.educator?._id === userData?._id
            )
          : [];
        setCourses(educatorCourses);
      } catch (error) {
        console.error("Error filtering courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    if (allCourses && userData) {
      fetchEducatorCourses();
    } else if (!allCourses || !userData) {
      // Handle case where context data isn't ready
      setLoading(false);
    }
  }, [allCourses, userData]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">My Courses</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <CourseSkeleton />
            <CourseSkeleton />
            <CourseSkeleton />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">
              No Courses Yet
            </h3>
            <p className="text-gray-500 mt-2">
              When you create courses, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
