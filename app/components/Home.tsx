'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { deleteUser } from '@/app/actions/user';
import LoadingSpinner from './LoadingSpinner';
import SignIn from './SignIn';
import ConfirmModal from './ConfirmModal';

const Home = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [signLoading, setSignLoading] = useState(false);

  const handleLogout = () => {
    signOut();
  };

  const handleWithdrawal = async () => {
    try {
      await deleteUser();
      signOut();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleWrite = () => {
    router.push('/diary');
  };

  if (status === 'loading' || signLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col items-center justify-start select-none">
      <h1 className="text-2xl font-bold mt-10 mb-6">
        {session ? `${session.user?.name}님, 환영합니다!` : '환영합니다!'}
      </h1>
      {session?.user?.image && (
        <div className="mb-6">
          <Image
            src={session.user.image}
            alt={`${session.user.name}'s profile`}
            width={50}
            height={50}
            sizes="50px"
            priority={true}
            className="rounded-full"
          />
        </div>
      )}
      {!session && <SignIn setSignLoading={setSignLoading} />}
      <div className="space-x-4 mb-6">
        {session &&
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          로그아웃
        </button>}
        {session && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            회원 탈퇴
          </button>
        )}
      </div>
      <div>
        {session && (
          <button
            onClick={handleWrite}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            일기 목록
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleWithdrawal}
        title="정말 회원 탈퇴를 하시겠습니까?"
        message="이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?"
        confirmLabel="회원 탈퇴"
      />
    </div>
  );
};

export default Home;
