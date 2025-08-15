import CircularText from "../AnimationLibrary/CircularText";
import CountUp from "../AnimationLibrary/CountUp";


const HeroSection = () => {
  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Circular Text */}
          <div className="flex items-center justify-center">
            <CircularText
              text=" -- s i n c e  2 0 1 8 -- A w a r d    W i n n i n g A g e n c y "
              onHover="speedUp"
              spinDuration={20}
              className="w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60"
            />
          </div>

          {/* Hero Text */}
          <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left">
            <h1 className="text-[clamp(2rem,5vw,3.75rem)] font-bold leading-tight tracking-tight">
              Let's sharpen your brand <br />
              with{" "}
              <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-md">
                ∞ quality
              </span>{" "}
              work
            </h1>
          </div>
        </div>

        {/* Right Column - Stats */}
        <div className="flex flex-col justify-end space-y-8 lg:col-span-1">
          <div className="grid grid-cols-2 gap-6 sm:gap-10">
            {/* Satisfaction */}
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold">
                <CountUp
                  from={0}
                  to={98}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                />
                %
              </h2>
              <p className="text-sm sm:text-base mt-1">
                Average clients satisfied and repeating
              </p>
            </div>

            {/* Projects Done */}
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold">
                <CountUp
                  from={0}
                  to={120}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                />
                +
              </h2>
              <p className="text-sm sm:text-base mt-1">
                Successfully projects done in{" "}
                <CountUp
                  from={0}
                  to={24}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                />{" "}
                countries
              </p>
            </div>
          </div>

          {/* Divider & Description */}
          <hr className="border-border" />
          <p className="text-sm sm:text-base">
            We're a digital product design & development agency that works
            passionately with digital experiences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
