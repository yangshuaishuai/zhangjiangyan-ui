<template>
  <div class="pf-company-detail" v-if="company">
    <!-- 公司信息卡片 -->
    <div class="info-card">
      <div class="card-header">
        <span class="title">公司信息</span>
        <van-button type="primary" size="small" @click="goEdit">编辑</van-button>
      </div>
      <van-cell-group>
        <van-cell title="公司名称" :value="company.name" />
        <van-cell title="公司类型" :value="company.type" />
        <van-cell title="企业客户号" :value="company.enterpriseNo" />
        <van-cell title="授信金额" :value="company.creditAmount + '万元'" />
        <van-cell title="贷款余额" :value="company.loanBalance + '万元'" />
      </van-cell-group>
      <div class="card-actions">
        <van-button type="primary" size="small" @click="goEdit">编辑</van-button>
        <van-button type="primary" size="small" @click="markAsReserve">标记为储备</van-button>
      </div>
    </div>

    <!-- 关联客户 -->
    <div class="info-card">
      <div class="card-header">
        <span class="title">关联客户</span>
        <van-button type="primary" size="small" @click="goRelateCustomer">关联客户</van-button>
      </div>
      <div class="customer-list" v-if="relatedCustomers.length">
        <div
          class="customer-item"
          v-for="item in relatedCustomers"
          :key="item.id"
        >
          <div @click="goCustomerDetail(item)">
            <div class="cust-name">{{ item.name }}</div>
            <div class="cust-phone">{{ item.maskedPhone }}</div>
          </div>
          <van-button type="danger" size="mini" @click.stop="removeRelation(item)">删除</van-button>
        </div>
      </div>
      <van-empty v-else description="暂无关联客户" :image-size="60" />
    </div>

    <!-- 走访记录 -->
    <div class="info-card">
      <div class="card-header">
        <span class="title">走访记录</span>
        <van-button type="primary" size="small" @click="goAddVisit">新增走访</van-button>
      </div>
      <div class="visit-list" v-if="visitList.length">
        <div class="visit-total">该公司共 {{ visitList.length }} 条走访</div>
        <div
          class="visit-item"
          v-for="item in visitList"
          :key="item.id"
          @click="goVisitDetail(item)"
        >
          <div class="visit-tag">走访记录 #{{ item.id }}</div>
          <div class="visit-info">
            {{ item.visitDate }} · 代发储备 {{ item.payrollReserveAmount }}万元 · {{ item.visitorType }}/{{ item.visitorNames }}
          </div>
        </div>
      </div>
      <van-empty v-else description="暂无走访记录" :image-size="60" />
    </div>
  </div>
</template>

<script>
import { getCompanyById, getRelatedCustomers, getCompanyVisitsByCompanyId, customerList } from './mockData'

export default {
  name: 'pfCompanyDetail',
  data() {
    return {
      company: null,
      relatedCustomers: [],
      visitList: [],
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const id = this.$route.query.id
      this.company = getCompanyById(id)
      this.relatedCustomers = getRelatedCustomers(id)
      this.visitList = getCompanyVisitsByCompanyId(id)
    },
    goEdit() {
      this.$router.push({ name: 'pfEditCompany', query: { id: this.company.id } })
    },
    goRelateCustomer() {
      this.$router.push({ name: 'pfCustomerList', query: { companyId: this.company.id } })
    },
    goCustomerDetail(item) {
      this.$router.push({ name: 'pfCustomerDetail', query: { id: item.id } })
    },
    removeRelation(item) {
      this.$dialog.confirm({
        title: '确认',
        message: '确定要解除与 ' + item.name + ' 的关联吗？',
      }).then(() => {
        const idx = this.company.relatedCustomers.indexOf(item.id)
        if (idx >= 0) {
          this.company.relatedCustomers.splice(idx, 1)
        }
        this.relatedCustomers = getRelatedCustomers(this.company.id)
        this.$toast('已解除关联')
      }).catch(() => {})
    },
    markAsReserve() {
      this.$toast('已标记为储备')
    },
    goAddVisit() {
      this.$router.push({ name: 'pfAddCompanyVisit', query: { id: this.company.id } })
    },
    goVisitDetail(item) {
      this.$router.push({ name: 'pfCompanyVisitDetail', query: { id: item.id, companyId: this.company.id } })
    },
  },
}
</script>

<style lang="less" scoped>
.pf-company-detail {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 40px;

  .info-card {
    background: #fff;
    margin: 20px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;
      .title {
        font-size: 30px;
        font-weight: 600;
        color: #323233;
      }
    }

    .card-actions {
      display: flex;
      gap: 16px;
      padding: 20px 24px;
      justify-content: center;
      border-top: 1px solid #f0f0f0;
    }
  }

  .customer-list {
    .customer-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #f5f5f5;
      .cust-name {
        font-size: 28px;
        font-weight: 500;
        color: #323233;
      }
      .cust-phone {
        font-size: 24px;
        color: #969799;
        margin-top: 6px;
      }
    }
  }

  .visit-list {
    .visit-total {
      text-align: center;
      padding: 20px;
      font-size: 24px;
      color: #969799;
    }
    .visit-item {
      padding: 20px 24px;
      border-bottom: 1px solid #f5f5f5;
      .visit-tag {
        font-size: 26px;
        color: #1989fa;
        font-weight: 500;
      }
      .visit-info {
        font-size: 24px;
        color: #969799;
        margin-top: 8px;
        line-height: 1.5;
      }
    }
  }
}
</style>
