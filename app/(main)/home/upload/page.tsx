"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";

export default function Upload() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 업로드 API 호출
    await uploadImage(file);
  };

  // 2. 이미지를 백엔드로 전송하는 함수
  const uploadImage = async (file: File) => {
    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      // FormData 생성 (이미지 담기)
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/runnings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("OCR 성공:", data);
        alert("러닝 기록이 등록되었습니다!");
        router.push("/home"); // 성공 시 홈으로 이동
      } else {
        console.error("업로드 실패:", response.status);
        alert("이미지 업로드에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. div 클릭 시 숨겨진 input 클릭 트리거
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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
      <div
        onClick={handleUploadClick}
        className="flex flex-col items-center mt-[48px] mx-[20px] py-12 gap-6 rounded-xl border-2 border-dotted"
      >
        <div className="rounded-full p-3 bg-bg-gray ">
          <Image src="/upload.svg" width="24" height="24" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-lg font-semibold">러닝 기록 업로드</h2>
          <p className="text-base font-medium text-sub-gray">
            러닝 기록이 적힌 캡쳐 이미지를 올려주세요
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*" // 이미지 파일만 선택 가능
          className="hidden"
        />
      </div>

      {/* 업로드 예시 */}
      <div className="flex flex-col items-center rounded-xl bg-bg-gray mx-[20px] mt-[43px] px-[24px] py-[40px] gap-6">
        <div className="relative w-[314px] h-[267px]">
          <Image src="/record.png" fill className="object-cover rounded-xl" />
          {/* 킬로미터 영역 (큰 박스) */}
          <div className="absolute top-[7%] left-[4%] w-[60%] h-[40%] bg-primary-blue/20 rounded-2xl"></div>

          {/* 평균 페이스 영역 (왼쪽 작은 박스) */}
          <div className="absolute top-[50%] left-[4%] w-[25%] h-[20%] bg-primary-blue/20 rounded-xl"></div>

          {/* 시간 영역 (가운데 작은 박스) */}
          <div className="absolute top-[50%] left-[35%] w-[24%] h-[20%] bg-primary-blue/20 rounded-xl"></div>
        </div>
        <p className="text-[15px] font-medium text-sub-gray">
          거리·페이스·시간이 나오도록 캡쳐해주세요.
        </p>
      </div>
    </>
  );
}
