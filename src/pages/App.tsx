import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NavigationBar from "../Layouts/Navbar";
import DocumentUpload from "../Layouts/FileUpload";
import { ChartLineInteractive } from "../Layouts/Chart";
/* import ResponseHistory from "../Layouts/ResponseHistory"; */
/* import AskaiCard from "../Layouts/AskaiCard";
import AnalyseAnimation from "../animation/Analyse"; */
import ProjectsCard from "../Layouts/RecentProjects";
import HorizontalRoundedCard from "../Layouts/HorizontalCard";

export default function App() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <NavigationBar />
          </header>

          <div className="w-full max-w-full overflow-x-hidden overflow-y-auto p-3">
            <div className="flex flex-col gap-3">
              <div className="relative text-center  z-10">
                <h1 className="text-3xl md:text-3xl font-bold text-foreground mb-4">
                  What are you researching?
                </h1>
              </div>
              <div className="grid grid-col gap-6 w-full">
                <HorizontalRoundedCard />
              </div>
              <div className="grid grid-col gap-6 w-full">
                <ProjectsCard />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                <div className="w-full">
                  <DocumentUpload />
                </div>
                <div className="w-full">
                  <ChartLineInteractive />
                </div>
              </div>
              <div className="grid grid-col gap-6 w-full">
                {/* <ResponseHistory /> */}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
