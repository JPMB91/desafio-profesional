import "./App.css";
import { AuthProvider } from "./context/Auth.Context";
import { DesktopProvider } from "./context/Desktop.Context";
import { FavoriteProvider } from "./context/Favorite.Context";
import { Layout } from "./Layouts/Layout";

function App() {
  return (
    <>
      <AuthProvider>
        <FavoriteProvider >
          <DesktopProvider>
            <Layout />
          </DesktopProvider>
        </FavoriteProvider>
      </AuthProvider>
    </>
  );
}

export default App;
