import { useNavigate } from "react-router-dom";

const Card = ({ imgSrc, desc, title, btnText, heart, camId }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#131420] rounded-3xl sm:rounded-2xl overflow-hidden py-2 px-3 flex flex-col sm:items-center sm:flex-row">
      <img
        className="h-72 sm:w-40 sm:h-auto"
        src={imgSrc}
        alt="spin"
        style={{
          width: "348px",
          height: "200px",
          alignSelf: "center",
        }}
      />
      <div className="sm:mt-0 sm:ml-2 mt-2 text-[#fff] flex-1">
        <h2 className="mb-2 text-base font-semibold text-center sm:text-left">
          {title}
        </h2>
        <div className="flex items-center justify-between">
          <p className="max-w-[185px] text-base font-normal">{desc}</p>
          <div className="flex flex-col items-center">
            {heart ? (
              <img
                className="w-12 mb-2"
                src={`./assets/icons/${heart}.svg`}
                alt="heart"
              />
            ) : (
              <button className="bg-[#52DCF0] mb-2 text-[#000000] font-bold rounded-3xl	 flex items-center overflow-hidden justify-center py-3 px-6">
                {btnText}
              </button>
            )}
            <p className="text-[#B09DFF] text-xs cursor-pointer" onClick={() => navigate(`/campaign/${camId}`)}>view campaign</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
