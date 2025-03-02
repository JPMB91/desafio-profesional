import "./App.css";
import { AuthProvider } from "./context/Auth.Context";
import { DesktopProvider } from "./context/Desktop.Context";
import { Layout } from "./Layouts/Layout";

function App() {
  return (
    <>
      <AuthProvider>
        <DesktopProvider>
          <Layout />
        </DesktopProvider>
      </AuthProvider>
    </>
  );
}

export default App;
