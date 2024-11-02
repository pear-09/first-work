<template>
    <!-- 导航栏 -->
    <div id="app">
        <div class="UserHeader">
            <div class="logo">
                <!-- PROJECT PARTNER -->
                 Project Partner
            </div>
            <div class="navy">
                <ul>
                    <li><RouterLink to="/shouye" active-class="active">首页</RouterLink></li>
                    <li><RouterLink to="/faxian" active-class="active">发现</RouterLink></li>
                    <li><RouterLink to="/fabu" active-class="active">发布</RouterLink></li>
                    <li><RouterLink to="/liaotian" active-class="active">聊天</RouterLink></li>
                    <li><RouterLink to="/xiangmu" active-class="active">项目</RouterLink></li>
                    <li><RouterLink to="/denglu" active-class="active">登录/注册</RouterLink></li>
                </ul>
            </div>
        </div>
    </div>
     <!-- 展示区 -->
    <RouterView />
</template>

<script>
// eslint-disable-next-line no-unused-vars
// import { RouterView ,RouterLink} from 'vue-router';
export default {
    name:'UserHeader',
}
</script>

<style scoped>

#app .UserHeader{
    width: 100%;
    height: 90px;
    display: flex;
    justify-content: space-between;
    background-color:#f8dd8b;
}

#app .UserHeader .logo{
    width:600px;
    
    height: 100%;
    padding: 0 20px;
    margin-left: 10px;
    color: #0d0c21;
    margin-top: 10px;
    font-size: 28px;
    /* font-weight: 800; */
    /* letter-spacing: 3px; */
    /* font-family: 'Permanent Marker', cursive; */
    font-family: 'Kaushan Script', cursive;
}

#app .UserHeader .navy{
    width: 100%;
    height: 60px;
    display: flex;
    justify-content:flex-end;
    align-items: end;
    margin-top: 10px;
    border-radius: 5px; 
    /* background-color:bisque; */
}

#app .UserHeader .navy ul li{
    display: inline-block;
    /* font-weight:500; */
    margin-right: 50px;
}

#app .UserHeader .navy ul li a{
    position: relative;
    font-size: 18px;
    color: #0d0c21;
    z-index: 2;
}

#app .UserHeader .navy a::after{
    content: ' ';
    position: absolute;
    top: 100%;
    left: 50%;
    width: 120%;
    height: 80%;
    padding: 11px 15px;
    border-radius: 50px;
    background-color:#0d0c21;
    transform: translate(-50%,-50%);
    z-index: -1;
    opacity: 0;
}

#app .UserHeader .navy a.active::after{
    top:50%;
    opacity: 1;
}

#app .UserHeader .navy a.active{
    color: #fff;
}

#app .UserHeader .navy li a:hover{
    color: #fff;
}


#app .UserHeader .navy li a:hover::after{
    top:50%;
    opacity: 1;
    transition: all .4s;
}
</style>