import Hero from "../../components/student/Hero";
import Companies from "../../components/student/Companies";
import CourseSection from "../../components/student/CourseSection";
import TestimonialSection from "../../components/student/TestimonialSection";
import CallToAction from "../../components/student/CallToAction";
import Footer from "../../components/student/Footer";
import ServicesSection from "../../components/student/Service";
import AboutUs from "../../components/student/Aboutus";
import WorkingProcess from "../../components/student/WorkingProcess";
import InsightsSection from "../../components/student/InsightsSection";
import CourseTImeline from "../../components/student/CourseTImeline";
import HeroSection from "../../components/student/HeroSection";
import { serviceData } from "../../assets/ServiceOffer";
import ServiceOffer from "../../components/student/SerciceOffer";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <HeroSection/>
      <Hero />
      <Companies />
      <WorkingProcess/>
      <div className="border-t-2 text-left py-3">
        <h1 className="px-3 text-black">We Are Offering</h1>
        {serviceData.map((service, index) => (
          <ServiceOffer key={index} serviceData={service} />
        ))}
      </div>
      <CourseSection />
      <AboutUs />
      <CourseTImeline/>
      <ServicesSection />
      <InsightsSection/>
      <TestimonialSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;