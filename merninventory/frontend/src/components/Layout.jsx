import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Sidebar />
      <div className="container-fluid">
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;