<template>
  <div class="pf-company-list">
    <van-search
      v-model="searchValue"
      placeholder="公司名称/类型/分类"
      shape="round"
      show-action
      @search="onSearch"
      @cancel="$router.go(-1)"
    />
    <div class="filter-bar">
      <van-dropdown-menu>
        <van-dropdown-item v-model="typeFilter" :options="typeOptions" @change="onFilterChange" />
      </van-dropdown-menu>
      <van-button type="primary" size="small" icon="plus" @click="goAddCompany">新增公司</van-button>
    </div>
    <div class="list-container">
      <div
        class="list-item"
        v-for="item in filteredList"
        :key="item.id"
        @click="goDetail(item)"
      >
        <div class="item-main">
          <div class="item-title">{{ item.name }}</div>
          <div class="item-info">
            <van-tag type="primary" size="medium">{{ item.type }}</van-tag>
            <span>{{ item.category }}</span>
          </div>
          <div class="item-info">
            <span>授信 {{ item.creditAmount }}万</span>
            <span>贷款余额 {{ item.loanBalance }}万</span>
          </div>
        </div>
        <van-icon name="arrow" />
      </div>
      <van-empty v-if="!filteredList.length" description="暂无公司" />
    </div>
  </div>
</template>

<script>
import { companyList } from './mockData'

export default {
  name: 'pfCompanyList',
  data() {
    return {
      searchValue: '',
      typeFilter: 'all',
      typeOptions: [
        { text: '全部', value: 'all' },
        { text: '订单贷公司', value: '订单贷公司' },
        { text: '民营小企业', value: '民营小企业' },
      ],
      list: [],
    }
  },
  computed: {
    filteredList() {
      let list = this.list
      if (this.typeFilter !== 'all') {
        list = list.filter(c => c.type === this.typeFilter)
      }
      if (this.searchValue) {
        const kw = this.searchValue.toLowerCase()
        list = list.filter(c =>
          c.name.toLowerCase().includes(kw) ||
          (c.type && c.type.includes(this.searchValue)) ||
          (c.category && c.category.includes(this.searchValue))
        )
      }
      return list
    },
  },
  created() {
    this.list = [...companyList]
  },
  methods: {
    onSearch() {},
    onFilterChange() {},
    goDetail(item) {
      this.$router.push({ name: 'pfCompanyDetail', query: { id: item.id } })
    },
    goAddCompany() {
      this.$router.push({ name: 'pfEditCompany' })
    },
  },
}
</script>

<style lang="less" scoped>
.pf-company-list {
  min-height: 100vh;
  background: #f5f6fa;

  .filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #fff;
  }

  .list-container {
    padding: 20px;
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
        gap: 16px;
      }
    }
  }
}
</style>
