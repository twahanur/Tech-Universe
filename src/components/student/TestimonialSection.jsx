// Make sure your asset imports are correct
import { assets, dummyTestimonial } from '../../assets/assets'; 

// I've added a 'title' to your dummy data structure for the card's heading.
// Example: { name: 'Esther Howard', title: 'Efficient and Professional Team', ... }

const TestimonialSection = () => {
  return (
    <section className="bg-[#FBF9F7] py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center" >
          
          {/* Left Column: Text Content & Testimonials */}
          <div className="px-4 lg:px-0 shadow rounded" >
            <p className="text-sm font-semibold text-gray-500 tracking-wider">
              ( TESTIMONIALS )
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-800">
              Words From Our Students
            </h2>

            {/* Carousel with Navigation */}
            <div className="relative mt-8">
              {/* Previous Button */}
             
              
              <div className="carousel carousel-center w-full space-x-6 rounded-box p-2">
                {dummyTestimonial.map((testimonial, index) => (
                  <div
                    key={index}
                    id={`slide${index}`}
                    className="carousel-item w-[320px] relative" // Set fixed width for items
                  >
                    <div className="card bg-base-100 shadow-xl rounded-2xl p-6 w-full">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-12 rounded-full">
                            <img src={testimonial.image} alt={testimonial.name} />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                          <p className="text-sm text-gray-500">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-bold text-gray-800 text-lg">{testimonial.title}</h4>
                        <p className="text-sm text-gray-600 mt-2">{testimonial.feedback}</p>
                        <div className="flex gap-1 mt-4">
                          {[...Array(5)].map((_, i) => (
                            <img
                              className="h-5 w-5"
                              key={i}
                              src={i < Math.floor(testimonial.rating) ? assets.star : assets.star_blank}
                              alt="star rating"
                            />
                          ))}
                        </div>
                      </div>
                      {/* Speech Bubble Pointer for the 3rd card */}
                      {index === 2 && (
                        <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 bg-base-100 transform rotate-45"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative h-[500px] hidden lg:block">
             <div className="absolute inset-0 bg-orange-400 rounded-tl-[80px] rounded-br-[80px]"></div>
             <img 
               src="https://i.ibb.co/39cf13VD/testimonial.png" // Assuming you have a student image in your assets
               alt="Happy Student"
               className="absolute bottom-0 right-0 h-full w-auto object-cover"
             />
          </div>

        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;