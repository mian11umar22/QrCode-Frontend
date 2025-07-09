import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeForm from "./components/EmployeeForm";
import FileUploader from "./components/FileUploader";
import EmployeeVerify from "./components/EmployeeVerify";
import { Toaster } from "react-hot-toast";
import EmployeeList from "./components/EmployeeList";
import Header from "./components/Header";
 
function App() {
  return (
    <Router>
  <Header/>
      <Routes>
        <Route path="/" element={<FileUploader />} />
        <Route path="/verify/:employeeId" element={<EmployeeVerify />} />{" "}
      <Route path="/list" element={<EmployeeList/>}/>
      </Routes>
     
    </Router>
  );
}

export default App;
