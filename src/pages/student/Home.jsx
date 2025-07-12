// import React from 'react'

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

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      <Hero />
      <Companies />
      <WorkingProcess/>
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
