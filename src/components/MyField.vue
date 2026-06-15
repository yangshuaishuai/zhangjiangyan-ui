<template>
  <main>
    <div v-for="(item, i) in dataForm" :key="i">
      <van-field
        v-if="item.parentKey ? showChild(item.parentKey, item.key) : true"
        v-show="item.isHide ? false : true"
        :placeholder="
          item.typeText
            ? item.typeText
            : item.type == 'picker' ||
              item.type == 'time' ||
              item.type == 'checkbox' ||
              item.type == 'href' ||
              item.type == 'area' ||
              item.type == 'showPicker' ||
              item.type == 'dateTime'
            ? '请选择'
            : '请输入'
        "
        v-model="item.val"
        autosize
        input-align="right"
        :rows="item.rowsNum ? item.rowsNum : 1"
        :error="item.error ? true : false"
        :maxlength="item.maxlength ? item.maxlength : 999"
        :name="item.key"
        :label="item.label"
        :disabled="
          item.isDisabled
            ? handleDisabled(item.isDisabled, item.key)
            : item.disabled
        "
        :readonly="item.readonly"
        :required="item.rules ? item.rules[0].required : false"
        :type="
          item.rows ? 'textarea' : item.inputType ? item.inputType : 'text'
        "
        :clickable="
          item.type == 'picker' ||
          item.type == 'time' ||
          item.type == 'href' ||
          item.type == 'area' ||
          item.type == 'dateTime'
            ? true
            : false
        "
        :is-link="
          item.disabled
            ? false
            : item.type == 'picker' ||
              item.type == 'time' ||
              item.type == 'href' ||
              item.type == 'area' ||
              item.type == 'showPicker' ||
              item.type == 'dateTime'
            ? true
            : false
        "
        @click="showPicker(item, i)"
        @input="input($event, item, i)"
        @focus="focus(item, i)"
        @blur="blur(item, i)"
        :rules="item.rules"
      >
        <template #input v-if="item.type == 'radio'">
          <van-radio-group
            v-model="item.val"
            :disabled="item.isRadioDisable"
            direction="horizontal"
            checked-color="#5176E0"
            style="display: flex"
            @change="change(item, i)"
          >
            <van-radio
              style="margin: 2px"
              v-for="(child, c) in item.columns"
              :key="c"
              :name="
                item.columnsConfig
                  ? child[item.columnsConfig.value]
                  : child.code
              "
              :disabled="item.disabled"
              >{{
                item.columnsConfig ? child[item.columnsConfig.text] : child.text
              }}
            </van-radio>
          </van-radio-group>
        </template>
        <template #input v-else-if="item.type == 'checkbox'">
          <van-checkbox-group
            v-model="item.checkboxVal"
            direction="horizontal"
            checked-color="#5176E0"
            style="display: flex"
          >
            <van-checkbox
              shape="square"
              @click="(ev) => click(item.key, item.checkboxVal)"
              style="margin: 2px"
              v-for="(child, c) in item.columns"
              :key="c"
              :disabled="item.disabled"
              :name="
                item.columnsConfig
                  ? child[item.columnsConfig.value]
                  : child.code
              "
              >{{
                item.columnsConfig ? child[item.columnsConfig.text] : child.text
              }}</van-checkbox
            >
          </van-checkbox-group>
        </template>
        <template #input v-else-if="item.parentValKey">
          {{ handleVal(item.parentValKey, item.key) }}
        </template>
        <template #button v-if="item.unit">
          <span>{{ item.unit }}</span>
        </template>
      </van-field>
    </div>
  </main>
</template>
<script>
export default {
  name: "my-field",
  data() {
    return {};
  },
  props: {
    routerPath: {
      default: "",
      type: String,
    },
    dataForm: {
      type: Array,
    },
    dataInfo: {
      type: Object,
    },
  },
  methods: {
    showPicker(item, i) {
      this.$emit("showPicker", item, i);
    },
    input(e, item, i) {
      this.$emit("input", e, item, i);
    },
    focus(item, i) {
      this.$emit("focus", item, i);
    },
    blur(item, i) {
      this.$emit("blur", item, i);
    },
    change(item, i) {
      this.$emit("change", item, i);
    },
    showChild(_key, itemKey) {
      console.log(_key, itemKey, "aaa");
      let flag = false;
      for (var key in this.dataForm) {
        if (this.dataForm[key].key == _key) {
          if (_key == "actIsXuanchuanbd") {
            if (this.dataForm[key].val === "0") {
              flag = true;
            } else {
              flag = false;
            }
          }
          if (_key == "isSyTh") {
            if (this.dataForm[key].val === "1") {
              flag = true;
            } else {
              flag = false;
            }
          }
        }
      }
      return flag;
    },
    handleVal(_key, itemKey) {
      console.log(_key, itemKey, "11");
      var val;
      for (var key in this.dataForm) {
        if (this.dataForm[key].key == _key) {
          if (_key == "limitAmt") {
            if (this.dataForm[key].val) {
              val = "是";
            } else {
              val = "否";
            }
          } else if (_key == "xdAddFkBal") {
            if (this.dataForm[key].val) {
              val = 1;
            } else {
              val = 0;
            }
          }
        }
      }
      return val;
    },
    click(key, checkboxVal) {
      // 复选框选中后复制给表单数据
      this.$emit("checkBoxClick", key, checkboxVal);
    },
    handleDisabled(_key, itemKey) {
      // 处理是否禁用
      let flag = false;
      console.log(this.dataInfo, "-");
      if (_key == "cbStatus") {
        var userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        // Number(this.dataInfo.oldcbStatus >= 2)
        // if (Number(this.dataInfo.oldcbStatus >= 0)) {
        if (
          this.dataInfo.oldcbStatus == 5 ||
          userInfo.userId != this.dataInfo.createUserId
        ) {
          flag = true;
        } else {
          flag = false;
        }
      }
      return flag;
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep .oldVal .van-field__control {
  color: grey;
}
::v-deep .van-field__label {
  width: auto;
}
</style>
