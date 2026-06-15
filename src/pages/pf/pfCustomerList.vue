<template>
  <div class="pf-customer-list">
    <van-search
      v-model="searchValue"
      placeholder="姓名/联系方式/条线"
      shape="round"
      show-action
      @search="onSearch"
      @cancel="$router.go(-1)"
    />
    <div class="toolbar">
      <div class="total">共 {{ filteredList.length }} 条</div>
      <van-button type="primary" size="small" icon="plus" @click="goAddCustomer">新增客户</van-button>
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
          <div class="item-info">电话：{{ item.maskedPhone }}</div>
          <div class="item-info">所属公司：{{ item.companyName }}</div>
        </div>
        <van-icon name="arrow" />
      </div>
      <van-empty v-if="!filteredList.length" description="暂无客户" />
    </div>
  </div>
</template>

<script>
import { customerList } from './mockData'

export default {
  name: 'pfCustomerList',
  data() {
    return {
      searchValue: '',
      list: [],
    }
  },
  computed: {
    filteredList() {
      let list = this.list
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
    this.list = [...customerList]
  },
  methods: {
    onSearch() {},
    goDetail(item) {
      this.$router.push({ name: 'pfCustomerDetail', query: { id: item.id } })
    },
    goAddCustomer() {
      this.$router.push({ name: 'pfEditCustomer' })
    },
  },
}
</script>

<style lang="less" scoped>
.pf-customer-list {
  min-height: 100vh;
  background: #f5f6fa;

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: #fff;
    .total {
      font-size: 26px;
      color: #969799;
    }
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
        margin-top: 6px;
      }
    }
  }
}
</style>
