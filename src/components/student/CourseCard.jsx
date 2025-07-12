/* eslint-disable react/prop-types */
import { useContext } from "react"
import { assets } from "../../assets/assets" // Ensure assets.star and assets.star_blank exist
import { AppContext } from "../../context/AppContext"
import { Link } from "react-router-dom"

const CourseCard = ({ course }) => {
    const { currency, calculateRating } = useContext(AppContext)

    // Fallback for educator name if it's null or undefined
    const educatorName = course.educator?.name || "Unknown Educator";

    // Calculate discounted price
    const discountedPrice = (course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2);
    const originalPrice = course.coursePrice.toFixed(2);

    // Calculate rating for display
    const rating = calculateRating(course);
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    return (
        <Link
            to={`/course/${course._id}`} // Template literal for cleaner URL
            onClick={() => window.scrollTo(0, 0)}
            className="block border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group bg-white"
            aria-label={`Learn more about ${course.courseTitle}`}
        >
            {/* Course Thumbnail */}
            <div className="relative w-full h-48 overflow-hidden">
                <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={course.courseThumbnail?.url || assets.default_course_thumbnail} // Add a fallback image if URL is missing
                    alt={course.courseTitle + " thumbnail"}
                />
                {/* Optional: Discount Badge */}
                {course.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                        {course.discount}% OFF
                    </span>
                )}
            </div>

            {/* Course Details */}
            <div className="p-4 text-left flex flex-col gap-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    {course.courseTitle}
                </h3>
                <p className="text-gray-600 text-sm">By <span className="font-medium text-gray-700">{educatorName}</span></p>

                {/* Rating Section */}
                <div className="flex items-center space-x-2">
                    <p className="text-base font-semibold text-yellow-600">{rating.toFixed(1)}</p>
                    <div className="flex">
                        {/* Full Stars */}
                        {[...Array(fullStars)].map((_, i) => (
                            <img key={`star-full-${i}`} src={assets.star} alt="Star" className="w-4 h-4 text-yellow-500" />
                        ))}
                        {/* Half Star (if applicable) */}
                        {hasHalfStar && (
                            <img key="star-half" src={assets.star_half} alt="Half Star" className="w-4 h-4 text-yellow-500" /> // Assuming you have a half-star icon
                        )}
                        {/* Empty Stars */}
                        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                            <img key={`star-empty-${i}`} src={assets.star_blank} alt="Empty Star" className="w-4 h-4 text-gray-300" />
                        ))}
                    </div>
                    <p className="text-gray-500 text-sm">({course.courseRatings.length} ratings)</p>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-2 mt-2">
                    <p className="text-xl font-bold text-gray-900">
                        {currency}{discountedPrice}
                    </p>
                    {course.discount > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                            {currency}{originalPrice}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CourseCard