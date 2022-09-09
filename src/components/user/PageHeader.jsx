const PageHeader = ({ heading = "" }) => {
  return (
    <div className="flex flex-col md:flex-row items-center space-y-3 md:space-x-8 ">
      <h1 className="text-[#0F172A] dark:text-[#fff] font-bold text-3xl">
        {heading}
      </h1>
      <p className=" bg-[#1C1924] py-1 px-4 sm:px-8 mx-4 md:px-14 rounded-full ">
        <div className="gradient-text  font-bold text-base">
          0xdeswqes35derihi87987gjhge
        </div>
      </p>
    </div>
  );
};

export default PageHeader;
