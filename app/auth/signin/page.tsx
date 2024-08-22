'use client';

import { signIn } from 'next-auth/react';

const SignIn = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signIn('github', { callbackUrl: '/' })}>
        GitHub
      </button>
      <button onClick={() => signIn('kakao', { callbackUrl: '/' })}>
        Kakao
      </button>
    </div>
  );
};

export default SignIn;
