export default {
    login: '/login',
    user: {
        pwdUpdate: '/user/updPassword'
    },
    sys: {
        site: {
            get: '/site/getSiteByWhere',
            update: '/site/updateSiteDetail',
            add: '/site/addSite',
            openSite: '/site/openTheSite',
            closeSite: '/site/closeTheSite',
            equipment: '/equipment/getAll', //获取所有未绑定的设备列表
            getDeviceList: '/equipment/getEquipmentBySiteId', //获取站点的设备列表 需要站点id
            bindEquipment: '/equipment/bindEquipment',//获取站点的设备列表 
            getTag: '/industry/getAll'
        },
        user: {
            get: '/userAdmin/getUsers',
            openUser: 'userAdmin/openTheUser',
            closeUser: 'userAdmin/closeTheUser',
            add: '/userAdmin/addUser',
            update: '/userAdmin/updateUserDetail',
            editpwd: '/userAdmin/randUserPassCode'
        }
    },
    history: {
        day: '/history/queryOneDay',
        details: '/history/queryDetail'
    },
    map: {
        getAll: '/map/getAll',
        getDeviceList: '/map/getEquipmentBySite'
    },
    real: {
        getSiteByCity: '/real/getSiteByCity',
        charsHistiry: '/real/getSiteHistory',
        getHistory: '/real/statisticalSiteHistory',
        getAllUser: '/devOps/getAllDevOpsBySiteID',
        sendMsg: '/real/sendWarningSms',
        getErrorRecord: '/warningRecord/ByName', //获取异常记录
        readOne: '/warningRecord/readOne', //已读id
        readAll: '/warningRecord/readAll', //已读全部
        delOne: '/warningRecord/delOne',
        delAll: '/warningRecord/delAll',
    },
    uploadImg: '/upload/siteImg'
}