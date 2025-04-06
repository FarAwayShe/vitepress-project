# 表格开发文档

## 组件使用

### 基础表格组件

```vue
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180" />
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column prop="address" label="地址" />
    <el-table-column prop="status" label="状态">
      <template #default="scope">
        <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
          {{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const tableData = ref([
  {
    date: '2024-01-01',
    name: '张三',
    address: '北京市朝阳区',
    status: 'active'
  },
  {
    date: '2024-01-02',
    name: '李四',
    address: '上海市浦东新区',
    status: 'inactive'
  }
])

const handleEdit = (row) => {
  ElMessage.info(`编辑行: ${row.name}`)
}

const handleDelete = (row) => {
  ElMessage.warning(`删除行: ${row.name}`)
}
</script>
```

## API 参考

### Table 组件

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| data | 表格数据 | array | [] |
| border | 是否带有边框 | boolean | false |
| stripe | 是否显示斑马纹 | boolean | false |
| height | 表格高度 | string/number | - |

### TableColumn 组件

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| prop | 字段名 | string | - |
| label | 标题 | string | - |
| width | 列宽度 | string/number | - |
| sortable | 是否可排序 | boolean/string | false |

## 最佳实践

1. 性能优化
   - 使用虚拟滚动
   - 合理设置列宽
   - 避免频繁更新数据

2. 数据处理
   - 统一的数据格式
   - 合理的分页策略
   - 高效的数据过滤

3. 交互体验
   - 提供加载状态
   - 支持快捷键操作
   - 保持操作反馈 