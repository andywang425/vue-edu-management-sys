<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">学号</el-text>
                        <el-input v-model="form.sno" placeholder="留空表示任意学号" class="handle-input input-margin"></el-input>
                        <el-text size="large">姓名</el-text>
                        <el-input v-model="form.sname" placeholder="留空表示任意姓名" class="handle-input input-margin"></el-input>
                        <el-text size="large">性别</el-text>
                        <el-select v-model="form.gender" placeholder="性别" class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option key="1" label="男" value="男"></el-option>
                            <el-option key="2" label="女" value="女"></el-option>
                        </el-select>
                        <el-text size="large">政治面貌</el-text>
                        <el-select v-model="form.status" placeholder="政治面貌" class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option key="1" label="群众" value="群众"></el-option>
                            <el-option key="2" label="团员" value="团员"></el-option>
                            <el-option key="3" label="党员" value="党员"></el-option>
                        </el-select>
                        <el-text size="large">学生状态</el-text>
                        <el-select v-model="form.type" placeholder="学生状态" style="width: 150px;">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option key="1" label="在籍" value="在籍"></el-option>
                            <el-option key="2" label="毕业" value="毕业"></el-option>
                        </el-select>
                    </el-space>
                </div>
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">年级</el-text>
                        <el-input v-model="form.entrance_year" placeholder="留空表示任意年级"
                            class="handle-input input-margin"></el-input>
                        <el-text size="large">学院</el-text>
                        <el-select v-model="form.cname" placeholder="学院" @change="collegeChangeHandler"
                            class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option v-for="(item, index) in college_options" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-text size="large">专业</el-text>
                        <el-select v-model="form.mname" placeholder="专业" class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option v-for="(item, index) in major_options" :key="index" :label="item" :value="item">
                            </el-option>
                        </el-select>
                        <el-text size="large">班号&emsp;&emsp;</el-text>
                        <el-input v-model="form.cno" placeholder="留空表示任意班号" class="handle-input input-margin"></el-input>
                    </el-space>
                </div>
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header">
                <el-table-column prop="sno" label="学号" width="120" align="center"></el-table-column>
                <el-table-column prop="sname" label="姓名"></el-table-column>
                <el-table-column prop="gender" label="性别" width="80" align="center"></el-table-column>
                <el-table-column prop="status" label="政治面貌" width="100" align="center"></el-table-column>
                <el-table-column prop="entrance_year" label="年级" width="100" align="center"></el-table-column>
                <el-table-column prop="cname" label="学院"></el-table-column>
                <el-table-column prop="mname" label="专业"></el-table-column>
                <el-table-column prop="cno" label="班号" width="100" align="center"></el-table-column>
                <el-table-column prop="type" label="学生状态" width="100" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { getByteLength, isNaturalNumber, route_jump } from '../utils/common'
import API from '../utils/api'

const router = useRouter();
// 原始表格数据
const tableData = ref([]);
// 学院选项
const college_options = ref([]);
// 专业选项
const major_options = ref([]);
// 获取学院名称列表
const getCollegeNames = async () => {
    const res = await API.getAllCollegeName();
    route_jump(router, res);
    if (res.code === 0) {
        college_options.value = res.data;
    } else {
        ElMessage.error('获取学院名称列表失败');
    }
};
getCollegeNames();
// 获取专业名称列表
const collegeChangeHandler = async (cname) => {
    form.mname = 'any';
    const res = await API.getAllMajorName({ cname: cname });
    route_jump(router, res);
    if (res.code === 0) {
        major_options.value = res.data;
    } else {
        ElMessage.error('获取专业名称列表失败');
    }
};
// 请求数据
const getData = async () => {
    if (!validateInput(form.sno, form.sname, form.entrance_year, form.cno))
        return;
    const res = await API.getAllStudentInfo(form);
    route_jump(router, res);
    if (res.code === 0) {
        ElMessage.success('查询成功');
        tableData.value = res.data;
    } else {
        ElMessage.error('查询失败');
    }
};
// 搜索条件输入数据
let form = reactive({
    sno: '',
    sname: '',
    gender: 'any',
    status: 'any',
    entrance_year: '',
    cno: '',
    mname: 'any',
    cname: 'any',
    type: 'any'
});
// 校验输入是否合法
const validateInput = (sno, sname, entrance_year, cno) => {
    if (sno && getByteLength(sno) != 8) {
        ElMessage.warning('学号长度必须为8')
        return false;
    }
    if (sname && getByteLength(sname) > 20) {
        ElMessage.warning('学生姓名长度不能超过20')
        return false;
    }
    if (cno && getByteLength(cno) != 7) {
        ElMessage.warning('班号长度必须为7')
        return false;
    }
    if (entrance_year && !isNaturalNumber(entrance_year)) {
        ElMessage.warning('年级不合法')
        return false;
    }
    return true;
}
</script>

<style scoped>
.search-btn-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.el-space-wrap {
    margin-bottom: 10px;
}

.input-margin {
    margin-inline-end: 20px;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 200px;
}

.handle-input {
    width: 200px;
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
