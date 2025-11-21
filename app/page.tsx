import { redirect } from "next/navigation";

export default async function HomePage() {
  redirect(`/login`);

  return (
    <div>
      <p>이동 중...</p>
    </div>
  );
}
