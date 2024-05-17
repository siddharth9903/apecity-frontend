import { useRoutes } from "react-router-dom";
import Main from "../layouts/main";
import Token from "../pages/Token";
import Explore from "../pages/Explore";
import Create from "../pages/Create";
import ComingSoon from "../pages/ComingSoon";

const Router = () => {
  return useRoutes([
    {
        path:'/',
        element:<Main />,
        children:[
            {
              index:true,
              element:<Explore />
            },
            {
              path:'token',
              element:<Token />
            },
            {
              path:'create',
              element:<Create />
            }
        ]
        // element:<ComingSoon />,
        // children:[
        //     {
        //       index:true,
        //       element:<Token />
        //     },
        //     {
        //       path:'/token1',
        //       element:<Token1 />
        //     }
        // ]
    }
  ])
}

export default Router;
