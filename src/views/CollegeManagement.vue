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
                <el-table-column prop="no" label="学院编号" width="100" align="center"></el-table-column>
                <el-table-column prop="name" label="学院名称" width="250"></el-table-column>
                <el-table-column prop="intro" label="学院简介"></el-table-column>
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
                <el-form-item label="学院名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="学院简介">
                    <el-input v-model="form.intro"></el-input>
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
                <el-form-item label="学院编号">
                    <el-input v-model="form.no"></el-input>
                </el-form-item>
                <el-form-item label="学院名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="学院简介">
                    <el-input v-model="form.intro"></el-input>
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
    const res = await API.getAllCollegeInfo();
    route_jump(router, res);
    if (res.code === 0) {
        tableData.value = res.data;
    }
};
getData();
// 删除操作
const handleDelete = (index, row) => {
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        const result = await API.deleteCollege({ no: row.no });
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
    no: '',
    name: '',
    intro: ''
});
// 表单index临时变量，触发事件的行数
let idx = -1;
// 编辑操作
const handleEdit = (index, row) => {
    idx = index;
    form.no = row.no;
    form.name = row.name;
    form.intro = row.intro;
    editVisible.value = true;
};
// 保存编辑内容
const saveEdit = async () => {
    if (!validateInput(form.no, form.name, form.intro))
        return;
    const result = await API.modifyCollege({ no: form.no, name: form.name, intro: form.intro });
    route_jump(router, result);
    if (result.code === 0) {
        editVisible.value = false;
        ElMessage.success(`修改第 ${idx + 1} 行成功`);
        tableData.value[idx].name = form.name;
        tableData.value[idx].intro = form.intro;
    } else {
        ElMessage.error(`修改第 ${idx + 1} 行失败`);
    }
};
// 保存新增内容
const saveCreate = async () => {
    if (!validateInput(form.no, form.name, form.intro))
        return;
    createVisible.value = false;
    const reqData = { no: form.no, name: form.name, intro: form.intro };
    const result = await API.createCollege(reqData);
    route_jump(router, result);
    if (result.code === 0) {
        ElMessage.success(`新增学院成功`);
        tableData.value.push(reqData)
    } else {
        ElMessage.error(`新增学院失败`);
    }
}
// 校验输入是否合法
const validateInput = (no, name, intro) => {
    if (!no) {
        ElMessage.warning('请填写学院编号');
        return false;
    }
    if (!name) {
        ElMessage.warning('请填写学院名称')
        return false;
    }
    if (getByteLength(no) != 2) {
        ElMessage.warning('学院编号长度必须为2')
        return false;
    }
    if (getByteLength(name) > 30) {
        ElMessage.warning('学院名称长度不得大于30')
        return false;
    }
    if (intro && getByteLength(intro) > 200) {
        ElMessage.warning('学院简介长度不得大于200')
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
