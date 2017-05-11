<style>
.log-box{
    overflow: hidden;
}
.log-box .log{
    color: green;
}
.list-box{
    background: #fefefe;
    padding: 20px;
    line-height: 30px;
    cursor: pointer;
    border: 1px solid #eee;
    margin-bottom: 20px;
}
</style>
<template>
    <div class="log-box">
        <div class="list-box">
            <div class="log" v-for="item in list" @click="getDetail(item)">{{item}}</div>
        </div>
        <div class="list-box" v-loading="loading" element-loading-text="拼命加载中">
            <div class="log">{{fileName}}</div>
            <div class="log" v-for="item in logList">{{item}}</div>
        </div>
    </div>
</template>
<script>
    export default {
        data: function(){
            return {
                list: [],
                logList: [],
                fileName: '',
                loading: false
            }
        },
        created: function(){
            this.openDir();
        },
        methods: {
            openDir: function () {
                this.$http.get('/api/admin/opendir').then(function(res){
                    if(res.data.status == 'success'){
                        this.list = res.data.data.files
                    }
                })
            },
            getDetail: function (file) {
                this.loading = true
                this.$http.get('/api/admin/readfile?file=' + file).then(function(res){
                    this.loading = false
                    if(res.data.status == 'success'){
                        this.logList = res.data.data.logList
                        this.fileName = res.data.data.fileName
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            }
        }
    }
</script>