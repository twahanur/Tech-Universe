import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import axios, { all } from "axios";
import { toast } from "react-toastify";
import Footer from "../../components/student/Footer"; // Assuming you still need this

// ## 1. Skeleton Component for the Loading State
const EnrollmentCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <div className="w-28 h-16 rounded-md bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-5 rounded-md bg-gray-300 w-3/4 mb-3"></div>
          <div className="h-2 rounded-full bg-gray-200 w-full"></div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <div className="h-4 w-24 rounded-md bg-gray-200"></div>
        <div className="h-10 w-32 rounded-md bg-gray-300"></div>
      </div>
    </div>
  </div>
);

// ## 2. Enrollment Card Component
const EnrollmentCard = ({ course, navigate }) => {
  const { courseThumbnail, courseTitle, progress } = course;
  const { lectureCompleted, totalLectures } = progress || { lectureCompleted: 0, totalLectures: 0 };
  
  const percent = totalLectures > 0 ? (lectureCompleted * 100) / totalLectures : 0;
  const isCompleted = percent === 100;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={courseThumbnail.url || courseThumbnail} // Handles both object and string URLs
            alt={courseTitle}
            className="w-28 h-16 object-cover rounded-md"
            onError={(e) => { e.target.onerror = null; e.target.src = '/default-course-image.png'; }}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 leading-tight" title={courseTitle}>
              {courseTitle}
            </h3>
            <div className="mt-2">
              <Line
                percent={percent}
                strokeWidth={2.5}
                trailWidth={2.5}
                strokeColor={isCompleted ? "#16a34a" : "#2563eb"} // Green for completed, blue for in-progress
                className="rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {lectureCompleted} / {totalLectures} Lectures
          </p>
          <button
            onClick={() => navigate(`/player/${course._id}`)}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors ${
              isCompleted 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isCompleted ? "Review Course" : "Continue Learning"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ## 3. Main MyEnrollments Component
const MyEnrollments = () => {
  const { enrolledCourses, allCourses, calculateNoOfLectures, navigate, userData, backendUrl, getToken } = useContext(AppContext);
  console.log(enrolledCourses)
  
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect fetches the base enrolled courses list
  useEffect(() => {
    if (userData?._id) {
      console.log("allCourses",allCourses);
      
    }
  }, [userData, allCourses]);

  // This effect fetches progress for the enrolled courses and merges the data
  useEffect(() => {
    const getCourseProgress = async () => {
      if (enrolledCourses.length === 0) {
        setCoursesWithProgress([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const token = await getToken();
        // Pro Tip: For better performance, your API could accept an array of course IDs
        // to return all progress data in a single network request.
        const progressPromises = enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          return {
            lectureCompleted: data.progressData?.lectureCompleted?.length || 0,
            totalLectures: calculateNoOfLectures(course),
          };
        });

        const progressResults = await Promise.all(progressPromises);
        
        // Merge course data with its progress into a single, robust object
        const mergedData = enrolledCourses.map((course, index) => ({
          ...course,
          progress: progressResults[index],
        }));
        
        setCoursesWithProgress(mergedData);

      } catch (error) {
        toast.error("Could not fetch course progress.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getCourseProgress();
  }, [enrolledCourses, backendUrl, getToken, calculateNoOfLectures]);

  return (
    <>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">My Learning</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              // Render skeleton loaders
              <>
                <EnrollmentCardSkeleton />
                <EnrollmentCardSkeleton />
                <EnrollmentCardSkeleton />
                <EnrollmentCardSkeleton />
              </>
            ) : coursesWithProgress.length > 0 ? (
              // Render the list of enrollment cards
              coursesWithProgress.map((course) => (
                <EnrollmentCard key={course._id} course={course} navigate={navigate} />
              ))
            ) : (
              // Modern "No enrollments found" state
              <div className="md:col-span-2 text-center py-20 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-medium text-gray-700">You haven't enrolled in any courses yet.</h3>
                <p className="text-gray-500 mt-2">Explore our courses and start learning today!</p>
                <button 
                  onClick={() => navigate('/course-list')}
                  className="mt-4 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;