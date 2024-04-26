<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-text size="large" tag="b">{{ elective_year }}-{{ elective_year + 1 }}学年第{{ elective_semester === 1 ? '一'
                    :
                    '二'
                }}学期选课</el-text>
            </div>
            <el-table :data="filterTableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header">
                <el-table-column prop="cid" label="课号" width="200" align="center"></el-table-column>
                <el-table-column prop="cname" label="课名"></el-table-column>
                <el-table-column prop="credit" label="学分" width="80" align="center"></el-table-column>
                <el-table-column prop="chour" label="学时" width="80" align="center"></el-table-column>
                <el-table-column prop="pre_cname" label="先行课课名"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template #default="scope">
                        <el-button text :icon="Document" class="blue" @click="handleElective(scope.$index, scope.row)">
                            选课
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Document } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { route_jump, search_filter } from '../utils/common'
import API from '../utils/api'

const router = useRouter();
// 原始表格数据
const tableData = ref([]);
// 搜索内容
const search = ref('')
// 过滤后表格数据
const filterTableData = computed(() =>
    tableData.value.filter(data => search_filter(data, search.value))
);
// 获取选课的学年、学期
function getElectiveSemester() {
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth();
    /**
     * 3-8月可以选下一学年第一学期的课
     * 其它时间可以选当前学年第二学期的课
     */
    if (month >= 2 && month <= 7) {
        return [year, 1];
    } else {
        if (month > 7) {
            return [year, 2];
        } else {
            return [year - 1, 2]
        }
    }
};
const [elective_year, elective_semester] = getElectiveSemester();
// 请求数据
const getData = async () => {
    const res = await API.getStudentCoursePlan({ year: elective_year, semester: elective_semester });
    route_jump(router, res);
    if (res.code === 0) {
        tableData.value = res.data;
    }
};
getData();
// 删除操作
const handleElective = (index, row) => {
    // 二次确认删除
    ElMessageBox.confirm(`确定要选课 <strong>${row.cname}</strong> 吗？`, '提示', {
        type: 'warning',
        dangerouslyUseHTMLString: true
    }).then(async () => {
        const result = await API.electiveCourse({ cid: row.cid });
        route_jump(router, result);
        if (result.code === 0) {
            ElMessage.success('选课成功');
            tableData.value.splice(index, 1);
        } else if (result.code === 1 || result.code === 2) {
            ElMessage.error(result.msg);
        } else {
            ElMessage.error('选课失败');
        }
    }).catch(() => { });
};
// // 表单index临时变量，触发事件的行数
// let idx = -1;

</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.blue {
    color: #20a0f4;
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
