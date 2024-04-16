import { useRoutes } from "react-router-dom";
import Main from "../layouts/main";
import Token from "../pages/Token";
import Token1 from "../pages/Token1";
const Router = () => {
  return useRoutes([
    {
        path:'/',
        element:<Main />,
        children:[
            {
              index:true,
              element:<Token />
            },
            {
              path:'/token1',
              element:<Token1 />
            }
        ]
    }
  ])
}

export default Router;
