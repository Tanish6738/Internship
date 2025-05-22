import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="page-transition w-full overflow-x-hidden min-h-screen max-h-screen overflow-y-auto">
      <div className="max-w-screen-2xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
