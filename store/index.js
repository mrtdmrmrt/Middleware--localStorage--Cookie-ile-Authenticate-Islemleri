import Cookie from "js-cookie"
import Vuex from "vuex"
const createStore =()=>{
    return new Vuex.Store({
        state : {
            authKey : null
        },
        mutations : {
            //herhangi bir uzak bağlantı olmadığı için mutations u kullandık
            //mutations la state i güncelledik
            setAuthKey(state,authKey){
                Cookie.set("authKey",authKey)
                state.authKey = authKey

            },
            clearAuthKey(state){
                Cookie.remove("authKey")
                state.authKey = null
            }

        },
        actions : {
            //nuxtServerInit actionsda çalışır
            //context bize uygulamamız hakkında bir çok bilgi verir.
            //nuxtSewrverInit ile cookie okumayı başardık
            nuxtServerInit(vuexContext,context){
                //console.log(context.req.headers.cookie)
                let cookie = context.req.headers.cookie
                //autKey=mert-demir splint("=")[1] yaptık ki autKeyden kurtulalım 
                cookie= cookie.split("=")[1]
                console.log(cookie)
            }
        },
        getters : {
            isAuthenticated(state){
                return state.authKey!==null
            },
            getAuthKey(state){
                return state.authKey
            }
        }
    })
}
export default createStore //yaptık çünkü nuxt bunu kontrol etsin