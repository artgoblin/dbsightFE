import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const AutoSlider = () => {
  const slides = [
    {
      image: "/assets/aichatinterface.png",
      title: "AI-Powered Chat",
      desc: "Ask questions in natural language and get instant SQL results.",
    },
    {
      image: "/assets/query.png",
      title: "Run SQL Queries",
      desc: "Execute queries with instant results and pagination.",
    },
    {
      image: "/assets/visualize.png",
      title: "Visualize Data",
      desc: "Create beautiful charts and graphs from your data.",
    },
    {
      image: "/assets/connections.png",
      title: "Manage Connections",
      desc: "Securely connect to multiple databases in seconds.",
    },
    {
      image: "/assets/aichatinterfacewithgraph.png",
      title: "Analyze Data",
      desc: "View structured results with smart UI.",
    },
    {
      image: "/assets/visualizer.png",
      title: "Data Visualization",
      desc: "Create beautiful charts and graphs from your data.",
    },
    {
      image: "/assets/editorandschema.png",
      title: "Schema Explorer",
      desc: "Browse database tables and columns with ease.",
    },
  ];

  return (
    <div className=" bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center p-6">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
        spaceBetween={40}
        slidesPerView={1}
        speed={800}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col items-center text-center text-white p-8">
              {/* Image Container */}
              <div className="w-full h-[250px] flex items-center justify-center mb-8 rounded-3xl bg-black/20 transition-all duration-500 hover:scale-105">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="max-h-full max-w-full object-contain contrast-110 brightness-105"
                />
              </div>

              {/* Text Content */}
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {slide.title}
              </h2>
              <p className="text-blue-100 text-xl max-w-2xl leading-relaxed">
                {slide.desc}
              </p>

              {/* Decorative Dots */}
              <div className="flex gap-2 mt-8">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === index ? "bg-white w-8" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AutoSlider;
