"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  if (pathname === "/home/upload") {
    return null;
  }

  const navLinks = [
    {
      label: "홈",
      href: "/home",
      icon: "/NavIcons/home.svg",
      activeIcon: "/NavIcons/home-blue.svg",
    },
    {
      label: "러닝",
      href: "/running",
      icon: "/NavIcons/running.svg",
      activeIcon: "/NavIcons/running-blue.svg",
    },
    {
      label: "그룹",
      href: "/group",
      icon: "/NavIcons/group.svg",
      activeIcon: "/NavIcons/group-blue.svg",
    },
    {
      label: "챌린지",
      href: "/challenge",
      icon: "/NavIcons/challenge.svg",
      activeIcon: "/NavIcons/challenge-blue.svg",
    },
    {
      label: "마이페이지",
      href: "/mypage",
      icon: "/NavIcons/mypage.svg",
      activeIcon: "/NavIcons/mypage-blue.svg",
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white flex justify-around z-50 border">
      {navLinks.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center h-16"
          >
            <Image
              src={isActive ? item.activeIcon : item.icon}
              alt={item.label}
              width={24}
              height={24}
            />
            <span className="font-xs text-sub-gray">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
