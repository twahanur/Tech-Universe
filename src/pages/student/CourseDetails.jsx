import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets"; // Ensure all necessary assets are here
// e.g., assets.star, assets.star_blank, assets.star_half, assets.play_icon,
// assets.down_arrow_icon, assets.time_clock_icon, assets.lesson_icon,
// assets.check_icon, assets.certificate_icon (or assets.trophy_icon),
// assets.default_course_image
// Add these if needed and exist: assets.language_icon, assets.skill_level_icon, assets.book_icon,
// assets.slide_icon, assets.download_icon, assets.coupon_icon
import humanizeDuration from "humanize-duration"; // For readable durations
import Footer from "../../components/student/Footer"; // Assuming this component exists
import YouTube from "react-youtube"; // For embedding YouTube videos
import axios from "axios";
import { toast } from "react-toastify"; // For notifications
import { useUser } from "@clerk/clerk-react";

const CourseDetails = () => {
 const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null); // Stores videoId for YouTube player
  const [loadingEnroll, setLoadingEnroll] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    currency,
    calculateCourseDuration,
    calculateNoOfLectures,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchCourseData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message || "Failed to fetch course data.");
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast.error(error.message || "An error occurred while fetching course details.");
    }
  }, [backendUrl, id]);

  const enrolledCourses = async () => {
    try {
      setLoadingEnroll(true);
      console.log(userData)

      if (!userData) {
        toast.warn("Please log in to enroll in courses.");
        return;
      }

      if (userData.enrolledCourses?.includes(courseData._id)) {
        toast.warn("You are already enrolled in this course!");
        setIsAlreadyEnrolled(true);
        return;
      }

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message || "Enrollment failed. Please try again.");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(error.message || "An error occurred during enrollment.");
    } finally {
      setLoadingEnroll(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses?.includes(courseData._id) || false);
    }
  }, [userData, courseData]);

  useEffect(() => {
    if (!courseData && allCourses?.length > 0 && id) {
      const findCourse = allCourses.find((course) => course._id === id);
      setCourseData(findCourse || null);
    }
  }, [id, allCourses, courseData]);

  // Toggle chapter section visibility for accordion
  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Function to handle playing a lecture video and scrolling to the top
  const handlePlayLecture = (lectureUrl) => {
    const videoId = getYouTubeVideoId(lectureUrl);
    console.log("firstPreviewLecture", videoId);
    if (videoId) {
      setPlayerData({ videoId });
      // Scroll to the top of the page to ensure the sticky video player is in view
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      toast.error("Invalid YouTube URL for preview.");
    }
  };
  if (!courseData) return <Loading />;

  // Destructure with fallbacks for cleaner JSX
  const {
    courseTitle,
    courseDescription,
    courseRatings = [],
    enrolledStudents = [],
    educator,
    courseContent = [],
    courseThumbnail,
    coursePrice: rawCoursePrice,
    discount: rawDiscount,
  } = courseData;

  const coursePrice = parseFloat(rawCoursePrice || 0);
  const discount = parseFloat(rawDiscount || 0);
  const discountedPrice = (coursePrice - (discount * coursePrice) / 100).toFixed(2);
  const originalPrice = coursePrice.toFixed(2);

  const ratingValue = calculateRating(courseData);
  const fullStars = Math.floor(ratingValue);
  const hasHalfStar = ratingValue - fullStars >= 0.5;
  const educatorName = educator?.name || "Unknown Educator";

  // Truncate description for initial display, then show more
  const truncatedDescription = courseDescription?.slice(0, 300) + "..."; // Adjust length as needed

  return (
    <>
      {/* Main Container - Simple background, consistent padding */}
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">

          {/* Top Section: Course Header & Meta Info */}
          <div className="mb-8 md:mb-10 border-b border-gray-200 pb-6 md:pb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3 animate-fade-in">
              {courseTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm sm:text-base text-gray-600">
              {/* Rating Display */}
              <div className="flex items-center space-x-1">
                <p className="font-semibold text-yellow-600">{ratingValue.toFixed(1)}</p>
                <div className="flex">
                  {[...Array(fullStars)].map((_, i) => (
                    <img key={`star-full-${i}`} src={assets.star} alt="Full Star" className="w-4 h-4" />
                  ))}
                  {hasHalfStar && (
                    <img key="star-half" src={assets.star_half} alt="Half Star" className="w-4 h-4" />
                  )}
                  {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                    <img key={`star-empty-${i}`} src={assets.star_blank} alt="Empty Star" className="w-4 h-4 text-gray-300" />
                  ))}
                </div>
                <p className="text-blue-600 hover:underline cursor-pointer">
                  ({courseRatings.length} {courseRatings.length === 1 ? "rating" : "ratings"})
                </p>
              </div>
              {/* Other Meta Info */}
              <p>Category: <span className="font-medium text-gray-700">Programming</span></p> {/* Placeholder */}
              <p>Last Updated: <span className="font-medium text-gray-700">09 July, 2025</span></p> {/* Changed to current date */}
              <p>Learners: <span className="font-medium text-gray-700">{enrolledStudents.length.toLocaleString()}</span></p>
              <p>By: <span className="text-blue-600 hover:underline cursor-pointer font-medium">{educatorName}</span></p>
            </div>
          </div>

          {/* Main Content Grid: Left Column (Details) and Right Column (Purchase/Info Card) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column: Course Video/Thumbnail & Details */}
            <div className="lg:col-span-2 space-y-8 animate-fade-in">
              {/* Video Player / Course Thumbnail Area */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-xl aspect-video">
                {playerData ? (
                  // YouTube Player (visible only when playerData is set)
                  <YouTube
                    videoId={playerData.videoId}
                    opts={{ playerVars: { autoplay: 1 } }}
                    iframeClassName="absolute inset-0 w-full h-full"
                    onEnd={() => setPlayerData(null)} // Hide player when video ends
                  />
                ) : (
                  // Course Thumbnail (default view)
                  <>
                    <img
                      className="absolute inset-0 w-full h-full object-cover"
                      src={courseThumbnail?.url || assets.default_course_image}
                      alt={`Thumbnail for ${courseTitle}`}
                      onError={(e) => { e.target.src = assets.default_course_image; }}
                    />
                    {/* Play button overlay on thumbnail */}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-opacity duration-200 cursor-pointer"
                      onClick={() => {
                        // Logic to find and play the first free preview lecture
                        const firstPreviewLecture = courseContent
                            .flatMap(c => c.chapterContent)
                            .find(l => l.isPreviewFree && getYouTubeVideoId(l.lectureUrl));

                        const videoId = firstPreviewLecture ? getYouTubeVideoId(firstPreviewLecture.lectureUrl) : null;

                        if (videoId) {
                            setPlayerData({ videoId }); // Set playerData to render YouTube component
                        } else {
                            toast.info("No free preview available or invalid video URL.");
                        }
                    }}>
                      <img src={assets.play_icon} alt="Play" className="w-16 h-16 sm:w-20 sm:h-20 filter invert opacity-80" />
                    </div>
                  </>
                )}
              </div>

              {/* Course Overview */}
              <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Course Overview</h2>
                <div
                  className="rich-text text-gray-700 leading-relaxed overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: showFullDescription ? courseDescription : truncatedDescription,
                  }}
                ></div>
                {courseDescription?.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 font-medium hover:underline mt-2 text-sm"
                  >
                    {showFullDescription ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* What Will You Learn From This Course? */}
              <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">What Will You Learn From This Course?</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-gray-700 text-base">
                  <li className="flex items-start gap-3">
                    <img src={assets.check_icon} alt="Check" className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                    <span>Data structures for developing efficient AI solutions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <img src={assets.check_icon} alt="Check" className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                    <span>Understanding of AI algorithms and models</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <img src={assets.check_icon} alt="Check" className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                    <span>Real-world AI projects to solidify your understanding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <img src={assets.check_icon} alt="Check" className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                    <span>Proficiency in Python is highly recommended</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <img src={assets.check_icon} alt="Check" className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                    <span>Develop skills in data collection, cleaning & analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <img src={assets.check_icon} alt="Check" className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                    <span>Machine learning algorithms and types</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <img src={assets.check_icon} alt="Check" className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                    <span>AI models using various machine learning frameworks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <img src={assets.check_icon} alt="Check" className="w-5 h-5 mt-1 flex-shrink-0 text-green-500" />
                    <span>Neural networks & optimization techniques</span>
                  </li>
                </ul>
              </div>

              {/* Course Content (Curriculum Accordion) */}
              <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
                <p className="text-sm text-gray-500 mb-4">{courseContent.length} sections</p>
                <div className="space-y-3">
                  {courseContent.length > 0 ? (
                    courseContent.map((chapter, index) => (
                      <div
                        key={chapter.chapterId || `chapter-${index}`}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between px-4 py-3 cursor-pointer select-none bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => toggleSection(index)}
                          role="button"
                          aria-expanded={openSections[index]}
                          aria-controls={`chapter-panel-${index}`}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              className={`transform transition-transform duration-300 w-4 h-4 text-blue-500 ${
                                openSections[index] ? "rotate-180" : ""
                              }`}
                              src={assets.down_arrow_icon}
                              alt="Toggle icon"
                            />
                            <p className="font-semibold text-base sm:text-lg text-gray-900">
                              {chapter.chapterOrder}. {chapter.chapterTitle || `Chapter ${index + 1}`}
                            </p>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {chapter.chapterContent?.length || 0} lectures •{" "}
                            {calculateChapterTime(chapter)}
                          </p>
                        </div>
                        <div
                          id={`chapter-panel-${index}`}
                          className={`overflow-hidden transition-all duration-500 ease-in-out ${
                            openSections[index] ? "max-h-[1000px] opacity-100 px-4 py-2" : "max-h-0 opacity-0"
                          }`}
                        >
                          {chapter.chapterContent?.length > 0 ? (
                            <ul className="space-y-1 pl-6 border-l border-blue-200">
                              {chapter.chapterContent.map((lecture, i) => (
                                <li key={lecture.lectureId || `lecture-${i}`} className="flex items-center justify-between py-2 text-gray-700 text-sm">
                                  <div className="flex items-center gap-2 flex-grow">
                                    {/* Conditional Play Icon/Preview Button with Tooltip */}
                                    {lecture.isPreviewFree ? (
                                      <img
                                        src={assets.play_icon}
                                        alt="Play icon"
                                        className="w-4 h-4 text-indigo-500 cursor-pointer"
                                        onClick={() => handlePlayLecture(lecture.lectureUrl)} // Play video on click
                                      />
                                    ) : (
                                      <div className="relative group">
                                        {/* Use assets.lock_icon if available, else a grayed-out play icon */}
                                        <img
                                          src={assets.lock_icon || assets.play_icon} // Fallback to play icon if lock_icon not provided
                                          alt="Locked icon"
                                          className={`w-4 h-4 ${assets.lock_icon ? 'text-gray-400' : 'text-gray-300' } cursor-not-allowed`}
                                        />
                                        {/* Tooltip */}
                                        <span className="absolute left-5 bottom-full hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform pointer-events-none z-10">
                                          Only for enrolled students
                                        </span>
                                      </div>
                                    )}
                                    <p>{lecture.lectureOrder}. {lecture.lectureTitle || `Lecture ${i + 1}`}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {/* The "Preview" text button is removed here as the play icon now handles it */}
                                    <p className="text-gray-500 text-xs">
                                      {humanizeDuration((lecture.lectureDuration || 0) * 60 * 1000, { units: ["h", "m"], round: true })}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-center py-3 text-gray-500 text-sm italic">No lectures in this chapter yet.</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-gray-600 text-base italic border border-gray-200 rounded-lg bg-gray-50">
                      No course content available yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Purchase Card */}
            <div className="lg:col-span-1 w-full max-w-sm mx-auto lg:max-w-none lg:w-auto sticky top-6 md:top-24 self-start bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
              {/* Course Thumbnail */}
              <img
                className="w-full aspect-video object-cover rounded-t-lg border-b border-gray-200"
                src={courseThumbnail?.url || assets.default_course_image}
                alt={`Thumbnail for ${courseTitle}`}
                onError={(e) => { e.target.src = assets.default_course_image; }}
              />

              {/* Price, Discount & Buy Button */}
              <div className="p-4 sm:p-5 flex flex-col items-center justify-center border-b border-gray-200">
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-900 leading-none line-through">
                  {currency}{originalPrice}
                  {discount > 0 && (
                  <span className="absolute top-0 right-0 text-sm font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full mb-4">
                    {discount}% OFF
                  </span>
                )}
                  </p>
                  {discount > 0 && (
                    <p className="text-base text-green-600 font-semibold">
                      {currency}{discountedPrice}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={enrolledCourses}
                  disabled={loadingEnroll || isAlreadyEnrolled}
                  className={`w-full py-2.5 rounded-md font-semibold text-white transition-colors duration-200 shadow-md hover:shadow-lg
                    ${isAlreadyEnrolled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-98"
                    }
                    ${loadingEnroll ? "opacity-70 animate-pulse" : ""}`
                  }
                >
                  {loadingEnroll ? "Processing..." : (isAlreadyEnrolled ? "Enrolled" : "Buy Course")}
                </button>
                {/* 30 Day Money Back Guarantee */}
                <p className="text-xs text-gray-500 mt-2 text-center">30 Day Money Back Guarantee</p>
              </div>

              {/* This Course Includes (moved from separate grid) */}
              <div className="p-4 sm:p-5 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">This Course Includes:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <img src={assets.time_clock_icon} alt="Duration" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span><span className="font-medium">{calculateCourseDuration(courseData)}</span> on-demand video</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={assets.lesson_icon} alt="Lectures" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span><span className="font-medium">{calculateNoOfLectures(courseData)}</span> lectures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={assets.language_icon || assets.text_icon} alt="Language" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>Language: <span className="font-medium">English</span></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={assets.skill_level_icon || assets.level_icon} alt="Skill Level" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>Skill Level: <span className="font-medium">Beginner</span></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={assets.certificate_icon || assets.trophy_icon} alt="Certificate" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>

              {/* Material Includes */}
              <div className="p-4 sm:p-5 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Material Includes</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <img src={assets.book_icon || assets.file_icon} alt="Guidebook" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>Course Guidebook</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={assets.slide_icon || assets.document_icon} alt="Slides" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>Lecture Slides</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={assets.download_icon} alt="Download" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>200+ Downloadable Resources</span>
                  </li>
                </ul>
              </div>

              {/* Requirements */}
              <div className="p-4 sm:p-5 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <img src={assets.check_icon} alt="Requirement" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>Assignments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <img src={assets.check_icon} alt="Requirement" className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>Participation</span>
                  </li>
                </ul>
              </div>

              {/* Apply Coupon Section */}
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Apply Coupon</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetails;