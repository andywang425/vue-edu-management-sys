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
                <el-table-column prop="tno" label="工号" width="120" align="center"></el-table-column>
                <el-table-column prop="mno" label="专业编号" width="100" align="center"></el-table-column>
                <el-table-column prop="mname" label="专业名称"></el-table-column>
                <el-table-column prop="tname" label="姓名"></el-table-column>
                <el-table-column prop="gender" label="性别" width="80" align="center"></el-table-column>
                <el-table-column prop="title" label="职称"></el-table-column>
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
                <el-form-item label="专业编号">
                    <el-input v-model="form.mno"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.tname"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.gender" placeholder="性别" class="handle-select mr10">
                        <el-option key="1" label="男" value="男"></el-option>
                        <el-option key="2" label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职称">
                    <el-select v-model="form.title" placeholder="政治面貌" class="handle-select mr10">
                        <el-option key="1" label="助教" value="助教"></el-option>
                        <el-option key="2" label="讲师" value="讲师"></el-option>
                        <el-option key="3" label="副教授" value="副教授"></el-option>
                        <el-option key="4" label="教授" value="教授"></el-option>
                    </el-select>
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
                <el-form-item label="工号">
                    <el-input v-model="form.tno"></el-input>
                </el-form-item>
                <el-form-item label="专业编号">
                    <el-input v-model="form.mno"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.tname"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.gender" placeholder="性别" class="handle-select mr10">
                        <el-option key="1" label="男" value="男"></el-option>
                        <el-option key="2" label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职称">
                    <el-select v-model="form.title" placeholder="政治面貌" class="handle-select mr10">
                        <el-option key="1" label="助教" value="助教"></el-option>
                        <el-option key="2" label="讲师" value="讲师"></el-option>
                        <el-option key="3" label="副教授" value="副教授"></el-option>
                        <el-option key="4" label="教授" value="教授"></el-option>
                    </el-select>
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
import { getByteLength, route_jump, search_filter } from '../utils/common'
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
    const res = await API.getAllTeacherInfo();
    route_jump(router, res);
    if (res.code === 0) {
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
        const result = await API.deleteTeacher({ no: row.tno });
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
// 是否新增编辑弹窗
const createVisible = ref(false);
// 弹窗表单输入数据
let form = reactive({
    tno: '',
    mno: '',
    tname: '',
    gender: '男',
    title: '讲师'
});
// 表单index临时变量，触发事件的行数
let idx = -1;
// 编辑操作
const handleEdit = (index, row) => {
    idx = index;
    form.tno = row.tno;
    form.mno = row.mno;
    form.tname = row.tname;
    form.gender = row.gender;
    form.title = row.title;
    editVisible.value = true;
};
// 保存编辑内容
const saveEdit = async () => {
    if (!validateInput(form.tno, form.mno, form.tname))
        return;
    const reqData = {
        mno: form.mno,
        tno: form.tno,
        tname: form.tname,
        gender: form.gender,
        title: form.title
    };
    const result = await API.modifyTeacher(reqData);
    route_jump(router, result);
    if (result.code === 0) {
        editVisible.value = false;
        ElMessage.success(`修改第 ${idx + 1} 行成功`);
        if (form.mno != tableData.value[idx].mno) {
            const res = await API.getMajorName({ no: form.mno });
            route_jump(router, res);
            if (res.code === 0) {
                tableData.value[idx].mname = res.data.name;
            } else {
                ElMessage.error(`获取专业名称失败`);
            }
        }
        tableData.value[idx].mno = form.mno;
        tableData.value[idx].tname = form.tname;
        tableData.value[idx].gender = form.gender;
        tableData.value[idx].title = form.title;
    } else {
        ElMessage.error(`修改第 ${idx + 1} 行失败`);
    }
};
// 保存新增内容
const saveCreate = async () => {
    if (!validateInput(form.tno, form.mno, form.tname))
        return;
    createVisible.value = false;
    const reqData = {
        tno: form.tno,
        mno: form.mno,
        tname: form.tname,
        gender: form.gender,
        title: form.title
    };
    const result = await API.createTeacher(reqData);
    route_jump(router, result);
    if (result.code === 0) {
        ElMessage.success(`新增教师成功`);
        const res = await API.getMajorName({ no: form.mno });
        route_jump(router, res);
        if (res.code === 0) {
            reqData.mname = res.data.name;
            tableData.value.push(reqData)
        } else {
            ElMessage.error(`获取专业名称失败`);
        }
    } else {
        ElMessage.error(`新增教师失败`);
    }
}
// 校验输入是否合法
const validateInput = (tno, mno, tname) => {
    if (!tno) {
        ElMessage.warning('请填写工号');
        return false;
    }
    if (!mno) {
        ElMessage.warning('请填写专业编号');
        return false;
    }
    if (!tname) {
        ElMessage.warning('请填写教师姓名')
        return false;
    }
    if (getByteLength(tno) != 8) {
        ElMessage.warning('工号长度必须为8')
        return false;
    }
    if (getByteLength(mno) != 3) {
        ElMessage.warning('专业编号长度必须为3')
        return false;
    }
    if (getByteLength(tname) > 20) {
        ElMessage.warning('教师姓名长度不能超过20')
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
