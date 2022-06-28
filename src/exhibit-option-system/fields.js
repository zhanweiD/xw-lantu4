// type文档：https://dtwave.yuque.com/waveview/levoxx/eo63xo
// NOTE: 这个文件内只定义最新版的配置体系，不包含向后兼容的映射
// TODO:
// - 向后兼容的设计
// - 相对位置的图标

// 动画
const enterAnimation = {
  type: 'switch',
  label: 'enterAnimation',
  defaultValue: true,
}

const legendType = {
  type: 'select',
  label: 'legendType',
  defaultValue: 'rect',
  options: [
    {
      key: '矩形',
      value: 'rect',
    },
    {
      key: '圆形',
      value: 'circle',
    },
    {
      key: 'line',
      value: 'broken-line',
    },
    {
      key: '虚线',
      value: 'dotted-line',
    },
    {
      key: '五星状',
      value: 'star',
    },
  ],
}

const animationType = {
  type: 'select',
  label: 'animationType',
  defaultValue: 'erase',
  options: [
    {
      key: '淡入淡出',
      value: 'fade',
    },
    {
      key: '扫光',
      value: 'scan',
    },
    {
      key: '缩放',
      value: 'zoom',
    },
    {
      key: '擦除',
      value: 'erase',
    },
  ],
}
const duration = {
  type: 'number',
  label: 'duration',
  defaultValue: 2000,
}

const dasharray = {
  type: 'text',
  label: 'dasharray',
  defaultValue: ' ',
}
// 虚线设置
const dasharrayLength = {
  type: 'number',
  label: 'dasharrayLength',
  defaultValue: 0,
  min: 0,
  max: Infinity,
}

const calibrationTitle = {
  type: 'text',
  label: 'calibrationTitle',
  defaultValue: '刻度线',
}

const calibrationValue = {
  type: 'number',
  label: 'calibrationValue',
  defaultValue: 0,
}

const dasharraySpacing = {
  type: 'number',
  label: 'dasharraySpacing',
  defaultValue: 0,
  min: 0,
  max: Infinity,
}

const rectStepPercentage = {
  type: 'number',
  label: 'rectStepPercentage',
  defaultValue: 0,
  min: 0,
  max: 20,
  step: 0.1,
}

const rectStepGap = {
  type: 'number',
  label: 'rectStepGap',
  defaultValue: 0,
  min: 0,
  max: 2,
  step: 0.1,
}

const rectRadius = {
  type: 'number',
  label: 'rectRadius',
  defaultValue: 0,
  min: 0,
  max: 50,
  step: 1,
}

const delay = {
  type: 'number',
  label: 'delay',
  defaultValue: 100,
}
const scope = {
  type: 'select',
  label: 'scope',
  defaultValue: 'stroke',
  options: [
    {
      key: '中间',
      value: 'stroke',
    },
    {
      key: '填满',
      value: 'fill',
    },
    {
      key: '全部',
      value: 'both',
    },
  ],
}
//取值方式
const valueMethod = {
  type: 'check',
  label: 'valueMethod',
  defaultValue: 'timePoint',
  options: [
    {
      key: '时间点',
      value: 'timePoint',
    },
    {
      key: '时间范围',
      value: 'timeRange',
    },
  ],
}

// 轮播间隔
const updateDuration = {
  type: 'number',
  label: 'updateDuration',
  defaultValue: 1000,
  max: 5000,
}

const animationDirection = {
  type: 'check',
  label: 'animationDirection',
  defaultValue: 'right',
  options: [
    {
      key: '向上',
      value: 'top',
    },
    {
      key: '向右',
      value: 'right',
    },
    {
      key: '向下',
      value: 'bottom',
    },
    {
      key: '向左',
      value: 'left',
    },
    {
      key: '向外',
      value: 'outer',
    },
    {
      key: '向内',
      value: 'inner',
    },
  ],
}

// 主题
const theme = {
  type: 'select',
  label: 'themeLabel',
  defaultValue: 'default',
  options: [
    {
      key: 'theme.default',
      value: 'default',
    },
    {
      key: 'theme.fairyLand',
      value: 'fairyLand',
    },
    {
      key: 'theme.emeraldGreen',
      value: 'emeraldGreen',
    },
    {
      key: 'theme.duskUniverse',
      value: 'duskUniverse',
    },
    {
      key: 'theme.glaze',
      value: 'glaze',
    },
    {
      key: 'theme.exquisite',
      value: 'exquisite',
    },
    {
      key: 'theme.blueGreen',
      value: 'blueGreen',
    },
    {
      key: 'theme.greenRed',
      value: 'greenRed',
    },
    {
      key: 'theme.blueRed',
      value: 'blueRed',
    },
    {
      key: 'theme.orangePurple',
      value: 'orangePurple',
    },
    {
      key: 'theme.brownGreen',
      value: 'brownGreen',
    },
  ],
}

// gis
// 相机位置
const origin = {
  type: 'multiNumber',
  label: 'origin',
  defaultValue: [120.14857128194079, 30.251288234866852, 10000],
  items: [
    {
      key: '经度',
      step: 1,
    },
    {
      key: '纬度',
      step: 1,
    },
    {
      key: '海拔',
      step: 1,
    },
  ],
}
// 相机角度
const viewport = {
  type: 'multiNumber',
  label: 'viewport',
  defaultValue: [0, -90, 0],
  items: [
    {
      key: '偏航角(Y)',
      step: 1,
    },
    {
      key: '俯仰角(X)',
      step: 1,
    },
    {
      key: '翻滚角(Z)',
      step: 1,
    },
  ],
}
// const gisBackground = {
//   type: 'color',
//   label: 'gisBackground',
//   defaultValue: 'rgba(0,0,0,1)',
// }
const sceneMode = {
  type: 'check',
  label: 'sceneMode',
  defaultValue: 'SCENE3D',
  options: [
    {
      key: '3D',
      value: 'SCENE3D',
    },
    {
      key: '2D',
      value: 'PLANAR3D',
    },
  ],
}

// 自适应
const adapterContainer = {
  type: 'switch',
  label: 'adapterContainer',
  defaultValue: true,
}

// 行数
const rowNumber = {
  type: 'number',
  label: 'rowNumber',
  defaultValue: 100,
}

// 行间距
const lineSpacing = {
  type: 'number',
  label: 'lineSpacing',
  defaultValue: 5,
}

// 列间距
const columnSpacing = {
  type: 'number',
  label: 'columnSpacing',
  defaultValue: 5,
}

// 标题显隐
const titleVisible = {
  type: 'switch',
  label: 'titleVisible',
  defaultValue: false,
}

// 标题-字号
const titleFontSize = {
  type: 'number',
  label: 'titleFontSize',
  defaultValue: 30,
}

// 标题颜色
const titleColor = {
  type: 'color',
  label: 'titleColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}

// 标题背景色
const titleBackground = {
  type: 'color',
  label: 'titleBackground',
  defaultValue: 'rgba(255, 255, 255, 0)',
}

// 标题文本
const titleText = {
  type: 'text',
  label: 'titleText',
  defaultValue: '2019年分学科硕士招生数',
}

// 标题对齐
const titlePosition = {
  type: 'select',
  label: 'titlePosition',
  defaultValue: 'left',
  options: [
    {
      key: '首端',
      value: 'left',
    },
    {
      key: '居中',
      value: 'center',
    },
    {
      key: '末端',
      value: 'right',
    },
  ],
}

// 标题下间距
const titleLowerSpacing = {
  type: 'number',
  label: 'titleLowerSpacing',
  defaultValue: 20,
}

// 表头显隐
const headVisible = {
  type: 'switch',
  label: 'headVisible',
  defaultValue: false,
}

// 表头文字大小
const headFontSize = {
  type: 'number',
  label: 'headFontSize',
  defaultValue: 24,
}

// 表头-文字加粗
const headFontWeight = {
  type: 'number',
  label: 'headFontWeight',
  defaultValue: 700,
}

// 表头文字颜色
const headFontColor = {
  type: 'color',
  label: 'headFontColor',
  defaultValue: 'rgb(255,255,255)',
}

// 表头背景色
const headBackground = {
  type: 'color',
  label: 'headBackground',
  defaultValue: 'rgba(255,255,255,0.1)',
}

// 表头位置
const headPosition = {
  type: 'select',
  label: 'titlePosition',
  defaultValue: 'center',
  options: [
    {
      key: '首端',
      value: 'left',
    },
    {
      key: '居中',
      value: 'center',
    },
    {
      key: '末端',
      value: 'right',
    },
  ],
}

const leftLableFontSize = {
  type: 'number',
  label: 'leftLableFontSize',
  defaultValue: 20,
}

const rightLableFontSize = {
  type: 'number',
  label: 'rightLableFontSize',
  defaultValue: 20,
}

// 单位显/隐
const unitVisible = {
  type: 'switch',
  label: 'unitVisible',
  defaultValue: true,
}

// 文字大小
const unitFontSize = {
  type: 'number',
  label: 'unitFontSize',
  defaultValue: 15,
}

// 文字颜色
const unitFontColor = {
  type: 'color',
  label: 'unitFontColor',
  defaultValue: 'rgba(255,255,255,0.65)',
}

// 单位文本
const unitText = {
  type: 'text',
  label: 'unitText',
  defaultValue: '单位：人',
}

// 单位-下间距
const unitLowerSpacing = {
  type: 'number',
  label: 'unitLowerSpacing',
  defaultValue: 16,
}

// 标记-显/隐
const signVisible = {
  type: 'switch',
  label: 'signVisible',
  defaultValue: true,
}

// 标记-颜色
const signFontColor = {
  type: 'color',
  label: 'signFontColor',
  defaultValue: 'rgba(255,200,100,0.9)',
}

// 标记-宽度
const signWidth = {
  type: 'number',
  label: 'signWidth',
  defaultValue: 6,
  max: 20,
  min: 0,
}

// 矩形-显/隐
const rectVisible = {
  type: 'switch',
  label: 'rectVisible',
  defaultValue: true,
}

// 矩形-颜色
const rectFontColor = {
  type: 'color',
  label: 'rectFontColor',
  defaultValue: '#09f',
}

// 矩形-宽度
// const rectWidth = {
//   type: 'number',
//   label: 'rectWidth',
//   defaultValue: 50,
// }

// 矩形-高度
const rectHeight = {
  type: 'number',
  label: 'rectHeight',
  defaultValue: 6,
  max: 30,
  min: 1,
}

// 单元格-自适应宽度
const isAutoWidth = {
  type: 'switch',
  label: 'isAutoWidth',
  defaultValue: false,
}

// 单元格-宽度
const cellWidth = {
  type: 'number',
  label: 'cellWidth',
  defaultValue: 200,
}

// 单元格-高度
const cellHeight = {
  type: 'number',
  label: 'cellHeight',
  defaultValue: 30,
}

// 单元格-文字大小
const cellFontSize = {
  type: 'number',
  label: 'cellFontSize',
  defaultValue: 20,
}

// 单元格-文字颜色
const cellFontColor = {
  type: 'color',
  label: 'cellFontColor',
  defaultValue: 'rgb(255,255,255)',
}

// 单元格-背景色
const cellBackground = {
  type: 'color',
  label: 'cellBackground',
  defaultValue: 'rgb(255,255,25, 0.1)',
}

// 单元格-数值条背景色
const valueBarBackground = {
  type: 'color',
  label: 'valueBarBackground',
  defaultValue: 'rgba(0,119,255,1)',
}

// 单元格-对齐
const cellPosition = {
  type: 'select',
  label: 'cellPosition',
  defaultValue: 'center',
  options: [
    {
      key: '首端',
      value: 'left',
    },
    {
      key: '居中',
      value: 'center',
    },
    {
      key: '末端',
      value: 'right',
    },
  ],
}

// 轮播滚动动画效果-是否开启
const enableLoopAnimation = {
  type: 'switch',
  label: 'enableLoopAnimation',
  defaultValue: false,
}

// 单次动画时长
const loopAnimationDuration = {
  type: 'number',
  label: 'loopAnimationDuration',
  defaultValue: 2000,
  step: 200,
}

// 单词动画延时
const loopAnimationDelay = {
  type: 'number',
  label: 'loopAnimationDelay',
  defaultValue: 2000,
  step: 200,
}

// 是否禁用
const isDisabled = {
  type: 'switch',
  label: 'isDisabled',
  defaultValue: false,
}

// 是否展示输入框的字数提示
const isDisplayTextNum = {
  type: 'switch',
  label: 'isDisplayTextNum',
}

// 更改连接线类型
const connectLineType = {
  type: 'select',
  label: 'connectLineType',
  defaultValue: 'wavyline',
  options: [
    {
      key: '波浪线',
      value: 'wavyline',
    },
    {
      key: '箭头线',
      value: 'arrow',
    },
    {
      key: '短横线',
      value: 'shortline',
    },
  ],
}

const enableMapInteractive = {
  type: 'switch',
  label: 'enableMapInteractive',
  defaultValue: false,
}
const viewFixed = {
  type: 'switch',
  label: 'viewFixed',
  defaultValue: false,
}
const coordinateAcquisitionResult = {
  type: 'text',
  label: 'coordinateAcquisitionResult',
  defaultValue: ' ',
  // hasSlider: true,
}
const snow = {
  type: 'switch',
  label: 'snow',
  defaultValue: false,
}
const rain = {
  type: 'switch',
  label: 'rain',
  defaultValue: false,
}
const elevation = {
  type: 'text',
  label: 'elevation',
  defaultValue: ' ',
  // hasSlider: true,
}
const layerName = {
  type: 'text',
  label: 'layerName',
  defaultValue: ' ',
  // hasSlider: true,
}

const mapService = {
  type: 'switch',
  label: 'mapService',
  defaultValue: false,
}
const baseMapStyle = {
  type: 'select',
  label: 'baseMapStyle',
  defaultValue: 'blueStyle',
  options: [
    {
      key: '蓝色',
      value: 'blueStyle',
    },
  ],
}
const viewportMode = {
  type: 'check',
  label: 'viewportMode',
  defaultValue: 'manual',
  options: [
    {
      key: '自动',
      value: 'auto',
    },
    {
      key: '手动',
      value: 'manual',
    },
  ],
}
const longitude = {
  type: 'number',
  label: 'longitude',
  defaultValue: 120,
}
const latitude = {
  type: 'number',
  label: 'latitude',
  defaultValue: 30,
}
const zoom = {
  type: 'number',
  label: 'zoom',
  defaultValue: 8,
}
const pitch = {
  type: 'number',
  label: 'pitch',
  defaultValue: 0,
}
const bearing = {
  type: 'number',
  label: 'bearing',
  defaultValue: 0,
}
const showMapControl = {
  type: 'switch',
  label: 'showMapControl',
  defaultValue: true,
}
const showMapHelper = {
  type: 'switch',
  label: 'showMapHelper',
  defaultValue: true,
}

const stroked = {
  type: 'switch',
  label: 'stroked',
  defaultValue: false,
}
const label = {
  type: 'switch',
  label: 'label',
  defaultValue: true,
}
const isBreathe = {
  type: 'switch',
  label: 'isBreathe',
  defaultValue: true,
}

const extruded = {
  type: 'switch',
  label: 'extruded',
  defaultValue: false,
}
const getElevationValue = {
  type: 'number',
  label: 'getElevationValue',
  defaultValue: 5000,
}
const getElevation = {
  type: 'number',
  label: 'getElevation',
  defaultValue: 5000,
}
const diskResolution = {
  type: 'number',
  label: 'diskResolution',
  defaultValue: 4,
}
const getRadius = {
  type: 'number',
  label: 'getRadius',
  defaultValue: 12,
}
const radius = {
  type: 'number',
  label: 'radius',
  defaultValue: 50,
}
const getLineWidth = {
  type: 'number',
  label: 'getLineWidth',
  defaultValue: 1,
}
const heatmapType = {
  type: 'select',
  label: 'heatmapType',
  defaultValue: 'classic',
  options: [
    {
      key: '经典',
      value: 'classic',
    },
    {
      key: '蜂窝',
      value: 'honeycomb',
    },
    {
      key: '网格',
      value: 'grid',
    },
  ],
}
const type = {
  type: 'check',
  label: 'type',
  defaultValue: '2D',
  options: [
    {
      key: '2D',
      value: '2D',
    },
    {
      key: '3D',
      value: '3D',
    },
  ],
}

const flyPoint = {
  type: 'switch',
  label: 'flyPoint',
  defaultValue: true,
}
const sourcePoint = {
  type: 'switch',
  label: 'sourcePoint',
  defaultValue: true,
}
const sourceLabel = {
  type: 'switch',
  label: 'sourceLabel',
  defaultValue: true,
}
const targetPoint = {
  type: 'switch',
  label: 'targetPoint',
  defaultValue: true,
}
const targetLabel = {
  type: 'switch',
  label: 'targetLabel',
  defaultValue: true,
}

const flyPointSize = {
  type: 'number',
  label: 'flyPointSize',
  defaultValue: 8,
}
const flyPointWidth = {
  type: 'number',
  label: 'flyPointWidth',
  defaultValue: 1,
}
const sourceLabelSize = {
  type: 'number',
  label: 'sourceLabelSize',
  defaultValue: 8,
}
const targetPointSize = {
  type: 'number',
  label: 'targetPointSize',
  defaultValue: 8,
}
const targetLabelSize = {
  type: 'number',
  label: 'targetLabelSize',
  defaultValue: 8,
}
const sourcePointSize = {
  type: 'number',
  label: 'sourcePointSize',
  defaultValue: 8,
}
const dotSize = {
  type: 'number',
  label: 'dotSize',
}
const dotColor = {
  type: 'color',
  label: 'dotColor',
}
const currentShowDotColor = {
  type: 'color',
  label: 'currentShowDotColor',
}
const flyPointColor = {
  type: 'color',
  label: 'flyPointColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const getSourceColor = {
  type: 'color',
  label: 'getSourceColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const sourcePointColor = {
  type: 'color',
  label: 'sourcePointColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const sourceLabelColor = {
  type: 'color',
  label: 'sourceLabelColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const getTargetColor = {
  type: 'color',
  label: 'getTargetColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const targetPointColor = {
  type: 'color',
  label: 'targetPointColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const targetLabelColor = {
  type: 'color',
  label: 'targetLabelColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}

const greatCircle = {
  type: 'switch',
  label: 'greatCircle',
  defaultValue: true,
}
const getTilt = {
  type: 'number',
  label: 'getTilt',
  defaultValue: 0,
}
const getHeight = {
  type: 'number',
  label: 'getHeight',
  defaultValue: 1,
}
const getWidth = {
  type: 'number',
  label: 'getWidth',
  defaultValue: 1,
}

const filled = {
  type: 'switch',
  label: 'filled',
  defaultValue: true,
}
const getFillColor = {
  type: 'color',
  label: 'getFillColor',
  defaultValue: 'rgba(255, 155, 35, 1)',
}
const wireframe = {
  type: 'switch',
  label: 'wireframe',
  defaultValue: true,
}
const getLineColor = {
  type: 'color',
  label: 'getLineColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const geojsonType = {
  type: 'check',
  label: 'geojsonType',
  defaultValue: 'province',
  options: [
    {
      key: '省份',
      value: 'province',
    },
    {
      key: '建筑群',
      value: 'city',
    },
  ],
}

const elevationDecoder = {
  type: 'multiNumber',
  label: 'elevationDecoder',
  defaultValue: [6553.6, 25.6, 0.1, -10000],
  items: [
    {
      key: 'r',
      step: 1,
    },
    {
      key: 'g',
      step: 1,
    },
    {
      key: 'b',
      step: 1,
    },
    {
      key: 'offset',
      step: 1,
    },
  ],
}
const elevationData = {
  type: 'text',
  label: 'elevationData',
  defaultValue: `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoid3VmZW5mZW4iLCJhIjoiY2tma2pjbHU0MWJ6ZzMycDFrejl5dmQ0NiJ9.3F5nrYyDEfDjq6W8UOzZpg`,
}
const texture = {
  type: 'text',
  label: 'texture',
  defaultValue: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1Ijoid3VmZW5mZW4iLCJhIjoiY2tma2pjbHU0MWJ6ZzMycDFrejl5dmQ0NiJ9.3F5nrYyDEfDjq6W8UOzZpg`,
}
const showPath = {
  type: 'switch',
  label: 'showPath',
  defaultValue: true,
}
const showTrail = {
  type: 'switch',
  label: 'showTrail',
  defaultValue: true,
}
const showEndVertex = {
  type: 'switch',
  label: 'showEndVertex',
  defaultValue: true,
}
const showVertex = {
  type: 'switch',
  label: 'showVertex',
  defaultValue: true,
}
const rounded = {
  type: 'switch',
  label: 'rounded',
  defaultValue: true,
}
const pathColor = {
  type: 'color',
  label: 'pathColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const trailColor = {
  type: 'color',
  label: 'trailColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const endVertexColor = {
  type: 'color',
  label: 'endVertexColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const vertexColor = {
  type: 'color',
  label: 'vertexColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}

const pathWidth = {
  type: 'number',
  label: 'pathWidth',
  defaultValue: 2,
}
const trailWidth = {
  type: 'number',
  label: 'trailWidth',
  defaultValue: 4,
}
const trailLength = {
  type: 'number',
  label: 'trailLength',
  defaultValue: 4,
}
const trailSpeed = {
  type: 'number',
  label: 'trailSpeed',
  defaultValue: 1,
}
const endVertexSize = {
  type: 'number',
  label: 'endVertexSize',
  defaultValue: 2,
}
const vertexSize = {
  type: 'number',
  label: 'vertexSize',
  defaultValue: 1,
}
const iconSize = {
  type: 'number',
  label: 'iconSize',
  defaultValue: 30,
}
const showLabel = {
  type: 'switch',
  label: 'showLabel',
  defaultValue: true,
}
const billboard = {
  type: 'switch',
  label: 'billboard',
  defaultValue: true,
}
const getAngle = {
  type: 'number',
  label: 'getAngle',
  defaultValue: 0,
}
const geojsonData = {
  type: 'text',
  label: 'geojsonData',
  defaultValue: 'http://cdn.dtwave.com/waveview/geojson/100000_full.json',
}
const getTextAnchor = {
  type: 'check',
  label: 'getTextAnchor',
  defaultValue: 'middle',
  options: [
    {key: '左', value: 'end'},
    {key: '中', value: 'middle'},
    {key: '右', value: 'start'},
  ],
}
const getAlignmentBaseline = {
  type: 'check',
  label: 'getAlignmentBaseline',
  defaultValue: 'bottom',
  options: [
    {key: '上', value: 'bottom'},
    {key: '中', value: 'center'},
    {key: '下', value: 'top'},
  ],
}
const tileUrl = {
  type: 'text',
  label: 'tileUrl',
  defaultValue: 'https://assets.cesium.com/43978/tileset.json',
  // defaultValue: 'https://saasprod.4001113900.com:10020/jxmgy/tileset.json',
}
const tileType = {
  type: 'check',
  label: 'tileType',
  defaultValue: 'cesium',
  options: [
    {key: 'cesium', value: 'cesium'},
    {key: 'acrgis', value: 'i3s'},
    {key: 'supermap', value: 'tile3d'},
  ],
}

/**
 * =====================================
 * common
 * =====================================
 */

// 偏移
const offset = {
  type: 'multiNumber',
  label: 'offset',
  defaultValue: [0, 0],
  items: [
    {
      key: 'X',
      step: 1,
    },
    {
      key: 'Y',
      step: 1,
    },
  ],
}

// padding
const padding = {
  type: 'multiNumber',
  label: 'padding',
  defaultValue: [40, 40, 40, 40],
  items: [
    {
      key: '上',
      step: 1,
    },
    {
      key: '右',
      step: 1,
    },
    {
      key: '下',
      step: 1,
    },
    {
      key: '左',
      step: 1,
    },
  ],
}
const fillColor = {
  type: 'color',
  label: 'fillColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
const elevationRange = {
  type: 'multiNumber',
  label: 'elevationRange',
  defaultValue: [1000, 10000],
  items: [
    {
      key: '低',
      step: 1,
    },
    {
      key: '高',
      step: 1,
    },
  ],
}

// show
const show = {
  type: 'switch',
  label: 'show',
  defaultValue: true,
}

const trackShow = {
  type: 'switch',
  label: 'trackShow',
  defaultValue: true,
}

// 区域偏移
const areaOffset = {
  type: 'offset',
  defaultValue: [0, 0, 0, 0],
}

// 间隔
const gap = {
  type: 'number',
  label: 'gap',
  defaultValue: 0,
}

// 内外间隔
// TODO 不通用
const gap2 = {
  type: 'multiNumber',
  label: 'gap',
  defaultValue: [0, 0],
  items: [
    {
      key: 'in',
      step: 1,
    },
    {
      key: 'out',
      step: 1,
    },
  ],
}

const blur = {
  type: 'number',
  label: 'blur',
  defaultValue: 0,
  min: 0,
  max: 10,
  hasSlider: true,
}

// 透明度
const opacity = {
  type: 'number',
  label: 'opacity',
  defaultValue: 1,
  min: 0,
  max: 1,
  step: 0.1,
  hasSlider: true,
}

// 相对位置
// NOTE: 锚点依赖relativePosition
const relativePosition = {
  type: 'check',
  label: 'position',
  defaultValue: 'top',
  // TODO
  options: [
    // {
    //   icon: 'relative-position-top-left',
    //   value: 'topLeft',
    // },
    {
      icon: 'relative-position-top-center',
      value: 'top',
    },
    // {
    //   icon: 'relative-position-top-right',
    //   value: 'topRight',
    // },
    {
      icon: 'relative-position-middle-left',
      value: 'left',
    },
    {
      icon: 'relative-position-middle-center',
      value: 'center',
    },
    {
      icon: 'relative-position-middle-right',
      value: 'right',
    },
    // {
    //   icon: 'relative-position-bottom-left',
    //   value: 'bottomLeft',
    // },
    {
      icon: 'relative-position-bottom-center',
      value: 'bottom',
    },
    // {
    //   icon: 'relative-position-bottom-right',
    //   value: 'bottomRight',
    // },
  ],
}

// NOTE: layoutPosition
const layoutPosition = {
  type: 'check',
  label: 'position',
  defaultValue: 'topLeft',
  options: [
    {
      icon: 'relative-position-top-left',
      value: 'topLeft',
    },
    {
      icon: 'relative-position-top-center',
      value: 'topCenter',
    },
    {
      icon: 'relative-position-top-right',
      value: 'topRight',
    },
    {
      icon: 'relative-position-middle-left',
      value: 'middleLeft',
    },
    {
      icon: 'relative-position-middle-center',
      value: 'middleCenter',
    },
    {
      icon: 'relative-position-middle-right',
      value: 'middleRight',
    },
    {
      icon: 'relative-position-bottom-left',
      value: 'bottomLeft',
    },
    {
      icon: 'relative-position-bottom-center',
      value: 'bottomCenter',
    },
    {
      icon: 'relative-position-bottom-right',
      value: 'bottomRight',
    },
  ],
}

// 坐标位置
const xyPosition = {
  type: 'multiNumber',
  label: 'coordinate',
  defaultValue: [0, 0],
  items: [
    {
      key: 'X',
      step: 1,
    },
    {
      key: 'Y',
      step: 1,
    },
  ],
}

// 锚点
const anchor = {
  type: 'check',
  label: 'anchor',
  defaultValue: 'topLeft',
  // TODO
  options: [
    {
      icon: 'anchor-top-left',
      value: 'topLeft',
    },
    {
      icon: 'anchor-top-center',
      value: 'topCenter',
    },
    {
      icon: 'anchor-top-right',
      value: 'topRight',
    },
    {
      icon: 'anchor-middle-left',
      value: 'middleLeft',
    },
    {
      icon: 'anchor-middle-center',
      value: 'middleCenter',
    },
    {
      icon: 'anchor-middle-right',
      value: 'middleRight',
    },
    {
      icon: 'anchor-bottom-left',
      value: 'bottomLeft',
    },
    {
      icon: 'anchor-bottom-center',
      value: 'bottomCenter',
    },
    {
      icon: 'anchor-bottom-right',
      value: 'bottomRight',
    },
  ],
}

// 角度
const angle = {
  type: 'number',
  label: 'angle',
  defaultValue: 0,
  min: 0,
  max: 360,
  step: 1,
  hasSlider: true,
}

// 触发事件类型
const eventType = {
  type: 'check',
  label: 'trigger',
  options: [
    {
      key: 'click',
      value: 'click',
    },
    {
      key: 'hover',
      value: 'hover',
    },
  ],
}

// 缺失
const missing = {
  type: 'missing',
  label: 'missing',
}

//选择器类型
const pickerTypecwq = {
  type: 'string',
  label: 'pickerTypecwq',
}
/**
 * =====================================
 * size
 * =====================================
 */

// 宽度
const width = {
  type: 'number',
  label: 'width',
  min: 0,
  max: 5000,
  step: 1,
}

// 高度
const height = {
  type: 'number',
  label: 'height',
  min: 0,
  max: 5000,
  step: 1,
}

// 尺寸
const size = {
  type: 'number',
  label: 'size',
  min: 1,
  max: 100,
  step: 1,
}
//字体大小
const fontSize = {
  type: 'number',
  label: 'fontSize',
  min: 1,
  max: 1000,
  step: 1,
}
// 缩放系数
const scale = {
  type: 'number',
  label: 'scale',
  min: 0,
  max: 1,
  step: 1,
}
// 选择器类型
const pickerType = {
  type: 'select',
  label: 'pickerType',
  defaultValue: 'date',
  options: [
    {
      // key值为选项标签名
      key: 'date',
      value: 'date',
    },
    {
      key: 'time',
      value: 'time',
    },
    {
      key: 'datetime',
      value: 'datetime',
    },
    {
      key: 'year',
      value: 'year',
    },
    {
      key: 'month',
      value: 'month',
    },
    {
      key: 'week',
      value: 'week',
    },
  ],
}

// 尺寸-仅：点装饰组件 组件的行间距需<10  因为>10会行行相交 行间点会连在一起
const sizeSpecialDotMaterial = {
  type: 'number',
  label: 'size',
  min: 1,
  max: 9,
  step: 1,
}

// 尺寸(宽高)
const areaSize = {
  type: 'multiNumber',
  label: 'size',
  defaultValue: [0, 0],
  items: [
    {
      key: 'width',
      min: 0,
      step: 1,
    },
    {
      key: 'height',
      min: 0,
      step: 1,
    },
  ],
}

/**
 * =====================================
 * color
 * =====================================
 */

// 颜色类型
const colorType = {
  type: 'check',
  label: 'colorType',
  defaultValue: 'singleColor',
  options: [
    {
      key: 'monochromatic',
      value: 'singleColor',
    },
    {
      key: 'gradientColor',
      value: 'gradientColor',
    },
    {
      key: 'multicolor',
      value: 'rangeColors',
    },
    // {
    //   key: 'themeColor',
    //   value: 'theme',
    // },
    // {
    //   key: 'listColor',
    //   value: 'list',
    // },
  ],
  // Action({siblings, value}) {
  //   siblings.singleColor.setEffective(value === 'singleColor')
  //   siblings.gradientColor.setEffective(value === 'gradientColor')
  //   // siblings.themeColor.setEffective(value === 'themeColor')
  // },
  action({siblings, value}) {
    siblings.singleColor.setEffective(value === 'singleColor')
    siblings.gradientColor.setEffective(value === 'gradientColor')
    siblings.rangeColors.setEffective(value === 'rangeColors')
    // siblings.themeColor.setEffective(value === 'themeColor')
  },
}

// 颜色类型
const colorType2 = {
  type: 'check',
  label: 'colorType',
  defaultValue: 'customColors',
  options: [
    {
      key: 'monochromatic',
      value: 'customColors',
    },
    {
      key: 'multicolor',
      value: 'rangeColors',
    },
  ],
  action({siblings, value}) {
    siblings.singleColor.setEffective(value === 'customColors')
    siblings.rangeColors.setEffective(value === 'rangeColors')
  },
}

// 单色
const singleColor = {
  type: 'color',
  label: 'singleColor',
  defaultValue: 'transparent',
}

// 左label
const leftLabelColor = {
  type: 'color',
  label: 'leftLabelColor',
  defaultValue: '#fff',
}

// 右描述label
const rightLabelColor = {
  type: 'color',
  label: 'rightLabelColor',
  defaultValue: '#fff',
}

// 选项文字颜色
const optionFontColor = {
  type: 'color',
  label: 'optionFontColor',
  defaultValue: '#000',
}

// 选项默认背景色
const optionBackgroundColor = {
  type: 'color',
  label: 'optionBackgroundColor',
  defaultValue: 'rgb(255,255,255)',
}

// 选项文字悬浮时颜色
const optionHoverTextColor = {
  type: 'color',
  label: 'optionHoverTextColor',
}

// 选项的背景悬浮时颜色
const optionHoverBackgroundColor = {
  type: 'color',
  label: 'optionHoverBackgroundColor',
  defaultValue: 'rgb(83,90,138)',
}

// 边框宽度
const borderWidth = {
  type: 'number',
  label: 'borderWidth',
  defaultValue: 2,
  max: 100,
  min: 0,
}

// 自定义大小
const isCustomSize = {
  type: 'switch',
  label: 'isCustomSize',
  defaultValue: false,
}

// 是否开启交互
const isMarkVisible = {
  type: 'switch',
  label: 'isMarkVisible',
  defaultValue: false,
}

// 支持自定义滚动
const scrolling = {
  type: 'switch',
  label: 'scrolling',
  defaultValue: false,
}
//最大长度
const maxLength = {
  type: 'number',
  label: 'maxLength',
}

// 边框颜色
const borderColor = {
  type: 'color',
  label: 'borderColor',
}
// 激活边框宽度
const activeBorderWidth = {
  type: 'number',
  label: 'activeBorderWidth',
}
// 文字动画时长
const animationDuration = {
  type: 'number',
  label: 'animationDuration',
}

// 边框阴影色
const shadowColor = {
  type: 'color',
  label: 'shadowColor',
}

// 边框阴影宽度
const shadowWidth = {
  type: 'number',
  label: 'shadowWidth',
}

// 边框阴影模糊度
const shadowFuzziness = {
  type: 'number',
  label: 'shadowFuzziness',
}
// 进入焦点边框色
const focusColor = {
  type: 'color',
  label: 'focusColor',
}
// 背景色
const backgroundColor = {
  type: 'color',
  label: 'backgroundColor',
  defaultValue: 'rgb(0, 119, 255)',
}

// 占位符文字颜色
const placeholder = {
  type: 'text',
  label: 'placeholder',
}

// 使单选模式可搜索
const supportSearch = {
  type: 'switch',
  label: 'supportSearch',
}

// 搜索icon颜色
const searchIconColor = {
  type: 'color',
  label: 'searchIconColor',
}

// icon搜索背景色
const iconBackgroundColor = {
  type: 'color',
  label: 'iconBackgroundColor',
}

// 圆点颜色
const pointColor = {
  type: 'color',
  label: 'pointColor',
  defaultValue: 'rgb(0,0,0)',
}
// NOTE 将删除
const colorSingle = {
  type: 'color',
  label: 'singleColor',
  defaultValue: 'transparent',
}

// 渐变
const gradientColor = {
  type: 'gradient',
  label: 'gradientColor',
  defaultValue: [
    ['#79b7ff', 0],
    ['#007eff', 1],
  ],
}
// 颜色数组
const colorList = {
  type: 'colorList',
  label: 'colorList',
  defaultValue: [[['rgba(52,200,254,1)', 0]]],
}
const rangeColors = {
  type: 'gradient',
  label: 'multicolor',
  defaultValue: [
    ['#50E3C2', 0],
    ['#007eff', 1],
  ],
}

// NOTE 将删除
const colorGradient = {
  type: 'gradient',
  label: 'gradientColor',
  defaultValue: [
    ['#79b7ff', 0],
    ['#007eff', 1],
  ],
}

// 颜色列表
const listColor = {
  type: 'colorList',
  label: 'listColor',
  defaultValue: ['#007EFF'],
}

const columnNumber = {
  type: 'number',
  label: 'columnNumber',
  defaultValue: 3,
}

/**
 * =====================================
 * column
 * =====================================
 */

// 普通字段
const column = {
  type: 'columnSelect',
  label: 'dataColumn',
}

// 经度字段
const longitudeColumn = {
  type: 'columnSelect',
  label: 'longitude',
}

// 维度字段
const latitudeColumn = {
  type: 'columnSelect',
  label: 'latitude',
}

// X轴
const xColumn = {
  type: 'columnSelect',
  label: 'xAxis',
}

// Y轴
const yColumn = {
  type: 'columnSelect',
  label: 'yAxis',
}

/**
 * =====================================
 * gis
 * =====================================
 */

// gis中心点坐标
const gisCenterCoordinate = {
  type: 'multiNumber',
  label: 'centerCoordinate',
  // 默认杭州
  defaultValue: [120.19, 30.26],
}

// gis缩放系数
const gisZoom = {
  type: 'number',
  label: 'zoom',
  defaultValue: 12,
  min: 1,
  max: 24,
  step: 0.1,
  hasSlider: true,
}

// gis倾斜角度
const gisPitch = {
  type: 'number',
  label: 'pitch',
  defaultValue: 45,
  min: 0,
  max: 60,
  step: 1,
  hasSlider: true,
}

// gis旋转角度
const gisBearing = {
  type: 'number',
  label: 'bearing',
  defaultValue: 0,
  step: 1,
}

// gis单位
const gisUnit = {
  type: 'check',
  label: 'unit',
  defaultValue: 'hover',
  options: [
    {key: 'meter', value: 'meter'},
    {key: 'px', value: 'px'},
  ],
}

/**
 * =====================================
 * text
 * =====================================
 */

// 名称
const name = {
  type: 'text',
  label: 'name',
  defaultValue: '',
}

// URL
const url = {
  type: 'text',
  label: 'url',
  defaultValue: '',
}

// 内容
const content = {
  type: 'text',
  label: 'content',
  defaultValue: '',
}

// 字号
const textSize = {
  type: 'number',
  label: 'textSize',
  defaultValue: 12,
  min: 4,
  max: 200,
  step: 1,
  hasSlider: true,
}

// 字重
const textWeight = {
  type: 'check', // 待确认
  label: 'textWeight',
  defaultValue: 200,
  options: [
    {key: '1', value: 100},
    {key: '2', value: 200},
    {key: '3', value: 300},
    {key: '4', value: 400},
    {key: '5', value: 500},
    {key: '6', value: 600},
    {key: '7', value: 700},
  ],
}

// 文字方向
const direction = {
  type: 'check',
  label: 'direction',
  defaultValue: 'horizontal',
  options: [
    {
      key: 'horizontal',
      value: 'horizontal',
    },
    {
      key: 'vertical',
      value: 'vertical',
    },
  ],
}

// 排列方向
const alignmentDirection = {
  type: 'check',
  label: 'alignmentDirection',
  defaultValue: 'HORIZONTAL',
  options: [
    {
      key: '水平',
      value: 'HORIZONTAL',
    },
    {
      key: '垂直',
      value: 'VERTICAL',
    },
  ],
}
// 未激活背景色
const inactiveColor = {
  type: 'color',
  label: 'inactiveColor',
  defaultValue: 'rgb(255,255,255,0.1)',
}
// 激活背景色
const activeColor = {
  type: 'color',
  label: 'activeColor',
  defaultValue: 'rgba(0,119,255,1)',
}

const DIRECTION = {
  type: 'check',
  label: 'direction',
  defaultValue: 'horizontal',
  options: [
    {
      key: 'horizontal',
      value: 'HORIZONTAL',
    },
    {
      key: 'vertical',
      value: 'VERTICAL',
    },
  ],
}

/**
 * =====================================
 * number
 * =====================================
 */

// 千分位
const thousandDiv = {
  type: 'switch',
  label: 'thousandDiv',
  defaultValue: false,
}

// 百分比
const percentage = {
  type: 'switch',
  label: 'percentage',
  defaultValue: false,
}

// 小数位数
const decimalPlaces = {
  type: 'check',
  label: 'decimalPlaces',
  defaultValue: 0,
  options: [
    {
      key: '0',
      value: 0,
    },
    {
      key: '1',
      value: 1,
    },
    {
      key: '2',
      value: 2,
    },
    {
      key: '3',
      value: 3,
    },
    {
      key: '4',
      value: 4,
    },
    {
      key: '5',
      value: 5,
    },
    {
      key: '6',
      value: 6,
    },
    {
      key: '7',
      value: 7,
    },
  ],
}

/**
 * =====================================
 * line
 * =====================================
 */

// 线宽
const lineWidth = {
  type: 'number',
  label: 'lineWidth',
  defaultValue: 1,
  min: 1,
  max: 10,
  step: 1,
}

// 线样式
const lineCurve = {
  type: 'select',
  label: 'lineCurve',
  defaultValue: 'curveLinear',
  options: [
    {
      key: 'Linear',
      value: 'curveLinear',
    },
    {
      key: 'Natural',
      value: 'curveNatural',
    },
    {
      key: 'Step',
      value: 'curveStep',
    },
    {
      key: 'BumpX',
      value: 'curveBumpX',
    },
    {
      key: 'BumpY',
      value: 'curveBumpY',
    },
    {
      key: 'MonotoneX',
      value: 'curveMonotoneX',
    },
  ],
}

// 线光滑
const lineSmooth = {
  type: 'switch',
  label: 'lineSmooth',
  defaultValue: true,
}

// 线缺省
const lineFallback = {
  type: 'select',
  label: 'lineFallback',
  defaultValue: 'break',
  options: [
    {
      key: 'zeroFallback',
      value: 'zero',
    },
    {
      key: 'continueFallback',
      value: 'continue',
    },
    {
      key: 'breakFallback',
      value: 'break',
    },
  ],
}
const lineOpacity = {
  type: 'number',
  label: 'lineOpacity',
  min: 0,
  max: 1,
  step: 0.1,
}

const lineColor = {
  type: 'color',
  label: 'lineColor',
  defaultValue: 'rgba(0, 255, 255, 1)',
}

const arcLineColor = {
  type: 'color',
  label: 'lineColor',
  defaultValue: 'rgba(0, 255, 255, 0.6)',
}
/**
 * =====================================
 * range
 * =====================================
 */

// 数值范围
const numberRange = {
  type: 'numberRange',
  label: 'numberRange',
  defaultValue: [0, 20],
}

// 时间范围 暂不做
const time = {
  type: 'time',
  label: 'time',
  defaultValue: [0, 60],
}

// 形状
const shapeType = {
  type: 'shapeType',
  label: 'shapeType',
  defaultValue: 'square',
  options: [
    {
      key: 'square',
      value: 'square',
    },
    {
      key: 'circular',
      value: 'circular',
    },
    {
      key: 'triangle',
      value: 'triangle',
    },
  ],
}
/**
 * =====================================
 * special
 * =====================================
 */

// 填充模式
const fillMode = {
  type: 'check',
  label: 'fillMode',
  defaultValue: 'shortEdgeFill',
  options: [
    {
      key: 'shortEdgeFill',
      value: 'shortEdgeFill',
    },
    {
      key: 'longEdgeFill',
      value: 'longEdgeFill',
    },
    {
      key: 'stretchFill',
      value: 'stretchFill',
    },
  ],
}

// 宽度适配
const widthAdaption = {
  type: 'check',
  label: 'width',
  defaultValue: 'zoomToScreenWidth',
  options: [
    {
      key: 'zoomToScreenWidth',
      value: 'zoomToScreenWidth',
    },
    {
      key: 'scrollHorizontal',
      value: 'scrollHorizontal',
    },
  ],
}

// 高度适配
const heightAdaption = {
  type: 'check',
  label: 'height',
  defaultValue: 'zoomToScreenHeight',
  options: [
    {
      key: 'zoomToScreenHeight',
      value: 'zoomToScreenHeight',
    },
    {
      key: 'scrollVertical',
      value: 'scrollVertical',
    },
  ],
}

// 宽度适配
// const widthAdaption = {
//   type: 'switch',
//   label: 'screenAdaption',
//   defaultValue: true,
// }

// 密码
const password = {
  type: 'password',
  label: 'password',
}

// 图片混合模式
const blendMode = {
  type: 'select',
  label: 'blendMode',
  defaultValue: 'normal',
  options: [
    {
      key: 'normal',
      value: 'normal',
    },
    {
      key: 'multiply',
      value: 'multiply',
    },
    {
      key: 'screen',
      value: 'screen',
    },
    {
      key: 'overlay',
      value: 'overlay',
    },
    {
      key: 'darken',
      value: 'darken',
    },
    {
      key: 'lighten',
      value: 'lighten',
    },
    {
      key: 'color-dodge',
      value: 'color-dodge',
    },
    {
      key: 'color-burn',
      value: 'color-burn',
    },
    {
      key: 'hard-light',
      value: 'hard-light',
    },
    {
      key: 'soft-light',
      value: 'soft-light',
    },
    {
      key: 'difference',
      value: 'difference',
    },
    {
      key: 'exclusion',
      value: 'exclusion',
    },
    {
      key: 'hue',
      value: 'hue',
    },
    {
      key: 'saturation',
      value: 'saturation',
    },
    {
      key: 'color',
      value: 'color',
    },
    {
      key: 'luminosity',
      value: 'luminosity',
    },
  ],
}

/**
 * =====================================
 * 坐标轴和比例尺类配置
 * =====================================
 */

// 绑定主轴或副轴
const axisBinding = {
  type: 'check',
  label: 'axisBinding',
  defaultValue: 'main',
  options: [
    {
      key: 'mainAxis',
      value: 'main',
    },
    {
      key: 'minorAxis',
      value: 'minor',
    },
  ],
}

// 刻度数量
const tickCount = {
  type: 'number',
  label: 'tickCount',
  defaultValue: 5,
  min: 1,
  max: 10,
  step: 1,
  hasSlider: true,
}

// 刻度是否包含0
const tickZero = {
  type: 'switch',
  label: 'tickZero',
  defaultValue: false,
}

// 比例尺内边距比值
const paddingInner = {
  type: 'number',
  label: 'paddingInner',
  defaultValue: 0.3,
  min: 0,
  max: 1,
  step: 0.1,
  hasSlider: true,
}

const echartsoption = {
  type: 'echartsoption',
  label: 'echartsoption',
}

// 内半径
const innerRadius = {
  type: 'number',
  label: 'innerRadius',
  defaultValue: 30,
  min: 0,
  hasSlider: true,
}

// 散点图，散点大小
const pointSize = {
  type: 'multiNumber',
  label: 'pointSize',
  defaultValue: [10, 10],
}

const pointSizes = {
  type: 'number',
  label: 'pointSizes',
  defaultValue: 100,
  min: 2,
  max: 500,
}
// 圆角
const borderRadius = {
  type: 'number',
  label: 'borderRadius',
  defaultValue: 10,
}

/**
 * =====================================
 * 段落
 * =====================================
 */
const textarea = {
  type: 'textarea',
  label: 'content',
  defaultValue: '',
}

// 关键词颜色
const keywordColor = {
  type: 'color',
  label: 'keywordColor',
  defaultValue: 'rgba(0, 255, 255, 1)',
}

// 关键词字重
const keywordFontWeight = {
  type: 'check',
  label: 'keywordFontWeight', // 影响显示的名称
  defaultValue: 400,
  options: [
    {key: '1', value: 100},
    {key: '2', value: 200},
    {key: '3', value: 300},
    {key: '4', value: 400},
    {key: '5', value: 500},
    {key: '6', value: 600},
    {key: '7', value: 700},
  ],
}

// 是否应用关键词大小
const hasKeywordFontSize = {
  type: 'switch',
  label: 'hasKeywordFontSize',
  defaultValue: false,
}

// 关键词大小
const keywordFontSize = {
  type: 'number',
  label: 'keywordFontSize',
  defaultValue: 14,
  min: 4,
  max: 200,
  step: 1,
  hasSlider: true,
}

// 首行缩进
const textIndent = {
  type: 'number',
  label: 'textIndent',
  defaultValue: 0,
}

// 行高
const lineHeight = {
  type: 'number',
  label: 'lineHeight',
  min: 0,
}

// 对齐
const textAlign = {
  type: 'check',
  label: 'textAlign',
  defaultValue: 'left',
  options: [
    {
      key: 'L',
      value: 'left',
    },
    {
      key: 'C',
      value: 'center',
    },
    {
      key: 'R',
      value: 'right',
    },
  ],
}
// 日历背景色
const calanderThemeColor = {
  type: 'color',
  label: 'calanderThemeColor',
}

// 段间距
const paragraphMargin = {
  type: 'number',
  label: 'paragraphMargin',
  min: 0,
}

// 刻度文字
const tickSize = {
  type: 'number',
  label: 'tickSize',
  defaultValue: 10,
  min: 0,
  max: 50,
}

// 标签偏移
const labelOffset = {
  type: 'number',
  label: 'labelOffset',
  defaultValue: 5,
  min: 0,
  max: 50,
}
const labelOffsetX = {
  type: 'number',
  label: 'labelOffsetX',
  defaultValue: 5,
  min: 0,
  max: 50,
}
const labelOffsetY = {
  type: 'number',
  label: 'labelOffsetY',
  defaultValue: 5,
  min: -100,
  max: 100,
}
// 标签颜色
const labelColor = {
  type: 'color',
  label: 'labelColor',
  defaultValue: 'rgba(255, 255, 255, 1)',
}
// 标签角度
const labelAngle = {
  type: 'number',
  label: 'labelAngle',
  defaultValue: 5,
  min: 0,
  max: 50,
}
// 标签字体
const labelSize = {
  type: 'number',
  label: 'labelSize',
  defaultValue: 12,
  min: 0,
  max: 50,
}
// 圆大小
const circleSize = {
  type: 'number',
  label: 'circleSize',
  defaultValue: 10,
}

const orderType = {
  type: 'check',
  label: 'orderType',
  defaultValue: 'DEFAULT',
  options: [
    {key: '默认', value: 'DEFAULT'},
    {key: '降序', value: 'MAX_MIN'},
    {key: '升序', value: 'MIN_MAX'},
  ],
}
// 桑基图对齐
const sankeyAlign = {
  type: 'check',
  label: 'sankeyAlign',
  defaultValue: 'middle',
  options: [
    {key: '上', value: 'start'},
    {key: '中', value: 'middle'},
    {key: '下', value: 'end'},
  ],
}
// 节点线宽
const nodeWidth = {
  type: 'number',
  label: 'nodeWidth',
  defaultValue: 10,
}
// 节点间距
const nodeGap = {
  type: 'number',
  label: 'nodeGap',
  defaultValue: 10,
}

const groupBarGap = {
  type: 'number',
  label: 'groupBarGap',
  defaultValue: 10,
}

const valueSize = {
  type: 'number',
  label: 'valueSize',
  defaultValue: 12,
}
const valueWidth = {
  type: 'number',
  label: 'valueWidth',
  defaultValue: 700,
  min: 0,
  max: 1000,
}
const valueVisible = {
  type: 'switch',
  label: 'valueVisible',
  defaultValue: true,
}

const valueColor = {
  type: 'color',
  label: 'valueColor',
  defaultValue: 'rgba(0, 255, 255, 1)',
}
const valueType = {
  type: 'check',
  label: 'valueSize',
  defaultValue: 'SCALE',
  options: [
    {key: '百分比', value: 'SCALE'},
    {key: '数值', value: 'REAL'},
  ],
}
const valueOffsetY = {
  type: 'number',
  label: 'valueOffsetY',
  defaultValue: 12,
}

const decimalNumber = {
  type: 'number',
  label: 'decimalNumber',
  defaultValue: 0,
  min: 0,
  max: 10,
}
// 圆点透明度
const circleOpacity = {
  type: 'number',
  label: 'circleOpacity',
  defaultValue: 0.6,
  min: 0,
  max: 1,
  step: 0.1,
}
// 圆点半径
const circleMaxRadius = {
  type: 'number',
  label: 'circleMaxRadius',
  defaultValue: 40,
}
const minRadius = {
  type: 'number',
  label: 'arcType.minRadius',
  defaultValue: 50,
  min: 0,
  max: 500,
}

const arcBackgroundWidth = {
  type: 'number',
  label: 'arcType.arcBackgroundWidth',
  defaultValue: 10,
  min: 0,
  max: 50,
}

const order = {
  type: 'check',
  label: 'arcType.order',
  defaultValue: 'POSITIVE',
  options: [
    {key: '升序', value: 'POSITIVE'},
    {key: '降序', value: 'REVERSE'},
    {key: '不排序', value: 'DEFAULT'},
  ],
}

const arcBackgroundColor = {
  type: 'color',
  label: 'arcType.arcBackgroundColor',
  defaultValue: 'rgba(255,255,255,0.15)',
}

const arcWidth = {
  type: 'number',
  label: 'arcType.arcWidth',
  defaultValue: 0,
  min: 0,
  max: 50,
}

const arcGap = {
  type: 'number',
  label: 'arcType.arcGap',
  defaultValue: 0,
  min: 0,
  max: 50,
}

const showLabelValue = {
  type: 'switch',
  label: 'valueVisible',
  defaultValue: true,
}

const labelValueColor = {
  type: 'color',
  label: 'labelValueColor',
  defaultValue: 'rgba(255,255,255,0.15)',
}
const labelYOffset = {
  type: 'number',
  label: 'labelYOffset',
  defaultValue: 0,
  min: -100,
  max: 100,
}
const labelXOffset = {
  type: 'number',
  label: 'labelXOffset',
  defaultValue: 0,
  min: -100,
  max: 100,
}

const trackBagHeight = {
  type: 'number',
  label: 'trackBagHeight',
  defaultValue: 32,
  min: 0,
  max: 100,
}

const thresholdHeight = {
  type: 'number',
  label: 'thresholdHeight',
  defaultValue: 32,
  min: 0,
  max: 100,
}
const trackHeight = {
  type: 'number',
  label: 'trackHeight',
  defaultValue: 20,
  min: 0,
  max: 100,
}
const thresholdWidth = {
  type: 'number',
  label: 'thresholdWidth',
  defaultValue: 4,
  min: 0,

  max: 100,
}

const lineOffset = {
  type: 'number',
  label: 'lineOffset',
  defaultValue: 0,
  min: 0,
  max: 100,
}

const gradientDirection = {
  type: 'check',
  label: 'gradientDirection',
  defaultValue: 'POSITIVE',
  options: [
    {key: '单色系', value: 'HIRONZATAL'},
    {key: '多色系', value: 'VERTICAL'},
  ],
}
const bgLineColor = {
  type: 'color',
  label: 'bgLineColor',
  defaultValue: 'rgba(255,255,255,0.15)',
}

const noLabelColor = {
  type: 'color',
  label: ' ',
  defaultValue: 'rgba(255,255,255,0.15)',
}
const maxRow = {
  type: 'number',
  label: 'maxRow',
  defaultValue: 80,
  min: 0,
  max: 100,
}

const valueInPosition = {
  type: 'check',
  label: 'valueInPosition',
  defaultValue: 'inside',
  options: [
    {key: 'inside', value: 'inside'},
    {key: 'outside', value: 'outside'},
  ],
}

const showShadow = {
  type: 'switch',
  label: 'showShadow',
  defaultValue: false,
}

const shadowOptions = {
  type: 'multiNumber',
  label: ' ',
  defaultValue: [0, 0, 5],
  items: [
    {
      key: 'horizontal',
      step: 1,
    },
    {
      key: 'vertical',
      step: 1,
    },
    {
      key: 'blur',
      step: 1,
    },
  ],
}

const adaptContainer = {
  label: 'adaptContainer',
  type: 'switch',
}

export default {
  rectRadius,
  rectStepGap,
  rectStepPercentage,
  dasharray,
  legendType,
  dasharrayLength,
  dasharraySpacing,
  calibrationTitle,
  calibrationValue,
  adaptContainer,
  theme,
  valueOffsetY,
  bgLineColor,
  noLabelColor,
  showShadow,
  shadowOptions,
  maxRow,
  groupBarGap,
  gradientDirection,
  valueInPosition,
  lineOffset,
  labelXOffset,
  labelYOffset,
  thresholdWidth,
  trackHeight,
  trackBagHeight,
  valueWidth,
  thresholdHeight,
  valueType,
  valueColor,
  valueSize,
  valueVisible,
  circleMaxRadius,
  circleOpacity,
  showLabelValue,
  labelValueColor,
  trackShow,
  minRadius,
  arcWidth,
  arcBackgroundWidth,
  arcBackgroundColor,
  arcGap,
  order,
  echartsoption,
  decimalNumber,
  // 偏移
  offset,
  padding,
  areaOffset,
  // 间隔,
  gap,
  // 内外间隔
  gap2,
  // 模糊
  blur,
  // 透明度
  opacity,
  // 相对位置
  relativePosition,
  // 局部位置
  layoutPosition,
  // 坐标位置
  xyPosition,
  // 锚点
  anchor,
  // 角度
  angle,
  // 触发事件类型
  eventType,
  // 缺失
  missing,
  // 宽度
  width,
  // 高度
  height,
  // 大小
  size,
  //取值方式
  valueMethod,
  //缩放系数
  scale,
  // 字体大小
  fontSize,
  leftLableFontSize,
  rightLableFontSize,
  // 选择器类型
  pickerType,
  //尺寸-特殊单设-适配：点装饰组件
  sizeSpecialDotMaterial,
  // 尺寸(宽高)
  areaSize,
  // 颜色类型
  colorType,
  colorType2,
  // 颜色单色
  singleColor,
  leftLabelColor,
  rightLabelColor,
  colorSingle,
  // 下拉框选项文字颜色
  optionFontColor,
  optionBackgroundColor,
  optionHoverTextColor,
  optionHoverBackgroundColor,
  // 颜色渐变
  colorGradient,
  gradientColor,
  rangeColors,
  // 颜色列表
  listColor,
  columnNumber,
  // 普通字段
  column,
  // 经度
  longitudeColumn,
  // 纬度
  latitudeColumn,
  // X轴
  xColumn,
  // Y轴
  yColumn,
  // gis中心点坐标
  gisCenterCoordinate,
  // gis缩放系数
  gisZoom,
  // gis倾斜角度
  gisPitch,
  // gis旋转角度
  gisBearing,
  // gis单位
  gisUnit,
  // 名称
  name,
  // URL
  url,
  // 内容
  content,
  // 字号
  textSize,
  // 字重
  textWeight,
  // 文字方向
  direction,
  DIRECTION,
  // 千分位
  thousandDiv,
  // 百分比
  percentage,
  // 小数位数
  decimalPlaces,
  // 线宽
  lineWidth,
  // 线样式
  lineCurve,
  // 线光滑
  lineSmooth,
  // 线缺省
  lineFallback,
  //线条透明度
  lineOpacity,
  //线条颜色
  lineColor,
  // 数值范围
  numberRange,
  // 时间
  time,
  // 形状
  shapeType,
  // 填充模式
  fillMode,
  scrolling,
  isMarkVisible,
  isCustomSize,
  // 宽度自适应
  widthAdaption,
  // 高度自适应
  heightAdaption,
  // 密码
  password,
  // 图片混合模式
  blendMode,
  // 绑定主轴或副轴
  axisBinding,
  // 刻度线数量
  tickCount,
  // 包含零刻度
  tickZero,
  // 比例尺内边距
  paddingInner,
  // 内半径
  innerRadius,
  // 散点大小
  pointSize,
  // 段落
  textarea,
  calanderThemeColor,
  // 关键词颜色
  keywordColor,
  // 关键词字重
  keywordFontWeight,
  // 是否应用关键词大小
  hasKeywordFontSize,
  // 关键词大小
  keywordFontSize,
  // 首行缩进
  textIndent,
  // 行高
  lineHeight,
  // 对齐
  textAlign,
  // 段间距
  paragraphMargin,
  // 刻度线长度
  tickSize,
  // 大小圆大小
  circleSize,
  // 文字偏移
  labelOffset,
  labelColor,
  labelAngle,
  labelSize,
  labelOffsetX,
  labelOffsetY,
  // 桑基图对齐
  sankeyAlign,
  arcLineColor,
  nodeWidth,
  nodeGap,

  alignmentDirection,
  inactiveColor,
  activeColor,
  // 圆角大小
  borderRadius,
  show,
  // 占位符文字内容
  placeholder,
  // 使单选模式可搜索
  supportSearch,
  searchIconColor,
  iconBackgroundColor,
  backgroundColor,
  //圆点颜色
  pointColor,
  //圆点大小
  pointSizes,
  //选择器类型
  pickerTypecwq,
  activeBorderWidth,
  animationDuration,
  borderColor,
  shadowColor,
  shadowWidth,
  shadowFuzziness,
  focusColor,
  borderWidth,
  maxLength,
  // gis
  origin,
  viewport,
  sceneMode,
  adapterContainer,
  rowNumber,
  lineSpacing,
  columnSpacing,
  titleVisible,
  titleFontSize,
  titleLowerSpacing,
  titleColor,
  headVisible,
  headFontSize,
  headFontWeight,
  titleBackground,
  titleText,
  titlePosition,
  headFontColor,
  headBackground,
  headPosition,
  unitVisible,
  unitFontSize,
  unitFontColor,
  unitText,
  unitLowerSpacing,
  isAutoWidth,
  signVisible,
  signFontColor,
  signWidth,
  rectVisible,
  rectFontColor,
  // rectWidth,
  rectHeight,
  cellWidth,
  cellFontSize,
  cellHeight,
  cellFontColor,
  cellBackground,
  valueBarBackground,
  cellPosition,
  enableLoopAnimation,
  loopAnimationDuration,
  loopAnimationDelay,
  isDisabled,
  isDisplayTextNum,
  enableMapInteractive,
  connectLineType,
  viewFixed,
  coordinateAcquisitionResult,
  snow,
  rain,
  elevation,
  layerName,
  mapService,
  baseMapStyle,
  viewportMode,
  longitude,
  latitude,
  zoom,
  pitch,
  bearing,
  showMapControl,
  showMapHelper,
  orderType,
  stroked,
  label,
  isBreathe,
  extruded,
  getRadius,
  heatmapType,
  type,
  fillColor,
  getLineWidth,
  getElevationValue,
  diskResolution,
  elevationRange,
  radius,
  greatCircle,
  getTilt,
  getHeight,
  getWidth,
  getSourceColor,
  sourcePoint,
  sourcePointSize,
  sourcePointColor,
  sourceLabel,
  sourceLabelSize,
  sourceLabelColor,
  getTargetColor,
  targetPoint,
  targetPointSize,
  targetPointColor,
  targetLabel,
  targetLabelSize,
  targetLabelColor,
  flyPoint,
  flyPointWidth,
  dotColor,
  currentShowDotColor,
  dotSize,
  flyPointColor,
  flyPointSize,
  elevationData,
  elevationDecoder,
  texture,
  showPath,
  pathWidth,
  pathColor,
  rounded,
  showTrail,
  trailWidth,
  trailLength,
  trailColor,
  trailSpeed,
  showEndVertex,
  endVertexColor,
  endVertexSize,
  showVertex,
  vertexColor,
  vertexSize,
  iconSize,
  showLabel,
  getAngle,
  getTextAnchor,
  getAlignmentBaseline,
  filled,
  getFillColor,
  wireframe,
  getLineColor,
  geojsonData,
  getElevation,
  geojsonType,
  tileUrl,
  tileType,
  // 动画
  enterAnimation,
  animationType,
  duration,
  delay,
  scope,
  animationDirection,
  updateDuration,
  billboard,
  colorList,
}
