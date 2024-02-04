import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { Post } from "./pages/Post";

export const router = createBrowserRouter(
   [
      {
         path: "/",
         element: <Home />,
      },
      {
         path: "/:id",
         element: <Post />,
      },
    ]
 );