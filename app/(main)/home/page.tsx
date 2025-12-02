"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-[430px] bg-white min-h-screen relative flex flex-col pb-24 shadow-2xl overflow-hidden">
        {/* 1. 상단 헤더 배경 (그라데이션) */}
        <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-primary-blue from-0% to-transparent pointer-events-none z-0" />

        {/* 2. 헤더 내용 */}
        <header className="relative z-10 px-6 pt-12 pb-4 flex justify-between items-center">
          <p className="text-[32px] font-bagel text-brand-blue">Run Duel</p>

          <div className="relative w-20 h-20">
            <Image
              src="/bluedragon.png"
              alt="Character"
              fill
              className="object-contain"
            />
          </div>
        </header>

        {/* 메인 스크롤 영역 */}
        <main className="relative z-10 flex flex-col gap-6 px-5 ">
          {/* 3. 오늘의 러닝 (Today Run) */}
          <section>
            <h2 className="text-base font-semibold leading-normal tracking-[0.091px] mb-3 pl-1">
              오늘의 러닝
            </h2>
            <div className="bg-bg-gray rounded-[12px] px-1 py-6 shadow-sm border border-gray-50 flex justify-between items-center w-full">
              <div className="flex-1 flex flex-col items-center gap-2">
                <span className="text-2xl font-bold text-black text-center tracking-[-0.552px] [font-feature-settings: 'ss10']">
                  5.24
                </span>
                <span className="text-sm text-sub-gray mt-1 font-medium">
                  거리
                </span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <span className="text-2xl font-bold text-black text-center tracking-[-0.552px] [font-feature-settings: 'ss10']">
                  39:12
                </span>
                <span className="text-sm text-sub-gray mt-1 font-medium">
                  시간
                </span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <span className="text-2xl font-bold text-black text-center tracking-[-0.552px] [font-feature-settings: 'ss10']">
                  7&rsquo;30&rdquo;
                </span>
                <span className="text-sm text-sub-gray mt-1 font-medium">
                  페이스
                </span>
              </div>
            </div>
          </section>

          {/* 4. 이번 달 배틀리그 */}
          <section>
            <div className="flex justify-between items-center mb-3 pl-1 pr-1">
              <h2 className="text-base font-semibold leading-normal tracking-[0.091px] mb-3 pl-1">
                이번 달 배틀 리그 <span className="text-lg">🔥</span>
              </h2>
              <button
                onClick={() => router.push("/home/battle-league")}
                className="text-sm font-medium text-primary-blue text-center leading-[142.9%] tracking-[0.203px] [font-feature-settings: 'ss10']"
              >
                더보기
              </button>
            </div>

            <div className="bg-bg-gray rounded-[12px] p-7 shadow-sm">
              <div className="flex justify-between items-end mb-6 px-4">
                {/* 우리팀 */}
                <div className="text-center">
                  <p className="text-[32px] font-kbl text-brand-blue">Run</p>
                  <div className="text-2xl font-bold text-gray-800">
                    24
                    <span className="text-sm font-normal ml-1">km</span>
                  </div>
                </div>
                <div className="text-[rgba(46,47,51,0.88)] font-bagel text-2xl mb-3">
                  vs
                </div>
                {/* 상대팀 */}
                <div className="text-center">
                  <p className="text-[32px] font-kbl text-brand-red">Duel</p>
                  <div className="text-2xl font-bold text-gray-800">
                    27
                    <span className="text-sm font-normal ml-1">km</span>
                  </div>
                </div>
              </div>

              {/* 프로그레스 바 */}
              <div className="w-full h-4 bg-white rounded-full overflow-hidden flex shadow-inner">
                <div className="h-full bg-brand-blue w-[45%] rounded-l-full" />{" "}
                {/* Run 비율 */}
                <div className="h-full bg-brand-red flex-1 rounded-r-full" />{" "}
                {/* Duel 비율 */}
              </div>

              {/* 하단 텍스트 */}
              <div className="text-center text-sub-gray text-xs font-medium mt-4">
                11월 대전 챌린지 · D-20
              </div>
            </div>
          </section>

          {/* 5. 그룹 활동 (Group Activity) */}
          <section>
            <div className="flex justify-between items-center mb-3 pl-1 pr-1">
              <h2 className="text-base font-semibold leading-normal tracking-[0.091px] mb-3 pl-1">
                그룹 활동
              </h2>
              <button className="text-sm font-medium text-primary-blue text-center leading-[142.9%] tracking-[0.203px] [font-feature-settings: 'ss10']">
                전체보기
              </button>
            </div>

            {/* 리스트 아이템 1 */}
            <div className="bg-bg-gray rounded-xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-50 flex gap-4 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                {/* 프로필 이미지 자리 */}
                {/* <Image src="..." /> */}
                <Image
                  src="/profile.png"
                  alt="profile image"
                  height={56}
                  width={56}
                />
                <div className="w-full h-full bg-gray-300" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[15px]">이세빈</h3>
                    <p className="text-sub-gray text-xs mt-0.5">
                      새로운 기록을 공유했어요
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-sub-gray font-medium">
                  <span className="flex items-center gap-1">📍 5.2km</span>
                  <span className="flex items-center gap-1">⏱️ 39분</span>
                  <span className="flex items-center gap-1">
                    ⚡ 7&rsquo;30&rdquo;
                  </span>
                </div>
              </div>
            </div>

            {/* 리스트 아이템 2 (잘린 모습 표현을 위해 추가) */}
            <div className="bg-bg-gray rounded-xl p-5 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-50 flex gap-4 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                {/* 프로필 이미지 자리 */}
                {/* <Image src="..." /> */}
                <Image
                  src="/profile.png"
                  alt="profile image"
                  height={56}
                  width={56}
                />
                <div className="w-full h-full bg-gray-300" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[15px]">이세빈</h3>
                    <p className="text-sub-gray text-xs mt-0.5">
                      새로운 기록을 공유했어요
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-sub-gray font-medium">
                  <span className="flex items-center gap-1">📍 5.2km</span>
                  <span className="flex items-center gap-1">⏱️ 39분</span>
                  <span className="flex items-center gap-1">
                    ⚡ 7&rsquo;30&rdquo;
                  </span>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* 6. Floating Action Button (+) */}
        <button
          onClick={() => router.push("/home/upload")}
          className="fixed bottom-24 right-5 w-14 h-14 bg-primary-blue rounded-[20px] shadow-lg shadow-blue-500/30 flex items-center justify-center z-20 active:scale-95 transition-transform"
        >
          <Image src="/plus.svg" width="24" height="24" />
        </button>
      </div>
    </div>
  );
}
