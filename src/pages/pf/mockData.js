// 个金部一体化营销 - Mock数据服务
// 所有数据均为模拟数据，不调用后端接口

// ============ 公司数据 ============
export const companyList = [
  {
    id: 'C001',
    name: '南京云链科技有限公司',
    type: '订单贷公司',
    category: '科技企业',
    creditAmount: 500,
    loanBalance: 320,
    enterpriseNo: 'ENT20260001',
    contactPerson: '张经理',
    contactPhone: '025-88886666',
    address: '南京市鼓楼区中山北路100号',
    relatedCustomers: ['KH001', 'KH005'],
    visitCount: 3,
  },
  {
    id: 'C002',
    name: '秦淮区政务服务中心',
    type: '民营小企业',
    category: '政府机构',
    creditAmount: 0,
    loanBalance: 0,
    enterpriseNo: 'ENT20260002',
    contactPerson: '王主任',
    contactPhone: '025-55551234',
    address: '南京市秦淮区中华路200号',
    relatedCustomers: ['KH002'],
    visitCount: 2,
  },
  {
    id: 'C003',
    name: '建邺区商贸集团',
    type: '订单贷公司',
    category: '商贸企业',
    creditAmount: 800,
    loanBalance: 450,
    enterpriseNo: 'ENT20260003',
    contactPerson: '李总',
    contactPhone: '025-66667890',
    address: '南京市建邺区河西大街300号',
    relatedCustomers: ['KH003'],
    visitCount: 1,
  },
  {
    id: 'C004',
    name: '玄武区商会',
    type: '民营小企业',
    category: '商会组织',
    creditAmount: 200,
    loanBalance: 100,
    enterpriseNo: 'ENT20260004',
    contactPerson: '赵会长',
    contactPhone: '025-77778888',
    address: '南京市玄武区珠江路500号',
    relatedCustomers: ['KH004'],
    visitCount: 3,
  },
  {
    id: 'C005',
    name: '江北新区产业园',
    type: '订单贷公司',
    category: '产业园区',
    creditAmount: 1200,
    loanBalance: 800,
    enterpriseNo: 'ENT20260005',
    contactPerson: '孙园长',
    contactPhone: '025-99990000',
    address: '南京市江北新区浦口大道66号',
    relatedCustomers: [],
    visitCount: 0,
  },
]

// ============ 客户数据 ============
export const customerList = [
  {
    id: 'KH001',
    name: '王建国',
    phone: '18612340897',
    maskedPhone: '186****0897',
    companyId: 'C001',
    companyName: '南京云链科技有限公司',
    custNo: 'CUST20260001',
    isSelfOperated: '是',
    custLevel: '富嘉',
    currentAUM: 520,
    branchName: '鼓楼支行',
    visitCount: 3,
  },
  {
    id: 'KH002',
    name: '李明华',
    phone: '13912341234',
    maskedPhone: '139****1234',
    companyId: 'C002',
    companyName: '秦淮区政务服务中心',
    custNo: 'CUST20260002',
    isSelfOperated: '否',
    custLevel: '普通',
    currentAUM: 80,
    branchName: '秦淮支行',
    visitCount: 2,
  },
  {
    id: 'KH003',
    name: '张晓峰',
    phone: '15856785678',
    maskedPhone: '158****5678',
    companyId: 'C003',
    companyName: '建邺区商贸集团',
    custNo: 'CUST20260003',
    isSelfOperated: '是',
    custLevel: '钻石',
    currentAUM: 1200,
    branchName: '建邺支行',
    visitCount: 1,
  },
  {
    id: 'KH004',
    name: '赵雅琴',
    phone: '18723452345',
    maskedPhone: '187****2345',
    companyId: 'C004',
    companyName: '玄武区商会',
    custNo: 'CUST20260004',
    isSelfOperated: '否',
    custLevel: '普通',
    currentAUM: 30,
    branchName: '玄武支行',
    visitCount: 2,
  },
  {
    id: 'KH005',
    name: '钱伟民',
    phone: '13678907890',
    maskedPhone: '136****7890',
    companyId: 'C001',
    companyName: '南京云链科技有限公司',
    custNo: 'CUST20260005',
    isSelfOperated: '是',
    custLevel: '私行',
    currentAUM: 3000,
    branchName: '鼓楼支行',
    visitCount: 3,
  },
]

// ============ 客户走访记录 ============
export const customerVisitList = [
  {
    id: 'V001',
    customerId: 'KH001',
    visitDate: '2026-05-02',
    visitorType: '二分行领导',
    visitorNames: '客户经理',
    address: '南京市鼓楼区中央路88号',
    photos: [],
    familyAUM: 520,
    reserveAUM: 180,
    aumExpectedTime: '2026-08',
    reserveFujia: 1,
    reserveZuanshi: 0,
    reserveSixing: 0,
    description: '',
  },
  {
    id: 'V002',
    customerId: 'KH001',
    visitDate: '2026-05-11',
    visitorType: '财富顾问',
    visitorNames: '客户经理',
    address: '南京市鼓楼区中山北路120号',
    photos: [],
    familyAUM: 600,
    reserveAUM: 260,
    aumExpectedTime: '2026-09',
    reserveFujia: 0,
    reserveZuanshi: 1,
    reserveSixing: 0,
    description: '客户对私行产品表现出浓厚兴趣',
  },
  {
    id: 'V003',
    customerId: 'KH001',
    visitDate: '2026-05-16',
    visitorType: '客户经理',
    visitorNames: '客户经理',
    address: '南京市鼓楼区汉中门大街50号',
    photos: [],
    familyAUM: 550,
    reserveAUM: 90,
    aumExpectedTime: '2026-07',
    reserveFujia: 0,
    reserveZuanshi: 0,
    reserveSixing: 0,
    description: '普通客群维护走访',
  },
  {
    id: 'V004',
    customerId: 'KH005',
    visitDate: '2026-05-05',
    visitorType: '私行客户经理',
    visitorNames: '私行客户经理',
    address: '南京市鼓楼区汉中路140号',
    photos: [],
    familyAUM: 3000,
    reserveAUM: 500,
    aumExpectedTime: '2026-06',
    reserveFujia: 2,
    reserveZuanshi: 1,
    reserveSixing: 1,
    description: '私行客户季度维护',
  },
]

// ============ 公司走访记录 ============
export const companyVisitList = [
  {
    id: 'CV001',
    companyId: 'C001',
    visitDate: '2026-05-08',
    visitorType: '二分个金总',
    visitorNames: '一支行领导 / 渠道专员',
    address: '南京市鼓楼区中山北路66号',
    photos: [],
    payrollReserveAmount: 0,
    description: '已接触财务总监和人力负责人，后续跟进代发试点与财私客户转化。',
  },
  {
    id: 'CV002',
    companyId: 'C001',
    visitDate: '2026-05-18',
    visitorType: '财富顾问',
    visitorNames: '客户经理',
    address: '南京市鼓楼区中山北路66号',
    photos: [],
    payrollReserveAmount: 60,
    description: '代发业务初步对接，收集企业员工名册。',
  },
  {
    id: 'CV003',
    companyId: 'C001',
    visitDate: '2026-05-28',
    visitorType: '二分行领导',
    visitorNames: '私行客户经理',
    address: '南京市鼓楼区中山北路66号',
    photos: [],
    payrollReserveAmount: 120,
    description: '代发试点正式启动，首批覆盖30名核心员工。',
  },
  {
    id: 'CV004',
    companyId: 'C004',
    visitDate: '2026-05-12',
    visitorType: '客户经理',
    visitorNames: '客户经理',
    address: '南京市玄武区珠江路500号',
    photos: [],
    payrollReserveAmount: 50,
    description: '商会会员企业走访，了解批量开户需求。',
  },
]

// ============ 储备客户数据 ============
export const reserveCustomerList = [
  {
    id: 'RC001',
    name: '陈志强',
    phone: '13800001111',
    maskedPhone: '138****1111',
    custLevel: '富嘉',
    reserveAUM: 200,
    expectedTime: '2026-07',
    source: '公司走访',
    companyId: 'C001',
    companyName: '南京云链科技有限公司',
  },
  {
    id: 'RC002',
    name: '刘芳',
    phone: '15900002222',
    maskedPhone: '159****2222',
    custLevel: '钻石',
    reserveAUM: 800,
    expectedTime: '2026-08',
    source: '客户推荐',
    companyId: '',
    companyName: '',
  },
  {
    id: 'RC003',
    name: '周涛',
    phone: '18700003333',
    maskedPhone: '187****3333',
    custLevel: '私行',
    reserveAUM: 2000,
    expectedTime: '2026-09',
    source: '代发转化',
    companyId: 'C003',
    companyName: '建邺区商贸集团',
  },
]

// ============ 辅助方法 ============
let nextCompanyId = 6
let nextCustomerId = 6
let nextCVisitId = 5
let nextCompanyVisitId = 5

export function addCompany(data) {
  const company = {
    ...data,
    id: 'C' + String(nextCompanyId++).padStart(3, '0'),
    relatedCustomers: [],
    visitCount: 0,
  }
  companyList.push(company)
  return company
}

export function updateCompany(id, data) {
  const idx = companyList.findIndex(c => c.id === id)
  if (idx >= 0) {
    companyList[idx] = { ...companyList[idx], ...data }
    return companyList[idx]
  }
  return null
}

export function addCustomer(data) {
  const customer = {
    ...data,
    id: 'KH' + String(nextCustomerId++).padStart(3, '0'),
    visitCount: 0,
  }
  customerList.push(customer)
  return customer
}

export function updateCustomer(id, data) {
  const idx = customerList.findIndex(c => c.id === id)
  if (idx >= 0) {
    customerList[idx] = { ...customerList[idx], ...data }
    return customerList[idx]
  }
  return null
}

export function addCustomerVisit(data) {
  const visit = {
    ...data,
    id: 'V' + String(nextCVisitId++).padStart(3, '0'),
  }
  customerVisitList.push(visit)
  return visit
}

export function addCompanyVisit(data) {
  const visit = {
    ...data,
    id: 'CV' + String(nextCompanyVisitId++).padStart(3, '0'),
  }
  companyVisitList.push(visit)
  return visit
}

export function getCompanyById(id) {
  return companyList.find(c => c.id === id) || null
}

export function getCustomerById(id) {
  return customerList.find(c => c.id === id) || null
}

export function getCustomerVisitsByCustomerId(customerId) {
  return customerVisitList.filter(v => v.customerId === customerId)
}

export function getCompanyVisitsByCompanyId(companyId) {
  return companyVisitList.filter(v => v.companyId === companyId)
}

export function getRelatedCustomers(companyId) {
  return customerList.filter(c => c.companyId === companyId)
}

// 走访人员类型选项
export const visitorTypeOptions = [
  { text: '二分行领导', value: '二分行领导' },
  { text: '二分个金总', value: '二分个金总' },
  { text: '一支行领导', value: '一支行领导' },
  { text: '财富顾问', value: '财富顾问' },
  { text: '客户经理', value: '客户经理' },
  { text: '渠道专员', value: '渠道专员' },
  { text: '私行客户经理', value: '私行客户经理' },
]

// 客户等级选项
export const custLevelOptions = [
  { text: '普通', value: '普通' },
  { text: '富嘉', value: '富嘉' },
  { text: '钻石', value: '钻石' },
  { text: '私行', value: '私行' },
]

// 公司类型选项
export const companyTypeOptions = [
  { text: '订单贷公司', value: '订单贷公司' },
  { text: '民营小企业', value: '民营小企业' },
]
