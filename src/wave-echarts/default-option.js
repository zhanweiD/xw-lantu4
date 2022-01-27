const baseLineOption = {
  title: {
    text: '基础折线',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'line',
    },
  ],
}

const grouplineOption = {
  title: {
    text: '分组折线',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'line',
    },
    {
      type: 'line',
    },
  ],
}

// 面积折线
const baseAreaLineOption = {
  title: {
    text: '面积折线',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'line',
      areaStyle: {},
    },
  ],
}

// 堆叠面积
const grouplineAreaOption = {
  title: {
    text: '堆叠折线',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'line',
      areaStyle: {},
    },
    {
      type: 'line',
      areaStyle: {},
    },
  ],
}

// 面积和线
const lineAndAreaOption = {
  title: {
    text: '面积和折线',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'category',
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'line',
    },
    {
      type: 'line',
      areaStyle: {},
    },
  ],
}

// 柱状图
const baseBarOption = {
  title: {
    text: '基础条形',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
    },
  ],
}

const groupBarOption = {
  title: {
    text: '分组条形图',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
    },
    {
      type: 'bar',
    },
  ],
}

// 堆叠柱状图
const stackBarOption = {
  title: {
    text: '分组条形图',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
  },
  series: [
    {
      stack: '总量',
      type: 'bar',
    },
    {
      stack: '总量',
      type: 'bar',
    },
  ],
}

const waterfallBarOption = {
  title: {
    text: '瀑布图',
    textStyle: {
      color: '#fff',
    },
  },
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
      stack: 'Total',
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent',
      },
      emphasis: {
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent',
        },
      },
    },
    {
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        position: 'inside',
      },
    },
  ],
}

const baseColumnOption = {
  title: {
    text: '基础柱状图',
    textStyle: {
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
  },
  xAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
    },
  ],
}

const groupColumnOption = {
  title: {
    text: '基础柱状图',
    textStyle: {
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
  },
  xAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
    },
    {
      type: 'bar',
    },
  ],
}

const stackColumnOption = {
  title: {
    text: '堆叠柱状图',
    textStyle: {
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
  },
  xAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
      stack: 'Total',
    },
    {
      type: 'bar',
      stack: 'Total',
    },
  ],
}

const waterfallColumnOption = {
  title: {
    text: '瀑布图',
    textStyle: {
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
  },
  xAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
      stack: 'Total',
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent',
      },
      emphasis: {
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent',
        },
      },
    },
    {
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        position: 'inside',
      },
    },
  ],
}

const baseColumnLineOption = {
  title: {
    text: '基础折柱图',
    textStyle: {
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
  },
  xAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
    },
    {
      type: 'line',
    },
  ],
}

const groupColumnLineOption = {
  title: {
    text: '分组折柱图',
    textStyle: {
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
  },
  xAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
    },
    {
      type: 'bar',
    },
    {
      type: 'line',
    },
    {
      type: 'line',
    },
  ],
}

const stackColumnLineOption = {
  title: {
    text: '堆叠折柱图',
    textStyle: {
      color: '#fff',
    },
  },
  yAxis: {
    type: 'value',
  },
  xAxis: {
    type: 'category',
  },
  series: [
    {
      type: 'bar',
      stack: 'Total',
    },
    {
      type: 'bar',
      stack: 'Total',
    },
    {
      type: 'line',
    },
    {
      type: 'line',
    },
  ],
}

export {
  baseLineOption,
  grouplineOption,
  baseAreaLineOption,
  grouplineAreaOption,
  lineAndAreaOption,
  baseBarOption,
  groupBarOption,
  stackBarOption,
  waterfallBarOption,
  baseColumnOption,
  groupColumnOption,
  stackColumnOption,
  waterfallColumnOption,
  baseColumnLineOption,
  groupColumnLineOption,
  stackColumnLineOption,
}
