
import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";


function AnimatedTitle() {
  const [hovered, setHovered] = useState(false);
  const { x } = useSpring({
    from: { x: 0 },
    x: hovered ? 1 : 0,
    config: { duration: 1000 },
  });

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer", // Cambia el cursor al hacer hover
        paddingLeft: "30px"
      }}
    >
      <animated.div
        style={{
          opacity: x.to({ range: [0, 1], output: [0.3, 1] }),
          transform: x
            .to({
              range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
              output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
            })
            .to((x) => `scale(${x})`),
        }}
      >
        In-Toler(allergies)!
      </animated.div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex start-2 justify-start w-px-4 items-center h-20">
      <img src="/public/Logo.jpg" alt="logo" width={86}  />
      <div className="text-3xl font-extrabold text-black hover:text-red-500, bg-transparent">
        <AnimatedTitle /> {/* Agrega el componente AnimatedTitle */}
      </div>
    </div>
  );
}

export default Logo;

