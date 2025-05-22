import React, { useRef } from "react";
import Herosection from "../components/homepage/Herosection";
import Collections from "../components/homepage/Collections";
import Testimonials from "../components/homepage/Testimonials";
import Howitworks from "../components/homepage/Howitworks";
import Faqs from "../components/homepage/Faqs";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const Homepage = () => {
  const pageRef = useRef(null);
  useIntersectionObserver(pageRef);

  return (
    <div ref={pageRef}>
      <Herosection />
      <Collections />
      <Testimonials />
      <Howitworks />
      <Faqs />
    </div>
  );
};

export default Homepage;
