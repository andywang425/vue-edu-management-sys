<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-upload action="#" ref="ref_upload" :limit="1" accept=".xlsx, .xls" :show-file-list="false"
                    :before-upload="beforeUpload" :http-request="httpRequestHandler" :on-exceed="handleExceed">
                    <el-button class="mr10" type="primary">
                        上传表格<el-icon class="el-icon--right">
                            <Upload />
                        </el-icon>
                    </el-button>
                </el-upload>
                <el-button class="mr10" type="success" :disabled="uploadDisable" @click="upload">提交</el-button>
                <el-text type="info">提示：上传的 Excel 表格需包含学号、班号、姓名、性别和政治面貌共 5 列</el-text>
            </div>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="sno" label="学号" align="center"></el-table-column>
                <el-table-column prop="cno" label="班号" align="center"></el-table-column>
                <el-table-column prop="sname" label="姓名" align="center"></el-table-column>
                <el-table-column prop="gender" label="性别" align="center"></el-table-column>
                <el-table-column prop="status" label="政治面貌" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, genFileId } from 'element-plus';
import { route_jump, hasAllKeys, getByteLength } from '../utils/common'
import * as XLSX from 'xlsx';
import API from '../utils/api';

const router = useRouter();
const ref_upload = ref();
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
const requiredKeys = ['学号', '班号', '姓名', '性别', '政治面貌'];
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
            cno: importList[i]['班号'],
            sname: importList[i]['姓名'],
            gender: importList[i]['性别'],
            status: importList[i]['政治面貌'],
        })
    }
    tableData.value = tempTableData;
    // console.log('tableData.value', tableData.value)
    uploadDisable.value = false;
    return true;
};
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
    obj['班号'] = String(obj['班号']);
    if (getByteLength(obj['班号']) != 7) {
        return [false, '班号'];
    }
    if (typeof obj['姓名'] === 'string' && getByteLength(obj['姓名']) > 20) {
        return [false, '姓名'];
    }
    if (getByteLength(obj['性别']) > 2) {
        return [false, '性别'];
    }
    if (!['群众', '团员', '党员'].includes(obj['政治面貌'])) {
        return [false, '政治面貌'];
    }
    return [true, undefined]
}
// 提交
const upload = async () => {
    const res = await API.uploadStudents({ students: tableData.value });
    route_jump(router, res);
    if (res.code === 0) {
        ElMessage.success('批量导入学生信息成功');
        tableData.value = [];
        uploadDisable.value = true;
    } else {
        ElMessage.error('批量导入学生信息失败，已回滚所有插入的数据');
    }
}
</script>

<style scoped>
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
