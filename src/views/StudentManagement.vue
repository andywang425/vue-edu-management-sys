<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="search" placeholder="搜索" class="handle-input mr10"></el-input>
                <el-button type="primary" :icon="Refresh" @click="getData">刷新</el-button>
                <el-button type="primary" :icon="Plus" @click="createVisible = true">新增</el-button>
                <el-button class="mr10" type="success" :disabled="graduateDisable" @click="graduate">毕业已选中学生</el-button>
            </div>
            <el-table :data="filterTableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" align="center" width="55" />
                <el-table-column prop="sno" label="学号" width="120" align="center"></el-table-column>
                <el-table-column prop="cno" label="班号" width="100" align="center"></el-table-column>
                <el-table-column prop="entrance_year" label="入学年份" width="100" align="center"></el-table-column>
                <el-table-column prop="sname" label="姓名"></el-table-column>
                <el-table-column prop="gender" label="性别" width="80" align="center"></el-table-column>
                <el-table-column prop="cname" label="学院"></el-table-column>
                <el-table-column prop="mname" label="专业"></el-table-column>
                <el-table-column prop="status" label="政治面貌" width="100" align="center"></el-table-column>
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
                <el-form-item label="班号">
                    <el-input v-model="form.cno"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.sname"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.gender" placeholder="性别" class="handle-select mr10">
                        <el-option key="1" label="男" value="男"></el-option>
                        <el-option key="2" label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="政治面貌">
                    <el-select v-model="form.status" placeholder="政治面貌" class="handle-select mr10">
                        <el-option key="1" label="群众" value="群众"></el-option>
                        <el-option key="2" label="团员" value="团员"></el-option>
                        <el-option key="3" label="党员" value="党员"></el-option>
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
                <el-form-item label="学号">
                    <el-input v-model="form.sno"></el-input>
                </el-form-item>
                <el-form-item label="班号">
                    <el-input v-model="form.cno"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="form.sname"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.gender" placeholder="性别" class="handle-select mr10">
                        <el-option key="1" label="男" value="男"></el-option>
                        <el-option key="2" label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="政治面貌">
                    <el-select v-model="form.status" placeholder="政治面貌" class="handle-select mr10">
                        <el-option key="1" label="群众" value="群众"></el-option>
                        <el-option key="2" label="团员" value="团员"></el-option>
                        <el-option key="3" label="党员" value="党员"></el-option>
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
const search = ref('');
// 过滤后表格数据
const filterTableData = computed(() =>
    tableData.value.filter(data => search_filter(data, search.value))
);
// 毕业按钮是否可用
const graduateDisable = ref(true);
// 被多选选中的数据
const multipleSelection = ref([])
// 多选选择 handler
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
    if (multipleSelection.value.length > 0) {
        graduateDisable.value = false;
    } else {
        graduateDisable.value = true;
    }
    //   console.log('multipleSelection.value', val)
}
// 请求数据
const getData = async () => {
    const res = await API.getAllCurrentStudentInfo();
    route_jump(router, res);
    if (res.code === 0) {
        tableData.value = res.data;
    }
};
getData();
// 毕业已选中学生
const graduate = () => {
    // 二次确认毕业
    ElMessageBox.confirm('确定要毕业所有已选中的学生吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        const snoList = multipleSelection.value.map(stu => stu.sno);
        const result = await API.graduateStudent({ sno_list: snoList });
        route_jump(router, result);
        if (result.code === 0) {
            ElMessage.success('毕业学生成功');
            multipleSelection.value.forEach(stu => tableData.value.splice(tableData.value.findIndex(s => s.sno === stu.sno), 1));
            multipleTableRef.value.clearSelection();
        } else {
            ElMessage.error('毕业学生失败');
        }
    }).catch(() => { });
}
// 删除操作
const handleDelete = (index, row) => {
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        const result = await API.deleteStudent({ no: row.sno });
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
// 是否显示新增弹窗
const createVisible = ref(false);
// 弹窗表单输入数据
let form = reactive({
    sno: '',
    cno: '',
    sname: '',
    gender: '男',
    status: '群众'
});
// 表单index临时变量，触发事件的行数
let idx = -1;
// 编辑操作
const handleEdit = (index, row) => {
    idx = index;
    form.sno = row.sno;
    form.cno = row.cno;
    form.sname = row.sname;
    form.gender = row.gender;
    form.status = row.status;
    editVisible.value = true;
};
// 保存编辑内容
const saveEdit = async () => {
    if (!validateInput(form.sno, form.cno, form.sname))
        return;
    const reqData = {
        cno: form.cno,
        sno: form.sno,
        sname: form.sname,
        gender: form.gender,
        status: form.status
    };
    const result = await API.modifyStudent(reqData);
    if (result.code === 0) {
        editVisible.value = false;
        ElMessage.success(`修改第 ${idx + 1} 行成功`);
        if (form.cno != tableData.value[idx].cno) {
            const res = await API.getOneStudentInfo({ no: form.sno });
            route_jump(router, res);
            if (res.code === 0) {
                tableData.value[idx] = res.data;
            } else {
                ElMessage.error(`获取单个学生信息失败`);
            }
        } else {
            tableData.value[idx].sname = form.sname;
            tableData.value[idx].gender = form.gender;
            tableData.value[idx].status = form.status;
        }
    } else {
        ElMessage.error(`修改第 ${idx + 1} 行失败`);
    }
};
// 保存新增内容
const saveCreate = async () => {
    if (!validateInput(form.sno, form.cno, form.sname))
        return;
    createVisible.value = false;
    const reqData = {
        sno: form.sno,
        cno: form.cno,
        sname: form.sname,
        gender: form.gender,
        status: form.status
    };
    const result = await API.createStudent(reqData);
    route_jump(router, result);
    if (result.code === 0) {
        ElMessage.success(`新增学生成功`);
        const res = await API.getOneStudentInfo({ no: form.sno });
        route_jump(router, res);
        if (res.code === 0) {
            tableData.value.push(res.data)
        }
    } else {
        ElMessage.error(`新增学生失败`);
    }
}
// 校验输入是否合法
const validateInput = (sno, cno, sname) => {
    if (!sno) {
        ElMessage.warning('请填写学号');
        return false;
    }
    if (!cno) {
        ElMessage.warning('请填写班号');
        return false;
    }
    if (!sname) {
        ElMessage.warning('请填写学生姓名')
        return false;
    }
    if (getByteLength(sno) != 8) {
        ElMessage.warning('学号长度必须为8')
        return false;
    }
    if (getByteLength(cno) != 7) {
        ElMessage.warning('班号长度必须为7')
        return false;
    }
    if (getByteLength(sname) > 20) {
        ElMessage.warning('学生姓名长度不能超过20')
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
