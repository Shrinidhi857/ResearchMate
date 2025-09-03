import { AppSidebar } from "./Layouts/app-sidebar";
import NavigationMenuDemo from "./Layouts/Navbar";
function App() {
  return (
    <div className=" flex-row items-start">
      <NavigationMenuDemo />
      <AppSidebar />
    </div>
  );
}

export default App;
