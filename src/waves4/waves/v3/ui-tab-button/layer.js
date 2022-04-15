export default () => {
  return {
    name: '标签组',
    type: 'tab',
    sections: [
      {
        name: 'basic',
        fields: [
          {
            name: 'adaptContainer',
            defaultValue: false,
          },
          {
            name: 'trackShow',
            defaultValue: true,
          },
        ],
      },
    ],
    // v: [
    //   {
    //     section: 'optionPanel.basic',
    //     option: 'adaptContainer',
    //     field: {
    //       type: 'switch',
    //       label: 'style.adaptContainer',
    //       defaultValue: false,
    //     },
    //   },
    //   {
    //     section: 'optionPanel.basic',
    //     option: 'width',
    //     when: {
    //       key: 'adaptContainer',
    //       value: false,
    //     },
    //     field: {
    //       type: 'number',
    //       label: 'width',
    //       defaultValue: 450,
    //     },
    //   },
    //   {
    //     section: 'optionPanel.basic',
    //     option: 'height',
    //     when: {
    //       key: 'adaptContainer',
    //       value: false,
    //     },
    //     field: {
    //       type: 'number',
    //       label: 'height',
    //       defaultValue: 40,
    //     },
    //   },
    //   {
    //     section: 'optionPanel.basic',
    //     option: 'fontSize',
    //     field: {
    //       type: 'number',
    //       label: 'style.fontSize',
    //       defaultValue: 20,
    //     },
    //   },
    //   {
    //     section: 'optionPanel.basic',
    //     option: 'activeColor',
    //     field: {
    //       type: 'color',
    //       label: k('activeColor'),
    //       defaultValue: 'rgba(0,119,255,1)',
    //     },
    //   },
    //   {
    //     section: 'optionPanel.basic',
    //     option: 'inactiveColor',
    //     field: {
    //       type: 'color',
    //       label: k('inactiveColor'),
    //       defaultValue: 'rgba(255,255,255,0.1)',
    //     },
    //   },
    //   {
    //     section: 'optionPanel.basic',
    //     option: 'alignmentDirection',
    //     field: {
    //       type: 'check',
    //       label: k('alignmentDirection'),
    //       defaultValue: 'HORIZONTAL',
    //       options: [{
    //         key: 'style.horizontal',
    //         value: 'HORIZONTAL',
    //       }, {
    //         key: 'style.vertical',
    //         value: 'VERTICAL',
    //       }],
    //     },
    //   },
    //   {
    //     section: 'style.animation',
    //     option: 'enableLoopAnimation',
    //     field: {
    //       type: 'switch',
    //       label: 'animation.enableLoopAnimation',
    //       defaultValue: false,
    //     },
    //   },
    //   {
    //     section: 'style.animation',
    //     option: 'loopAnimationDuration',
    //     when: {
    //       key: 'enableLoopAnimation',
    //       value: true,
    //     },
    //     field: {
    //       type: 'number',
    //       label: 'animation.loopAnimationDuration',
    //       defaultValue: 2000,
    //       step: 200,
    //     },
    //   },
    // ]
  }
}
