import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeForm from "./components/EmployeeForm";
import FileUploader from "./components/FileUploader";
import EmployeeVerify from "./components/EmployeeVerify";
import { Toaster } from "react-hot-toast";
 
function App() {
  return (
    <Router>
  
      <Routes>
        <Route path="/" element={<FileUploader />} />
        <Route path="/verify/:employeeId" element={<EmployeeVerify />} />{" "}
      
      </Routes>
     
    </Router>
  );
}

export default App;
