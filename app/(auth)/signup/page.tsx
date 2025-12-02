"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });
  const handleSignup = () => {
    alert("가입이 완료되었습니다!");
    router.push("/home");
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 pb-6 pt-14">
      {/* 상단 네비게이션 */}
      <header className="relative mb-8 flex items-center justify-center py-4">
        <button
          onClick={() => router.back()}
          className="absolute left-0 text-gray-900"
        >
          <Image src="/back.svg" alt="go back" width={24} height={24} />
        </button>
        <h1 className="text-xl font-semibold">회원가입</h1>
      </header>

      {/* 메인 타이틀 */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold leading-tight text-gray-800">
          Run Duel에
          <br />
          오신 것을 환영합니다!
        </h2>
      </div>

      {/* 입력 폼 영역 */}
      <div className="flex flex-1 flex-col gap-8">
        {/* 이름 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">이름</label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            className="w-full rounded-xl bg-bg-gray px-4 py-3 text-base placeholder:text-sub-gray"
          />
        </div>

        {/* 이메일주소 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">이메일 주소</label>
          <input
            type="text"
            placeholder="이메일 주소를 입력하세요"
            className="w-full rounded-xl bg-bg-gray px-4 py-3 text-base placeholder:text-sub-gray"
          />
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요 (6자 이상)"
            className="w-full rounded-xl bg-bg-gray px-4 py-3 text-base placeholder:text-sub-gray"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            className="w-full rounded-xl bg-bg-gray px-4 py-3 text-base placeholder:text-sub-gray"
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="mb-16">
        <button
          onClick={handleSignup}
          className="w-full rounded-xl bg-[#80B2FF] py-3 text-base font-semibold text-white"
        >
          다음
        </button>
      </div>
    </div>
  );
}
