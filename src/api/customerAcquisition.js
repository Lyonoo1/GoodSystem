/**
 * 重点项目获客管理 - API 接口
 *
 * 说明：当前所有接口均为 mock 实现，需要对接真实后端时，
 *      搜索 "TODO: 替换为真实接口" 即可找到所有需要修改的位置。
 *
 * 若复制到 Vue2 项目，请将 import { http } from './http' 替换为您项目中实际的 axios 实例引入方式。
 */

import { http } from './http'

/* ============================================================
 * Mock 数据 —— 编辑时使用
 * TODO: 替换为真实接口后可删除此部分
 * ============================================================ */

/** 模拟的项目详情数据（编辑模式下返回） */
const MOCK_PROJECT_DETAIL = {
  id: 1001,
  projectDescription: '本项目旨在通过银行代发工资、联合营销等方式，拓展重点企业客户资源，提升零售客户获客能力。计划在2026年度新增获客不少于5000户，重点覆盖制造业、科技类企业。',
  /** 项目说明附件 */
  projectAttachments: [
    { name: '获客方案V2.docx', url: 'https://example.com/files/plan_v2.docx' }
  ],
  /** 合作客户列表 */
  customerList: [
    {
      id: 1,
      merchantName: '宁煤集团有限责任公司',
      creditCode: '91640000MA7EXAMPLE1',
      annualTarget: '年度新增代发工资客户2000户，信用卡获客500户',
      remark: '与宁煤集团已签署战略合作协议，优先推进代发业务',
      agreementName: '宁煤集团合作协议.pdf',
      agreementUrl: 'https://example.com/files/agreement_ningmei.pdf'
    },
    {
      id: 2,
      merchantName: '中铁建设集团有限公司',
      creditCode: '91110000717825551A',
      annualTarget: '年度计划获取ETC客户3000户',
      remark: '',
      agreementName: '中铁建设合作框架协议.pdf',
      agreementUrl: 'https://example.com/files/agreement_zhongtie.pdf'
    },
    {
      id: 3,
      merchantName: '华润万家生活超市有限公司',
      creditCode: '91440300708EXAMPLE',
      annualTarget: '联合推广信用卡，目标1500张',
      remark: '商超场景联合营销，双方共享客户数据',
      agreementName: '华润联合营销协议.pdf',
      agreementUrl: 'https://example.com/files/agreement_huarun.pdf'
    },
    {
      id: 4,
      merchantName: '比亚迪股份有限公司',
      creditCode: '91440300192EXAMPLE',
      annualTarget: '汽车金融获客目标800户',
      remark: '重点推进汽车消费贷款和车主信用卡',
      agreementName: '比亚迪金融合作协议.pdf',
      agreementUrl: 'https://example.com/files/agreement_byd.pdf'
    }
  ]
}

/* ============================================================
 * 接口定义
 * ============================================================ */

/**
 * 获取项目详情（编辑模式）
 * @param {number|string} projectId - 项目 ID
 * @returns {Promise<Object>}
 */
export function getProjectDetail(projectId) {
  // TODO: 替换为真实接口
  // return http.get('/api/project/customer-acquisition/detail', { params: { id: projectId } })
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ data: JSON.parse(JSON.stringify(MOCK_PROJECT_DETAIL)) })
    }, 300)
  })
}

/**
 * 保存项目说明
 * @param {Object} data - { id, projectDescription, projectAttachments }
 * @returns {Promise}
 */
export function saveProjectDescription(data) {
  // TODO: 替换为真实接口
  // return http.post('/api/project/customer-acquisition/save-description', data)
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ data: { success: true } })
    }, 200)
  })
}

/**
 * 添加合作客户
 * @param {Object} data - 客户表单数据
 * @returns {Promise}
 */
export function addCustomer(data) {
  // TODO: 替换为真实接口
  // return http.post('/api/project/customer-acquisition/add-customer', data)
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ data: { success: true, id: Date.now() } })
    }, 200)
  })
}

/**
 * 编辑合作客户
 * @param {Object} data - 客户表单数据（含 id）
 * @returns {Promise}
 */
export function updateCustomer(data) {
  // TODO: 替换为真实接口
  // return http.post('/api/project/customer-acquisition/update-customer', data)
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ data: { success: true } })
    }, 200)
  })
}

/**
 * 删除合作客户
 * @param {number|string} customerId
 * @returns {Promise}
 */
export function deleteCustomer(customerId) {
  // TODO: 替换为真实接口
  // return http.post('/api/project/customer-acquisition/delete-customer', { id: customerId })
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({ data: { success: true } })
    }, 200)
  })
}

/**
 * 上传文件（通用）
 * @description 上传入口，返回文件信息
 * @param {FormData} formData
 * @returns {Promise}
 */
export function uploadFile(formData) {
  // TODO: 替换为真实接口
  // return http.post('/api/common/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  return new Promise(function (resolve) {
    setTimeout(function () {
      var file = formData.get('file')
      resolve({
        data: {
          success: true,
          fileName: file ? file.name : 'uploaded_file',
          fileUrl: 'https://example.com/files/' + (file ? file.name : 'uploaded_file')
        }
      })
    }, 300)
  })
}
