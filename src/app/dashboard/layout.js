import MainSideBar from "@/components/dashboardlayout/MainSideBar";
import { Toaster } from "sonner";

export default function DashboardLayout({ children }) {
  return (
    <section>
      <MainSideBar>{children}</MainSideBar>
      <Toaster position="top-right" richColors={true} closeButton={true} />
    </section>
  );
}
