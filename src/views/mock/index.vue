<template>
	<div class="content">
		<h4>mock测试</h4>
		<div>{{info}}</div>
        <!-- <Button  type="primary" @click="goHome" size="large" style="position: fixed; top: 10px; right: 10px; width: 80px;">返回首页</Button> -->
	</div>	
</template>

<script>
	//import utils from '@/libs/utils.js'

	export default {
		data() {
			return {
				info: ''
			}
		},

		mounted() {
			// console.log(utils)
			//utils.title('mock测试')	
            this.initInfo() 					
		},

		computed: {},

		methods: {
			initInfo() {
                let params =  {
                        "id": 2,
                        "name": "werrwrewr"
                    };
              
				this.$http({
					url: '/mock/blastgoods',
					method: 'get',
					data: params 
				}).then(res => {
					console.log(res)
                    // this.$http({
                    //     url: '/mock/address',
                    //     method: 'post',
                    //     data: {} 
                    // }).then(res => {
                    //     console.log(res)
                    //     this.info = res[0].name
                    // })
				})	
            },

            goHome () {
                this.$router.push({
                    name: 'index'
                });
            }
		}
		
	};
	
</script>

<style lang='less' scoped>
	@import '../../public/style/variable.less';
	.content {
		width: 200px;
		margin: 10px auto;
		h4 {
			color: @primary-color;
			font-size: 18px;
		}
	}
</style>