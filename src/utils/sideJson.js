
export const menus = [
    { id: 1, route: "/home", name: "首页", icon: "sys", disabled: true },
    { id: 2, route: "/map", name: "地图展示", icon: "map" },
    { id: 3, route: "/real-time", name: "实时查询", icon: "real-time" },
    { id: 4, name: "历史查询", icon: "history", },
    { id: 5, pid: 4, route: "/dayHis", name: "按天查询", },
    { id: 6, pid: 4, route: "/mouthHis", name: "按月查询", },
    { id: 7, pid: 4, route: "/yearHis", name: "按年查询", },
    { id: 8, name: "系统管理", icon: "sys", disabled: true },
    { id: 9, pid: 8, route: "/site", name: "站点管理", disabled: true },
    { id: 10, pid: 8, route: "/user", name: "用户管理", disabled: true },
]

export function filterMenus(params) {
    let _menus = JSON.parse(JSON.stringify(params))
    let treeMapList = _menus.reduce((arr, item) => {
        arr[item['id']] = item;
        return arr;
    }, {})
    let result = _menus.reduce((arr, item) => {
        let pid = item.pid;
        item.label = item.name;
        let parent = treeMapList[pid];
        if (parent) {
            parent.children ? parent.children.push(item) : parent.children = [item]
        } else {
            arr.push(item)
        }
        return arr;
    }, [])
    return result;
}

