<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">班号</el-text>
                        <el-input v-model="form.cno" placeholder="班号" class="handle-input input-margin"></el-input>
                        <el-text size="large">学年</el-text>
                        <el-select v-model="form.year" placeholder="学年" class="handle-select input-margin">
                            <el-option v-for="(item, index) in years_list" :key="index" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <el-text size="large">学期</el-text>
                        <el-select v-model="form.semester" placeholder="学期" class="handle-select input-margin">
                            <el-option key="1" label="第一学期" value="1"></el-option>
                            <el-option key="2" label="第二学期" value="2"></el-option>
                        </el-select>
                        <el-text size="large">排序方式</el-text>
                        <el-select v-model="form.order_row" placeholder="排序方式" class="handle-select input-margin">
                            <el-option key="1" label="学号升序" value="student_no"></el-option>
                            <el-option key="2" label="绩点降序" value="gpa"></el-option>
                        </el-select>
                    </el-space>
                </div>
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                    <el-button type="success" size="large" :disabled="exportDataDisable" :icon="Download"
                        @click="exportData">导出Excel</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="sno" label="学号"></el-table-column>
                <el-table-column prop="sname" label="姓名"></el-table-column>
                <el-table-column prop="gpa" label="平均绩点"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Download } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { getByteLength, route_jump, objectList2Array } from '../utils/common'
import * as XLSX from 'xlsx';
import API from '../utils/api'

const router = useRouter();
// 原始表格数据
const tableData = ref([]);
// 学年数组，包含过去9年，当前年和未来2年
const years_list = (function () {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 9; i <= currentYear + 2; i++) {
        years.push({ value: i, label: `${i}-${i + 1}` });
    }
    return years;
})();
// 请求数据
const getData = async () => {
    if (!validateInput(form.cno))
        return;
    const res = await API.classGPAStatement(form);
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
// 搜索条件输入数据
let form = reactive({
    cno: '',
    year: new Date().getFullYear(),
    semester: "1",
    order_row: 'student_no'
});
// 校验输入是否合法
const validateInput = (cno) => {
    if (!cno) {
        ElMessage.warning('请填写班号')
        return false;
    }
    if (getByteLength(cno) != 7) {
        ElMessage.warning('班号长度必须为7')
        return false;
    }
    return true;
};
// 是否禁止导出
const exportDataDisable = ref(true);
// 导出查询结果为Excel
const exportData = () => {
    const header = ['学号', '姓名', '平均绩点'];
    const properties = ['sno', 'sname', 'gpa'];
    // 把tableData转换成aoa
    const list = objectList2Array(tableData.value, properties);
    // 添加表头
    list.unshift(header);
    // 导出
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(list);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, `班级${form.cno}_${year_ext(form.year)}${num2word(form.semester)}绩点报表.xlsx`);
};
// 将数字x转换为第x学期
const num2word = (semesterNum) => {
    return semesterNum == 1 ? '第一学期' :
        semesterNum == 2 ? '第二学期' :
            semesterNum;
};
// 将学年转换为一个范围
const year_ext = (year) => {
    return `${year}-${Number(year) + 1}`
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
    margin-top: 20px;
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
