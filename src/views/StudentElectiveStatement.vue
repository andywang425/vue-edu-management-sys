<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">学号</el-text>
                        <el-input v-model="form.sno" placeholder="学号" class="handle-input input-margin"></el-input>
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
                    </el-space>
                </div>
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                    <el-button type="success" size="large" :disabled="exportDataDisable" :icon="Download"
                        @click="exportData">导出Excel</el-button>
                </div>
            </div>
            <div class="credit-text-wrap">
                <el-text size="large">已获得学分：</el-text>
                <el-text size="large" tag="b">{{ credit }}</el-text>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="cid" label="课程ID"></el-table-column>
                <el-table-column prop="cname" label="课名"></el-table-column>
                <el-table-column prop="credit" label="学分"></el-table-column>
                <el-table-column prop="chour" label="学时"></el-table-column>
                <el-table-column prop="score" label="成绩"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Download } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { getByteLength, route_jump, objectList2Array, num2word, year_ext } from '../utils/common'
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
// 已获得学分
const credit = ref('暂无');
// 请求数据
const getData = async () => {
    if (!validateInput(form.sno))
        return;
    const res = await API.studentElectiveStatement(form);
    route_jump(router, res);
    if (res.code === 0) {
        ElMessage.success('查询成功');
        if (res.data.length) {
            exportDataDisable.value = false;
        } else {
            exportDataDisable.value = true;
        }
        tableData.value = res.data;
        credit.value = res.data.reduce((prev, curr) => curr.score >= 60 ? prev + curr.credit : prev, 0) || '暂无';
    } else {
        ElMessage.error('查询失败');
    }
};
// 搜索条件输入数据
let form = reactive({
    sno: '',
    year: new Date().getFullYear(),
    semester: "1"
});
// 校验输入是否合法
const validateInput = (sno) => {
    if (!sno) {
        ElMessage.warning('请填写学号')
        return false;
    }
    if (getByteLength(sno) != 8) {
        ElMessage.warning('学号长度必须为8')
        return false;
    }
    return true;
};
// 是否禁止导出
const exportDataDisable = ref(true);
// 导出查询结果为Excel
const exportData = () => {
    const header = ['课程ID', '课名', '学分', '学时', '成绩'];
    const properties = ['cid', 'cname', 'credit', 'chour', 'score'];
    // 把tableData转换成aoa
    const list = objectList2Array(tableData.value, properties);
    // 添加表头
    list.unshift(header);
    // 添加已获得学分
    list.push([], ['已获得学分', credit.value]);
    // 导出
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(list);
    XLSX.utils.book_append_sheet(workbook, worksheet);
    XLSX.writeFile(workbook, `学生${form.sno}_${year_ext(form.year)}${num2word(form.semester)}选课报表.xlsx`);
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
