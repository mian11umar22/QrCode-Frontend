import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeForm from "./components/EmployeeForm";
import FileUploader from "./components/FileUploader";
import EmployeeVerify from "./components/EmployeeVerify";
import EmployeeList from "./components/EmployeeList";
import MainLayout from "./components/MainLayout";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Routes with header */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<FileUploader />} />
          <Route path="/list" element={<EmployeeList />} />
        </Route>

        {/* Routes without header */}
        <Route path="/verify/:employeeId" element={<EmployeeVerify />} />
      </Routes>
    </Router>
  );
}

export default App;
