import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";

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
      `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/admin/info`,
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
    <header className="flex h-16 items-center bg-white shadow-md border-2">
      <div className="flex w-[25%] justify-center items-center">
        <span className="text-xl font-bold">GloryClothing</span>
      </div>

      <div className="flex-1 w-[30%]">
        <SearchInput />
      </div>

      <div className="flex justify-around w-[20%] items-center">
        <div className="relative cursor-pointer">
          <Bell size={30} />

          {/* Notification Badge */}
          {notificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {notificationsCount > 99 ? "99+" : notificationsCount}
            </span>
          )}
        </div>
        <div>
          {isLogin ? (
            <section className="">
              {adminInfo?.imageUrl && (
                <div className="relative cursor-pointer w-12 h-12">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="cursor-pointer">
                      <Image
                        src={adminInfo.imageUrl}
                        alt={`${adminInfo.name}'s profile`}
                        fill
                        className="h-14 w-14 rounded-full object-cover border border-red-600"
                        sizes={100}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mt-9 ">
                      <DropdownMenuLabel>
                        ADMINISTRATOR ACCOUNT
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={`cursor-pointer`}>
                        {adminInfo.name}
                      </DropdownMenuItem>
                      <DropdownMenuItem className={`cursor-pointer`}>
                        {adminInfo.email}
                      </DropdownMenuItem>
                      <DropdownMenuItem className={`cursor-pointer`}>
                        <LogoutButton />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </section>
          ) : (
            <Link
              href="/auth/admin/login"
              className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
