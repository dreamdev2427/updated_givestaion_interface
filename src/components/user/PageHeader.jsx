import { useSelector } from "react-redux";

const PageHeader = ({ heading = "" }) => {
  const account = useSelector(state => state.auth.currentWallet);

  return (
    <div className="flex flex-col items-center space-y-3 md:flex-row md:space-x-8 ">
      <h1 className="text-[#0F172A] dark:text-[#fff] font-bold text-3xl">
        {heading}
      </h1>
      <div className=" bg-[#1C1924] py-1 px-4 sm:px-8 mx-4 md:px-14 rounded-full ">
        <div className="text-base font-bold gradient-text">
        {account && <h2>{account.toString().substring(0, 8)+"..."+account.toString().substring(36, 42)}</h2>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
