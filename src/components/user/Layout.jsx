import { useState } from "react";
import Header from "./Header";
import Sidebar1 from "./Sidebar1";

const Layout = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <div className="font-Jura ">
      <Sidebar1
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
      />
      <div className=" lg:ml-72	lg:main">
        <Header
          setIsSideBarOpen={setIsSideBarOpen}
          isSideBarOpen={isSideBarOpen}
        />
        <div className="px-5 lg:px-8 mt-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
