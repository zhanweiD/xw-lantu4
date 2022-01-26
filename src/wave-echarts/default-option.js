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
    {
      type: 'bar',
    },
  ],
}

export {baseLineOption, grouplineOption, baseAreaLineOption, grouplineAreaOption, lineAndAreaOption, baseBarOption}
