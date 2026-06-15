<template>
  <div class="pf-company-visit-detail">
    <!-- 走访信息 -->
    <div class="info-card" v-if="visit">
      <div class="card-header">
        <span class="title">走访日期</span>
        <span class="title-value">{{ visit.visitDate }}</span>
      </div>
      <van-cell-group>
        <van-cell title="走访地址" :value="visit.address" />
        <van-cell title="走访人员" :value="visit.visitorType + ' / ' + visit.visitorNames" />
        <van-cell title="代发储备金额" :value="visit.payrollReserveAmount + '万元'" />
      </van-cell-group>
    </div>

    <!-- 走访说明 -->
    <div class="info-card" v-if="visit && visit.description">
      <div class="card-header">
        <span class="title">走访说明</span>
      </div>
      <div class="description-text">{{ visit.description }}</div>
    </div>

    <!-- 走访记录列表 -->
    <div class="info-card" v-if="companyId && allVisits.length">
      <div class="card-header">
        <span class="title">走访记录</span>
        <van-button type="primary" size="small" @click="goAddVisit">新增走访</van-button>
      </div>
      <div class="visit-total">该公司共 {{ allVisits.length }} 条走访</div>
      <div
        class="visit-item"
        v-for="item in allVisits"
        :key="item.id"
        @click="switchVisit(item)"
      >
        <div class="visit-tag">走访记录 #{{ item.id }}</div>
        <div class="visit-info">
          {{ item.visitDate }} · 代发储备 {{ item.payrollReserveAmount }}万元 · {{ item.visitorType }}/{{ item.visitorNames }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { companyVisitList, getCompanyVisitsByCompanyId } from './mockData'

export default {
  name: 'pfCompanyVisitDetail',
  data() {
    return {
      visit: null,
      companyId: '',
      allVisits: [],
    }
  },
  created() {
    const id = this.$route.query.id
    this.companyId = this.$route.query.companyId || ''
    this.visit = companyVisitList.find(v => v.id === id)
    if (this.companyId) {
      this.allVisits = getCompanyVisitsByCompanyId(this.companyId)
    } else if (this.visit) {
      this.companyId = this.visit.companyId
      this.allVisits = getCompanyVisitsByCompanyId(this.visit.companyId)
    }
  },
  methods: {
    switchVisit(item) {
      this.visit = item
    },
    goAddVisit() {
      this.$router.push({ name: 'pfAddCompanyVisit', query: { id: this.companyId } })
    },
  },
}
</script>

<style lang="less" scoped>
.pf-company-visit-detail {
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
      .title-value {
        font-size: 28px;
        color: #1989fa;
        font-weight: 600;
      }
    }
  }

  .description-text {
    padding: 20px 24px;
    font-size: 28px;
    color: #646566;
    line-height: 1.6;
  }

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
</style>
