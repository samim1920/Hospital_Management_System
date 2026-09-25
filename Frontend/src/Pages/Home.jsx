import React from "react";
import { Link } from "react-router-dom";


function Home() {

  const backgroundImage = import.meta.env.VITE_HOSPITAL_BACKGROUND_IMAGE_URL;
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">

      {/* ================= MAIN SECTION ================= */}
      <main
        className="
          relative
          flex-1
          min-h-[calc(100vh-90px)]
          flex
          items-center
          justify-center
          bg-cover
          bg-center
          bg-no-repeat
          py-10
        "
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >

        {/* ================= DARK OVERLAY ================= */}
        <div className="absolute inset-0 bg-black/20"></div>


        {/* ================= MOVING TITLE ================= */}
        {/* <div className="absolute top-0 left-0 w-full overflow-hidden z-10">

          <div
            className="
              flex
              w-max
              whitespace-nowrap
              py-4
              animate-marquee
            "
          >

            <span className="
              shrink-0
              pr-28
              text-white
              text-3xl
              font-extrabold
              tracking-[5px]
              drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]
            ">
              🏥 HOSPITAL MANAGEMENT SYSTEM
            </span>

            <span className="
              shrink-0
              pr-28
              text-white
              text-3xl
              font-extrabold
              tracking-[5px]
              drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]
            ">
              🏥 HOSPITAL MANAGEMENT SYSTEM
            </span>

            <span className="
              shrink-0
              pr-28
              text-white
              text-3xl
              font-extrabold
              tracking-[5px]
              drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]
            ">
              🏥 HOSPITAL MANAGEMENT SYSTEM
            </span>

            <span className="
              shrink-0
              pr-28
              text-white
              text-3xl
              font-extrabold
              tracking-[5px]
              drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]
            ">
              🏥 HOSPITAL MANAGEMENT SYSTEM
            </span>

          </div>

        </div> */}
        {/* <div className="absolute top-0 left-0 w-full overflow-hidden z-10">
  <div className="flex w-max whitespace-nowrap animate-marquee py-4">

    <span className="shrink-0 px-20 text-white text-3xl font-extrabold tracking-[5px]">
      Medcore Medcore Medcore 
      Register our Website for Maintain Your Hospital
    </span>

    <span className="shrink-0 px-20 text-white text-3xl font-extrabold tracking-[5px]">
      Medcore Medcore Medcore
    </span>

    <span className="shrink-0 px-20 text-white text-3xl font-extrabold tracking-[5px]">
      Medcore Medcore Medcore
    </span>

  </div>
</div> */}

{/* ================= MOVING MEDCORE HEADER ================= */}
<div className="absolute top-0 left-0 w-full overflow-hidden z-10">

  <div className="flex w-max animate-marquee">

    <div className="flex items-center shrink-0">

      <span className="px-10 text-white text-3xl font-extrabold tracking-[4px]">
        🏥 Medcore
      </span>

      <span className="text-cyan-300 text-3xl">
        ──♥──
      </span>

      <span className="px-10 text-white text-xl font-semibold">
        CARE TODAY, HEALTHY TOMORROW
      </span>

      <span className="text-cyan-300 text-3xl">
        ✚
      </span>

      <span className="
        mx-10
        px-8
        py-3
        rounded-full
        border-2
        border-cyan-300
        bg-cyan-900/40
        backdrop-blur-sm
        text-white
        text-xl
        font-bold
      ">
        <Link to="/register">
        Register our Website
        </Link>
        <span className="text-cyan-300 ml-2">
          for Maintain Your Hospital
        </span>
      </span>

    </div>


    {/* Duplicate for seamless scrolling */}

    <div className="flex items-center shrink-0">

      <span className="px-10 text-white text-3xl font-extrabold tracking-[4px]">
        🏥 Medcore
      </span>

      <span className="text-cyan-300 text-3xl">
        ──♥──
      </span>

      <span className="px-10 text-white text-xl font-semibold">
        CARE TODAY, HEALTHY TOMORROW
      </span>

      <span className="text-cyan-300 text-3xl">
        ✚
      </span>

      <span className="
        mx-10
        px-8
        py-3
        rounded-full
        border-2
        border-cyan-300
        bg-cyan-900/40
        backdrop-blur-sm
        text-white
        text-xl
        font-bold
      ">
        Register our Website
        <span className="text-cyan-300 ml-2">
          for Maintain Your Hospital
        </span>
      </span>

    </div>

  </div>

</div>

        {/* ================= ADMIN CARD ================= */}
        <div className="relative z-20 w-[450px] max-w-[90%]">

          <div
            className="
              min-h-[430px]
              p-9
              rounded-3xl
              bg-white/5
              backdrop-blur-md
              border
              border-white/80
              shadow-2xl
              flex
              flex-col
            "
          >

            {/* ================= ICON ================= */}
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-cyan-100
                flex
                items-center
                justify-center
                text-3xl
                mb-6
              "
            >
              👤
            </div>


            {/* ================= LABEL ================= */}
            <p className="
              text-sm
              tracking-[2px]
              text-cyan-1000
              mb-2
            ">
              AUTHORIZED ACCESS
            </p>


            {/* ================= HEADING ================= */}
            <h2 className="
              text-3xl
              font-serif
              font-bold
              text-gray-900
              mb-6
            ">
              Admin Login
            </h2>


            {/* ================= DESCRIPTION ================= */}
            <p className="
              text-[17px]
              leading-relaxed
              text-white
              mb-8
            ">
              Login as hospital administrator to manage
              patients, doctors, appointments and hospital
              operations.
            </p>


            {/* ================= LOGIN BUTTON ================= */}
            <Link
              to="/login"
              className="
                w-full
                py-4
                rounded-xl
                bg-white
                text-cyan-700
                font-bold
                text-base
                text-center
                hover:bg-cyan-700
                hover:text-white
                transition
                duration-300
                cursor-pointer
                shadow-md
              "
            >
              Register Your Hospital →
            </Link>

          </div>

        </div>

      </main>


      {/* ================= FOOTER ================= */}
      <footer
        className="
          min-h-[90px]
          bg-cyan-950
          text-white
          flex
          flex-col
          justify-center
          items-center
          gap-2
          text-sm
          text-center
          px-4
        "
      >

        <p>
          Hospital Management System
        </p>

        <p>
          © 2026 Hospital Management System |
          Privacy Policy | Terms & Conditions
        </p>

      </footer>


      {/* ================= MARQUEE ANIMATION ================= */}
<style>{`
  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }

    100% {
      transform: translateX(-50%);
    }
  }

  .animate-marquee {
    animation: marquee 12s linear infinite;
  }
`}</style>
    </div>
  );
}

export default Home;