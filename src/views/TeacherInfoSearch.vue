<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">工号</el-text>
                        <el-input v-model="form.tno" placeholder="留空表示任意学号" class="handle-input input-margin"></el-input>
                        <el-text size="large">姓名</el-text>
                        <el-input v-model="form.tname" placeholder="留空表示任意姓名" class="handle-input input-margin"></el-input>
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
                        <el-text size="large">性别</el-text>
                        <el-select v-model="form.gender" placeholder="性别" class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option key="1" label="男" value="男"></el-option>
                            <el-option key="2" label="女" value="女"></el-option>
                        </el-select>
                    </el-space>
                </div>
                <div class="el-space-wrap">
                    <el-space wrap>
                        <el-text size="large">职称</el-text>
                        <el-select v-model="form.title" placeholder="职称" class="handle-select input-margin">
                            <el-option key="-1" label="任意" value="any"></el-option>
                            <el-option key="1" label="助教" value="助教"></el-option>
                            <el-option key="2" label="讲师" value="讲师"></el-option>
                            <el-option key="3" label="副教授" value="副教授"></el-option>
                            <el-option key="4" label="教授" value="教授"></el-option>
                        </el-select>
                    </el-space>
                </div>
                <div class="search-btn-wrap">
                    <el-button type="primary" size="large" :icon="Search" @click="getData">查询</el-button>
                </div>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header">
                <el-table-column prop="tno" label="工号" width="120" align="center"></el-table-column>
                <el-table-column prop="tname" label="姓名"></el-table-column>
                <el-table-column prop="mname" label="所属专业"></el-table-column>
                <el-table-column prop="cname" label="所属学院"></el-table-column>
                <el-table-column prop="gender" label="性别" width="80" align="center"></el-table-column>
                <el-table-column prop="title" label="职称" width="180" align="center"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Search } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { getByteLength, route_jump } from '../utils/common'
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
    if (!validateInput(form.tno, form.tname))
        return;
    const res = await API.getAllTeacherInfoV2(form);
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
    tno: '',
    tname: '',
    mname: 'any',
    cname: '',
    gender: 'any',
    title: 'any'
});
// 校验输入是否合法
const validateInput = (tno, tname) => {
    if (tno && getByteLength(tno) != 8) {
        ElMessage.warning('工号长度必须为8')
        return false;
    }
    if (tname && getByteLength(tname) > 20) {
        ElMessage.warning('教师姓名长度不能超过20')
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
