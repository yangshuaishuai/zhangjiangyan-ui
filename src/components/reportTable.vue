<template>
  <div class="pages">
    <div class="table">
      <el-table :data="tableData" style="width: 100%" height="100%">
        <el-table-column prop="cjName" label="场景" width="180">
        </el-table-column>
        <el-table-column prop="description" label="描述" width="180">
        </el-table-column>
        <el-table-column prop="updateUserName" label="操作人名称">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :pager-count="5"
      background
      small
      :current-page.sync="current"
      @current-change="currentPage"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "report-table",
  props: ["tableData", "total", "pageIndex"],
  data() {
    return {
      current: 1,
    };
  },
  created() {},
  methods: {
    currentPage() {
      console.log(this.current, "--**");
      this.$emit("onLoad", this.current);
    },
  },
};
</script>

<style scoped lang="less">
.pages {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  .table {
    flex: 1;
    height: 0;
  }
  .el-pagination {
    text-align: right;
    padding-top: 20px;
  }
  ::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #5176e0;
  }
}
</style>
