import React, { useEffect, useRef } from "react";

const Herosection = () => {
  const heroSectionRef = useRef(null);

  useEffect(() => {
    const heroSection = heroSectionRef.current;
    const heroGradient = heroSection.querySelector(".hero-gradient");
    const heroTitle = heroSection.querySelector(".hero-title");

    const onMouseMove = (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      if (heroGradient) heroGradient.style.transform = `translateX(${moveX}px)`;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (heroTitle)
        heroTitle.style.textShadow = `${(x - 0.5) * 5}px ${
          (y - 0.5) * 5
        }px 10px rgba(0,0,0,0.03)`;
    };

    const onMouseLeave = () => {
      if (heroGradient) heroGradient.style.transform = "translateX(0)";
      if (heroTitle)
        heroTitle.style.textShadow = "0px 2px 10px rgba(0,0,0,0.05)";
    };

    heroSection.addEventListener("mousemove", onMouseMove);
    heroSection.addEventListener("mouseleave", onMouseLeave);

    return () => {
      heroSection.removeEventListener("mousemove", onMouseMove);
      heroSection.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={heroSectionRef}
      className="relative h-[70vh] flex items-center bg-[#f8f9fa] text-[#212529] overflow-hidden px-[5%]"
    >
      <div className="hero-content relative text-left max-w-[500px] z-20 mr-auto">
        <h1 className="hero-title text-[3.2rem] font-medium tracking-wide mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#2b2d42] to-[#4361ee] drop-shadow">
          Renting Made Easy
        </h1>
        <p className="hero-subtitle text-lg mb-8 opacity-80 font-light tracking-wide">
          Premium Equipment Rentals. Doorstep Delivery.
        </p>
        <a
          href="#products"
          className="cta-button inline-block px-7 py-2.5 text-sm font-normal text-white rounded-full bg-gradient-to-r from-[#3a86ff] to-[#4361ee] shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          Rent Now
        </a>
      </div>
      <div
        className="hero-gradient absolute top-0 right-0 w-3/5 h-full z-10"
        style={{
          clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
          background:
            "linear-gradient(to left, rgba(67,97,238,0.15), transparent)",
        }}
      >
        <i className="fa fa-camera doodle"></i>
        <i className="fa fa-tools doodle"></i>
        <i className="fa fa-laptop doodle"></i>
        <i className="fa fa-headphones doodle"></i>
        <i className="fa fa-microphone doodle"></i>
        <i className="fa fa-video doodle"></i>
        <i className="fa fa-mobile-alt doodle"></i>
        <i className="fa fa-keyboard doodle"></i>
      </div>
    </div>
  );
};

export default Herosection;
