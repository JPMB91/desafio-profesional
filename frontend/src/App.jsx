import "./App.css";
import { DesktopProvider } from "./context/Desktop.context";
import { Layout } from "./Layouts/Layout";

function App() {
  return (
    <>
      <DesktopProvider>
        <Layout />
      </DesktopProvider>
    </>
  );
}

export default App;
