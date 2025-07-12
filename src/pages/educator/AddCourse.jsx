/* eslint-disable no-undef */
import uniqid from "uniqid";
import Quill from "quill";
import { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets"; // Assuming assets.plus_icon, assets.dropdown_icon, assets.cross_icon, assets.file_upload_icon exist
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: 0, // Initialize as number for consistency
    lectureUrl: "",
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false, // Default to not collapsed
          chapterOrder: chapters.length + 1, // Simple sequential order
        };
        setChapters((prevChapters) => [...prevChapters, newChapter]);
      }
    } else if (action === "remove") {
      const filteredChapters = chapters.filter((c) => c.chapterId !== chapterId);
      // Re-index chapter orders after removal to maintain sequence
      const reIndexedChapters = filteredChapters.map((chapter, index) => ({
        ...chapter,
        chapterOrder: index + 1,
      }));
      setChapters(reIndexedChapters);
    } else if (action === "toggle") {
      setChapters((prevChapters) =>
        prevChapters.map((c) =>
          c.chapterId === chapterId ? { ...c, collapsed: !c.collapsed } : c
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters((prevChapters) =>
        prevChapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            // Create a NEW array by filtering out the lecture
            const updatedContent = chapter.chapterContent.filter(
              (_, idx) => idx !== lectureIndex
            );
            // Map over the NEW array to re-assign lectureOrder for each remaining lecture
            const reIndexedContent = updatedContent.map((lecture, index) => ({
              ...lecture,
              lectureOrder: index + 1, // Re-assign based on new position
            }));
            return {
              ...chapter,
              chapterContent: reIndexedContent,
            };
          }
          return chapter; // Return chapter as is if not the target chapter
        })
      );
    }
  };

  const addLectureToChapter = () => {
    const parsedLectureDuration = Number(lectureDetails.lectureDuration);

    if (
      currentChapterId &&
      lectureDetails.lectureTitle &&
      parsedLectureDuration > 0 && // Duration must be positive
      lectureDetails.lectureUrl
    ) {
      setChapters((prevChapters) =>
        prevChapters.map((chapter) => {
          if (chapter.chapterId === currentChapterId) {
            const newLectureOrder = chapter.chapterContent.length + 1; // Calculate order

            const newLecture = {
              lectureId: uniqid(),
              lectureTitle: lectureDetails.lectureTitle,
              lectureDuration: parsedLectureDuration,
              lectureUrl: lectureDetails.lectureUrl,
              isPreviewFree: lectureDetails.isPreviewFree,
              lectureOrder: newLectureOrder,
            };

            return {
              ...chapter,
              chapterContent: [...chapter.chapterContent, newLecture], // Add new lecture immutably
            };
          }
          return chapter;
        })
      );

      setLectureDetails({
        lectureTitle: "",
        lectureDuration: 0,
        lectureUrl: "",
        isPreviewFree: false,
      });
      setShowPopup(false);
    } else {
      toast.error("Please fill all required lecture details (Title, Duration > 0, and URL).");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Thumbnail Not Selected");
      return;
    }

    try {
      setIsSubmitting(true);

      const courseContent = chapters.map((chapter) => ({
        chapterId: chapter.chapterId,
        chapterTitle: chapter.chapterTitle,
        chapterOrder: chapter.chapterOrder,
        collapsed: chapter.collapsed, // Include if in Mongoose schema
        chapterContent: chapter.chapterContent.map((lecture) => ({
          lectureId: lecture.lectureId,
          lectureTitle: lecture.lectureTitle,
          lectureDuration: Number(lecture.lectureDuration), // Ensure numerical type
          lectureUrl: lecture.lectureUrl,
          isPreviewFree: lecture.isPreviewFree,
          lectureOrder: lecture.lectureOrder, // This should already be correctly set
        })),
      }));

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent,
      };

      console.groupCollapsed("Course Data to Send:", courseData);

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/educator/add-course`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = "";
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Error submitting course:", err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        },
      });
    }
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-start">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white p-6 md:p-10 rounded-xl shadow-2xl text-gray-800 flex flex-col gap-8 transform transition-all duration-300 hover:shadow-3xl"
      >
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-6 border-b-2 border-blue-200 pb-4">
          Create New Course
        </h2>

        {/* Course Title */}
        <div className="flex flex-col gap-2">
          <label htmlFor="courseTitle" className="text-xl font-semibold text-gray-700">
            Course Title
          </label>
          <input
            id="courseTitle"
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="e.g., Master React with Advanced Hooks"
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-lg"
            required
          />
        </div>

        {/* Course Description */}
        <div className="flex flex-col gap-2">
          <label htmlFor="courseDescription" className="text-xl font-semibold text-gray-700">
            Course Description
          </label>
          <div
            ref={editorRef}
            id="courseDescription"
            className="bg-white border border-gray-300 rounded-lg p-3 min-h-[250px] focus-within:ring-3 focus-within:ring-blue-400 focus-within:border-blue-500 transition-all duration-300 shadow-sm"
          ></div>
        </div>

        {/* Price, Discount & Thumbnail Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Course Price */}
          <div className="flex flex-col gap-2">
            <label htmlFor="coursePrice" className="text-xl font-semibold text-gray-700">
              Course Price ($)
            </label>
            <input
              id="coursePrice"
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder="0"
              min="0"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-lg"
              required
            />
          </div>

          {/* Discount */}
          <div className="flex flex-col gap-2">
            <label htmlFor="discount" className="text-xl font-semibold text-gray-700">
              Discount (%)
            </label>
            <input
              id="discount"
              onChange={(e) => setDiscount(e.target.value)}
              value={discount}
              type="number"
              placeholder="0"
              min={0}
              max={100}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-500 transition-all duration-300 text-lg"
              required
            />
          </div>

          {/* Course Thumbnail */}
          <div className="flex flex-col gap-2 items-start md:items-center">
            <p className="text-xl font-semibold text-gray-700">Course Thumbnail</p>
            <label htmlFor="thumbnailImage" className="flex flex-col items-center gap-3 cursor-pointer p-4 bg-blue-100 rounded-lg hover:bg-blue-200 transition-all duration-300 w-full md:w-auto text-blue-800 font-medium border border-blue-200 shadow-sm">
              <img
                src={assets.file_upload_icon}
                alt="Upload Icon"
                className="w-10 h-10 p-2 bg-blue-600 rounded-full text-white"
              />
              <span>Choose Image</span>
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/**"
                hidden
                required
              />
            </label>
            {image ? (
              <img
                className="max-h-32 w-auto object-cover rounded-lg shadow-md mt-4"
                src={URL.createObjectURL(image)}
                alt="Thumbnail Preview"
              />
            ) : (
              <div className="max-h-32 h-32 w-full md:w-36 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-center text-sm p-4 mt-4 bg-gray-50">
                No image selected
              </div>
            )}
          </div>
        </div>

        {/* Chapters & Lectures Section */}
        <div className="bg-indigo-50 p-6 rounded-xl shadow-inner border border-indigo-200">
          <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
            Course Chapters & Lectures
          </h3>
          {chapters.length === 0 && (
            <p className="text-gray-600 text-center py-6 text-lg italic">
              No chapters added yet. Click "Add Chapter" to start building your course!
            </p>
          )}
          {chapters.map((chapter) => (
            <div key={chapter.chapterId} className="bg-white border border-gray-200 rounded-lg shadow-md mb-4 last:mb-0 overflow-hidden group">
              <div
                className="flex justify-between items-center p-5 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleChapter("toggle", chapter.chapterId)}
                aria-expanded={!chapter.collapsed}
                aria-controls={`chapter-content-${chapter.chapterId}`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={assets.dropdown_icon}
                    width={18}
                    alt="Toggle Chapter"
                    className={`transform transition-transform duration-300 ${chapter.collapsed ? '-rotate-90' : 'rotate-0'}`}
                  />
                  <span className="font-bold text-xl text-gray-900">
                    {chapter.chapterOrder}. {chapter.chapterTitle}
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-gray-600 text-base font-medium">
                    {chapter.chapterContent.length} {chapter.chapterContent.length === 1 ? 'Lecture' : 'Lectures'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent toggling chapter when removing
                      handleChapter("remove", chapter.chapterId);
                    }}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label={`Remove chapter ${chapter.chapterTitle}`}
                  >
                    <img src={assets.cross_icon} className="w-5 h-5" alt="Remove Chapter" />
                  </button>
                </div>
              </div>
              <div id={`chapter-content-${chapter.chapterId}`} className={`transition-all duration-500 ease-in-out ${chapter.collapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-screen opacity-100'}`}>
                <div className="p-5 pt-0">
                  {chapter.chapterContent.length === 0 && (
                    <p className="text-gray-500 italic text-center py-4">No lectures added to this chapter yet.</p>
                  )}
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div
                      key={lecture.lectureId}
                      className="flex justify-between items-center bg-gray-100 rounded-md p-4 mb-3 shadow-sm border border-gray-200 last:mb-0 group/lecture"
                    >
                      <span className="text-base text-gray-800 flex-grow pr-4">
                        <span className="font-semibold text-blue-700 mr-2">{lecture.lectureOrder}.</span>
                        {lecture.lectureTitle} - {lecture.lectureDuration} mins
                        <a
                          href={lecture.lectureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline ml-3 text-sm"
                          aria-label={`View lecture ${lecture.lectureTitle}`}
                        >
                          (Link)
                        </a>
                        <span className="ml-3 text-gray-600 text-xs font-medium">
                          - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleLecture("remove", chapter.chapterId, lectureIndex)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label={`Remove lecture ${lecture.lectureTitle}`}
                      >
                        <img src={assets.cross_icon} className="w-5 h-5" alt="Remove Lecture" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-md"
                    onClick={() => handleLecture("add", chapter.chapterId)}
                  >
                    <img src={assets.plus_icon} alt="Add Lecture" className="w-5 h-5 filter brightness-0 invert" /> Add Lecture
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="mt-8 w-full bg-green-600 text-white font-bold py-3.5 px-8 rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 text-lg shadow-lg"
            onClick={() => handleChapter("add")}
          >
            <img src={assets.plus_icon} alt="Add Chapter" className="w-5 h-5 filter brightness-0 invert" /> Add New Chapter
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-8 w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-lg shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-xl tracking-wide
            ${isSubmitting ? "opacity-60 cursor-not-allowed transform scale-98" : "transform hover:scale-105"}`}
        >
          {isSubmitting ? "Submitting Course..." : "Publish Course"}
        </button>
      </form>

      {/* Lecture Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-white text-gray-800 p-8 rounded-xl shadow-3xl relative w-full max-w-lg transform transition-all duration-300 scale-95 animate-scale-in">
            <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Add New Lecture</h2>
            <div className="grid grid-cols-1 gap-5">
              <div className="flex flex-col">
                <label htmlFor="popupLectureTitle" className="text-base font-medium mb-1">Lecture Title</label>
                <input
                  id="popupLectureTitle"
                  type="text"
                  className="border border-gray-300 rounded-md py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="popupLectureDuration" className="text-base font-medium mb-1">Duration (minutes)</label>
                <input
                  id="popupLectureDuration"
                  type="number"
                  min="0"
                  className="border border-gray-300 rounded-md py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
                  value={lectureDetails.lectureDuration === 0 ? '' : lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, lectureDuration: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="popupLectureUrl" className="text-base font-medium mb-1">Lecture URL</label>
                <input
                  id="popupLectureUrl"
                  type="text"
                  className="border border-gray-300 rounded-md py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-lg"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails.lectureUrl, lectureUrl: e.target.value }) // Fixed: was ...lectureDetails.lectureUrl
                  }
                  required
                />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <input
                  id="isPreviewFree"
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })
                  }
                />
                <label htmlFor="isPreviewFree" className="text-base font-medium text-gray-700 cursor-pointer">Is Preview Free?</label>
              </div>
            </div>
            <button
              type="button"
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow transition-colors duration-200 text-lg"
              onClick={addLectureToChapter}
            >
              Add Lecture
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPopup(false);
                setLectureDetails({
                  lectureTitle: '',
                  lectureDuration: 0,
                  lectureUrl: '',
                  isPreviewFree: false,
                });
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <img src={assets.cross_icon} className="w-6 h-6" alt="Close Popup" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;