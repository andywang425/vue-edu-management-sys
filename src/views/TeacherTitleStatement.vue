<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                    <el-button type="success" size="large" :disabled="exportDataDisable" :icon="Download"
                        @click="exportData">导出Excel</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="cname" label="学院名称"></el-table-column>
                <el-table-column prop="assistant" label="助教人数"></el-table-column>
                <el-table-column prop="lecturer" label="讲师人数"></el-table-column>
                <el-table-column prop="associate_professor" label="副教授人数"></el-table-column>
                <el-table-column prop="professor" label="教授人数"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Download } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { route_jump, objectList2Array } from '../utils/common'
import * as XLSX from 'xlsx';
import API from '../utils/api'

const router = useRouter();
// 学院选项
const college_options = ref([]);
// 获取学院名称列表
const getCollegeNames = async () => {
    const res = await API.getAllCollegeName();
    route_jump(router, res);
    if (res.code === 0) {
        college_options.value = res.data;
    } else {
        ElMessage.error('获取学院名称列表失败');
    }
};
getCollegeNames();
// 原始表格数据
const tableData = ref([]);
// 请求数据
const getData = async () => {
    const res = await API.teacherTitleStatement();
    route_jump(router, res);
    if (res.code === 0) {
        if (res.data.length) {
            exportDataDisable.value = false;
        } else {
            exportDataDisable.value = true;
        }
        ElMessage.success('查询成功');
        tableData.value = res.data;
    } else {
        ElMessage.error('查询失败');
    }
};
// 是否禁止导出
const exportDataDisable = ref(true);
// 导出查询结果为Excel
const exportData = () => {
    const header = ['学院名称', '助教人数', '讲师人数', '副教授人数', '教授人数'];
    const properties = ['cname', 'assistant', 'lecturer', 'associate_professor', 'professor'];
    // 把tableData转换成aoa
    const list = objectList2Array(tableData.value, properties);
    // 添加表头
    list.unshift(header);
    // 导出
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(list);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, `教师职称报表.xlsx`);
};
</script>

<style scoped>
.credit-text-wrap {
    margin-bottom: 20px;
}

.search-btn-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    /* margin-top: 20px; */
}

.el-space-wrap {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
}

.input-margin {
    margin-inline-end: 20px;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 200px;
}

.handle-input {
    width: 200px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #F56C6C;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
