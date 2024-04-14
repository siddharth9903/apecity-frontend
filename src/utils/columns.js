const orderCoulumns = [
  {
    name: "rank",
  },
  {
    name: "maker",
  },
  {
    name: "bought",
  },
  {
    name: "sold",
  },
  {
    name: "pnl",
  },
  {
    name: "UNREALIZED",
  },
  {
    name: "BALANCE",
  },
  {
    name: "TXNS",
  },
  {
    name: "exp",
  },
];
const holderColumns=[
    {
        name:'address'
    },
    {
        name:'%'
    },
    {
        name:'amount',
        width:30
    },
    {
        name:'value'
    },
    {
        name:'txns'
    },
    {
        name:'exp'
    }
]
const providersColumns=[
    {
        name:'address'
    },
    {
        name:'%'
    },
    {
        name:'amount',
        width:30
    },
    {
        name:'txns'
    },
    {
        name:'exp'
    }
]
export { holderColumns,orderCoulumns,providersColumns };
