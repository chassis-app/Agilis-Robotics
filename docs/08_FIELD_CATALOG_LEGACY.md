> **Note:** This document is extracted from the consolidated plan. See `plan/FULLPLAN.md` Appendix B for the original source.

# Legacy Field Catalog (From Requirement Screenshots)

## 1) Extraction scope and method
- Source: `Requirement.pdf` (17 pages), including narrative text + embedded screenshots.
- Method: page rendering (`gs`) + manual zoom/crop review of each screen capture.
- Coverage target: all visible field labels, line columns, and key action/menu entries shown in captures.
- Confidence tags:
  - `Confirmed`: clearly readable label in screenshot.
  - `Context-confirmed`: partially truncated but strongly inferable from neighboring labels or repeated screens.

## 2) Complete field/column extraction from existing system screens

### 2.1 Base setup and master-data navigation (基础设置)

#### A) Base Setup domains shown
`Confirmed` navigation entries visible:
- 部门
- 员工
- 往来单位
- 计量单位
- 存货
- 往来单位存货设置
- 序列号方案
- 序列号解析生成规则
- 条码方案
- 电商商品
- 班组
- 替代方案
- 物料清单
- 物料清单正向查询
- 物料清单反向查询
- 物料清单对比

`Confirmed` additional basic/master entries:
- 地区
- 项目
- 出入库类别
- 业务类型
- 配货仓库关系设置
- 物流网点
- 不合格原因

`Confirmed` settlement/finance dictionary entries:
- 收入
- 费用
- 科目
- 凭证类别
- 常用凭证
- 常用摘要
- 结算方式
- 币种
- 现金流量项目
- 资产属性
- 资产分类
- 增减方式
- 使用状况
- 处理原因
- 存放位置
- 经济用途

`Confirmed` pricing dictionary/report entries:
- 进价设置导航
- 进价带出策略
- 供应商价格本
- 供应商价格本调价单
- 采购价格查询
- 采购价格波动分析表
- 销价设置导航
- 销价带出策略
- 存货价格本
- 存货价格本调价单
- 存货效期价格本
- 客户价格本
- 客户价格本调价单
- 客户折扣
- 存货数量档位价格
- 部门价格本
- 销售价格查询
- 销售价格波动分析表
- 委外价设置导航

#### B) Stock category tree/list (存货分类/存货)
`Confirmed` list/tree fields:
- 存货分类 (tree)
- 序号
- 存货编码
- 存货名称
- 规格型号

### 2.2 Inventory master form (存货) - detailed

#### A) Header fields
`Confirmed`:
- 存货编码
- 助记码
- 计价方式
- 存货名称
- 规格型号
- 所属类别

#### B) Tabs shown
`Confirmed`:
- 基本信息
- 库存信息
- 条形码
- 价格
- 图片
- 开票

#### C) Basic Information tab fields (基本信息)
`Confirmed`:
- 税率%
- 品牌
- 新品 (checkbox)
- 停用 (checkbox)
- 新品周期(天)
- 建档日期
- 体积(m³)
- 重量(kg)
- 产地
- 自动生成项目档案 (checkbox)

#### D) Unit conversion/usage fields (计量单位)
`Confirmed`:
- 计量方式
- 计量单位
- 报表单位
- 库存常用单位
- 采购常用单位
- 销售常用单位
- 生产常用单位
- 包装常用单位

#### E) Stock attribute flags (存货属性)
`Confirmed`:
- 外购
- 销售
- 自制
- 生产耗用
- 委外
- 虚拟件
- 劳务费用
- 电商

#### F) Other/custom fields
`Confirmed`:
- 存货描述
- 配件版本号
- 成品质量风险
- 存货名称(英文)
- 存货分类-枚举

#### G) Inventory/Cost/Quality/Planning fields (库存信息/成本信息/质量信息/计划信息)
`Confirmed`:
- 参考成本
- 最新成本
- 平均成本
- 最低库存
- 最高库存
- 安全库存
- 标准周转天数
- 需要检验
- 来料入库检验
- 来料检验方式
- 来料抽检比例
- 生产入库检验
- 生产检验方式
- 生产抽检比例
- 委外入库检验
- 委外检验方式
- 委外抽检比例
- 检验要求
- 生产过程检验
- 采购最小批量
- 生产委外最小批量
- 生产委外批量倍量

### 2.3 Purchase requisition / request form (请购单)

#### A) Header fields
`Confirmed`:
- 单据日期
- 单据编号
- 部门
- 请购人
- 需求日期
- 到货地址
- 销售订单号

#### B) Tabs
`Confirmed`:
- 明细
- 汇总

#### C) Line columns (visible)
`Confirmed`:
- 序号
- 存货名称
- 存货图片
- 存货编码
- 规格型号
- 数量
- 需求日期

`Context-confirmed` (partially truncated in screenshot but consistent with other forms):
- 配件版本号
- 成品质量风险
- 计量单位

#### D) Approval progress popup (审批进度)
`Confirmed` columns:
- 审核日期
- 审批时长
- 审批人
- 审批情况

### 2.4 Material outbound and issue request flows (材料出库单 / 领料申请)

#### A) Material outbound header fields
`Confirmed`:
- 单据日期
- 单据编号
- 业务类型
- 出库类别
- 领用人
- 项目
- 仓库
- 生产车间
- 领料申请人

#### B) Material outbound line columns (明细)
`Confirmed`:
- 序号
- 材料编码
- 材料名称
- 材料规格
- 计量单位
- 数量
- 批号

#### C) Summary columns (汇总)
`Confirmed`:
- 序号
- 材料编码
- 材料名称
- 材料规格
- 数量
- 金额
- 批号
- 来源单号

`Context-confirmed`:
- 计量单位

#### D) Production material detail columns used in issue-request scenarios
`Confirmed`:
- 序号
- 材料编码
- 材料名称
- 规格型号
- 现存量
- 损耗数量
- 材料倒冲方式
- 预出仓库
- 启用领料申请
- 行中止

`Context-confirmed`:
- 需用数量
- 计划数量(列名被截断)

### 2.5 Subcontract order and subcontract cost

#### A) Subcontract order header fields (委外加工单)
`Confirmed`:
- 单据日期
- 单据编号
- 业务类型
- 委外供应商
- 部门
- 业务员
- 预开工日
- 预完工日
- 启用领料申请

#### B) Product detail columns (产品明细)
`Confirmed`:
- 序号
- 规格型号
- 适用BOM
- BOM展开方式
- 预入仓库
- 生产单位
- 数量
- 单价
- 税率%
- 含税单价
- 金额
- 税额
- 含税金额

#### C) Material detail columns (材料明细)
`Confirmed`:
- 序号
- 材料编码
- 材料名称
- 规格型号
- 预出仓库
- 材料倒冲方式
- 启用领料申请
- 行中止

#### D) Subcontract process actions shown (生单/转换)
`Confirmed` action entries:
- 转成采购订单
- 生成领料申请单
- 生成委外发料单
- 生成委外发料单(退料)
- 生成成品报检单
- 生成委外入库单
- 生成委外入库单(退库)
- 生成调拨单
- 生成调拨单(分单)

#### E) Subcontract fee statement (委外加工费用单)
Header fields `Confirmed`:
- 单据日期
- 单据编号
- 业务类型
- 票据类型
- 发票号
- 委外供应商
- 部门
- 业务员
- 付款方式
- 付款到期日

Line columns `Confirmed`:
- 序号
- 存货编码
- 存货名称
- 规格型号
- 仓库
- 生产单位
- 数量
- 单价
- 税率%
- 含税单价
- 金额
- 税额
- 含税金额

### 2.6 Production order (生产加工单)

#### A) Header fields
`Confirmed`:
- 单据日期
- 单据编号
- 业务类型
- 生产车间
- 负责人
- 预开工日
- 启用领料申请

`Context-confirmed`:
- 预计完工日 (同类单据结构一致)

#### B) Product detail columns
`Confirmed`:
- 序号
- 产品编码
- 产品名称
- 规格型号
- 适用BOM
- BOM展开方式
- 预入仓库
- 生产单位
- 数量

#### C) Material detail columns
`Confirmed`:
- 序号
- 材料编码
- 材料名称
- 规格型号
- 现存量
- 损耗数量
- 材料倒冲方式
- 预出仓库
- 启用领料申请
- 行中止

`Context-confirmed`:
- 需用数量
- 计划数量

### 2.7 Engineering change order (工程变更单)

#### A) Header fields
`Confirmed`:
- 单据日期
- 单据编号
- 工程变更部门
- 工程变更人
- 变更类型
- 变更原因
- 变更内容
- 变更影响类型

#### B) Material list info grid (物料清单信息)
`Confirmed`:
- 序号
- 存货名称
- 规格型号
- 变更类型
- BOM版本号
- 变更状态
- 备注

#### C) Change detail tabs
`Confirmed`:
- 文件变更明细
- 材料变更明细

#### D) File change detail columns
`Confirmed`:
- 序号
- 变更差异
- 文件编码
- 文件名称
- 规格型号
- 版本号
- 工艺路线
- 计量单位
- 生产数量
- 生产车间
- 预入仓库
- 默认BOM
- 成品率%

### 2.8 BOM / item structure (物料清单, 物料清单维护)

#### A) Parent/item header fields (visible in BOM maintenance area)
`Confirmed`:
- 文件编码
- 文件名称
- 规格型号
- 配件版本号
- 版本号
- 计量单位
- 生产数量
- 成品率%
- 品牌
- 生产车间
- 预入仓库
- 默认BOM
- BOM层级
- 总成本
- 成本取值
- 停用
- 虚拟件

#### B) Child material columns (子件明细)
`Confirmed`:
- 序号
- 子件编码
- 成品质量风险
- 子件名称
- 需用数量
- 规格型号
- 配件版本号

#### C) Substitute/related child area (替代料相关显示)
`Confirmed`/`Context-confirmed`:
- 序号
- 子件编码
- 子件名称
- 虚拟件
- 子件BOM
- 预出仓库
- 计量单位

### 2.9 Receiving and inspection menus (到货单/报检)

`Confirmed` quality menu entries:
- 报检单
- 到货单
- 成品报检单
- 检验单
- 来料/成品检验单
- 生产过程检验单
- 到货单执行表
- 成品报检单执行表
- 质量统计分析表
- 检验单综合明细表
- 检验单综合统计表

### 2.10 Sales outbound order (销售出库单)

#### A) Header fields
`Confirmed`:
- 单据日期
- 单据编号
- 业务类型
- 退货原因
- 客户
- 结算客户
- 经手人
- 仓库

#### B) Tabs
`Confirmed`:
- 明细
- 汇总

#### C) Line columns
`Confirmed`:
- 序号
- 条形码
- 仓库
- 存货名称
- 规格型号
- 数量
- 智能选单
- 来源单号
- 现存量
- 现存量说明
- 退货原因

`Context-confirmed`:
- 计量单位

### 2.11 Workflow/system action fields repeatedly shown

`Confirmed` common status/toolbar fields:
- 单据状态(如: 已审)
- 新增/选单/保存/删除/弃审/审核/审批情况/生单/变更/工具/联查/设置/打印/更多

## 3) Consolidated "must-have current-system fields" by module
This section normalizes the above into implementation entities so no field is dropped in new ERP.

### 3.1 Item/Inventory Master entity
Fields to preserve exactly:
- 存货编码, 助记码, 计价方式, 存货名称(中), 存货名称(英), 规格型号, 所属类别
- 税率%, 品牌, 新品, 停用, 新品周期(天), 建档日期, 体积, 重量, 产地
- 计量方式, 主计量单位, 报表单位, 库存常用单位, 采购常用单位, 销售常用单位, 生产常用单位, 包装常用单位
- 成本信息(参考/最新/平均), 库存信息(最低/最高/安全/周转天数)
- 质量信息(需检标识 + 来料/生产/委外检验方式及抽检比例 + 检验要求 + 过程检验)
- 计划信息(采购最小批量, 生产委外最小批量, 生产委外批量倍量)
- 属性标识(外购/销售/自制/生产耗用/委外/虚拟件/劳务费用/电商)
- 存货描述, 配件版本号, 成品质量风险, 存货分类-枚举

### 3.2 Transaction document common header
Fields to preserve:
- 单据日期, 单据编号, 业务类型, 部门, 业务员/负责人/经手人
- 仓库/生产车间
- 供应商/客户/结算客户
- 需求日期/到货地址/开工完工日期
- 单据状态

### 3.3 Document line common columns
Fields to preserve:
- 序号
- 物料编码/存货编码
- 名称
- 规格型号
- 计量单位
- 数量
- 单价/税率/含税单价/金额/税额/含税金额 (when financial)
- 批号
- 来源单号
- 现存量/现存量说明
- 预出仓库/预入仓库
- 倒冲方式
- 启用领料申请
- 行中止

### 3.4 Engineering/BOM specific
Fields to preserve:
- 变更类型/原因/内容/影响类型/状态
- BOM版本号, 默认BOM, BOM层级
- 文件编码/名称/版本/工艺路线
- 子件编码/子件名称/需用数量/质量风险/配件版本号
- 预出仓库, 生产车间, 成品率

### 3.5 Approval/trace fields currently visible
Fields to preserve:
- 审核日期, 审批时长, 审批人, 审批情况

## 4) Additional fields recommended for a sophisticated medical-device ERP
Below are recommended additions beyond current screenshots to meet robust auditability, traceability, quality, and regulatory expectations.

### 4.1 Item/Regulatory master
Add fields:
- 物料主数据版本生命周期状态 (`Draft/Released/Obsolete`)
- 器械分类 (Class I/II/III)
- UDI-DI, UDI-PI rules
- GMDN code / product family code
- 注册证号/备案号/国家地区适用性
- 无菌方式/灭菌批次规则
- 有效期管理策略 (shelf-life control)
- 关键件标识 (critical component)
- RoHS/REACH/生物相容性属性
- 供应商批准状态 (Approved/Conditional/Blocked)

### 4.2 Procurement and supplier quality
Add fields:
- 供应商资质状态, 到期日, 审核结论
- 供应商绩效评分 (PPM, OTD, CAPA关闭率)
- 报价有效期, 价格生效区间, MOQ/MPQ, 交期承诺
- 采购审批风险等级, 风险原因
- 采购变更原因码

### 4.3 Production execution and genealogy
Add fields:
- 工单批次号, 工序号, 工位号, 班次, 操作员
- 工艺配方版本/作业指导书版本
- 实际开工/完工时间, 停机原因, 报废原因
- 关键过程参数 (CPP) 记录字段
- 批记录电子签名链 (E-sign per operation)

### 4.4 QA/QC and compliance
Add fields:
- 检验计划版本, 抽样标准版本
- 检验项目明细 (项目代码, 规格上下限, 实测值)
- 不合格处置结论 (`返工/报废/让步接收/退货`)
- CAPA编号, 根因分类, 纠正/预防措施, 截止日期
- 偏差/变更/投诉关联号
- DHR (Device History Record) 编号
- DMR (Device Master Record) 编号

### 4.5 Serialization and traceability
Add fields:
- 序列号生成规则版本
- 序列号状态 (`created/issued/shipped/returned/scrapped`)
- 母子件装配关系层级
- 发货行与组件批次映射明细
- 召回影响范围标识与召回批次号

### 4.6 Audit trail and security
Add fields (all critical docs):
- 创建人/时间, 修改人/时间, 最后审批人/时间
- 审批意见, 驳回原因, override原因
- 电子签名方式, 签名哈希, 签名原因码
- 事件哈希链 (`event_hash`, `prev_event_hash`)
- 客户端IP, 设备信息, 会话ID

### 4.7 Finance/cost control
Add fields:
- 成本中心, 成本要素, 订单归集号
- 汇率类型/汇率日期/本位币金额
- 标准成本/移动平均/实际成本标识
- 委外费用对账差异原因
- 财务过账状态与失败重试计数

### 4.8 Alerting and integration
Add fields:
- 安全库存提醒策略ID, 首次提醒时间, 重复提醒间隔
- 通知渠道偏好 (`Feishu/Email/In-app`)
- 集成事件ID, 幂等键, 重试次数, 最后错误
- 外部系统回执号/回执时间

## 5) Implementation note for coding agent
- Treat Section 2 as "legacy-visible fields that must not be dropped".
- Treat Section 4 as "recommended advanced fields for target medical-device ERP maturity".
- For every field in Sections 2 + 4, enforce:
  - datatype + required flag + default + validation rule
  - change history (old/new value)
  - permission scope (who can view/edit)
  - workflow and audit coupling
