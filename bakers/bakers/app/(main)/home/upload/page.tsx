"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Upload() {
  const router = useRouter();
  return (
    <>
      {/* 상단 */}
      <header className="flex mt-14 px-[18px] pt-[20px] items-center justify-between">
        <button onClick={() => router.back()}>
          <Image src="/x.svg" width="24" height="24" />
        </button>
        <p className="text-xl font-semibold">러닝 기록 등록</p>
        <div className="w-6"></div>
      </header>
      {/* 업로드 안내 */}
      <div className="flex flex-col items-center mt-[48px] mx-[20px] py-12 gap-6 rounded-xl border-2 border-dotted">
        <div className="rounded-full p-3 bg-bg-gray ">
          <Image src="/upload.svg" width="24" height="24" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-lg font-semibold">러닝 기록 업로드</h2>
          <p className="text-base font-medium text-sub-gray">
            러닝 기록이 적힌 캡쳐 이미지를 올려주세요
          </p>
        </div>
      </div>
      {/* 업로드 예시 */}
      <div className="flex flex-col items-center rounded-xl bg-bg-gray mx-[20px] mt-[43px] px-[24px] py-[40px] gap-6">
        <div className="relative w-[314px] h-[267px]">
          <Image src="/record.png" fill className="object-cover rounded-xl" />
          {/* 2. 킬로미터 영역 (큰 박스) */}
          <div className="absolute top-[7%] left-[4%] w-[60%] h-[40%] bg-primary-blue/20 rounded-2xl"></div>

          {/* 3. 평균 페이스 영역 (왼쪽 작은 박스) */}
          <div className="absolute top-[50%] left-[4%] w-[25%] h-[20%] bg-primary-blue/20 rounded-xl"></div>

          {/* 4. 시간 영역 (가운데 작은 박스) */}
          <div className="absolute top-[50%] left-[35%] w-[24%] h-[20%] bg-primary-blue/20 rounded-xl"></div>
        </div>
        <p className="text-[15px] font-medium text-sub-gray">
          거리·페이스·시간이 나오도록 캡쳐해주세요.
        </p>
      </div>
    </>
  );
}
