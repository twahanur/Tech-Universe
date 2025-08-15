import React from "react";
import PropTypes from "prop-types";
import { timelineData } from "../../assets/staticData";
// Map color names to Tailwind classes
const colorMap = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  info: "text-info",
  success: "text-success",
};

export const TimelineCard = ({ item, index }) => {
  return (
    <li key={index}>
      {index !== 0 && <hr className="md:hidden" />}
      <div className="timeline-middle text-primary" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 z-50"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div
        className={`timeline-item mb-6 card bg-base-100 shadow-xl p-6 ${
          index % 2 === 0 ? "timeline-start md:text-end" : "timeline-end"
        }`}
      >
        <time className="font-mono italic text-sm text-base-content/60">
          {item.time}
        </time>
        <div
          className={`text-lg font-black ${
            colorMap[item.color] || "text-primary"
          }`}
        >
          {item.title}
        </div>
        {item.description}
      </div>
      {index !== timelineData.length - 1 && <hr className="md:hidden" />}
    </li>
  );
};

TimelineCard.propTypes = {
  item: PropTypes.shape({
    time: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    color: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }).isRequired,
  index: PropTypes.number.isRequired,
};
