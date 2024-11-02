//创建一个路由器，并暴露出去

//1.引入createRouter
import { createRouter,createWebHashHistory} from "vue-router";
//引入一个一个可能要呈现的组件

import Home from "@/view/Home.vue";
import Record from "@/view/Record.vue";
import Check from "@/view/Check.vue";
import Count from "@/view/Count.vue";

//2.创建路由器
const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            component:Home
        },
        {
            path:'/home',
            component:Home,
        },      
        {
            name:'Record',
            path:'/record',
            component:Record
        },
        {
            name:'Check',
            path:'/check',
            component:Check
        },
        {
            name:'Count',
            path:'/count',
            component:Count
        }
    ]
})

//3.暴露路由器
export default router