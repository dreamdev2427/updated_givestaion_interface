import React, { useEffect } from "react";

export default function DarkLightMode() {
  useEffect(() => {
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
    var themeToggleLightIcon = document.getElementById(
      "theme-toggle-light-icon"
    );

    // Change the icons inside the button based on previous settings
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      // themeToggleLightIcon.classList.remove("hidden");
    } else {
      // themeToggleDarkIcon.classList.remove("hidden");
    }
  }, []);

  const onClickChangeColorMode = () => {
    var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
    var themeToggleLightIcon = document.getElementById(
      "theme-toggle-light-icon"
    );

    // toggle icons inside button
    // themeToggleDarkIcon.classList.toggle("hidden");
    // themeToggleLightIcon.classList.toggle("hidden");

    // if set via local storage previously
    if (localStorage.getItem("color-theme")) {
      if (localStorage.getItem("color-theme") === "light") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      }

      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      }
    }
  };
  return (
    <button
      id="theme-toggle"
      type="button"
      className="ml-10s text-gray-800 bg-[#0F172A] border-2 border-[rgb(31 ,41 ,55)] dark:border-gray-800 dark:bg-transparent dark:text-gray-500 focus:outline-none focus:ring-0 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
      onClick={() => {
        onClickChangeColorMode();
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.7 12C14.2 12.8 11.3 12.3 9.30005 10.3C6.80005 7.8 6.60005 3.8 8.60005 1C4.50005 1.4 1.30005 4.8 1.30005 9C1.30005 13.4 4.90005 17 9.30005 17C12.6 17 15.5 14.9 16.7 12Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLikecap="round"
          strokeLikejoin="round"
        />
      </svg>
    </button>
  );
}
