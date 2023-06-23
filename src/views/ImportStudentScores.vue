<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-text size="large" class="text-margin">课程ID</el-text>
                <el-input v-model="upload_cid" placeholder="请输入要录入成绩的课程ID" class="handle-input input-margin"></el-input>
                <el-upload action="#" ref="ref_upload" :limit="1" accept=".xlsx, .xls" :show-file-list="false"
                    :before-upload="beforeUpload" :http-request="httpRequestHandler" :on-exceed="handleExceed">
                    <el-button class="mr10" type="primary">
                        上传表格<el-icon class="el-icon--right">
                            <Upload />
                        </el-icon>
                    </el-button>
                </el-upload>
                <el-button class="mr10" type="success" :disabled="uploadDisable" @click="upload">提交</el-button>
                <el-text type="info">提示：上传的 Excel 表格需包含学号、成绩共 2 列</el-text>
            </div>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="sno" label="学号" align="center"></el-table-column>
                <el-table-column prop="score" label="成绩" align="center"></el-table-column>
                <el-table-column prop="gp" label="绩点" align="center"></el-table-column>
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
                <el-form-item label="成绩">
                    <el-input v-model="form.score"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, genFileId, ElMessageBox } from 'element-plus';
import { Delete, Edit } from '@element-plus/icons-vue';
import { route_jump, hasAllKeys, getByteLength, isNaturalNumber } from '../utils/common'
import * as XLSX from 'xlsx';
import API from '../utils/api';

const router = useRouter();
const ref_upload = ref();
const upload_cid = ref('');
const uploadDisable = ref(true);
// 上传第2个及之后文件时的钩子
const handleExceed = (files) => {
    tableData.value = [];
    ref_upload.value.clearFiles()
    const file = files[0];
    file.uid = genFileId()
    ref_upload.value.handleStart(file);
    beforeUpload(file);
}
// 处理后的表格数据
const tableData = ref([]);
// Excel 表格中必须要有的列
const requiredKeys = ['学号', '成绩'];
// 上传文件前的钩子
const beforeUpload = async (rawFile) => {
    // 导入文件的 json 格式
    const importList = await readExcel(rawFile);
    const tempTableData = [];
    for (let i = 0; i < importList.length; i++) {
        let [result, keyName] = hasAllKeys(importList[i], requiredKeys);
        if (!result) {
            ElMessage.error(`表格中有缺失的数据，请检查第${i + 1}行的${keyName}`);
            return false;
        }
        [result, keyName] = convertData(importList[i]);
        if (!result) {
            ElMessage.error(`表格不合法，请检查第${i + 1}行的${keyName}`);
            return false;
        }
        tempTableData.push({
            sno: importList[i]['学号'],
            score: importList[i]['成绩'],
            gp: calcGradePointByScore(importList[i]['成绩'])
        })
    }
    tableData.value = tempTableData;
    uploadDisable.value = false;
    return true;
};
// 通过成绩计算绩点
function calcGradePointByScore(score) {
    let grade_point;
    if (score >= 90) {
        grade_point = 4;
    } else if (score >= 85 && score < 90) {
        grade_point = 3.7;
    } else if (score >= 82 && score < 85) {
        grade_point = 3.3;
    } else if (score >= 78 && score < 82) {
        grade_point = 3;
    } else if (score >= 75 && score < 78) {
        grade_point = 2.7;
    } else if (score >= 72 && score < 75) {
        grade_point = 2.3;
    } else if (score >= 68 && score < 72) {
        grade_point = 2;
    } else if (score >= 66 && score < 68) {
        grade_point = 1.7;
    } else if (score >= 64 && score < 66) {
        grade_point = 1.5;
    } else if (score >= 60 && score < 64) {
        grade_point = 1;
    } else {
        grade_point = 0;
    }
    return grade_point;
}

// 读取 Excel 文件并将其转换为 json
const readExcel = (file) => {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target.result;
            let datajson = XLSX.read(data, {
                type: 'binary',
            });
            const sheetName = datajson.SheetNames[0];
            const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName]);
            resolve(result);
        };
        reader.readAsBinaryString(file);
    });
};
// 空函数，覆盖默认的 Xhr 行为
const httpRequestHandler = () => {
    // 不需要上传文件（excel表格）至服务器
    // 要上传的是格式化后的json，即 tableData
};
// 转换（检查）表中一行数据的格式
const convertData = (obj) => {
    obj['学号'] = String(obj['学号']);
    if (getByteLength(obj['学号']) != 8) {
        return [false, '学号'];
    }
    if (!isNaturalNumber(obj['成绩'])) {
        return [false, '成绩'];
    }
    return [true, undefined]
}
// 提交
const upload = async () => {
    if (!validateID(upload_cid.value))
        return false;
    const res = await API.uploadStudentScores({ course_id: upload_cid.value, student_scores: tableData.value });
    route_jump(router, res);
    if (res.code === 0) {
        ElMessage.success('批量录入学生成绩成功');
        tableData.value = [];
        uploadDisable.value = true;
    } else if (res.code === 1) {
        ElMessage.error(res.msg);
    } else {
        ElMessage.error('批量录入学生成绩失败，已回滚所有更改的数据');
    }
};
// 删除操作
const handleDelete = (index, row) => {
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    }).then(async () => {
        ElMessage.success('删除成功');
        tableData.value.splice(index, 1);
    }).catch(() => { });
};
// 是否显示编辑弹窗
const editVisible = ref(false);
// 弹窗表单输入数据
let form = reactive({
    score: ''
});
// 表单index临时变量，触发事件的行数
let idx = -1;
// 编辑操作
const handleEdit = (index, row) => {
    idx = index;
    form.score = row.score;
    editVisible.value = true;
};
// 保存编辑内容
const saveEdit = async () => {
    if (!validateInput(form.score))
        return;
    tableData.value[idx].score = form.score;
    tableData.value[idx].gp = calcGradePointByScore(form.score);
    editVisible.value = false;
    ElMessage.success(`修改第 ${idx + 1} 行成功`);
};
// 校验输入是否合法
const validateID = (cid) => {
    if (!cid) {
        ElMessage.warning('请输入课程ID')
        return false;
    }
    if (getByteLength(cid) > 15) {
        ElMessage.warning('课程ID长度不能超过15')
        return false;
    }
    return true;
};
const validateInput = (score) => {
    if (score === '') {
        ElMessage.warning('请输入成绩')
        return false;
    }
    if (!isNaturalNumber(score)) {
        ElMessage.warning('成绩不合法')
        return false;
    }
    return true;
}
</script>

<style scoped>
.red {
    color: #F56C6C;
}

.text-margin {
    margin-inline-end: 10px;
}

.input-margin {
    margin-inline-end: 20px;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-input {
    width: 200px;
}

.handle-box {
    display: flex;
    margin-bottom: 20px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.mr10 {
    margin-right: 10px;
}
</style>
