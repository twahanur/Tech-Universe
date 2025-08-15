/* eslint-disable @typescript-eslint/no-explicit-any */
// components/sections/ServiceOffer.tsx

import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { serviceData } from "@/assets/staticData/ServiceOffer";

const ServiceOffer = ({serviceData}:any) => {
  const { sectionTitle, description, content, link } = serviceData;

  // Split content into two columns
  const middleIndex = Math.ceil(content.length / 2);
  const leftContent = content.slice(0, middleIndex);
  const rightContent = content.slice(middleIndex);

  return (
    <section className="w-full py-16 px-4 md:px-12 bg-background text-foreground border-b-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Side Title */}
        <div className="text-[4rem] md:text-[8rem] font-serif text-muted-foreground leading-none">
          {sectionTitle}
        </div>

        {/* Right Side Content */}
        <div className="flex flex-col gap-8">
          <p className="text-lg md:text-xl max-w-2xl">{description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground">
            {leftContent.map((item:any, index:number) => (
              <span key={index}>{item}</span>
            ))}
            {rightContent.map((item:any, index:number) => (
              <span key={index + middleIndex}>{item}</span>
            ))}
          </div>

          <Link to={link} className="mt-6">
            <button>
              See Work <span className="ml-2">→</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceOffer;
