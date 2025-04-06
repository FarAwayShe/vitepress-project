# 表单开发文档

## 组件使用

### 基础表单组件

```vue
<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref(null)
const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('提交成功')
    }
  })
}

const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
}
</script>
```

## API 参考

### Form 组件

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model | 表单数据对象 | object | - |
| rules | 表单验证规则 | object | - |
| labelPosition | 标签位置 | string | 'right' |
| labelWidth | 标签宽度 | string | - |

### FormItem 组件

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| prop | 表单域 model 字段 | string | - |
| label | 标签文本 | string | - |
| rules | 表单验证规则 | object/array | - |

## 最佳实践

1. 表单验证
   - 使用统一的验证规则
   - 提供清晰的错误提示
   - 支持自定义验证函数

2. 性能优化
   - 合理使用表单验证时机
   - 避免不必要的重渲染
   - 使用防抖处理频繁验证

3. 用户体验
   - 提供即时反馈
   - 支持键盘操作
   - 保持一致的交互模式 