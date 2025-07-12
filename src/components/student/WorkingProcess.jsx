import React from "react";

// You can replace these with your actual illustration assets
const stepIllustrations = {
  step1: "https://i.ibb.co/VWVhvFRY/browse-course.png",
  step2: "https://i.ibb.co/s9qQ644h/purcess.png",
  step3: "https://i.ibb.co/whzSsYDk/learning.png",
  step4: "https://i.ibb.co/nqh4TDy6/support.png",
};

const stepsData = [
  {
    number: "01",
    title: "Browse Variety Of Our Course",
    description:
      "Offers free courses such as English for Career Development, Python for Data Science, and Cybersecurity etc.",
    image: stepIllustrations.step1,
  },
  {
    number: "02",
    title: "Purchase quickly And securely",
    description:
      "Securely checkout and get instant access to your chosen courses with a simple and fast payment process.",
    image: stepIllustrations.step2,
  },
  {
    number: "03",
    title: "Start Learning Right Away",
    description:
      "Dive into your course material immediately, with 24/7 access to all videos, resources, and learning modules.",
    image: stepIllustrations.step3,
  },
  {
    number: "04",
    title: "Assessment and Feedback",
    description:
      "Test your knowledge with quizzes and assignments, and receive valuable feedback to track your progress.",
    image: stepIllustrations.step4,
  },
];

const WorkingProcess = () => {
  return (
    <section className="bg-base-200 py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            WORKING PROCESS
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-base-content">
            We work In 4 Simple Steps
          </h2>
        </div>
        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stepsData.map((step) =>
            parseInt(step.number) % 2 === 0 ? (
              <div key={step.number} className="w-full max-w-sm mx-auto ">
                <div className="bg-base-100 shadow-lg relative rounded-t-full group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="bg-orange-500 h-56 flex items-center justify-center p-4 rounded-b-3xl">
                    <img
                      src={step.image}
                      alt={`Step ${step.number} Illustration`}
                      className="w-40 h-40 object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 pt-16 text-center">
                    <h3 className="card-title justify-center font-bold">
                      {step.title}
                    </h3>
                    <p className="text-base-content/70 text-sm mt-2">
                      {step.description}
                    </p>
                  </div>
                  <div className="avatar absolute left-1/2 top-48 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 rounded-full bg-orange-500 ring-8 ring-base-100 flex items-center justify-center">
                      <div className="text-2xl h-full w-full items-center flex justify-center font-bold text-white">
                        {step.number}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={step.number} className="w-full max-w-sm mx-auto ">
                <div className="bg-base-100 shadow-lg relative group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-b-full overflow-hidden">
                  <div className="p-6 pb-20 text-center">
                    <h3 className="card-title justify-center font-bold">
                      {step.title}
                    </h3>
                    <p className="text-base-content/70 text-sm mt-2">
                      {step.description}
                    </p>
                  </div>
                  <div className="avatar absolute left-1/2 bottom-50 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-20 h-20 rounded-full bg-teal-700  ring-8 ring-base-100 ">
                      <div className="text-2xl h-full w-full items-center flex justify-center  font-bold text-white">
                        {step.number}
                      </div>
                    </div>
                  </div>
                   <div className=" bg-teal-700 h-56 flex items-center justify-center rounded-t-2xl">
                    <img
                      src={step.image}
                      alt={`Step ${step.number} Illustration`}
                      className="w-40 h-40 object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkingProcess;
