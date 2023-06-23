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
                <el-table-column prop="cno" label="学院编号" width="100" align="center"></el-table-column>
                <el-table-column prop="mno" label="专业编号" width="100" align="center"></el-table-column>
                <el-table-column prop="cname" label="学院名称" width="250"></el-table-column>
                <el-table-column prop="mname" label="专业名称" width="250"></el-table-column>
                <el-table-column prop="intro" label="专业简介"></el-table-column>
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
                <el-form-item label="学院编号">
                    <el-input v-model="form.cno"></el-input>
                </el-form-item>
                <el-form-item label="专业名称">
                    <el-input v-model="form.mname"></el-input>
                </el-form-item>
                <el-form-item label="专业简介">
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
                    <el-input v-model="form.cno"></el-input>
                </el-form-item>
                <el-form-item label="专业编号">
                    <el-input v-model="form.mno"></el-input>
                </el-form-item>
                <el-form-item label="专业名称">
                    <el-input v-model="form.mname"></el-input>
                </el-form-item>
                <el-form-item label="专业简介">
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
const search = ref('');
// 过滤后表格数据
const filterTableData = computed(() =>
    tableData.value.filter(data => search_filter(data, search.value))
);
// 请求数据
const getData = async () => {
    const res = await API.getAllMajorInfo();
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
        const result = await API.deleteMajor({ no: row.mno });
        route_jump(router, result);
        if (result.code === 0) {
            ElMessage.success('删除成功');
            tableData.value.splice(index, 1);
        } else {
            ElMessage.error('删除失败');
        }
    }).catch(()=>{});
};
// 是否显示编辑弹窗
const editVisible = ref(false);
// 是否新增编辑弹窗
const createVisible = ref(false);
// 弹窗表单输入数据
let form = reactive({
    cno: '',
    mno: '',
    mname: '',
    intro: ''
});
// 表单index临时变量，触发事件的行数
let idx = -1;
// 编辑操作
const handleEdit = (index, row) => {
    idx = index;
    form.cno = row.cno;
    form.mno = row.mno;
    form.mname = row.mname;
    form.intro = row.intro;
    editVisible.value = true;
};
// 保存编辑内容
const saveEdit = async () => {
    if (!validateInput(form.cno, form.mno, form.mname, form.intro))
        return;
    const reqData = {
        cno: form.cno,
        mno: form.mno,
        name: form.mname,
        intro: form.intro
    };
    const result = await API.modifyMajor(reqData);
    route_jump(router, result);
    if (result.code === 0) {
        editVisible.value = false;
        ElMessage.success(`修改第 ${idx + 1} 行成功`);
        if (form.cno != tableData.value[idx].cno) {
            const res = await API.getCollegeName({ no: form.cno });
            route_jump(router, res);
            if (res.code === 0) {
                tableData.value[idx].cname = res.data.name;
            } else {
                ElMessage.error(`获取学院名称失败`);
            }
        }
        tableData.value[idx].cno = form.cno;
        tableData.value[idx].mname = form.mname;
        tableData.value[idx].intro = form.intro;
    } else {
        ElMessage.error(`修改第 ${idx + 1} 行失败`);
    }
};
// 保存新建内容
const saveCreate = async () => {
    if (!validateInput(form.cno, form.mno, form.mname, form.intro))
        return;
    createVisible.value = false;
    const reqData = {
        cno: form.cno,
        mno: form.mno,
        mname: form.mname,
        intro: form.intro
    };
    const result = await API.createMajor(reqData);
    route_jump(router, result);
    if (result.code === 0) {
        ElMessage.success(`新增专业成功`);
        const res = await API.getCollegeName({ no: form.cno });
        route_jump(router, res);
        reqData.cname = res.data.name;
        tableData.value.push(reqData)
    } else {
        ElMessage.error(`新增专业失败`);
    }
}
// 校验输入是否合法
const validateInput = (cno, mno, mname, intro) => {
    if (!cno) {
        ElMessage.warning('请填写学院编号');
        return false;
    }
    if (!mno) {
        ElMessage.warning('请填写专业编号');
        return false;
    }
    if (!mname) {
        ElMessage.warning('请填写专业名称')
        return false;
    }
    if (getByteLength(cno) != 2) {
        ElMessage.warning('学院编号长度必须为2')
        return false;
    }
    if (getByteLength(mno) != 3) {
        ElMessage.warning('专业编号长度必须为3')
        return false;
    }
    if (getByteLength(mname) > 30) {
        ElMessage.warning('专业名称长度不得大于30')
        return false;
    }
    if (intro && getByteLength(intro) > 200) {
        ElMessage.warning('专业简介长度不得大于200')
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
