<template>
<div>
    <el-table border :data="tableData" v-loading.body="loading" element-loading-text="拼命加载中" style="width: 100%">
        <el-table-column type="expand">
          <template scope="scope">
            <p>留言内容: {{scope.row.content}}</p>
            <el-button v-if="scope.row.status == 'OFF'" size="small" type="success" @click="setStatus(scope.row.id, 'ON')">朕已阅</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="100"></el-table-column>
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="sexName" label="性别" width="100"></el-table-column>
        <el-table-column prop="time" label="留言时间" width="200"></el-table-column>
        <el-table-column prop="email" label="电子邮箱"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="ip" label="IP地址"></el-table-column>
        <el-table-column prop="status" width="100" label="状态" :filter-method="filter" :filters="[{ text: '未批阅', value: 'OFF' }, { text: '已批阅', value: 'ON' }]">
            <template scope="scope">
                <el-tag v-if="scope.row.status == 'ON'" type="success">已批阅</el-tag>
                <el-tag v-if="scope.row.status == 'OFF'" type="danger">未批阅</el-tag>
            </template>
        </el-table-column>
        <el-table-column width="100" label="操作">
            <template scope="scope">
                <el-button v-if="scope.row.status == 'OFF'" size="small" type="success" @click="setStatus(scope.row.id, 'ON')">朕已阅</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div style="padding: 20px;text-align: right;">
        <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
    </div>
</div>        
</template>
<script>
export default{
    data: function(){
        return {
            tableData: [],
            loading: false,
            page: 1,
            pageSize: 10,
            total: 0
        }
    },
    created: function(){
        this.getList();
    },
    methods: {
        filter: function(value, row){
            return row.status === value;
        },
        getList: function(){
            this.loading = true;
            this.$http.post('/api/message/list',{
                page: this.page,
                pageSize: this.pageSize
            }).then(function(res){
                this.loading = false;
                if(res.data.status == 'success'){
                    this.tableData = res.data.data.list;
                    this.total = res.data.data.total;
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        handleCurrentChange: function(val){
            this.page = val;
            this.getList();
        },
        setStatus: function(id, status){
            this.$http.post('/api/message/set-status',{
                status: status,
                id: id
            }).then(function(res){
                if(res.data.status == 'success'){
                    this.getList();
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
    }
}    
</script>