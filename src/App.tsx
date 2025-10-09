import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NavigationMenuDemo from "./Layouts/Navbar";
import DocumentUpload from "./Layouts/FileUpload";
import { ChartLineInteractive } from "./Layouts/Chart";
import AnalyseCard from "./Layouts/AnalyseGreetCard";
import AskaiCard from "./Layouts/AskaiCard";
import Lot from "./Layouts/test";

export default function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <NavigationMenuDemo />
        </header>

        <div className="w-full max-w-full overflow-x-hidden overflow-y-auto p-3">
          <div className="flex flex-col gap-3">
            {/* First row: Two cards side by side on md+ screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
              <div className="w-full">
                <DocumentUpload />
              </div>
              <div className="w-full">
                <ChartLineInteractive />
                {/* <WelcomeCard /> */}
              </div>
            </div>

            {/* Second row: Single full-width card */}
            <div className="grid grid-col gap-6 w-full">
              <AnalyseCard />
              <AskaiCard />
              <Lot />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
