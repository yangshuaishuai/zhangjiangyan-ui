<template>
  <div class="pf-customer-detail" v-if="customer">
    <!-- 客户信息卡片 -->
    <div class="info-card">
      <div class="card-header">
        <span class="title">客户信息</span>
        <van-button type="primary" size="small" plain @click="goEdit">编辑</van-button>
      </div>
      <van-cell-group>
        <van-cell title="姓名" :value="customer.name" />
        <van-cell title="客户编号" :value="customer.custNo" />
        <van-cell title="手机号" :value="customer.maskedPhone" />
        <van-cell title="当前管户网点" :value="customer.branchName" />
        <van-cell title="是否自营" :value="customer.isSelfOperated" />
        <van-cell title="客户等级" :value="customer.custLevel" />
        <van-cell title="当前AUM(万元)" :value="customer.currentAUM" />
        <van-cell title="所属公司" :value="customer.companyName || '暂无'" is-link @click="goCompanyDetail" />
      </van-cell-group>
      <div class="card-actions">
        <van-button type="default" size="small" @click="goEdit">编辑</van-button>
        <van-button type="info" size="small" round @click="markAsReserve">标记为储备</van-button>
      </div>
    </div>

    <!-- 走访记录 -->
    <div class="info-card">
      <div class="card-header">
        <span class="title">走访记录</span>
        <van-button type="warning" size="small" @click="goAddVisit">新增走访</van-button>
      </div>
      <div class="visit-list" v-if="visitList.length">
        <div class="visit-total">该客户共 {{ visitList.length }} 条走访</div>
        <div
          class="visit-item"
          v-for="item in visitList"
          :key="item.id"
          @click="goVisitDetail(item)"
        >
          <div class="visit-tag">走访记录 #{{ item.id }}</div>
          <div class="visit-info">
            {{ item.visitDate }} · 储备AUM {{ item.reserveAUM }}万元{{ item.reserveFujia ? ' · 富嘉 ' + item.reserveFujia + '户' : '' }}{{ item.reserveZuanshi ? ' · 钻石 ' + item.reserveZuanshi + '户' : '' }}{{ item.reserveSixing ? ' · 私行 ' + item.reserveSixing + '户' : '' }}
          </div>
        </div>
      </div>
      <van-empty v-else description="暂无走访记录" :image-size="60" />
    </div>
  </div>
</template>

<script>
import { getCustomerById, getCustomerVisitsByCustomerId } from './mockData'

export default {
  name: 'pfCustomerDetail',
  data() {
    return {
      customer: null,
      visitList: [],
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      const id = this.$route.query.id
      this.customer = getCustomerById(id)
      this.visitList = getCustomerVisitsByCustomerId(id)
    },
    goEdit() {
      this.$router.push({ name: 'pfEditCustomer', query: { id: this.customer.id } })
    },
    goCompanyDetail() {
      if (this.customer.companyId) {
        this.$router.push({ name: 'pfCompanyDetail', query: { id: this.customer.companyId } })
      }
    },
    markAsReserve() {
      this.$toast('已标记为储备')
    },
    goAddVisit() {
      this.$router.push({ name: 'pfAddCustomerVisit', query: { id: this.customer.id } })
    },
    goVisitDetail(item) {
      this.$router.push({ name: 'pfCustomerVisitDetail', query: { id: item.id, customerId: this.customer.id } })
    },
  },
}
</script>

<style lang="less" scoped>
.pf-customer-detail {
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
