<template>
  <div class="pf-home">
    <!-- 顶部搜索栏 -->
    <div class="search-bar">
      <van-search
        v-model="searchValue"
        placeholder="搜索公司、客户、走访..."
        shape="round"
        @search="onSearch"
        @clear="onClear"
      />
    </div>

    <!-- 主Tab -->
    <van-tabs v-model="activeTab" sticky swipeable @change="onTabChange">
      <van-tab title="公司" name="company">
        <van-tabs v-model="companySubTab" shrink @change="onCompanySubChange">
          <van-tab title="全部" name="all"></van-tab>
          <van-tab title="订单贷公司" name="订单贷公司"></van-tab>
          <van-tab title="民营小企业" name="民营小企业"></van-tab>
        </van-tabs>
        <div class="list-container">
          <div class="toolbar">
            <div class="total">共 {{ filteredCompanyList.length }} 家公司</div>
            <van-button type="primary" size="small" icon="plus" @click="goAddCompany">新增公司</van-button>
          </div>
          <div
            class="list-item"
            v-for="item in filteredCompanyList"
            :key="item.id"
            @click="goCompanyDetail(item)"
          >
            <div class="item-main">
              <div class="item-title">{{ item.name }}</div>
              <div class="item-info">
                <van-tag type="primary" size="medium">{{ item.type }}</van-tag>
                <span class="item-desc">{{ item.enterpriseNo }}</span>
              </div>
              <div class="item-info">
                <span>授信 {{ item.creditAmount }}万元</span>
                <span>贷款余额 {{ item.loanBalance }}万元</span>
              </div>
            </div>
            <van-button type="primary" size="mini" plain @click.stop="goCompanyDetail(item)">详情</van-button>
          </div>
          <van-empty v-if="!filteredCompanyList.length" description="暂无公司数据" />
        </div>
      </van-tab>

      <van-tab title="客户" name="customer">
        <div class="list-container">
          <div class="toolbar">
            <div class="total">共 {{ filteredCustomerList.length }} 条</div>
            <van-button type="primary" size="small" icon="plus" @click="goAddCustomer">新增客户</van-button>
          </div>
          <div
            class="list-item"
            v-for="item in filteredCustomerList"
            :key="item.id"
            @click="goCustomerDetail(item)"
          >
            <div class="item-main">
              <div class="item-title">{{ item.name }}</div>
              <div class="item-info">
                <span>电话：{{ item.maskedPhone }}</span>
              </div>
              <div class="item-info">
                <span class="item-desc">所属公司：{{ item.companyName }}</span>
              </div>
            </div>
            <van-icon name="arrow" />
          </div>
          <van-empty v-if="!filteredCustomerList.length" description="暂无客户数据" />
        </div>
      </van-tab>

      <van-tab title="走访" name="visit">
        <div class="list-container">
          <div class="visit-section">
            <div class="section-title">客户走访</div>
            <div
              class="list-item"
              v-for="item in customerVisitList"
              :key="item.id"
              @click="goCustomerVisitDetail(item)"
            >
              <div class="item-main">
                <div class="item-title">{{ item.visitDate }} 走访</div>
                <div class="item-info">
                  <span>{{ item.visitorType }} / {{ item.visitorNames }}</span>
                </div>
                <div class="item-info">
                  <van-tag type="success" size="medium">储备AUM {{ item.reserveAUM }}万元</van-tag>
                </div>
              </div>
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="visit-section">
            <div class="section-title">公司走访</div>
            <div
              class="list-item"
              v-for="item in companyVisitList"
              :key="item.id"
              @click="goCompanyVisitDetail(item)"
            >
              <div class="item-main">
                <div class="item-title">{{ item.visitDate }} 走访</div>
                <div class="item-info">
                  <span>{{ item.visitorType }} / {{ item.visitorNames }}</span>
                </div>
                <div class="item-info">
                  <van-tag type="warning" size="medium">代发储备 {{ item.payrollReserveAmount }}万元</van-tag>
                </div>
              </div>
              <van-icon name="arrow" />
            </div>
          </div>
          <van-empty v-if="!customerVisitList.length && !companyVisitList.length" description="暂无走访记录" />
        </div>
      </van-tab>

      <van-tab title="储备" name="reserve">
        <div class="list-container">
          <div
            class="list-item"
            v-for="item in reserveCustomerList"
            :key="item.id"
            @click="goEditReserveCustomer(item)"
          >
            <div class="item-main">
              <div class="item-title">{{ item.name }}</div>
              <div class="item-info">
                <van-tag type="primary" size="medium">{{ item.custLevel }}</van-tag>
                <span class="item-desc">储备AUM {{ item.reserveAUM }}万元</span>
              </div>
              <div class="item-info">
                <span class="item-desc">预计引入：{{ item.expectedTime }}</span>
              </div>
            </div>
            <van-icon name="arrow" />
          </div>
          <van-empty v-if="!reserveCustomerList.length" description="暂无储备客户" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {
  companyList,
  customerList,
  customerVisitList,
  companyVisitList,
  reserveCustomerList,
} from './mockData'

export default {
  name: 'pfHome',
  data() {
    return {
      searchValue: '',
      activeTab: 'company',
      companySubTab: 'all',
      companyList: [],
      customerList: [],
      customerVisitList: [],
      companyVisitList: [],
      reserveCustomerList: [],
    }
  },
  computed: {
    filteredCompanyList() {
      let list = this.companyList
      if (this.companySubTab !== 'all') {
        list = list.filter(c => c.type === this.companySubTab)
      }
      if (this.searchValue) {
        const kw = this.searchValue.toLowerCase()
        list = list.filter(c =>
          c.name.toLowerCase().includes(kw) ||
          (c.type && c.type.toLowerCase().includes(kw)) ||
          (c.category && c.category.toLowerCase().includes(kw))
        )
      }
      return list
    },
    filteredCustomerList() {
      let list = this.customerList
      if (this.searchValue) {
        const kw = this.searchValue.toLowerCase()
        list = list.filter(c =>
          c.name.toLowerCase().includes(kw) ||
          c.phone.includes(this.searchValue) ||
          (c.companyName && c.companyName.toLowerCase().includes(kw))
        )
      }
      return list
    },
  },
  created() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.companyList = [...companyList]
      this.customerList = [...customerList]
      this.customerVisitList = [...customerVisitList]
      this.companyVisitList = [...companyVisitList]
      this.reserveCustomerList = [...reserveCustomerList]
    },
    onSearch() {},
    onClear() {
      this.searchValue = ''
    },
    onTabChange() {},
    onCompanySubChange() {},
    goCompanyDetail(item) {
      this.$router.push({ name: 'pfCompanyDetail', query: { id: item.id } })
    },
    goAddCompany() {
      this.$router.push({ name: 'pfEditCompany' })
    },
    goAddCustomer() {
      this.$router.push({ name: 'pfEditCustomer' })
    },
    goCustomerDetail(item) {
      this.$router.push({ name: 'pfCustomerDetail', query: { id: item.id } })
    },
    goCustomerVisitDetail(item) {
      this.$router.push({ name: 'pfCustomerVisitDetail', query: { id: item.id } })
    },
    goCompanyVisitDetail(item) {
      this.$router.push({ name: 'pfCompanyVisitDetail', query: { id: item.id } })
    },
    goEditReserveCustomer(item) {
      this.$router.push({ name: 'pfEditReserveCustomer', query: { id: item.id } })
    },
  },
}
</script>

<style lang="less" scoped>
.pf-home {
  min-height: 100vh;
  background: #f5f6fa;

  .search-bar {
    background: #f5f6fa;
    padding: 10px 0;
  }

  .list-container {
    padding: 20px;
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .total {
      font-size: 26px;
      color: #969799;
    }
  }

  .list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    padding: 24px 20px;
    margin-bottom: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    .item-main {
      flex: 1;
      .item-title {
        font-size: 30px;
        font-weight: 600;
        color: #323233;
        margin-bottom: 10px;
      }
      .item-info {
        font-size: 26px;
        color: #969799;
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .item-desc {
        color: #969799;
      }
    }
  }

  .visit-section {
    margin-bottom: 20px;
    .section-title {
      font-size: 30px;
      font-weight: 600;
      color: #323233;
      margin-bottom: 16px;
      padding-left: 10px;
      border-left: 6px solid #1989fa;
    }
  }
}
</style>
