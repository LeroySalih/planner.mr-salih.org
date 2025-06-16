
export const nextOrderBy = <T extends {order_by : number}>( lst: T[]) : number => {
    if (lst.length == 0 || lst === null)
      return 0;

    return (lst.sort((a, b) => (b.order_by || 0) - (a.order_by || 0))[0].order_by || 0) + 1
}

