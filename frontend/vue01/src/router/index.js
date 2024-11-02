//创建一个路由器，并暴露出去

//1.引入createRouter
import { createRouter,createWebHashHistory} from "vue-router";
//引入一个一个可能要呈现的组件


import ShouYe from "@/view/ShouYe.vue";
import ChaKan from "@/view/ChaKan.vue";
import TongJi from "@/view/TongJi.vue";
import JiLu from "@/view/JiLu.vue";

//2.创建路由器
const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            component:ShouYe
        },
        {
            path:'/shouye',
            component:ShouYe,
        },      
        {
            name:'JiLU',
            path:'/jilu',
            component:JiLu
        },
        {
            name:'ChaKan',
            path:'/chakan',
            component:ChaKan
        },
        {
            name:'TongJi',
            path:'/tongji',
            component:TongJi
        }
    ]
})

//3.暴露路由器
export default router