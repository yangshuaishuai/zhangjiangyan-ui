import store from "../vuex/store"
export default {
    url(u) {
        return store.state.proxyURL.trim() + this[u.trim()];
    },
    url2(u) {
        return store.state.BASEURL.trim() + this[u.trim()];
    },
    url3(u) {
        return store.state.FILEURL.trim() + this[u.trim()];
    },
    proxyURL: store.state.proxyURL,
    BASEURL: store.state.BASEURL,
    //分页查询路演活动列表
    querySamllRoadshowActInfoByPage: "api/phone/samllRoadshowActInfo/querySamllRoadshowActInfoByPage",
    //根据id查询路演活动详情
    querySamllRoadshowActInfoById: "api/phone/samllRoadshowActInfo/querySamllRoadshowActInfoById",
    //根据活动id查询渠道信息
    querySamllRoadshowChannelInfoByActId: "api/phone/samllRoadshowChannelInfo/querySamllRoadshowChannelInfoByActId",
    //保存路演活动表
    saveOrUpdateSamllRoadshowActInfo: "api/phone/samllRoadshowActInfo/saveOrUpdateSamllRoadshowActInfo",
    //删除路演活动表
    delSamllRoadshowActInfoByIds: "api/phone/samllRoadshowActInfo/delSamllRoadshowActInfoByIds",

    // 分页查询客户信息
    querySamllRoadshowCustomerByPage: "api/phone/samllRoadshowCustomer/querySamllRoadshowCustomerByPage",
    //id查询客户信息
    querySamllRoadshowCustomerById: "api/phone/samllRoadshowCustomer/querySamllRoadshowCustomerById",
    //保存客户信息
    saveOrUpdateSamllRoadshowCustomer: "api/phone/samllRoadshowCustomer/saveOrUpdateSamllRoadshowCustomer",
    //删除客户信息
    delSamllRoadshowCustomerByIds: "api/phone/samllRoadshowCustomer/delSamllRoadshowCustomerByIds",

    //分页查询渠道信息登记列表
    querySamllRoadshowChannelInfoByPage: "api/phone/samllRoadshowChannelInfo/querySamllRoadshowChannelInfoByPage",
    //根据id查询渠道信息登记
    querySamllRoadshowChannelInfoById: "api/phone/samllRoadshowChannelInfo/querySamllRoadshowChannelInfoById",
    //保存渠道信息登记
    saveOrUpdateSamllRoadshowChannelInfo: "api/phone/samllRoadshowChannelInfo/saveOrUpdateSamllRoadshowChannelInfo",
    //删除渠道信息登记
    delSamllRoadshowChannelInfoByIds: "api/phone/samllRoadshowChannelInfo/delSamllRoadshowChannelInfoByIds",

    //分页查询渠道走访表
    querySamllRoadshowChannelInterByPage: "api/phone/samllRoadshowChannelInter/querySamllRoadshowChannelInterByPage",
    //根据id查询渠道走访表
    querySamllRoadshowChannelInterById: "api/phone/samllRoadshowChannelInter/querySamllRoadshowChannelInterById",
    //保存渠道走访表
    saveOrUpdateSamllRoadshowChannelInter: "api/phone/samllRoadshowChannelInter/saveOrUpdateSamllRoadshowChannelInter",
    //删除渠道走访表
    delSamllRoadshowChannelInterByIds: "api/phone/samllRoadshowChannelInter/delSamllRoadshowChannelInterByIds",

    //分页查询客户走访表
    querySamllRoadshowCustomerInterviewByPage: "api/phone/samllRoadshowCustomerInterview/querySamllRoadshowCustomerInterviewByPage",
    //根据id查询客户走访表
    querySamllRoadshowCustomerInterviewById: "api/phone/samllRoadshowCustomerInterview/querySamllRoadshowCustomerInterviewById",
    //保存客户走访表
    saveOrUpdateSamllRoadshowCustomerInterview: "api/phone/samllRoadshowCustomerInterview/saveOrUpdateSamllRoadshowCustomerInterview",
    //删除客户走访表
    delSamllRoadshowCustomerInterviewByIds: "api/phone/samllRoadshowCustomerInterview/delSamllRoadshowCustomerInterviewByIds",
    // 查询移交人员信息
    queryAllUserInfo: "api/phone/common/queryAllUserInfo",
    // 确认移交客户
    yjCustomer: "api/phone/samllRoadshowCustomer/yjCustomer",

    // 字典信息
    queryDictInfoByDictTypeId: "api/phone/common/queryDictInfoByDictTypeId",
    // 查询当前登录人信息
    queryLoginUserInfo: "api/phone/samllRoadshowActInfo/queryLoginUserInfo",

    // 保存活动和渠道信息表（关联）
    saveSamllRoadshowActAndChannelInfo: "api/phone/samllRoadshowActInfo/saveSamllRoadshowActAndChannelInfo",
    // 保存活动和客户信息表（关联）
    saveSamllRoadshowActAndCustInfo: "api/phone/samllRoadshowActInfo/saveSamllRoadshowActAndCustInfo",
    // 活动地点（县/区）
    querySamllRoadshowActQxInfo: "api/phone/samllRoadshowActInfo/querySamllRoadshowActQxInfo",
    // 活动地点（镇/街道）
    querySamllRoadshowActXzInfo: "api/phone/samllRoadshowActInfo/querySamllRoadshowActXzInfo",
    // 查询渠道类型，B端类型
    querySamllRoadshowChannelTypeInfo: "api/phone/samllRoadshowChannelInfo/querySamllRoadshowChannelTypeInfo",
    // 上传文件
    uploadFile: "api/phone/samllRoadshowActInfo/uploadFile",
    // 下载文件
    downloadFile: "api/phone/samllRoadshowActInfo/downloadFile",
    // 通过二分查询一支信息
    queryYzInfoByEf: "api/phone/samllRoadshowActInfo/queryYzInfoByEf",

    // 分页查询场景信息
    querySamllRoadshowCjInfoByPage: "api/phone/samllRoadshowCjInfo/querySamllRoadshowCjInfoByPage",
    // 分页查询客户储备状态信息
    querySamllRoadshowCustomerCbInfoByPage: "api/phone/samllRoadshowCustomerCbInfo/querySamllRoadshowCustomerCbInfoByPage",
    // 保存客户储备状态信息
    saveOrUpdateSamllRoadshowCustomerCbInfo: "api/phone/samllRoadshowCustomerCbInfo/saveOrUpdateSamllRoadshowCustomerCbInfo",

    // 分页查询两小路演-渠道-网格员信息
    querySamllRoadshowChannelWgyByPage: "api/phone/samllRoadshowChannelWgy/querySamllRoadshowChannelWgyByPage",
    // 根据id查询两小路演-渠道-网格员信息
    querySamllRoadshowChannelWgyById: "api/phone/samllRoadshowChannelWgy/querySamllRoadshowChannelWgyById",
    // 保存或者修改两小路演-渠道-网格员信息
    saveOrUpdateSamllRoadshowChannelWgy: "api/phone/samllRoadshowChannelWgy/saveOrUpdateSamllRoadshowChannelWgy",
    // 批量新增网格员信息
    batchSaveSamllRoadshowChannelWgy: "api/phone/samllRoadshowChannelWgy/batchSaveSamllRoadshowChannelWgy",

    // 根据众ID删除两小路演-渠道-网格员信息
    delSamllRoadshowChannelWgyByIds: "api/phone/samllRoadshowChannelWgy/delSamllRoadshowChannelWgyByIds",

    // 根据当前登录人查询网点信息
    queryWdxInfo: "api/phone/samllRoadshowChannelWgy/queryWdxInfo",

    // 保存渠道和客户信息表
    saveSamllRoadshowChannelAndCustInfo: "api/phone/samllRoadshowChannelInfo/saveSamllRoadshowChannelAndCustInfo",
    // 同时保存或者修改渠道和走访表
    saveOrUpdateAllSamllRoadshowChannelInter: "api/phone/samllRoadshowChannelInter/saveOrUpdateAllSamllRoadshowChannelInter",
    // 客户和走访信息同时编辑
    saveOrUpdateAllSamllRoadshowCustomerInterview: "api/phone/samllRoadshowCustomerInterview/saveOrUpdateAllSamllRoadshowCustomerInterview",
    // 新文件上传下载接口（水印）
    uploadSyFile: "api/phone/common/uploadSyMultipartFile",
    downloadSyFile: "api/phone/common/downloadSyFile",
    // 根据二级场景查询行业信息
    queryHangYeInfoByEjInfo: "api/phone/samllRoadshowActInfo/queryHangYeInfoByEjInfo",
    // 用村村带的接口
    coordinateConversion: 'ccd-api/base/cct/api/position/coordinateConversion', //经纬度转换
    coordinateToAddress: 'ccd-api/base/cct/api/position/coordinateToAddress', //根据经纬度获取详细地址
    queryCsByLocate: 'ccd-api/base/cct/api/areaInfoApi/queryCsByLocate', //新增查询返回网格信息
    suggestByAddress: 'ccd-api/base/cct/api/position/suggestByAddress', //根据输入的地址提示信息

    queryInterCountByCustomerIdAndUserId: "/api/phone/samllRoadshowCustomerInterview/queryInterCountByCustomerIdAndUserId",// 根据客户id和录入人查询当天走访次数
    queryInterCountByChannelIdAndUserId: "/api/phone/samllRoadshowChannelInter/queryInterCountByChannelIdAndUserId",//根据渠道id和录入人查询当天走访次数

    // 云托管图片上传特殊接口
    fileDownload: "fileManagerTransfer/fileDownload",//图片下载
    fileUpload: "fileManagerTransfer/fileUpload",//图片上传
};
