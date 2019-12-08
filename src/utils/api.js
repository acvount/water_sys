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
            equipment: '/equipment/getAll'
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
    history:{
        day:'/history/queryOneDay'
    }
}