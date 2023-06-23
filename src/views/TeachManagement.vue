<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search" placeholder="搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" :icon="Refresh" @click="getData">刷新</el-button>
                <el-button type="primary" :icon="Plus" @click="createVisible = true">新增</el-button>
            </div>
            <el-table :data="filterTableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header">
                <el-table-column prop="cid" label="课程ID" width="150" align="center"></el-table-column>
                <el-table-column prop="tno" label="教师工号" width="120" align="center"></el-table-column>
                <el-table-column prop="cno" label="课号" width="100" align="center"></el-table-column>
                <el-table-column prop="cname" label="课名"></el-table-column>
                <el-table-column prop="tname" label="教师姓名"></el-table-column>
                <el-table-column prop="year" label="授课学年" width="100" align="center"></el-table-column>
                <el-table-column prop="semester" label="授课学期" width="120" align="center"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template #default="scope">
                        <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)">
                            编辑
                        </el-button>
                        <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index, scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="课程ID">
                    <el-input v-model="form.cid"></el-input>
                </el-form-item>
                <el-form-item label="教师工号">
                    <el-input v-model="form.tno"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-dialog title="新增" v-model="createVisible" width="30%">
            <el-form label-width="70px">
                <el-form-item label="课程ID">
                    <el-input v-model="form.cid"></el-input>
                </el-form-item>
                <el-form-item label="教师工号">
                    <el-input v-model="form.tno"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="createVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveCreate">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Refresh, Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { getByteLength, route_jump, search_filter, num2word, year_ext, convertDataList } from '../utils/common'
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
// 请求数据
const getData = async () => {
    const res = await API.getAllTeachInfo();
    route_jump(router, res);
    if (res.code === 0) {
        convertDataList(res.data)
        tableData.value = res.data;
    }
};
getData();
// 删除操作
const handleDelete = (index, row) => {
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        const result = await API.deleteTeachInfo({ cid: row.cid, tno: row.tno });
        route_jump(router, result);
        if (result.code === 0) {
            ElMessage.success('删除成功');
            tableData.value.splice(index, 1);
        } else {
            ElMessage.error('删除失败');
        }
    }).catch(() => { });
};
// 是否显示编辑弹窗
const editVisible = ref(false);
// 是否新增弹窗
const createVisible = ref(false);
// 弹窗表单输入数据
let form = reactive({
    cid: '',
    tid: ''
});
// 表单index临时变量，触发事件的行数
let idx = -1;
// 编辑操作
const handleEdit = (index, row) => {
    idx = index;
    form.cid = row.cid;
    form.tno = row.tno;
    editVisible.value = true;
};
// 保存编辑内容
const saveEdit = async () => {
    if (!validateInput(form.cid, form.tno))
        return;
    const reqData = {
        old_cid: tableData.value[idx].cid,
        new_cid: form.cid,
        old_tno: tableData.value[idx].tno,
        new_tno: form.tno
    };
    const result = await API.modifyTeachInfo(reqData);
    route_jump(router, result);
    if (result.code === 0) {
        editVisible.value = false;
        ElMessage.success(`修改第 ${idx + 1} 行成功`);
        if (form.cid != tableData.value[idx].cid || form.tno != tableData.value[idx].tno) {
            const res = await API.getOneTeachInfo({ cid: form.cid, tno: form.tno });
            route_jump(router, res);
            if (res.code === 0) {
                res.data.year = year_ext(res.data.year);
                res.data.semester = num2word(res.data.semester);
                tableData.value[idx] = res.data;
            } else {
                ElMessage.error(`获取单个课程计划失败`);
            }
        } else {
            tableData.value[idx].cid = form.cid;
            tableData.value[idx].entrance_year = form.entrance_year;
            tableData.value[idx].year = form.year;
            tableData.value[idx].semester = form.semester;
        }
    } else {
        ElMessage.error(`修改第 ${idx + 1} 行失败`);
    }
};
// 保存新增内容
const saveCreate = async () => {
    if (!validateInput(form.cid, form.tno))
        return;
    createVisible.value = false;
    const reqData = {
        cid: form.cid,
        tno: form.tno
    };
    const result = await API.createTeachInfo(reqData);
    route_jump(router, result);
    if (result.code === 0) {
        ElMessage.success(`新增授课信息成功`);
        const res = await API.getOneTeachInfo({ cid: form.cid, tno: form.tno });
        route_jump(router, res);
        if (res.code === 0) {
            res.data.year = year_ext(res.data.year);
            res.data.semester = num2word(res.data.semester);
            tableData.value.push(res.data);
        } else {
            ElMessage.error(`获取单个授课信息失败`);
        }
    } else {
        ElMessage.error(`新增授课信息失败`);
    }
}
// 校验输入是否合法
const validateInput = (cid, tno) => {
    if (!cid) {
        ElMessage.warning('请填写课程ID');
        return false;
    }
    if (!tno) {
        ElMessage.warning('请填写教师工号');
        return false;
    }
    if (getByteLength(cid) > 15) {
        ElMessage.warning('课程ID长度不能超过15')
        return false;
    }
    if (getByteLength(tno) != 8) {
        ElMessage.warning('教师工号长度必须为8')
        return false;
    }
    return true;
}
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
