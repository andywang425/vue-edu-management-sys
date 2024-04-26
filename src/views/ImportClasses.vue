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
                <el-text type="info">提示：上传的 Excel 表格需包含班号、专业编号、入学年份和学生人数共 4 列</el-text>
            </div>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="cno" label="班号" align="center"></el-table-column>
                <el-table-column prop="mno" label="专业编号" align="center"></el-table-column>
                <el-table-column prop="entrance_year" label="入学年份" align="center"></el-table-column>
                <el-table-column prop="student_num" label="学生人数" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, genFileId } from 'element-plus';
import { route_jump, isNaturalNumber, hasAllKeys, getByteLength } from '../utils/common'
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
const requiredKeys = ['班号', '专业编号', '入学年份', '学生人数'];
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
            cno: importList[i]['班号'],
            mno: importList[i]['专业编号'],
            entrance_year: importList[i]['入学年份'],
            student_num: importList[i]['学生人数'],
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
    obj['班号'] = String(obj['班号']);
    if (getByteLength(obj['班号']) != 7) {
        return [false, '班号'];
    }
    if (typeof obj['专业编号'] === 'string' && getByteLength(obj['专业编号']) != 3)
        return [false, '专业编号'];
    if (typeof obj['专业编号'] === 'number' && (obj['专业编号'] >= 1000 || obj['专业编号'] < 0))
        return [false, '专业编号'];
    obj['专业编号'] = ('00' + String(obj['专业编号'])).slice(-3);
    if (!isNaturalNumber(obj['入学年份']))
        return [false, '入学年份'];
    obj['入学年份'] = Number(obj['入学年份'])
    if (!isNaturalNumber(obj['学生人数']))
        return [false, '学生人数'];
    obj['学生人数'] = Number(obj['学生人数'])
    return [true, undefined]
}
// 提交
const upload = async () => {
    const res = await API.uploadClasses({ classes: tableData.value });
    route_jump(router, res);
    if (res.code === 0) {
        ElMessage.success('批量导入班级信息成功');
        tableData.value = [];
        uploadDisable.value = true;
    } else {
        ElMessage.error('批量导入班级信息失败，已回滚所有插入的数据')
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
