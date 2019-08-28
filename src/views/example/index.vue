<template>
    <div class="content clearfix">
        <div style="float: left; width: 200px;">
            <h4>PC端组件列表</h4>
            <ul>
                <li v-for="(item, index) in pcLinkList" :key="index" @click="linkTo(item.pathName)">{{item.name}}</li>
            </ul>
        </div>
        <div style="float: left; width: 200px;">
            <h4>移动端组件列表</h4>
            <ul>
                <li v-for="(item, index) in mobileLinkList" :key="index" @click="linkTo(item.pathName)">{{item.name}}</li>
            </ul>
        </div>
        <div style="float: left; width: 200px;">
            <h4>测试组件列表</h4>
            <ul>
                <li v-for="(item, index) in testLinkList" :key="index" @click="linkTo(item.pathName)">{{item.name}}</li>
            </ul>
        </div>
    </div>  
</template>

<script>
    //import utils from '@/libs/utils.js'

    export default {
        data() {
            return {
                // PC端组件列表数据
                pcLinkList: [],
                // 移动端组件列表数据
                mobileLinkList: [],
                // 测试组件列表数据
                testLinkList: [{
                    name: 'vuex实例',
                    pathName: 'store'
                }, {
                    name: 'mockjs组件',
                    pathName: 'mock'
                }],
            }
        },

        mounted() {
            //utils.title('首页')   
            this.installInfo()                      
        },

        computed: {
            clientHeight: {
                get() {
                    return this.$store.state.app.clientHeight
                }
            }
        },

        methods: {
            installInfo() {
                console.log(this.clientHeight)
                this.$store.commit("setUserInfo", {name:'Yeung', workld:'38249'});  
            },

            //更新信息
            updateInfo() {
                this.$store.commit("setState", {
                        userInfo: {name:'Yeung',workld:'38349'}
                    });
                this.$router.push({
                    name:'editor',
                    query:{
                        id:1
                    }
                })
            },

            // 跳转到响应的组件
            linkTo(pathName) {
                this.$router.push({
                    name: pathName
                })
            }
        }
        
    };    
    
</script>

<style lang='less' scoped>
    @import '../../public/style/variable.less';
    .content {
        width: 600px;
        margin: 10px auto;
        h4 {
            color: @primary-color;
            font-size: 18px;
        }
        ul {
            li {
                font-size: 16px;
                color: @success-color;
                line-height: 24px;
                cursor: pointer;
            }
        }
    }
</style>