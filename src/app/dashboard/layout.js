import MainSideBar from "@/components/dashboardlayout/MainSideBar";

export default function DashboardLayout({ children }) {
  return (
    <section>
      <MainSideBar>{children}</MainSideBar>
    </section>
  );
}
