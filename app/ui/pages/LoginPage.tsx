'use client'

import React from 'react';
import { Suspense, useEffect, useState } from 'react';
import LoginForm from '../components/login/LoginForm';
import DogIcon from '../components/icons/DogIcon';

const LoginPage = () => {
  const [loaded, setLoaded] = useState<boolean>(false);

  //Loaded state happens when the page mounts, not when the component mounts
  // allowing for css animations to activate
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="login page-root">
      <div className={`container ${loaded ? 'loaded' : ''}`}>
        <h1>Dog Match</h1>
        <DogIcon />
        <h3>Please login</h3>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div >
  );
};

export default LoginPage;
