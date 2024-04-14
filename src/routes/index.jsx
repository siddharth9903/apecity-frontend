import { useRoutes } from "react-router-dom";
import Main from "../layouts/main";
import Token from "../pages/Token";
const Router = () => {
  return useRoutes([
    {
        path:'/',
        element:<Main />,
        children:[
            {
              index:true,
              element:<Token />
            }
        ]
    }
  ])
}

export default Router;
