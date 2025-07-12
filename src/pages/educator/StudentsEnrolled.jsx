import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";

// ## 1. Skeleton Component for a clean loading state
const SkeletonRow = () => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full bg-gray-200"></div>
      <div>
        <div className="h-5 w-32 rounded-md bg-gray-300 mb-2"></div>
        <div className="h-4 w-48 rounded-md bg-gray-200"></div>
      </div>
    </div>
    <div className="h-4 w-24 rounded-md bg-gray-200"></div>
  </div>
);


// ## 2. Row Component for each student enrollment
const EnrollmentRow = ({ enrollment }) => {
  const { student, courseTitle, enrolledDate } = enrollment;

  // Safety check for student data
  if (!student) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center space-x-4 mb-3 sm:mb-0">
        <img
          src={student.imageUrl}
          alt={student.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
        />
        <div>
          <p className="font-semibold text-gray-800">{student.name}</p>
          <p className="text-sm text-gray-500 truncate">
            Enrolled in: <span className="font-medium">{courseTitle}</span>
          </p>
        </div>
      </div>
      <div className="text-sm text-gray-500 text-left sm:text-right">
        <p>
          {new Date(enrolledDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
};


// ## 3. Main StudentsEnrolled Component
const StudentsEnrolled = () => {
  // Data now comes from context
  const { enrolledStudents } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and handle case where context data might be initially empty
    setTimeout(() => {
      setLoading(false);
    }, 1000); // 1-second delay for demo; you can adjust or remove this
  }, [enrolledStudents]);

  const isLoading = loading || !enrolledStudents;

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Enrolled Students</h2>
        
        <div className="space-y-4">
          {isLoading ? (
            // Render a few skeleton loaders
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : enrolledStudents.length > 0 ? (
            // Render the list of students
            enrolledStudents.map((item, index) => (
              <EnrollmentRow key={item.purchaseId || index} enrollment={item} />
            ))
          ) : (
            // Modern "No students found" state
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700">No Students Found</h3>
              <p className="text-gray-500 mt-2">When students enroll in your courses, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsEnrolled;