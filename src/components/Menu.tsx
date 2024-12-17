"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Menu = () => {
  const [userRole, setUserRole] = useState<string>("admin");
  const router = useRouter()

  const baseMenuItems = [
    {
      title: "MENU",
      items: [
        {
          icon: "/home.png",
          label: "Home",
          href: "/",
          visible: ["results_admin", "registration_admin", "admin"],
        },
      ],
    },
    {
      title: "OTHER",
      items: [
        {
          icon: "/profile.png",
          label: "Profile",
          href: "/profile",
          visible: ["results_admin", "registration_admin", "admin"],
        },
        {
          icon: "/logout.png",
          label: "Logout",
          href: "/auth",
          visible: ["results_admin", "registration_admin", "admin"],
        },
      ],
    },
  ];

  const roleSpecificMenuItems = {
    results_admin: [
      {
        icon: "/result.png",
        label: "Short Course Results",
        href: "/list/results/short",
        visible: ["results_admin", "admin"],
      },
      {
        icon: "/result.png",
        label: "Long Course Results",
        href: "/list/results/long",
        visible: ["results_admin", "admin"],
      },
    ],
    registration_admin: [
      {
        icon: "/student.png",
        label: "Short Course Students",
        href: "/list/students/short-course",
        visible: ["registration_admin", "admin"],
      },
      {
        icon: "/student.png",
        label: "Long Course Students",
        href: "/list/students/long-course",
        visible: ["registration_admin", "admin"],
      },
    ],
    admin: [
      {
        icon: "/result.png",
        label: "Short Course Results",
        href: "/list/results/short",
        visible: ["results_admin", "admin"],
      },
      {
        icon: "/result.png",
        label: "Long Course Results",
        href: "/list/results/long",
        visible: ["results_admin", "admin"],
      },
      {
        icon: "/student.png",
        label: "Short Course Students",
        href: "/list/students/short-course",
        visible: ["registration_admin", "admin"],
      },
      {
        icon: "/student.png",
        label: "Long Course Students",
        href: "/list/students/long-course",
        visible: ["registration_admin", "admin"],
      },
    ],
  };

  useEffect(() => {
    const { role } = JSON.parse(localStorage.getItem("nasfa-dbms-admin") || '{}')
    setUserRole(role || "");
    if (!role) {
      toast.error("Unauthenticated");
      router.push("/auth")
    }
  }, [router]);

  const additionalMenuItems =
    roleSpecificMenuItems[userRole as keyof typeof roleSpecificMenuItems] || roleSpecificMenuItems.admin;

  return (
    <div className="mt-4 text-sm">
      {[{ title: "ROLE-SPECIFIC", items: additionalMenuItems }, ...baseMenuItems, ].map((menuSection) => (
        <div className="flex flex-col gap-2" key={menuSection.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">{menuSection.title}</span>
          {menuSection.items.map((item) => {
            if (item.visible.includes(userRole)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  <Image src={item.icon} alt={item.label} width={20} height={20} />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
