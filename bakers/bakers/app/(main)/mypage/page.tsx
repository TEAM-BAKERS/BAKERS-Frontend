"use client";
import Image from "next/image";

export default function MyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F7F8] pb-24">
      {/* 상단 파란색 영역 */}
      <div className="bg-primary-blue px-6 pb-10 pt-16">
        {/* 제목, 설정 */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">마이페이지</h1>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/30 text-white transition hover:bg-white/40">
            <Image src="/setting.svg" width="24" height="24" />
          </button>
        </div>

        {/* 프로필 카드 */}
        <div className="w-full rounded-3xl bg-white/20 p-6 text-white backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/30">
                <Image src="/profile.svg" width="48" height="48" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">김우주</h2>
                <p className="text-sm font-medium text-blue-100">
                  가입일 : 2025.09.24
                </p>
              </div>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/30 transition hover:bg-white/40">
              <Image src="/edit.svg" width="24" height="24" />
            </button>
          </div>

          {/* 구분선 */}
          <div className="mb-6 h-px w-full bg-white/50"></div>

          <div className="grid grid-cols-3 text-center">
            {/* 거리 */}
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold">245.8</span>
              <span className="text-sm font-normal text-blue-100">거리</span>
            </div>
            {/* 러닝 수 */}
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold">42</span>
              <span className="text-sm font-normal text-blue-100">러닝 수</span>
            </div>
            {/* 페이스 */}
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-bold">7'30"</span>
              <span className="text-sm font-normal text-blue-100">페이스</span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 흰색 영역 */}
      <div className="flex-1 px-6 pt-8">
        <h3 className="mb-4 text-[17px]] font-semibold text-gray-900">활동</h3>

        <div className="flex flex-col gap-4">
          {/* 메뉴 1: 나의 러닝 기록 */}
          <div className="flex items-center justify-between rounded-xl bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EBF6FF]">
                <Image src="/act1.svg" width="24" height="24" />
              </div>
              <span className="text-base font-semibold">나의 러닝 기록</span>
            </div>
            <Image src="/go.svg" width="24" height="24" />
          </div>

          {/* 메뉴 2: 나의 챌린지 */}
          <div className="flex items-center justify-between rounded-xl bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FDEEEE]">
                <Image src="/act2.svg" width="24" height="24" />
              </div>
              <span className="text-base font-semibold">나의 챌린지</span>
            </div>
            <Image src="/go.svg" width="24" height="24" />
          </div>

          {/* 메뉴 3: 월간 리포트 */}
          <div className="flex items-center justify-between rounded-xl bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2F8ED]">
                <Image src="/act3.svg" width="24" height="24" />
              </div>
              <span className="text-base font-semibold">월간 리포트</span>
            </div>
            <Image src="/go.svg" width="24" height="24" />
          </div>
        </div>
      </div>
    </div>
  );
}
