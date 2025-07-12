import React, { useState, useEffect, useRef } from "react";

// Data for the timeline is kept separate for cleaner code
const timelineData = [
    { time: "Week 1", title: "Grand Kick-off & Orientation", description: "Welcome aboard! 🚀 You'll meet your instructors, mentors, and classmates. We'll outline the complete course structure and set you up for success.", color: "primary" },
    { time: "Weekly", title: "Project Milestones", description: "Apply what you learn each week with hands-on projects. These milestones ensure you're mastering concepts by building real-world applications.", color: "secondary" },
    { time: "24/7", title: "Dedicated Support System", description: "Never get stuck. Our 24/7 support system includes live Q&A sessions, a dedicated Discord channel, and one-on-one doubt-clearing sessions.", color: "accent" },
    { time: "Final Phase", title: "Specialized Career Care", description: "As you near graduation, our career services team provides resume building workshops, portfolio reviews, and mock interviews with industry experts.", color: "info" },
    { time: "Post-Graduation", title: "Guaranteed Job Placement", description: "Your success is our success. We connect you with our network of hiring partners and provide placement assistance until you land your dream job.", color: "success" },
];

const CourseTimeline = () => {
    const [progress, setProgress] = useState(0);
    const timelineRef = useRef(null);

    useEffect(() => {
        // --- Logic for the line fill animation ---
        const handleScroll = () => {
            if (timelineRef.current) {
                const { top, height } = timelineRef.current.getBoundingClientRect();
                const scrollableHeight = height - window.innerHeight;
                // Calculate progress from 0 to 1
                const scrollProgress = Math.max(0, Math.min(1, (-top) / scrollableHeight));
                console.log(height - window.innerHeight)
                setProgress(scrollProgress);
            }
        };

        // --- Logic for the card fade-in animation ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Optional: stop observing after it's visible
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the item is visible

        const elements = timelineRef.current.querySelectorAll('.timeline-item');
        elements.forEach(el => observer.observe(el));
        
        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove listeners
        return () => {
            window.removeEventListener('scroll', handleScroll);
            elements.forEach(el => observer.unobserve(el));
        };
    }, []);


    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-base-200">
             {/* Add a style tag for the animations, or move this to your main CSS file */}
            <style>{`
                .timeline-item {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                }
                .timeline-item.timeline-start {
                    transform: translateX(-30px);
                }
                .timeline-item.timeline-end {
                    transform: translateX(30px);
                }
                .timeline-item.is-visible {
                    opacity: 1;
                    transform: translateY(0) translateX(0);
                }
            `}</style>

            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary">Your Journey to Success</h2>
                <p className="text-base-content/70 mt-2 max-w-2xl mx-auto">A step-by-step look at how we guide you from day one to your dream job.</p>
            </div>

            <div className="relative">
                 {/* The custom timeline line that will be animated */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-base-300 -translate-x-1/2 hidden md:block" />
                <div 
                    className="absolute left-1/2 top-0 w-1 bg-primary -translate-x-1/2 hidden md:block"
                    style={{ height: `${progress * 100}%` }}
                />

                <ul ref={timelineRef} className="timeline max-md:timeline-compact timeline-vertical">
                    {timelineData.map((item, index) => (
                        <li key={index}>
                            {/* hr elements are only for visual connection, not the main line */}
                            {index !== 0 && <hr className="md:hidden" />}
                            <div className="timeline-middle text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5`}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                            </div>
                            <div className={`timeline-item mb-10 card bg-base-100 shadow-xl p-6 ${index % 2 === 0 ? "timeline-start md:text-end" : "timeline-end"}`}>
                                <time className="font-mono italic text-sm text-base-content/60">{item.time}</time>
                                <div className={`text-lg font-black text-${item.color}`}>{item.title}</div>
                                {item.description}
                            </div>
                            {index !== timelineData.length - 1 && <hr className="md:hidden" />}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CourseTimeline;