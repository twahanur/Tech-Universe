import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";
import SearchBar from "./SearchBar";

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="container px-0 md:px-5 bg-gradient-to-br from-gray-50 to-white">
      {/* Section Header */}
      <p className="text-start text-orange-600 font-bold px-3 py-5">Courses</p>
      <div className=" mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4 animate-fade-in-up">
            Opportunity to learn from the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Best Educators
            </span>
          </h2>
          <p className="text-lg text-start text-gray-600 leading-relaxed animate-fade-in-up delay-100">
            Discover our top-rated courses across various categories.
          </p>
        </div>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:my-16 my-10 mx-auto">
        {Array.isArray(allCourses) &&
          allCourses
            .slice(0, 4)
            .map((course) => <CourseCard key={course._id} course={course} />)}
      </div>

      <Link
        to={"/course-list"}
        onClick={() => console.log("first")} // Use window.scrollTo for clarity
        className="z-50 inline-block px-12 py-4 text-lg font-semibold text-blue-700 border-2 border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="View all available courses"
      >
        <button className="text-center cursor-pointer">Explore All Courses</button>
      </Link>
    </div>
  );
};

export default CourseSection;
