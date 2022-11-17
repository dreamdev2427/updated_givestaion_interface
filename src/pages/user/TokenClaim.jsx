import { useState } from "react";
import HeaderHome from "../../components/HeaderHome";

const TokenClaim = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className=" relative dark:bg-[#242A38] duration-300 ease-out bg-[#fff] min-h-screen pb-10">
      <div className="font-Jura ">
        <HeaderHome />

        <div className="max-w-4xl px-5 mx-auto lg:px-8 ">
          <div className="bg-[#ffffff] rounded-xl p-4 space-y-4 pb-10">
            <div className="flex items-center justify-center">
              <img
                className="w-16 h-16 md:w-auto md:h-auto"
                src="./assets/images/congratulations.png"
                alt="congratulations"
              />
            </div>
            <h1 className="text-xl font-bold text-center md:text-2xl gradient-text-token">
              Congrats!
              <br className="hidden md:block" />
              You’re eligible for the airdrop.
            </h1>

            <div className="max-w-2xl mx-auto space-y-4">
              <div className="bg-[#1C1924] rounded-xl px-2 py-4 font-bold flex items-center justify-between">
                <div className="text-center">
                  <h2 className="gradient-text-token-claim sm:text-xl">
                    Current ratio: 50%
                  </h2>
                  <h1 className="gradient-text-token-claim sm:text-3xl">
                    500 GVST
                  </h1>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setShowModal(true);
                    }}
                    className="gradient-bg-token-claim py-2 px-8 rounded-full sm:w-40 text-[#232323]"
                  >
                    CLAIM
                  </button>
                </div>
              </div>{" "}
              <div className="bg-[#1C1924] rounded-xl px-2 py-4 font-bold flex items-center justify-between">
                <div className="text-center">
                  <h2 className="gradient-text-token-claim sm:text-xl">
                    Unclaimed (locked)
                  </h2>
                  <h1 className="gradient-text-token-claim sm:text-3xl">
                    500 GVST
                  </h1>
                </div>
                <div>
                  <button className="bg-[#949BAC] py-2 px-8 rounded-full  sm:w-40 text-[#232323]">
                    LOCKED
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[#68778D] text-center max-w-sm mx-auto text-base">
              See the airdrop breakdown and how you qualified below then claim.
            </p>

            <div className="text-[#68778D] max-w-2xl mx-auto space-y-4">
              <h2 className="text-lg font-semibold text-center md:text-left md:ml-8">ELIGIBILITY CRITERIA</h2>

              <div className="space-y-8">
                <div className="space-y-1">
                  <div className="flex items-center justify-between space-x-4 md:space-x-0">
                    <div className="flex items-center justify-start flex-1 space-x-2 ">
                      <div>
                        <svg
                          width="24"
                          height="28"
                          viewBox="0 0 24 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            y="0.00244141"
                            width="24"
                            height="27.5926"
                            rx="6"
                            fill="#00EDA6"
                          />
                          <path
                            d="M6 13.4539L10.8 18.9724L19.5 8.97006"
                            stroke="#FEFFFF"
                            strokeWidth="4"
                          />
                        </svg>
                      </div>
                      <p>GiveStation Contributor</p>
                    </div>
                    <div className="text-right md:flex-1">
                      <p className="text-lg gradient-text-token">500 GVST</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-4 md:space-x-0">
                    <div className="flex items-center justify-start flex-1 space-x-2 ">
                      <div>
                        <svg
                          width="24"
                          height="28"
                          viewBox="0 0 24 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="24"
                            height="27.7287"
                            rx="6"
                            fill="#C7D2CF"
                          />
                          <path
                            d="M6 13.5178L10.8 19.0635L19.5 9.01184"
                            stroke="#949BAC"
                            strokeWidth="4"
                          />
                        </svg>
                      </div>
                      <p>Grant creators</p>
                    </div>
                    <div className="text-right md:flex-1">
                      <p className="text-lg gradient-text-token">0 GVST</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-4 md:space-x-0">
                    <div className="flex items-center justify-start flex-1 space-x-2 ">
                      <div>
                        <svg
                          width="24"
                          height="28"
                          viewBox="0 0 24 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="24"
                            height="27.7287"
                            rx="6"
                            fill="#C7D2CF"
                          />
                          <path
                            d="M6 13.5178L10.8 19.0635L19.5 9.01184"
                            stroke="#949BAC"
                            strokeWidth="4"
                          />
                        </svg>
                      </div>
                      <p>GiveStationDAO Voter</p>
                    </div>
                    <div className="text-right md:flex-1">
                      <p className="text-lg gradient-text-token">0 GVST</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-4 md:space-x-0">
                    <div className="flex items-center justify-start flex-1 space-x-2 ">
                      <div>
                        <svg
                          width="24"
                          height="28"
                          viewBox="0 0 24 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="24"
                            height="27.7287"
                            rx="6"
                            fill="#C7D2CF"
                          />
                          <path
                            d="M6 13.5178L10.8 19.0635L19.5 9.01184"
                            stroke="#949BAC"
                            strokeWidth="4"
                          />
                        </svg>
                      </div>
                      <p>Multi-sig signers</p>
                    </div>
                    <div className="text-right md:flex-1">
                      <p className="text-lg gradient-text-token">0 GVST</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between space-x-4 md:space-x-0">
                    <div className="flex items-center justify-start flex-1 space-x-2 ">
                      <div>
                        <svg
                          width="24"
                          height="28"
                          viewBox="0 0 24 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            y="0.00244141"
                            width="24"
                            height="27.5926"
                            rx="6"
                            fill="#00EDA6"
                          />
                          <path
                            d="M6 13.4539L10.8 18.9724L19.5 8.97006"
                            stroke="#FEFFFF"
                            strokeWidth="4"
                          />
                        </svg>
                      </div>
                      <p>Donated to GiveStation’s Gitcoin Grant</p>
                    </div>
                    <div className="text-right md:flex-1">
                      <p className="text-lg gradient-text-token">500 GVST</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between space-x-4 md:space-x-0">
                    <div className="flex items-center justify-start flex-1 space-x-2 ">
                      <p>Total</p>
                    </div>
                    <div className="text-right md:flex-1">
                      <p className="text-lg gradient-text-token">1,000 GVST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed top-0 py-4 left-0 bottom-0 right-0 z-50 overflow-auto bg-[#000000CC]">
            <div className="max-w-2xl px-5 mx-auto md:mt-16 lg:px-8 ">
              <div className="bg-[#ffffff] rounded-xl p-4 space-y-4 pb-10">
                <h1 className="mt-6 text-xl font-bold text-center md:text-2xl gradient-text-token">
                  Sorry! You’re not eligible for the airdrop.
                </h1>
                <h2 className="text-[#000000] text-center">
                  Don’t worry! You can earn GVST by funding verified grants on
                  GiveStation.
                </h2>

                <div className="flex items-center justify-center my-4">
                  <button
                    onClick={() => {
                      setShowModal(false);
                    }}
                    className="bg-[#000000]  rounded-lg py-2 px-8 md:px-20"
                  >
                    <span className="text-lg font-semibold gradient-text-token">
                      Fund a grant
                    </span>
                  </button>
                </div>

                <p className="text-[#68778D] text-center max-w-sm mx-auto text-base">
                  See the airdrop breakdown and how you qualified below then
                  claim.
                </p>

                <div className="text-[#68778D] max-w-3xl mx-auto space-y-4">
                  <h2 className="text-lg font-semibold text-center md:text-left md:ml-8">ELIGIBILITY CRITERIA</h2>

                  <div className="space-y-8">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between space-x-4 md:space-x-0">
                        <div className="flex items-center justify-start flex-1 space-x-2 ">
                          <div>
                            <svg
                              width="24"
                              height="28"
                              viewBox="0 0 24 28"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="24"
                                height="27.7287"
                                rx="6"
                                fill="#C7D2CF"
                              />
                              <path
                                d="M6 13.5178L10.8 19.0635L19.5 9.01184"
                                stroke="#949BAC"
                                strokeWidth="4"
                              />
                            </svg>
                          </div>
                          <p>GiveStation Contributor</p>
                        </div>
                        <div className="text-right md:flex-1">
                          <p className="text-lg gradient-text-token">0 GVST</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between space-x-4 md:space-x-0">
                        <div className="flex items-center justify-start flex-1 space-x-2 ">
                          <div>
                            <svg
                              width="24"
                              height="28"
                              viewBox="0 0 24 28"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="24"
                                height="27.7287"
                                rx="6"
                                fill="#C7D2CF"
                              />
                              <path
                                d="M6 13.5178L10.8 19.0635L19.5 9.01184"
                                stroke="#949BAC"
                                strokeWidth="4"
                              />
                            </svg>
                          </div>
                          <p>Grant creators</p>
                        </div>
                        <div className="text-right md:flex-1">
                          <p className="text-lg gradient-text-token">0 GVST</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between space-x-4 md:space-x-0">
                        <div className="flex items-center justify-start flex-1 space-x-2 ">
                          <div>
                            <svg
                              width="24"
                              height="28"
                              viewBox="0 0 24 28"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="24"
                                height="27.7287"
                                rx="6"
                                fill="#C7D2CF"
                              />
                              <path
                                d="M6 13.5178L10.8 19.0635L19.5 9.01184"
                                stroke="#949BAC"
                                strokeWidth="4"
                              />
                            </svg>
                          </div>{" "}
                          <p>GiveStationDAO Voter</p>
                        </div>
                        <div className="text-right md:flex-1">
                          <p className="text-lg gradient-text-token">0 GVST</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between space-x-4 md:space-x-0">
                        <div className="flex items-center justify-start flex-1 space-x-2 ">
                          <div>
                            <svg
                              width="24"
                              height="28"
                              viewBox="0 0 24 28"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="24"
                                height="27.7287"
                                rx="6"
                                fill="#C7D2CF"
                              />
                              <path
                                d="M6 13.5178L10.8 19.0635L19.5 9.01184"
                                stroke="#949BAC"
                                strokeWidth="4"
                              />
                            </svg>
                          </div>
                          <p>Multi-sig signers</p>
                        </div>
                        <div className="text-right md:flex-1">
                          <p className="text-lg gradient-text-token">0 GVST</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between space-x-4 md:space-x-0">
                        <div className="flex items-center justify-start flex-1 space-x-2 ">
                          <div>
                            <svg
                              width="24"
                              height="28"
                              viewBox="0 0 24 28"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                width="24"
                                height="27.7287"
                                rx="6"
                                fill="#C7D2CF"
                              />
                              <path
                                d="M6 13.5178L10.8 19.0635L19.5 9.01184"
                                stroke="#949BAC"
                                strokeWidth="4"
                              />
                            </svg>
                          </div>
                          <p>Donated to GiveStation’s Gitcoin Grant</p>
                        </div>
                        <div className="text-right md:flex-1">
                          <p className="text-lg gradient-text-token">0 GVST</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between space-x-4 md:space-x-0">
                        <div className="flex items-center justify-start flex-1 space-x-2 ">
                          <p>Total</p>
                        </div>
                        <div className="text-right md:flex-1">
                          <p className="text-lg gradient-text-token">0 GVST</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenClaim;
