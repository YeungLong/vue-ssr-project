<template>
    <div>
        <h3>这是我的个人信息页面</h3>
        <p>名字：{{userInfo.name}}</p>
        <p>工号：{{userInfo.workld}}</p>
        <!-- <Radio v-model="single">Radio</Radio> -->
    </div>

</template>

<script>
//import utils from "@/libs/utils";
import {mapActions, mapGetters} from 'vuex';

export default {
    data() {
        return {
            single: false
        }
    },
    mounted() {
        //console.log(this.userInfo)
        //utils.title("vuex实例");
        this.init()
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo;
        },
        // userInfo: {
		// 	get() {
		// 		return this.$store.state.user.userInfo;
		// 	},
		// 	set(val) {
		// 		this.$store.commit("setState", {
		// 			userInfo: val
		// 		});
		// 	}
        // },
		// ...mapGetters([
		// 	'userInfo'
		// ])
	},
    methods: {
        init() {
            let self = this;
            setTimeout(function(){ 
                console.log(self.$store.state.user.userInfo) 
            }, 3000);
        }
    }
}

</script>

<style>
    
</style>

