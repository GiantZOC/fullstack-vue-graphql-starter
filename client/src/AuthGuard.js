import store from './store';

export default (to, from, next) => {
    //redirect unauthenticated users to signin page
    if(!store.getters.user){
        next({
            path: '/signin'
        })
    } else[
        next()
    ]
}