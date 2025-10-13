import MainSideBar from "@/components/dashboardlayout/MainSideBar";
import { ToastContainer } from "react-toastify";

export default function DashboardLayout({ children }) {
  return (
    <section>
      <MainSideBar>{children}</MainSideBar>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      
      />
    </section>
  );
}
