<template>
  <div class="key-project-page">
    <!-- 项目说明区域 -->
    <div class="section-block">
      <div class="section-title">
        <span class="required-star">*</span>
        <span>项目说明</span>
      </div>
      <div class="desc-area">
        <el-input
          v-model="projectDescription"
          type="textarea"
          :maxlength="5000"
          :rows="6"
          show-word-limit
          resize="none"
          placeholder="请简要说明获客项目背景、获客目标、获客方案"
        />
      </div>
      <!-- 附件上传 -->
      <div class="attachment-area">
        <el-upload
          :action="UPLOAD_PLACEHOLDER"
          :http-request="handleProjectAttachmentUpload"
          :file-list="projectAttachments"
          :on-remove="handleProjectAttachmentRemove"
          :before-upload="beforeFileUpload"
          :limit="MAX_ATTACHMENT_COUNT"
          :on-exceed="handleExceed"
          multiple
        >
          <el-button size="small" type="primary" icon="el-icon-upload">上传附件</el-button>
          <template #tip>
            <div class="upload-tip">
              支持常见文档格式，单个文件不超过 {{ MAX_FILE_SIZE_MB }}MB，最多 {{ MAX_ATTACHMENT_COUNT }} 个附件
            </div>
          </template>
        </el-upload>
      </div>
    </div>

    <!-- 合作客户区域 -->
    <div class="section-block">
      <div class="section-title">合作客户</div>

      <!-- 操作栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="warning" size="small" @click="handleAddCustomer">
            添加合作客户
          </el-button>
          <div class="search-group">
            <el-input
              v-model="searchInput"
              placeholder="输入客户名称"
              size="small"
              clearable
              style="width: 260px"
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            />
            <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
          </div>
        </div>
        <div class="toolbar-right">
          <el-button type="success" size="small" @click="handleExport">导出</el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <el-table
        :data="filteredCustomerList"
        border
        style="width: 100%"
        empty-text="暂无合作客户数据"
        size="small"
      >
        <el-table-column prop="merchantName" label="已添加合作商户名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="annualTarget" label="获客目标" min-width="160" show-overflow-tooltip />
        <el-table-column prop="creditCode" label="社会信用代码" min-width="180" show-overflow-tooltip />
        <el-table-column prop="agreementName" label="合作协议名称" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" size="small" class="danger-text-btn" @click="handleDelete(row)">删除</el-button>
            <el-button type="text" size="small" @click="handleViewDetail(row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/编辑 合作客户弹窗 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="customerFormRef"
        :model="customerForm"
        :rules="isViewMode ? {} : customerRules"
        label-position="top"
        size="small"
      >
        <el-form-item label="合作商户名称" prop="merchantName">
          <el-input
            v-model="customerForm.merchantName"
            :maxlength="100"
            show-word-limit
            placeholder="请输入合作商户名称"
            :disabled="isViewMode"
          />
        </el-form-item>

        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input
            v-model="customerForm.creditCode"
            :maxlength="18"
            show-word-limit
            placeholder="请输入18位统一社会信用代码"
            :disabled="isViewMode"
          />
        </el-form-item>

        <el-form-item label="当年获客目标" prop="annualTarget">
          <el-input
            v-model="customerForm.annualTarget"
            type="textarea"
            :maxlength="500"
            :rows="3"
            show-word-limit
            resize="none"
            placeholder="请输入当年获客目标"
            :disabled="isViewMode"
          />
        </el-form-item>

        <el-form-item label="备注说明">
          <el-input
            v-model="customerForm.remark"
            type="textarea"
            :maxlength="500"
            :rows="3"
            show-word-limit
            resize="none"
            placeholder="选填"
            :disabled="isViewMode"
          />
        </el-form-item>

        <el-form-item label="上传合作协议" prop="agreementName" :required="!isViewMode">
          <div v-if="isViewMode" class="view-file-name">
            {{ customerForm.agreementName || '无' }}
          </div>
          <el-upload
            v-else
            :action="UPLOAD_PLACEHOLDER"
            :http-request="handleAgreementUpload"
            :file-list="agreementFileList"
            :on-remove="handleAgreementRemove"
            :before-upload="beforeFileUpload"
            :limit="1"
            :on-exceed="handleAgreementExceed"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <template #tip>
              <div class="upload-tip">仅支持上传一个协议文件，支持 PDF / Word / 图片格式</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">
            {{ isViewMode ? '关闭' : '取消' }}
          </el-button>
          <el-button
            v-if="!isViewMode"
            type="primary"
            size="small"
            :loading="submitLoading"
            @click="handleSubmitCustomer"
          >
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 全局操作条 -->
    <div class="page-footer">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button type="primary" size="small" :loading="pageLoading" @click="handleSaveAll">提交</el-button>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import moment from 'moment'
import {
  getProjectDetail,
  saveProjectDescription,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  uploadFile,
} from '@/api/customerAcquisition'

// ─── 模块级常量 ──────────────────────────────────────────────────────────────
const MAX_FILE_SIZE_MB = 20
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024
const MAX_ATTACHMENT_COUNT = 5
const UPLOAD_PLACEHOLDER = '#'

const createDefaultCustomerForm = () => ({
  merchantName: '',
  creditCode: '',
  annualTarget: '',
  remark: '',
  agreementName: '',
  agreementUrl: '',
})

// ─── 组件 ────────────────────────────────────────────────────────────────────
export default {
  name: 'KeyProjectCustomer',

  data() {
    return {
      // 常量暴露给模板使用
      MAX_FILE_SIZE_MB,
      MAX_ATTACHMENT_COUNT,
      UPLOAD_PLACEHOLDER,

      // ── 项目说明 ──
      projectId: null,
      projectDescription: '',
      projectAttachments: [],

      // ── 合作客户列表 ──
      customerList: [],
      searchInput: '',
      searchKeyword: '',

      // ── 弹窗 ──
      dialogVisible: false,
      /** @type {'add'|'edit'|'view'} */
      dialogMode: 'add',
      submitLoading: false,
      currentEditId: null,

      // ── 全局 loading ──
      pageLoading: false,

      // ── 客户表单 ──
      customerForm: createDefaultCustomerForm(),
      agreementFileList: [],

      // ── 表单校验规则 ──
      customerRules: {
        merchantName: [
          { required: true, message: '请输入合作商户名称', trigger: 'blur' },
        ],
        creditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
          { len: 18, message: '统一社会信用代码应为18位', trigger: 'blur' },
        ],
        agreementName: [
          { required: true, message: '请上传合作协议', trigger: 'change' },
        ],
      },
    }
  },

  computed: {
    dialogTitle() {
      const modeMap = { add: '添加合作客户', edit: '编辑合作客户', view: '查看详情' }
      return modeMap[this.dialogMode] || '添加合作客户'
    },

    isViewMode() {
      return this.dialogMode === 'view'
    },

    filteredCustomerList() {
      const keyword = this.searchKeyword.trim()
      if (!keyword) return this.customerList
      return this.customerList.filter((item) => item.merchantName?.includes(keyword))
    },
  },

  created() {
    this.initPage()
  },

  methods: {
    // ── 页面初始化 ────────────────────────────────────────────────────────────

    initPage() {
      const projectId = this.$route?.query?.id ?? null
      if (projectId) {
        this.projectId = projectId
        this.loadProjectDetail(projectId)
      }
    },

    async loadProjectDetail(projectId) {
      try {
        const { data } = await getProjectDetail(projectId)
        this.projectDescription = data.projectDescription || ''
        this.projectAttachments = (data.projectAttachments || []).map(({ name, url }) => ({ name, url }))
        this.customerList = data.customerList || []
      } catch {
        this.$message.error('加载项目详情失败')
      }
    },

    // ── 全局保存 / 取消 ───────────────────────────────────────────────────────

    async handleSaveAll() {
      if (!this.projectDescription || !this.projectDescription.trim()) {
        this.$message.warning('请填写项目说明')
        return
      }

      this.pageLoading = true
      try {
        await saveProjectDescription({
          id: this.projectId,
          projectDescription: this.projectDescription,
          projectAttachments: this.projectAttachments,
          customerList: this.customerList,
        })
        this.$message.success('保存成功')
        if (this.$router) {
          this.$router.back()
        }
      } catch {
        this.$message.error('保存失败')
      } finally {
        this.pageLoading = false
      }
    },

    handleCancel() {
      this.$confirm(
        '确定要放弃当前修改并返回吗？未保存的数据将会丢失。',
        '提示',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' },
      )
        .then(() => {
          if (this.$router) this.$router.back()
        })
        .catch(() => {})
    },

    // ── 项目附件上传 ──────────────────────────────────────────────────────────

    async handleProjectAttachmentUpload(options) {
      const formData = new FormData()
      formData.append('file', options.file)
      try {
        const { data: fileInfo } = await uploadFile(formData)
        this.projectAttachments.push({ name: fileInfo.fileName, url: fileInfo.fileUrl })
        if (options.onSuccess) options.onSuccess()
      } catch (err) {
        this.$message.error('附件上传失败')
        if (options.onError) options.onError(err)
      }
    },

    handleProjectAttachmentRemove(file) {
      const idx = this.projectAttachments.findIndex(
        (item) => item.url === file.url || item.name === file.name,
      )
      if (idx > -1) this.projectAttachments.splice(idx, 1)
    },

    beforeFileUpload(file) {
      if (file.size > MAX_FILE_SIZE) {
        this.$message.warning(`文件大小不能超过 ${MAX_FILE_SIZE_MB}MB`)
        return false
      }
      return true
    },

    handleExceed() {
      this.$message.warning(`最多上传 ${MAX_ATTACHMENT_COUNT} 个附件`)
    },

    // ── 合作客户 CRUD ─────────────────────────────────────────────────────────

    handleAddCustomer() {
      this.dialogMode = 'add'
      this.currentEditId = null
      this.resetCustomerForm()
      this.dialogVisible = true
    },

    handleEdit(row) {
      this.dialogMode = 'edit'
      this.currentEditId = row.id
      this.customerForm = { ...createDefaultCustomerForm(), ...row }
      this.agreementFileList = row.agreementName
        ? [{ name: row.agreementName, url: row.agreementUrl || '' }]
        : []
      this.dialogVisible = true
    },

    handleViewDetail(row) {
      this.dialogMode = 'view'
      this.currentEditId = row.id
      this.customerForm = { ...createDefaultCustomerForm(), ...row }
      this.agreementFileList = []
      this.dialogVisible = true
    },

    handleDelete(row) {
      this.$confirm(
        `确定要删除合作客户 "${row.merchantName}" 吗？删除后不可恢复。`,
        '删除确认',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' },
      )
        .then(async () => {
          try {
            await deleteCustomer(row.id)
            const idx = this.customerList.findIndex((item) => item.id === row.id)
            if (idx > -1) this.customerList.splice(idx, 1)
            this.$message.success('删除成功')
          } catch {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {})
    },

    handleSubmitCustomer() {
      this.$refs.customerFormRef.validate(async (valid) => {
        if (!valid) return
        if (!this.customerForm.agreementName) {
          this.$message.warning('请上传合作协议')
          return
        }

        this.submitLoading = true
        const payload = { ...this.customerForm }

        try {
          if (this.dialogMode === 'add') {
            const { data } = await addCustomer(payload)
            payload.id = data.id || Date.now()
            this.customerList.push(payload)
            this.$message.success('添加成功')
          } else {
            payload.id = this.currentEditId
            await updateCustomer(payload)
            const idx = this.customerList.findIndex((item) => item.id === this.currentEditId)
            if (idx > -1) this.customerList.splice(idx, 1, payload)
            this.$message.success('编辑成功')
          }
          this.dialogVisible = false
        } catch {
          this.$message.error(this.dialogMode === 'add' ? '添加失败' : '编辑失败')
        } finally {
          this.submitLoading = false
        }
      })
    },

    // ── 合作协议上传 ──────────────────────────────────────────────────────────

    async handleAgreementUpload(options) {
      const formData = new FormData()
      formData.append('file', options.file)
      try {
        const { data: fileInfo } = await uploadFile(formData)
        this.customerForm.agreementName = fileInfo.fileName
        this.customerForm.agreementUrl = fileInfo.fileUrl
        this.agreementFileList = [{ name: fileInfo.fileName, url: fileInfo.fileUrl }]
        if (this.$refs.customerFormRef) {
          this.$refs.customerFormRef.validateField('agreementName')
        }
        if (options.onSuccess) options.onSuccess()
      } catch (err) {
        this.$message.error('协议上传失败')
        if (options.onError) options.onError(err)
      }
    },

    handleAgreementRemove() {
      this.customerForm.agreementName = ''
      this.customerForm.agreementUrl = ''
      this.agreementFileList = []
    },

    handleAgreementExceed() {
      this.$message.warning('只能上传一个合作协议文件，请先删除已有文件')
    },

    // ── 弹窗管理 ──────────────────────────────────────────────────────────────

    handleDialogClose() {
      this.resetCustomerForm()
    },

    resetCustomerForm() {
      this.customerForm = createDefaultCustomerForm()
      this.agreementFileList = []
      this.currentEditId = null
      this.$nextTick(() => this.$refs.customerFormRef?.clearValidate())
    },

    // ── 搜索 ──────────────────────────────────────────────────────────────────

    handleSearch() {
      this.searchKeyword = this.searchInput
    },

    // ── 导出 Excel ────────────────────────────────────────────────────────────

    handleExport() {
      const data = this.filteredCustomerList
      if (!data || !data.length) {
        this.$message.warning('暂无数据可导出')
        return
      }

      const COLUMNS = [
        { label: '已添加合作商户名称', key: 'merchantName', wch: 30 },
        { label: '获客目标',           key: 'annualTarget',  wch: 30 },
        { label: '社会信用代码',       key: 'creditCode',    wch: 22 },
        { label: '合作协议名称',       key: 'agreementName', wch: 30 },
        { label: '备注说明',           key: 'remark',        wch: 30 },
      ]

      try {
        const header = COLUMNS.map((c) => c.label)
        const rows = data.map((item) => COLUMNS.map((c) => item[c.key] || ''))

        const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
        ws['!cols'] = COLUMNS.map((c) => ({ wch: c.wch }))

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, '合作客户')

        // 使用 binary 类型兼容 xlsx@0.13.x，再通过 s2ab 转换为 ArrayBuffer
        const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' })

        const buf = new ArrayBuffer(wbout.length)
        const view = new Uint8Array(buf)
        for (let i = 0; i < wbout.length; i++) {
          view[i] = wbout.charCodeAt(i) & 0xFF
        }

        const fileName = `重点项目获客管理_合作客户_${moment().format('YYYYMMDDHHmmss')}.xlsx`
        saveAs(new Blob([buf], { type: 'application/octet-stream' }), fileName)

        this.$message.success('导出成功')
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出遇到错误，请重试')
      }
    },
  },
}
</script>

<style scoped>
.key-project-page {
  padding: 20px;
  background: #fff;
  min-height: 100%;
}

/* 区域块 */
.section-block {
  margin-bottom: 28px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.required-star {
  color: #f56c6c;
  font-weight: bold;
}

/* 项目说明 */
.desc-area {
  margin-bottom: 12px;
}

.attachment-area {
  margin-top: 8px;
}

.upload-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 删除按钮 */
.danger-text-btn {
  color: #f56c6c !important;
}

.danger-text-btn:hover {
  color: #f78989 !important;
}

/* 查看模式文件名 */
.view-file-name {
  padding: 8px 0;
  font-size: 14px;
  color: #606266;
}

/* 弹窗底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 页面底部操作条 */
.page-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

/* 弹窗内部自适应滚动 */
:deep(.el-dialog) {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  margin-top: 5vh !important;
}

:deep(.el-dialog__body) {
  padding: 10px 20px;
  max-height: calc(90vh - 120px);
  overflow-y: auto;
}
</style>
