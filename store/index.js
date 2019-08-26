import Cookie from "js-cookie"
import Vuex from "vuex"
import axios from "axios"
const createStore =()=>{
    return new Vuex.Store({
        state : {
            authKey : null
        },
        mutations : {
            //herhangi bir uzak bağlantı olmadığı için mutations u kullandık
            //mutations la state i güncelledik
            setAuthKey(state,authKey){
                
                state.authKey = authKey

            },
            clearAuthKey(state){
                Cookie.remove("authKey")
                Cookie.remove("expiresIn")
                if(process.client){
                    localStorage.removeItem("authKey")
                    localStorage.removeItem("expiresIn")
                }

                
                state.authKey = null

            }

        },
        actions : {
            //nuxtServerInit actionsda çalışır
            //context bize uygulamamız hakkında bir çok bilgi verir.
            //nuxtSewrverInit ile cookie okumayı başardık
            nuxtServerInit(vuexContext,context){
                //console.log(context.req.headers.cookie)
                // let cookie = context.req.headers.cookie
                // if(cookie){
                //     //autKey=mert-demir splint("=")[1] yaptık ki autKeyden kurtulalım 
                //     cookie= cookie.split("=")[1]
                //     console.log(cookie)
                // }
                
                
            },
            initAuth(vuexContext,req){
                let token;
                let expiresIn;
                if(req)
                {
                    //server tarafında çalışıyoruz
                    if(!req.headers.cookie)
                    {
                        return;
                    }
                    //Cookie token üzerinden elde etmek
                    token = req.headers.cookie.split(";").find(c => c.trim().startsWith("authKey="))
                    if(token){
                        token= token.split("=")[1]
                        
                    }
                    expiresIn = req.headers.cookie.split(";").find(e => e.trim().startsWith("expiresIn="))
                    if(expiresIn){
                        expiresIn= expiresIn.split("=")[1]
                        
                    }
                }
                else{
                    //client üzerinde çalışıyoruz
                    token = localStorage.getItem("authKey")
                    expiresIn = localStorage.getItem("expiresIn")
                    
                }
                if(new Date().getTime() > +expiresIn || !token)
                {
                    vuexContext.commit("clearAuthKey")
                }
                vuexContext.commit("setAuthKey",token)
            },
            authUser (vuexContext,authData){
                let authLink = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
                if(authData.isUser)
                {
                    authLink= "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
                }

                return axios.post(authLink + process.env.firebaseAPIKEY,
                {email : authData.user.email , password : authData.user.password, returnSecureToken : true})
                .then(response=>{
                //this.$store.dispatch("login","response.data.idToken")
                //this.$router.push("/") //index sayfasına aldık
                //console.log(response)

                    let expiresIn = new Date().getTime() + +response.data.expiresIn *1000 //response.data.expiresIn --> 3600 sn (+reponse)burda integer a dönüştürme kısayolu
                    //let expiresIn = new Date().getTime() + 5000 //test etmek için 5000 sn verdik
                    



                
                    Cookie.set("authKey",response.data.idToken)
                    Cookie.set("expiresIn",expiresIn)
                    localStorage.setItem("authKey",response.data.idToken)
                    localStorage.setItem("expiresIn",expiresIn)
                    vuexContext.commit("setAuthKey",response.data.idToken)
                })



                
            },
            logout(vuexContext){
                vuexContext.commit("clearAuthKey")
            }
        },
        getters : {
            isAuthenticated(state){
                return state.authKey != null
            },
            getAuthKey(state){
                return state.authKey
            }
        }
    })
}
export default createStore //yaptık çünkü nuxt bunu kontrol etsin