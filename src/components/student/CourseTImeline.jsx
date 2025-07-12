import React, { useState, useEffect, useRef } from "react";
import { timelineData } from "../../assets/staticData";
import { TimelineCard } from "./TimelineCard";



const CourseTimeline = () => {
    const [progress, setProgress] = useState(0);
    const timelineRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (timelineRef.current) {
                const { top, height } = timelineRef.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Start animation when 33% of the element is in view
                const triggerOffset = windowHeight * 0.33;
                const visibleHeight = height - triggerOffset;

                const scrollProgress = Math.max(
                    0,
                    Math.min(1, (triggerOffset - top) / visibleHeight)
                );

                setProgress(scrollProgress);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.33 } // Trigger when 33% of item is visible
        );

        const elements = [];
        if (timelineRef.current) {
            elements.push(...timelineRef.current.querySelectorAll(".timeline-item"));
            elements.forEach((el) => observer.observe(el));
        }

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial call in case it's already in view

        return () => {
            window.removeEventListener("scroll", handleScroll);
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-base-200">
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
                <h2 className="text-3xl sm:text-4xl font-bold text-primary">
                    Your Journey to Success
                </h2>
                <p className="text-base-content/70 mt-2 max-w-2xl mx-auto">
                    A step-by-step look at how we guide you from day one to your dream job.
                </p>
            </div>

            <div className="relative">
                {/* Timeline background line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-base-300 -translate-x-1/2 hidden md:block" />

                {/* Animated progress line */}
                <div
                    className="absolute left-1/2 top-0 w-1 bg-primary -translate-x-1/2 hidden md:block"
                    style={{ height: `${progress * 100}%` }}
                />

                <ul
                    ref={timelineRef}
                    className="timeline max-md:timeline-compact timeline-vertical"
                >
                    {timelineData.map((item, index) => (
                        <TimelineCard key={index} item={item} index={index}/>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CourseTimeline;
