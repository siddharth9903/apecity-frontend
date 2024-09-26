import { useRoutes } from "react-router-dom";
import Main from "../layouts/main";
import Token from "../pages/Token";
import Explore from "../pages/Explore";
import Create from "../pages/Create";
// import BondingCurveSubscription from "../components/BondingCurveSubscription";

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
              path:'token/:chainId/:tokenAddress',
              element:<Token />
            },
            {
              path:'create',
              element:<Create />
            },
        ]
    }
  ])
}

export default Router;
