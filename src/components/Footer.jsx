import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <div className="w-full footer">
      <section className="relative overflow-hidden">
        <div className="container bg-tarnsparent">
          <nav className="flex justify-between py-6">
            <div className="flex flex-wrap items-center justify-between w-full">
              <div className="w-full mb-3 md:w-6/12 lg:mb-0">
                <NavLink
                  className="flex items-center justify-center md:justify-start whitespace-nowrap"
                  to="/"
                >
                  <img
                    className="h-12"
                    src={`${window.location.origin}/images/logo.png`}
                    alt="logo"
                  />
                  <h4 className="ml-1 text-xl font-medium tracking-widest  title text-slate-800 dark:text-gray-100">
                    GiveStation
                  </h4>
                </NavLink>
              </div>
              <div className="w-full mb-6 md:w-6/12 lg:mb-0">
                <ul className="flex justify-center md:justify-end">
                  <li className="mr-9">
                    <a
                      className="font-bold text-gray-700 dark:text-gray-100"
                      href="https://github.com/GiveStation"
                      target="_blank"
                    >
                      Github
                    </a>
                  </li>
                  <li className="mr-9">
                    <a
                      className="font-bold text-gray-700 dark:text-gray-100"
                      href="https://t.me/GiveStation"
                      target="_blank"
                    >
                      Telegram
                    </a>
                  </li>
                  <li className="mr-9">
                    <a
                      className="font-bold text-gray-700 dark:text-gray-100"
                      href=" https://twitter.com/GiveStation"
                      target="_blank"
                    >
                      Twitter
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          <div className="flex justify-center -mt-0 lg:-mt-5">
            <ul className="flex justify-center">
              <a
                className="flex items-center justify-center mr-4 bg-white rounded-full iconsbtn"
                href="/page-two"
              >
                <img src="/images/fb.png" alt="facebook" className="mx-auto" />
              </a>
              <a
                className="flex items-center justify-center mr-4 bg-white rounded-full iconsbtn"
                href="/page-two"
              >
                <img src="/images/meta.png" alt="meta" className="mx-auto" />
              </a>
              <a
                className="flex items-center justify-center mr-4 bg-white rounded-full iconsbtn"
                href="/page-two"
              >
                <img src="/images/git.png" alt="git" className="mx-auto" />
              </a>
              <a
                className="flex items-center justify-center mr-4 bg-white rounded-full iconsbtn"
                href="/page-two"
              >
                <img
                  src="/images/telegram.png"
                  alt="telegram"
                  className="mx-auto"
                />
              </a>
              <a
                className="flex items-center justify-center bg-white rounded-full iconsbtn"
                href="/page-two"
              >
                <img
                  src="/images/instagram.png"
                  alt="instagram"
                  className="mx-auto"
                />
              </a>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
