import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/logo.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchInput from "./clients/SearchInput";
import LogoutButton from "./clients/LogoutButton";
import { Bell } from "lucide-react";

export default async function Header() {
  async function getAdminInfo() {
    const cookieStore = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/info`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      }
    );
    return res.json();
  }

  const notificationsCount = 4;

  const adminInfo = await getAdminInfo();
  const isLogin = !!adminInfo?._id;

  return (
    <header className="flex flex-wrap md:flex-nowrap h-16 items-center bg-white shadow-md border-2 px-4">
      {/* Logo */}
      <div className="flex items-center justify-center w-1/2 sm:w-1/5 select-none">
        <Link href="/" className="cursor-pointer">
          <Image
            className="h-12 w-12 sm:h-16 sm:w-16 rounded-full"
            src={logo}
            alt="logo"
            width={500}
            height={500}
          />
        </Link>
      </div>

      {/* SearchInput */}
      <div className="hidden md:flex md:flex-1 md:w-1/3 px-4">
        <SearchInput />
      </div>

      {/* Notification and Profile */}
      <div className="flex items-center justify-end w-1/2 sm:w-1/4 gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <Bell size={28} />
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[20px] min-h-[20px] text-center">
              {notificationsCount > 99 ? "99+" : notificationsCount}
            </span>
          )}
        </div>

        {/* Profile or Login */}
        <div>
          {isLogin ? (
            <section className="relative cursor-pointer w-10 h-10 sm:w-12 sm:h-12">
              {adminInfo?.imageUrl && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Image
                      src={adminInfo.imageUrl}
                      alt={`${adminInfo.name}'s profile`}
                      fill
                      className="rounded-full object-cover border border-red-600"
                      sizes="40px"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-9">
                    <DropdownMenuLabel>ADMINISTRATOR ACCOUNT</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>{adminInfo.name}</DropdownMenuItem>
                    <DropdownMenuItem>{adminInfo.email}</DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </section>
          ) : (
            <Link
              href="/auth/admin/login"
              className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg transition-colors duration-200 text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
