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
                <el-table-column prop="cno" label="课号" width="120" align="center"></el-table-column>
                <el-table-column prop="cname" label="课名"></el-table-column>
                <el-table-column prop="credit" label="学分" width="80" align="center"></el-table-column>
                <el-table-column prop="chour" label="学时" width="80" align="center"></el-table-column>
                <el-table-column prop="pre_cno" label="先行课课号" width="120" align="center"></el-table-column>
                <el-table-column prop="pre_cname" label="先行课课名"></el-table-column>
                <el-table-column prop="college_no" label="学院编号" width="120" align="center"></el-table-column>
                <el-table-column prop="college_name" label="学院名称"></el-table-column>
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
            <el-form label-width="90px">
                <el-form-item label="课名">
                    <el-input v-model="form.cname"></el-input>
                </el-form-item>
                <el-form-item label="学院编号">
                    <el-input v-model="form.college_no"></el-input>
                </el-form-item>
                <el-form-item label="学分">
                    <el-input v-model="form.credit"></el-input>
                </el-form-item>
                <el-form-item label="学时">
                    <el-input v-model="form.chour"></el-input>
                </el-form-item>
                <el-form-item label="先行课课号">
                    <el-input v-model="form.pre_cno"></el-input>
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
            <el-form label-width="90px">
                <el-form-item label="课号">
                    <el-input v-model="form.cno"></el-input>
                </el-form-item>
                <el-form-item label="学院编号">
                    <el-input v-model="form.college_no"></el-input>
                </el-form-item>
                <el-form-item label="课名">
                    <el-input v-model="form.cname"></el-input>
                </el-form-item>
                <el-form-item label="学分">
                    <el-input v-model="form.credit"></el-input>
                </el-form-item>
                <el-form-item label="学时">
                    <el-input v-model="form.chour"></el-input>
                </el-form-item>
                <el-form-item label="先行课课号">
                    <el-input v-model="form.pre_cno"></el-input>
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
import { getByteLength, route_jump, search_filter, isNaturalNumber } from '../utils/common'
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
    const res = await API.getAllCourseInfo();
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
        const result = await API.deleteCourse({ no: row.cno });
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
    cno: '',
    college_no: '',
    cname: '',
    credit: '',
    chour: '',
    pre_cno: null
});
// 表单index临时变量，触发事件的行数
let idx = -1;
// 编辑操作
const handleEdit = (index, row) => {
    idx = index;
    form.cno = row.cno;
    form.college_no = row.college_no;
    form.cname = row.cname;
    form.credit = row.credit;
    form.chour = row.chour;
    form.pre_cno = row.pre_cno;
    editVisible.value = true;
};
// 保存编辑内容
const saveEdit = async () => {
    if (!validateInput(form.cno, form.college_no, form.cname, form.credit, form.chour, form.pre_cno))
        return;
    const reqData = {
        cno: form.cno,
        cname: form.cname,
        college_no: form.college_no,
        credit: form.credit,
        chour: form.chour,
        pre_cno: form.pre_cno
    };
    const result = await API.modifyCourse(reqData);
    route_jump(router, result);
    if (result.code === 0) {
        editVisible.value = false;
        ElMessage.success(`修改第 ${idx + 1} 行成功`);
        if (form.pre_cno != tableData.value[idx].pre_cno || form.college_no != tableData.value[idx].college_no) {
            const res = await API.getOneCourseInfo({ no: form.cno });
            route_jump(router, res);
            if (res.code === 0) {
                tableData.value[idx] = res.data;
            } else {
                ElMessage.error(`获取单个课程信息失败`);
            }
        }
        tableData.value[idx].cname = form.cname;
        tableData.value[idx].credit = form.credit;
        tableData.value[idx].chour = form.chour;
    } else {
        ElMessage.error(`修改第 ${idx + 1} 行失败`);
    }
};
// 保存新增内容
const saveCreate = async () => {
    if (!validateInput(form.cno, form.college_no, form.cname, form.credit, form.chour, form.pre_cno))
        return;
    createVisible.value = false;
    const reqData = {
        cno: form.cno,
        college_no: form.college_no,
        cname: form.cname,
        credit: form.credit,
        chour: form.chour,
        pre_cno: form.pre_cno
    };
    const result = await API.createCourse(reqData);
    route_jump(router, result);
    if (result.code === 0) {
        ElMessage.success(`新增课程成功`);
        const res = await API.getOneCourseInfo({ no: form.cno });
        route_jump(router, res);
        if (res.code === 0) {
            tableData.value.push(res.data);
        } else {
            ElMessage.error(`获取单个课程信息失败`);
        }
    } else {
        ElMessage.error(`新增课程失败`);
    }
}
// 校验输入是否合法
const validateInput = (cno, college_no, cname, credit, chour, pre_cno) => {
    if (!cno) {
        ElMessage.warning('请填写课号');
        return false;
    }
    if (!college_no) {
        ElMessage.warning('请填写学院编号');
        return false;
    }
    if (!credit) {
        ElMessage.warning('请填写学分');
        return false;
    }
    if (!chour) {
        ElMessage.warning('请填写学时')
        return false;
    }
    if (getByteLength(cno) > 10) {
        ElMessage.warning('课号长度不能超过10')
        return false;
    }
    if (getByteLength(college_no) != 2) {
        ElMessage.warning('学院编号长度必须为2')
        return false;
    }
    if (getByteLength(cname) > 10) {
        ElMessage.warning('课名长度不能超过20')
        return false;
    }
    if (pre_cno && getByteLength(pre_cno) > 10) {
        ElMessage.warning('先行课课号长度不能超过10')
        return false;
    }
    if (!isNaturalNumber(credit)) {
        ElMessage.warning('学分不合法')
        return false;
    }
    if (!isNaturalNumber(chour)) {
        ElMessage.warning('学时不合法')
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
