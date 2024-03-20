import React from 'react';
import { Toaster } from 'react-hot-toast';
import Footer from './Footer';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div>
      <Header/>
      <Toaster />
      <main className="md:px-20 lg:px-24 xl:px-44 bg-slate-950">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
