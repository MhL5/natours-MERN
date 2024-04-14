import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import TourOverview from "./pages/TourOverview";
import Login from "./pages/Login";
import AuthProvider from "./contexts/AuthContext";
import NotFound from "./pages/NotFound";
import Me from "./pages/Me";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MyBookings from "./pages/MyBookings";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />}>
      <Route path="/notfound" element={<NotFound />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/tour/:tourId" element={<TourOverview />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<h1>not implemented</h1>} />
      <Route path="/me" element={<Me />} />
      <Route path="/my-tours" element={<MyBookings />} />
      <Route path="*" element={<h1>not FOUND 404</h1>} />
    </Route>
  )
);
const queryClient = new QueryClient();
function App() {
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default App;
