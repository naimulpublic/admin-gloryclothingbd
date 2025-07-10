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
import RoutePath from "./clients/RoutePath";
import SearchInput from "./clients/SearchInput";
import LogoutButton from "./clients/LogoutButton";

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

  const adminInfo = await getAdminInfo();
  const isLogin = !!adminInfo?._id;

  return (
    <header className="w-full h-16 shadow-sm px-4 flex items-center justify-between gap-4 bg-bgheader text-textheader">
      <div className="flex w-[30%]">
        <RoutePath />
      </div>

      <div className="flex-1 w-[35%]">
        <SearchInput />
      </div>

      <div className="flex justify-center w-[10%]">
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
                      className="h-14 w-14 rounded-full object-cover border border-white"
                      sizes={100}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-9 ">
                    <DropdownMenuLabel>ADMINISTRATOR ACCOUNT</DropdownMenuLabel>
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
    </header>
  );
}
