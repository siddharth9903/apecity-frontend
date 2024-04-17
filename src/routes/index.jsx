import { useRoutes } from "react-router-dom";
import Main from "../layouts/main";
import Token from "../pages/Token";
import Token1 from "../pages/Token1";
import ComingSoon from "../pages/ComingSoon";

const Router = () => {
  return useRoutes([
    {
        path:'/',
        element:<ComingSoon />,
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
