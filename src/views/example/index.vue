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
        <el-table :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址">
            </el-table-column>
        </el-table>
    </div>  
</template>

<script>
    import utils from '@/libs/utils.js'

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
                tableData: [{
                  date: '2016-05-22',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄'
                }, {
                  date: '2016-05-04',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1517 弄'
                }, {
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
                }, {
                  date: '2016-05-03',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1516 弄'
                }],
            }
        },

        mounted() {
            utils.title('首页')   
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