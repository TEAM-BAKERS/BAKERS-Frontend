"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        console.log("로그인 성공 응답:", data);

        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        alert("로그인되었습니다!");
        router.push("/home");
      } else {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("로그인 통신 에러:", error);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#3385FF] px-6 pb-10 pt-20">
      {/* 로고 영역 */}
      <div className="flex flex-1 flex-col items-center justify-center pb-20">
        <h1 className="text-[56px] font-bagel tracking-tight text-white">
          Run Duel
        </h1>
        <p className="mt-3 text-xl font-semibold text-white/90">
          다 함께, 더 멀리
        </p>
      </div>

      {/* 로그인 폼 카드 영역 */}
      <div className="w-full rounded-[16px] bg-white p-8 mb-14">
        <div className="flex flex-col gap-5">
          {/* 이메일 입력 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              아이디
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="w-full rounded-xl bg-bg-gray px-4 py-3 placeholder:text-sub-gray"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full rounded-xl bg-bg-gray px-4 py-3 placeholder:text-sub-gray"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            onClick={handleLogin}
            className="mt-4 w-full rounded-xl bg-primary-blue py-4 text-base font-semibold text-white"
          >
            로그인
          </button>
        </div>
      </div>

      {/* 회원가입 링크 */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 text-base font-medium">
        <span className="text-white">계정이 없으신가요?</span>
        <Link
          href="/signup"
          className="font-semibold text-white underline underline-offset-4"
        >
          회원가입하기
        </Link>
      </div>
    </div>
  );
}
